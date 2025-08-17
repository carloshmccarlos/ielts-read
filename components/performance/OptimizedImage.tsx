"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

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
	...props
}: OptimizedImageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const { measureInteraction } = usePerformanceMonitor("OptimizedImage");

	const handleLoad = useCallback(() => {
		const endMeasure = measureInteraction("image-load");
		setIsLoading(false);
		endMeasure();
	}, [measureInteraction]);

	const handleError = useCallback(() => {
		setHasError(true);
		setIsLoading(false);
	}, []);

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

	return (
		<div className={`relative overflow-hidden ${className}`}>
			{isLoading && (
				<div
					className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
					style={{ width, height }}
				/>
			)}
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				priority={priority}
				placeholder={placeholder}
				blurDataURL={blurDataURL || generateBlurDataURL(width, height)}
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
