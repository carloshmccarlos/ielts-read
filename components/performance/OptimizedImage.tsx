"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { useImageLazyLoadingPerformance } from "@/hooks/useLazyLoadingPerformance";

interface OptimizedImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	priority?: boolean;
	placeholder?: "blur" | "empty";
	blurDataURL?: string;
	sizes?: string;
	quality?: number;
	loading?: "lazy" | "eager";
	fill?: boolean;
	onLoad?: () => void;
	onError?: () => void;
	trackPerformance?: boolean;
	lazyThreshold?: number;
	[key: string]: any; // For additional Next.js Image props
}

export default function OptimizedImage({
	src,
	alt,
	width = 800,
	height = 600,
	className = "",
	priority = false,
	placeholder = "empty",
	blurDataURL,
	sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
	quality = 85,
	loading = "lazy",
	fill = false,
	onLoad,
	onError,
	trackPerformance = true,
	lazyThreshold = 0.1,
	...props
}: OptimizedImageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [isIntersecting, setIsIntersecting] = useState(priority);
	const imageRef = useRef<HTMLDivElement>(null);
	
	const {
		imageMetrics,
		handleImageLoadStart,
		handleImageLoad: performanceImageLoad,
		handleImageError: performanceImageError
	} = useImageLazyLoadingPerformance(`${alt || 'image'}-${src.split('/').pop()}`);

	// Intersection Observer for lazy loading
	useEffect(() => {
		if (priority || !trackPerformance) {
			setIsIntersecting(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsIntersecting(true);
					handleImageLoadStart();
					observer.disconnect();
				}
			},
			{ threshold: lazyThreshold, rootMargin: '50px' }
		);

		if (imageRef.current) {
			observer.observe(imageRef.current);
		}

		return () => observer.disconnect();
	}, [priority, trackPerformance, lazyThreshold, handleImageLoadStart]);

	const handleLoad = useCallback(() => {
		setIsLoading(false);
		performanceImageLoad();
		onLoad?.();
	}, [performanceImageLoad, onLoad]);

	const handleError = useCallback(() => {
		setHasError(true);
		setIsLoading(false);
		performanceImageError();
		onError?.();
	}, [performanceImageError, onError]);

	// Generate blur placeholder for better loading experience
	const generateBlurDataURL = (w: number, h: number) => {
		return `data:image/svg+xml;base64,${Buffer.from(
			`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
						<stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
					</linearGradient>
				</defs>
				<rect width="100%" height="100%" fill="url(#grad)" />
			</svg>`
		).toString("base64")}`;
	};

	if (hasError) {
		return (
			<div
				className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
				style={{ width, height }}
			>
				<svg
					className="w-8 h-8"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
		);
	}

	// Don't render image until it's intersecting (for non-priority images)
	if (!isIntersecting && !priority) {
		return (
			<div
				ref={imageRef}
				className={`relative overflow-hidden ${className}`}
				style={fill ? {} : { width, height }}
			>
				<div
					className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
					style={fill ? { width: '100%', height: '100%' } : { width, height }}
				/>
			</div>
		);
	}

	return (
		<div 
			ref={imageRef}
			className={`relative overflow-hidden ${className}`}
			style={fill ? {} : { width, height }}
		>
			{isLoading && (
				<div
					className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
					style={fill ? { width: '100%', height: '100%' } : { width, height }}
				/>
			)}
			<Image
				src={src}
				alt={alt}
				{...(fill ? { fill: true } : { width, height })}
				priority={priority}
				placeholder={placeholder}
				blurDataURL={blurDataURL || generateBlurDataURL(fill ? 800 : width, fill ? 600 : height)}
				sizes={sizes}
				quality={quality}
				loading={loading}
				onLoad={handleLoad}
				onError={handleError}
				className={`transition-opacity duration-300 ${
					isLoading ? "opacity-0" : "opacity-100"
				}`}
				{...props}
			/>
		</div>
	);
}
