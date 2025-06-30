import adminCheck from "@/lib/auth/adminCheck";
import {
	deleteArticle,
	getArticleById,
	updateArticle,
} from "@/lib/data/article";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface Props {
	params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
	try {
		const id = Number.parseInt((await params).id, 10);

		if (Number.isNaN(id)) {
			return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
		}

		const article = await getArticleById(id);

		if (!article) {
			return NextResponse.json({ error: "Article not found" }, { status: 404 });
		}

		return NextResponse.json(article);
	} catch (error) {
		console.error("Error getting article:", error);
		return NextResponse.json(
			{ error: "Failed to get article" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: NextRequest, { params }: Props) {
	try {
		const id = Number.parseInt((await params).id, 10);
		if (Number.isNaN(id)) {
			return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
		}

		const body = await request.json();

		const { title, imageUrl, content, description, categoryName } = body;

		// 验证必填字段
		if (!title || !imageUrl || !content || !description) {
			return NextResponse.json(
				{ error: "Title, image URL, content and description are required" },
				{ status: 400 },
			);
		}
		const updatedArticle = await updateArticle(id, {
			title,
			imageUrl,
			content,
			description,
			categoryName,
		});

		if (!updatedArticle) {
			return NextResponse.json({ error: "Article not found" }, { status: 404 });
		}

		return NextResponse.json(updatedArticle);
	} catch (error) {
		console.error("Error updating article:", error);
		return NextResponse.json(
			{ error: "Failed to update article" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest, { params }: Props) {
	try {
		// Check if user is admin
		await adminCheck();

		// Delete the article
		const articleId = Number.parseInt((await params).id, 10);

		if (Number.isNaN(articleId)) {
			return NextResponse.json(
				{ message: "Invalid article ID" },
				{ status: 400 },
			);
		}

		const deletedArticle = await deleteArticle(articleId);

		if (!deletedArticle) {
			return NextResponse.json(
				{ message: "Article not found" },
				{ status: 404 },
			);
		}
		revalidatePath("/admin/edit");

		return NextResponse.json({ message: "Article deleted successfully" });
	} catch (error) {
		console.error("Error deleting article:", error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
