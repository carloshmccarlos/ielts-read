import { createArticle, deleteArticles } from "@/lib/data/article";
import { prisma } from "@/lib/prisma";
import { CategoryName } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const {
			title,
			imageUrl,
			content,
			description,
			categoryName,
			ieltsWordsCount,
		} = body;

		if (
			!title ||
			!imageUrl ||
			!content ||
			!description ||
			!categoryName ||
			!ieltsWordsCount
		) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 },
			);
		}

		if (
			!Object.values(CategoryName).includes(
				categoryName.replaceAll("-", "_") as CategoryName,
			)
		) {
			return NextResponse.json(
				{ error: "Invalid category name" },
				{ status: 400 },
			);
		}
		const ieltsCount = Number.parseInt(
			ieltsWordsCount.replace("count_", ""),
			10,
		);
		const articleWordsCount = Math.round(ieltsCount * 25);

		const article = await createArticle({
			title,
			imageUrl,
			content,
			description,
			categoryName,
			ieltsWordsCount,
			articleWordsCount,
		});

		console.log(article);
		return NextResponse.json(article, { status: 201 });
	} catch (error) {
		console.error("Error creating article:", error);
		return NextResponse.json(
			{ error: "Failed to create article" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { ids } = await request.json();

		if (!Array.isArray(ids) || ids.length === 0) {
			return NextResponse.json(
				{ message: "Article IDs must be a non-empty array" },
				{ status: 400 },
			);
		}

		await deleteArticles(ids);

		return NextResponse.json(
			{ message: "Articles deleted successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error deleting articles:", error);
		return NextResponse.json(
			{ message: "Failed to delete articles" },
			{ status: 500 },
		);
	}
}
