"use client";

import { Suspense, lazy, useState, useEffect, useRef } from "react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

interface LazySectionProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	sectionName: string;
	threshold?: number;
	rootMargin?: string;
	priority?: boolean; // For above-the-fold content
}

// Enhanced skeleton for section loading
const SectionSkeleton = ({ sectionName }: { sectionName: string }) => (
	<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
		<div className="animate-pulse">
			{/* Section title skeleton */}
			<div className="h-8 lg:h-12 bg-gray-200 rounded w-1/3 mb-6"></div>
			
			{/* Content skeleton based on section type */}
			{sectionName.includes('Latest') && (
				<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6">
					<div className="lg:col-span-4 h-64 lg:h-80 bg-gray-200 rounded"></div>
					<div className="lg:col-span-2 space-y-4">
						<div className="h-32 bg-gray-200 rounded"></div>
						<div className="h-32 bg-gray-200 rounded"></div>
					</div>
				</div>
			)}
			
			{sectionName.includes('Featured') && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
					<div className="lg:col-span-2 h-64 lg:h-80 bg-gray-200 rounded"></div>
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => (
							<div key={i} className="h-20 bg-gray-200 rounded"></div>
						))}
					</div>
				</div>
			)}
			
			{sectionName.includes('Hottest') && (
				<div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 mb-6">
					<div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="h-24 bg-gray-200 rounded"></div>
						))}
					</div>
					<div className="lg:col-span-4 h-64 lg:h-80 bg-gray-200 rounded"></div>
				</div>
			)}
			
			{/* Default grid skeleton for other sections */}
			{!sectionName.includes('Latest') && !sectionName.includes('Featured') && !sectionName.includes('Hottest') && (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="space-y-3">
							<div className="h-32 bg-gray-200 rounded"></div>
							<div className="h-4 bg-gray-200 rounded w-3/4"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						</div>
					))}
				</div>
			)}
		</div>
	</div>
);

export default function LazySection({
	children,
	fallback,
	sectionName,
	threshold = 0.1,
	rootMargin = "100px",
	priority = false
}: LazySectionProps) {
	const [isVisible, setIsVisible] = useState(priority); // Load immediately if priority
	const [hasLoaded, setHasLoaded] = useState(priority);
	const sectionRef = useRef<HTMLDivElement>(null);
	const { measureInteraction } = usePerformanceMonitor(`LazySection-${sectionName}`);

	useEffect(() => {
		if (priority || hasLoaded) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					const endMeasure = measureInteraction("section-visible");
					setIsVisible(true);
					setHasLoaded(true);
					endMeasure();
					observer.disconnect();
				}
			},
			{
				threshold,
				rootMargin,
			}
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, [threshold, rootMargin, priority, hasLoaded, measureInteraction]);

	const defaultFallback = <SectionSkeleton sectionName={sectionName} />;

	return (
		<div ref={sectionRef}>
			{isVisible ? (
				<Suspense fallback={fallback || defaultFallback}>
					{children}
				</Suspense>
			) : (
				fallback || defaultFallback
			)}
		</div>
	);
}

// HOC for creating lazy section components
export function withLazySection<P extends object>(
	Component: React.ComponentType<P>,
	sectionName: string,
	options: {
		priority?: boolean;
		threshold?: number;
		rootMargin?: string;
	} = {}
) {
	return function LazyWrappedSection(props: P) {
		return (
			<LazySection
				sectionName={sectionName}
				priority={options.priority}
				threshold={options.threshold}
				rootMargin={options.rootMargin}
			>
				<Component {...props} />
			</LazySection>
		);
	};
}
