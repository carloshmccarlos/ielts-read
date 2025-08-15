"use client";

import { useEffect, useRef } from "react";

interface PerformanceMetrics {
	loadTime: number;
	renderTime: number;
	interactionTime: number;
}

export function usePerformanceMonitor(componentName: string) {
	const startTime = useRef<number>(performance.now());
	const metricsRef = useRef<PerformanceMetrics>({
		loadTime: 0,
		renderTime: 0,
		interactionTime: 0,
	});

	useEffect(() => {
		const endTime = performance.now();
		const renderTime = endTime - startTime.current;
		metricsRef.current.renderTime = renderTime;

		// Log performance metrics in development
		if (process.env.NODE_ENV === "development") {
			console.log(`🚀 ${componentName} Performance:`, {
				renderTime: `${renderTime.toFixed(2)}ms`,
				timestamp: new Date().toISOString(),
			});

			// Warn about slow components
			if (renderTime > 100) {
				console.warn(
					`⚠️ Slow component detected: ${componentName} took ${renderTime.toFixed(2)}ms to render`
				);
			}
		}

		// Measure Core Web Vitals
		if (typeof window !== "undefined" && "web-vital" in window) {
			// Measure LCP (Largest Contentful Paint)
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				const lastEntry = entries[entries.length - 1];
				if (lastEntry) {
					console.log("LCP:", lastEntry.startTime);
				}
			}).observe({ entryTypes: ["largest-contentful-paint"] });

			// Measure CLS (Cumulative Layout Shift)
			new PerformanceObserver((entryList) => {
				let clsValue = 0;
				for (const entry of entryList.getEntries()) {
					if (!(entry as any).hadRecentInput) {
						clsValue += (entry as any).value;
					}
				}
				if (clsValue > 0) {
					console.log("CLS:", clsValue);
				}
			}).observe({ entryTypes: ["layout-shift"] });
		}
	}, [componentName]);

	const measureInteraction = (interactionName: string) => {
		const interactionStart = performance.now();
		
		return () => {
			const interactionEnd = performance.now();
			const interactionTime = interactionEnd - interactionStart;
			metricsRef.current.interactionTime = interactionTime;

			if (process.env.NODE_ENV === "development") {
				console.log(`⚡ ${interactionName} interaction:`, {
					time: `${interactionTime.toFixed(2)}ms`,
					component: componentName,
				});

				if (interactionTime > 50) {
					console.warn(
						`⚠️ Slow interaction: ${interactionName} in ${componentName} took ${interactionTime.toFixed(2)}ms`
					);
				}
			}
		};
	};

	return {
		metrics: metricsRef.current,
		measureInteraction,
	};
}
