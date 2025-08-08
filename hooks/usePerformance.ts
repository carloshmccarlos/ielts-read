"use client";

import { useEffect, useRef, useCallback } from "react";

interface PerformanceMetrics {
	renderTime: number;
	componentName: string;
	timestamp: number;
}

export function usePerformanceMonitor(componentName: string) {
	const renderStartTime = useRef<number>(0);
	const mountTime = useRef<number>(0);

	useEffect(() => {
		mountTime.current = performance.now();
		
		return () => {
			if (process.env.NODE_ENV === 'development') {
				const unmountTime = performance.now();
				const totalLifetime = unmountTime - mountTime.current;
				console.log(`${componentName} lifetime: ${totalLifetime.toFixed(2)}ms`);
			}
		};
	}, [componentName]);

	const startRender = useCallback(() => {
		renderStartTime.current = performance.now();
	}, []);

	const endRender = useCallback(() => {
		if (process.env.NODE_ENV === 'development' && renderStartTime.current > 0) {
			const renderTime = performance.now() - renderStartTime.current;
			const metrics: PerformanceMetrics = {
				renderTime,
				componentName,
				timestamp: Date.now(),
			};
			
			if (renderTime > 16) { // More than one frame (60fps)
				console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
			}
			
			// Store metrics for potential analytics
			if (typeof window !== 'undefined') {
				const existingMetrics = JSON.parse(
					localStorage.getItem('performance-metrics') || '[]'
				);
				existingMetrics.push(metrics);
				
				// Keep only last 100 metrics
				if (existingMetrics.length > 100) {
					existingMetrics.splice(0, existingMetrics.length - 100);
				}
				
				localStorage.setItem('performance-metrics', JSON.stringify(existingMetrics));
			}
		}
	}, [componentName]);

	return { startRender, endRender };
}

// Hook for measuring async operations
export function useAsyncPerformance() {
	const measureAsync = useCallback(async <T>(
		operation: () => Promise<T>,
		operationName: string
	): Promise<T> => {
		const startTime = performance.now();
		
		try {
			const result = await operation();
			const endTime = performance.now();
			const duration = endTime - startTime;
			
			if (process.env.NODE_ENV === 'development') {
				console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
				
				if (duration > 1000) {
					console.warn(`Slow async operation: ${operationName} took ${duration.toFixed(2)}ms`);
				}
			}
			
			return result;
		} catch (error) {
			const endTime = performance.now();
			const duration = endTime - startTime;
			
			if (process.env.NODE_ENV === 'development') {
				console.error(`${operationName} failed after ${duration.toFixed(2)}ms:`, error);
			}
			
			throw error;
		}
	}, []);

	return { measureAsync };
}

// Hook for Web Vitals monitoring
export function useWebVitals() {
	useEffect(() => {
		if (typeof window === 'undefined') return;

		// Measure Largest Contentful Paint (LCP)
		const observer = new PerformanceObserver((list) => {
			const entries = list.getEntries();
			const lastEntry = entries[entries.length - 1];
			
			if (process.env.NODE_ENV === 'development') {
				console.log('LCP:', lastEntry.startTime);
			}
		});

		try {
			observer.observe({ entryTypes: ['largest-contentful-paint'] });
		} catch (e) {
			// LCP not supported
		}

		// Measure Cumulative Layout Shift (CLS)
		let clsValue = 0;
		const clsObserver = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				if (!(entry as any).hadRecentInput) {
					clsValue += (entry as any).value;
				}
			}
			
			if (process.env.NODE_ENV === 'development') {
				console.log('CLS:', clsValue);
			}
		});

		try {
			clsObserver.observe({ entryTypes: ['layout-shift'] });
		} catch (e) {
			// CLS not supported
		}

		return () => {
			observer.disconnect();
			clsObserver.disconnect();
		};
	}, []);
}
