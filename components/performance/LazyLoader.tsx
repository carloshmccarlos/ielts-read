"use client";

import { Suspense, lazy, ComponentType } from "react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

interface LazyLoaderProps {
	fallback?: React.ReactNode;
	componentName: string;
}

// Generic lazy loading wrapper
export function createLazyComponent<T extends ComponentType<any>>(
	importFn: () => Promise<{ default: T }>,
	componentName: string
) {
	const LazyComponent = lazy(importFn);

	return function LazyWrapper(props: React.ComponentProps<T>) {
		const { measureInteraction } = usePerformanceMonitor(`Lazy-${componentName}`);

		const LoadingFallback = () => (
			<div className="animate-pulse">
				<div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
				<div className="h-4 bg-gray-200 rounded w-1/2"></div>
			</div>
		);

		return (
			<Suspense fallback={<LoadingFallback />}>
				<LazyComponent {...props} />
			</Suspense>
		);
	};
}

// Intersection Observer based lazy loading
export function LazyLoader({
	children,
	fallback = <div className="h-32 bg-gray-100 animate-pulse rounded" />,
	componentName,
}: {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	componentName: string;
}) {
	const { measureInteraction } = usePerformanceMonitor(`LazyLoader-${componentName}`);

	return (
		<Suspense fallback={fallback}>
			{children}
		</Suspense>
	);
}

// Skeleton components for better loading UX
export const ArticleSkeleton = () => (
	<div className="animate-pulse space-y-4">
		<div className="h-8 bg-gray-200 rounded w-3/4"></div>
		<div className="space-y-2">
			<div className="h-4 bg-gray-200 rounded"></div>
			<div className="h-4 bg-gray-200 rounded w-5/6"></div>
			<div className="h-4 bg-gray-200 rounded w-4/6"></div>
		</div>
		<div className="h-48 bg-gray-200 rounded"></div>
	</div>
);

export const CategorySkeleton = () => (
	<div className="animate-pulse">
		<div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{[...Array(6)].map((_, i) => (
				<div key={i} className="space-y-3">
					<div className="h-32 bg-gray-200 rounded"></div>
					<div className="h-4 bg-gray-200 rounded w-3/4"></div>
					<div className="h-4 bg-gray-200 rounded w-1/2"></div>
				</div>
			))}
		</div>
	</div>
);

export const NavbarSkeleton = () => (
	<div className="animate-pulse">
		<div className="flex justify-between items-center p-4">
			<div className="h-8 bg-gray-200 rounded w-32"></div>
			<div className="flex space-x-4">
				<div className="h-8 bg-gray-200 rounded w-16"></div>
				<div className="h-8 bg-gray-200 rounded w-16"></div>
				<div className="h-8 bg-gray-200 rounded w-20"></div>
			</div>
		</div>
	</div>
);
