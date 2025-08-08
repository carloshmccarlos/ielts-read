"use client";

import { memo, Suspense, lazy, type ComponentType, type LazyExoticComponent } from "react";
import Spinner from "@/components/Spinner";

interface LoaderProps {
	fallback?: React.ReactNode;
	className?: string;
}

// Generic lazy loader with optimized fallback
export function createLazyComponent<T extends ComponentType<any>>(
	importFn: () => Promise<{ default: T }>,
	fallback?: React.ReactNode
): LazyExoticComponent<T> {
	return lazy(importFn);
}

// Wrapper component for lazy loading with suspense
export function LazyWrapper<P extends Record<string, any>>({
	component: Component,
	fallback,
	...props
}: {
	component: LazyExoticComponent<ComponentType<P>>;
	fallback?: React.ReactNode;
} & P) {
	return (
		<Suspense fallback={fallback || <OptimizedSpinner />}>
			<Component {...(props as P)} />
		</Suspense>
	);
}

// Optimized spinner component
const OptimizedSpinner = memo(() => (
	<div className="flex justify-center items-center p-8">
		<Spinner />
	</div>
));

OptimizedSpinner.displayName = "OptimizedSpinner";

// Skeleton loader for cards
export const CardSkeleton = memo(() => (
	<div className="animate-pulse">
		<div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
		<div className="space-y-2">
			<div className="bg-gray-200 h-4 rounded w-3/4"></div>
			<div className="bg-gray-200 h-4 rounded w-1/2"></div>
		</div>
	</div>
));

CardSkeleton.displayName = "CardSkeleton";

// Table skeleton loader
export const TableSkeleton = memo(() => (
	<div className="animate-pulse space-y-4">
		<div className="bg-gray-200 h-8 rounded w-full"></div>
		{Array.from({ length: 5 }).map((_, i) => (
			<div key={i} className="flex space-x-4">
				<div className="bg-gray-200 h-6 rounded w-1/4"></div>
				<div className="bg-gray-200 h-6 rounded w-1/2"></div>
				<div className="bg-gray-200 h-6 rounded w-1/4"></div>
			</div>
		))}
	</div>
));

TableSkeleton.displayName = "TableSkeleton";

// Generic content loader
export const ContentLoader = memo<LoaderProps>(({ fallback, className }) => (
	<div className={`flex justify-center items-center min-h-[200px] ${className || ''}`}>
		{fallback || <OptimizedSpinner />}
	</div>
));

ContentLoader.displayName = "ContentLoader";
