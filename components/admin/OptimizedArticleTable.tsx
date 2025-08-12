"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import ToolBar from "@/components/admin/ToolBar";
import { transformCategoryName } from "@/lib/utils";
import type { Article, Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import { useArticleMutations } from "@/hooks/useOptimizedMutations";

type ArticleWithCategory = Article & {
	Category: Category | null;
};

// Optimized fetch function with better error handling
async function fetchArticlesAndCategories(): Promise<{
	articles: ArticleWithCategory[];
	categories: Category[];
}> {
	const [articlesRes, categoriesRes] = await Promise.all([
		fetch("/api/articles/admin"),
		fetch("/api/category")
	]);

	if (!articlesRes.ok || !categoriesRes.ok) {
		throw new Error("Failed to fetch data");
	}

	const [articles, categories] = await Promise.all([
		articlesRes.json(),
		categoriesRes.json()
	]);

	return { articles, categories };
}

export function OptimizedArticleTable() {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [filteredCategory, setFilteredCategory] = useState("all");

	// Single query for both articles and categories
	const {
		data,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["articles", "categories"],
		queryFn: fetchArticlesAndCategories,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const { articles = [], categories = [] } = data || {};

	// Memoized filtered articles
	const showedArticles = useMemo(() => {
		if (filteredCategory === "all") return articles;
		return articles.filter(
			(article) => article.Category?.name === filteredCategory
		);
	}, [articles, filteredCategory]);

	// Use optimized mutations
	const { deleteArticle, deleteArticles } = useArticleMutations();

	// Memoized handlers
	const handleDeleteArticle = useCallback((id: number) => {
		if (!confirm("Are you sure you want to delete this article?")) {
			return;
		}
		deleteArticle.mutate(id);
	}, [deleteArticle]);

	const handleDeleteSelected = useCallback(() => {
		const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;
		if (!confirm(`Are you sure you want to delete ${selectedRowCount} articles?`)) {
			return;
		}
		
		const selectedIds = Object.keys(rowSelection)
			.filter((key) => rowSelection[key])
			.map((key) => showedArticles[Number(key)].id);
		
		deleteArticles.mutate(selectedIds, {
			onSuccess: () => {
				setRowSelection({});
			}
		});
	}, [rowSelection, showedArticles, deleteArticles]);

	// Memoized columns definition
	const columns: ColumnDef<ArticleWithCategory>[] = useMemo(() => [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate")
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
			size: 50,
		},
		{
			accessorKey: "id",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
				>
					Id
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			size: 80,
		},
		{
			accessorKey: "title",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			size: 600,
		},
		{
			accessorKey: "Category.name",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Category
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<div className="text-left">
					{transformCategoryName(row.original.categoryName || "") || "None"}
				</div>
			),
			size: 150,
		},
		{
			accessorKey: "readTimes",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Read Count
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<div className="font-mono text-left">{row.original.readTimes}</div>
			),
			size: 120,
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Created
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			),
			cell: ({ row }) => (
				<div className="font-mono text-left">
					{new Date(row.original.createdAt).toLocaleDateString()}
				</div>
			),
			size: 120,
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const article = row.original;
				return (
					<div className="flex space-x-2">
						<Button asChild size="icon" variant="outline">
							<Link href={`/admin/edit/${article.id}`}>
								<Edit className="h-4 w-4" />
							</Link>
						</Button>
						<Button
							size="icon"
							variant="outline"
							className="text-destructive hover:text-destructive"
							onClick={() => handleDeleteArticle(article.id)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				);
			},
			size: 100,
		},
	], [handleDeleteArticle]);

	if (isLoading) {
		return (
			<div className="flex justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex justify-center py-8 text-red-500">
				Failed to load articles: {error?.message}
			</div>
		);
	}

	return (
		<div>
			<DataTable
				columns={columns}
				data={showedArticles}
				rowSelection={rowSelection}
				onRowSelectionChange={setRowSelection}
				toolbar={(table) => (
					<ToolBar
						table={table}
						value={filteredCategory}
						onChange={setFilteredCategory}
						categories={categories}
						handleDeleteSelected={handleDeleteSelected}
						isDeleting={deleteArticles.isPending}
						selectedRowCount={Object.keys(rowSelection).length}
					/>
				)}
			/>
		</div>
	);
}
