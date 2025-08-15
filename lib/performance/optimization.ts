import { cache } from "react";

// Cache wrapper for expensive operations
export const createCachedFunction = <T extends (...args: any[]) => any>(
	fn: T,
): T => {
	return cache(fn) as T;
};

// Debounce utility for search and input operations
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

// Throttle utility for scroll and resize events
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number,
): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			func(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
	callback: IntersectionObserverCallback,
	options?: IntersectionObserverInit,
): IntersectionObserver => {
	const defaultOptions: IntersectionObserverInit = {
		root: null,
		rootMargin: "50px",
		threshold: 0.1,
		...options,
	};

	return new IntersectionObserver(callback, defaultOptions);
};

// Preload critical resources
export const preloadResource = (href: string, as: string, type?: string) => {
	if (typeof window !== "undefined") {
		const link = document.createElement("link");
		link.rel = "preload";
		link.href = href;
		link.as = as;
		if (type) link.type = type;
		document.head.appendChild(link);
	}
};

// Prefetch resources for better navigation
export const prefetchResource = (href: string) => {
	if (typeof window !== "undefined") {
		const link = document.createElement("link");
		link.rel = "prefetch";
		link.href = href;
		document.head.appendChild(link);
	}
};

// Memory usage monitoring (development only)
export const monitorMemoryUsage = () => {
	if (
		process.env.NODE_ENV === "development" &&
		typeof window !== "undefined" &&
		"memory" in performance
	) {
		const memory = (performance as any).memory;
		console.log("Memory Usage:", {
			used: `${Math.round(memory.usedJSHeapSize / 1048576)} MB`,
			total: `${Math.round(memory.totalJSHeapSize / 1048576)} MB`,
			limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)} MB`,
		});
	}
};

// Bundle size analyzer helper
export const logBundleInfo = (componentName: string) => {
	if (process.env.NODE_ENV === "development") {
		console.log(`🚀 Loaded component: ${componentName}`);
	}
};

// Critical CSS inlining helper
export const inlineCriticalCSS = (css: string) => {
	if (typeof window !== "undefined") {
		const style = document.createElement("style");
		style.textContent = css;
		document.head.appendChild(style);
	}
};

// Resource hints for better loading
export const addResourceHints = () => {
	if (typeof window !== "undefined") {
		// DNS prefetch for external domains
		const dnsPrefetch = [
			"https://fonts.googleapis.com",
			"https://fonts.gstatic.com",
			"https://images.ielts-read.space",
		];

		dnsPrefetch.forEach((domain) => {
			const link = document.createElement("link");
			link.rel = "dns-prefetch";
			link.href = domain;
			document.head.appendChild(link);
		});

		// Preconnect to critical origins
		const preconnect = ["https://fonts.googleapis.com"];
		preconnect.forEach((origin) => {
			const link = document.createElement("link");
			link.rel = "preconnect";
			link.href = origin;
			link.crossOrigin = "anonymous";
			document.head.appendChild(link);
		});
	}
};
