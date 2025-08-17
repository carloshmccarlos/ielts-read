"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LazyLoadingMetrics {
	loadTime: number;
	isVisible: boolean;
	intersectionTime: number;
	renderTime: number;
}

interface UseLazyLoadingPerformanceOptions {
	threshold?: number;
	rootMargin?: string;
	trackMetrics?: boolean;
}

export function useLazyLoadingPerformance(
	componentName: string,
	options: UseLazyLoadingPerformanceOptions = {}
) {
	const {
		threshold = 0.1,
		rootMargin = "50px",
		trackMetrics = process.env.NODE_ENV === "development"
	} = options;

	const [metrics, setMetrics] = useState<LazyLoadingMetrics>({
		loadTime: 0,
		isVisible: false,
		intersectionTime: 0,
		renderTime: 0
	});

	const elementRef = useRef<HTMLElement>(null);
	const startTimeRef = useRef<number>(0);
	const intersectionTimeRef = useRef<number>(0);
	const renderStartRef = useRef<number>(0);

	const measureStart = useCallback(() => {
		if (trackMetrics) {
			startTimeRef.current = performance.now();
			renderStartRef.current = performance.now();
		}
	}, [trackMetrics]);

	const measureIntersection = useCallback(() => {
		if (trackMetrics && startTimeRef.current > 0) {
			intersectionTimeRef.current = performance.now() - startTimeRef.current;
		}
	}, [trackMetrics]);

	const measureRenderComplete = useCallback(() => {
		if (trackMetrics && renderStartRef.current > 0) {
			const renderTime = performance.now() - renderStartRef.current;
			const totalLoadTime = performance.now() - startTimeRef.current;

			setMetrics(prev => ({
				...prev,
				loadTime: totalLoadTime,
				renderTime,
				intersectionTime: intersectionTimeRef.current
			}));

			// Log performance metrics in development
			if (process.env.NODE_ENV === "development") {
				console.group(`🚀 Lazy Loading Performance - ${componentName}`);
				console.log(`⏱️ Total Load Time: ${totalLoadTime.toFixed(2)}ms`);
				console.log(`👁️ Intersection Time: ${intersectionTimeRef.current.toFixed(2)}ms`);
				console.log(`🎨 Render Time: ${renderTime.toFixed(2)}ms`);
				
				// Performance warnings
				if (totalLoadTime > 1000) {
					console.warn(`⚠️ Slow loading detected for ${componentName}`);
				}
				if (renderTime > 500) {
					console.warn(`⚠️ Slow rendering detected for ${componentName}`);
				}
				console.groupEnd();
			}
		}
	}, [trackMetrics, componentName]);

	useEffect(() => {
		if (!elementRef.current || !trackMetrics) return;

		measureStart();

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					measureIntersection();
					setMetrics(prev => ({ ...prev, isVisible: true }));
					
					// Measure render completion after a short delay
					requestAnimationFrame(() => {
						setTimeout(() => {
							measureRenderComplete();
						}, 0);
					});
					
					observer.disconnect();
				}
			},
			{ threshold, rootMargin }
		);

		observer.observe(elementRef.current);

		return () => observer.disconnect();
	}, [threshold, rootMargin, trackMetrics, measureStart, measureIntersection, measureRenderComplete]);

	return {
		elementRef,
		metrics,
		isVisible: metrics.isVisible,
		measureStart,
		measureIntersection,
		measureRenderComplete
	};
}

// Hook for tracking image lazy loading performance
export function useImageLazyLoadingPerformance(imageName: string) {
	const [imageMetrics, setImageMetrics] = useState({
		loadStartTime: 0,
		loadEndTime: 0,
		loadTime: 0,
		isLoaded: false,
		hasError: false
	});

	const handleImageLoadStart = useCallback(() => {
		const startTime = performance.now();
		setImageMetrics(prev => ({
			...prev,
			loadStartTime: startTime
		}));
	}, []);

	const handleImageLoad = useCallback(() => {
		const endTime = performance.now();
		setImageMetrics(prev => {
			const loadTime = endTime - prev.loadStartTime;
			
			if (process.env.NODE_ENV === "development") {
				console.log(`🖼️ Image loaded: ${imageName} (${loadTime.toFixed(2)}ms)`);
				if (loadTime > 2000) {
					console.warn(`⚠️ Slow image loading: ${imageName}`);
				}
			}

			return {
				...prev,
				loadEndTime: endTime,
				loadTime,
				isLoaded: true
			};
		});
	}, [imageName]);

	const handleImageError = useCallback(() => {
		setImageMetrics(prev => ({
			...prev,
			hasError: true
		}));
		
		if (process.env.NODE_ENV === "development") {
			console.error(`❌ Image failed to load: ${imageName}`);
		}
	}, [imageName]);

	return {
		imageMetrics,
		handleImageLoadStart,
		handleImageLoad,
		handleImageError
	};
}
