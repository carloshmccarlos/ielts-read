"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useIntersectionObserver } from "./LazyComponents";

interface OptimizedImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	priority?: boolean;
	sizes?: string;
	quality?: number;
	placeholder?: "blur" | "empty";
	blurDataURL?: string;
}

export default function OptimizedImage({
	src,
	alt,
	width = 800,
	height = 600,
	className,
	priority = false,
	sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
	quality = 85,
	placeholder = "blur",
	blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
	...props
}: OptimizedImageProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const imageRef = useRef<HTMLDivElement>(null);
	const isInView = useIntersectionObserver(imageRef as React.RefObject<Element>, {
		threshold: 0.1,
		rootMargin: "50px",
	});

	const handleLoad = () => {
		setIsLoaded(true);
	};

	const handleError = () => {
		setHasError(true);
		console.warn(`Failed to load image: ${src}`);
	};

	// Generate optimized blur data URL for better placeholder
	const generateBlurDataURL = (w: number, h: number) => {
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.fillStyle = "#f3f4f6";
			ctx.fillRect(0, 0, w, h);
		}
		return canvas.toDataURL();
	};

	if (hasError) {
		return (
			<div
				className={`bg-gray-200 flex items-center justify-center ${className}`}
				style={{ width, height }}
			>
				<span className="text-gray-500 text-sm">Image not available</span>
			</div>
		);
	}

	return (
		<div
			ref={imageRef}
			className={`relative overflow-hidden ${className}`}
			style={{ width, height }}
		>
			{(isInView || priority) && (
				<Image
					src={src}
					alt={alt}
					width={width}
					height={height}
					className={`transition-opacity duration-300 ${
						isLoaded ? "opacity-100" : "opacity-0"
					}`}
					priority={priority}
					sizes={sizes}
					quality={quality}
					placeholder={placeholder}
					blurDataURL={blurDataURL || generateBlurDataURL(width, height)}
					onLoad={handleLoad}
					onError={handleError}
					{...props}
				/>
			)}
			{!isLoaded && (isInView || priority) && (
				<div className="absolute inset-0 bg-gray-200 animate-pulse" />
			)}
		</div>
	);
}
