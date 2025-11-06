import { getAllCategories } from "@/lib/actions/category";
import { NextResponse } from "next/server";

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
	const categories = await getAllCategories();

	return NextResponse.json(categories);
}
