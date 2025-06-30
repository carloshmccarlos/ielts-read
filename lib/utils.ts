import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/auth-client";
import { type ClassValue, clsx } from "clsx";
import { headers } from "next/headers";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function titleToPath(name: string): string {
	return name.toLowerCase().replaceAll(" ", "-");
}

export function categoryToPath(name: string): string {
	return name.toLowerCase().replaceAll("_", "-");
}

export function pathToCategory(name: string): string {
	return name.toLowerCase().replaceAll("-", "_");
}

// transform category name from string-string to String String
export function transformCategoryName(name: string): string {
	return name
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
