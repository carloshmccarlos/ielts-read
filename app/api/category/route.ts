import { getAllCategories } from "@/lib/data/category";
import { NextResponse } from "next/server";

export async function GET() {
	const categories = await getAllCategories();

	return NextResponse.json(categories);
}
