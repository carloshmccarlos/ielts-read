"use client";

import Image from "next/image";
import { useState, memo } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	priority?: boolean;
	fill?: boolean;
	sizes?: string;
	quality?: number;
	placeholder?: "blur" | "empty";
	blurDataURL?: string;
	onLoad?: () => void;
	onError?: () => void;
}

const OptimizedImage = memo<OptimizedImageProps>(({
	src,
	alt,
	width,
	height,
	className,
	priority = false,
	fill = false,
	sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px",
	quality = 85,
	placeholder = "empty",
	blurDataURL,
	onLoad,
	onError,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const handleLoad = () => {
		setIsLoading(false);
		onLoad?.();
	};

	const handleError = () => {
		setIsLoading(false);
		setHasError(true);
		onError?.();
	};

	if (hasError) {
		return (
			<div 
				className={cn(
					"flex items-center justify-center bg-gray-100 text-gray-400",
					className
				)}
				style={fill ? undefined : { width, height }}
			>
				<span className="text-sm">Failed to load image</span>
			</div>
		);
	}

	return (
		<div className={cn("relative overflow-hidden", className)}>
			{isLoading && (
				<div 
					className="absolute inset-0 bg-gray-200 animate-pulse"
					style={fill ? undefined : { width, height }}
				/>
			)}
			<Image
				src={src}
				alt={alt}
				width={fill ? undefined : width}
				height={fill ? undefined : height}
				fill={fill}
				sizes={sizes}
				quality={quality}
				priority={priority}
				placeholder={placeholder}
				blurDataURL={blurDataURL}
				className={cn(
					"transition-opacity duration-300",
					isLoading ? "opacity-0" : "opacity-100",
					fill ? "object-cover" : ""
				)}
				onLoad={handleLoad}
				onError={handleError}
			/>
		</div>
	);
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
