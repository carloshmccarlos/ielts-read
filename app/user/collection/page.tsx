"use client";

import HorizontalCard from "@/components/HorizontalCard";
import PaginationControls from "@/components/PaginationControls";
import Spinner from "@/components/Spinner";
import VerticalCard from "@/components/VerticalCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth/auth-client";
import type { MarkedArticle, ReadHistory } from "@/lib/data/user";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

const LIMIT = 8;

interface MarkedArticlesResponse {
	articles: MarkedArticle[];
	total: number;
}

interface ReadHistoryResponse {
	history: ReadHistory[];
	total: number;
}

interface MasteredArticlesResponse {
	articles: MarkedArticle[];
	total: number;
}

const fetchMarkedArticles = async (
	page: number,
): Promise<MarkedArticlesResponse> => {
	const response = await fetch(
		`/api/user/collection/marked?page=${page}&limit=${LIMIT}`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch marked articles");
	}
	return response.json();
};

const fetchReadHistory = async (page: number): Promise<ReadHistoryResponse> => {
	const response = await fetch(
		`/api/user/collection/history?page=${page}&limit=${LIMIT}`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch read history");
	}
	return response.json();
};

const fetchMasteredArticles = async (
	page: number,
): Promise<MasteredArticlesResponse> => {
	const response = await fetch(
		`/api/user/collection/mastered?page=${page}&limit=${LIMIT}`,
	);
	if (!response.ok) {
		throw new Error("Failed to fetch mastered articles");
	}
	return response.json();
};

export default function CollectionPage() {
	const [activeTab, setActiveTab] = useState("marked");
	const [markedPage, setMarkedPage] = useState(1);
	const [historyPage, setHistoryPage] = useState(1);
	const [masteredPage, setMasteredPage] = useState(1);

	const {
		data: markedData,
		isLoading: isMarkedLoading,
		error: markedError,
	} = useQuery<MarkedArticlesResponse>({
		queryKey: ["markedArticles", markedPage],
		queryFn: () => fetchMarkedArticles(markedPage),
		enabled: activeTab === "marked",
	});

	const {
		data: historyData,
		isLoading: isHistoryLoading,
		error: historyError,
	} = useQuery<ReadHistoryResponse>({
		queryKey: ["readHistory", historyPage],
		queryFn: () => fetchReadHistory(historyPage),
		enabled: activeTab === "history",
	});

	const {
		data: masteredData,
		isLoading: isMasteredLoading,
		error: masteredError,
	} = useQuery<MasteredArticlesResponse>({
		queryKey: ["masteredArticles", masteredPage],
		queryFn: () => fetchMasteredArticles(masteredPage),
		enabled: activeTab === "mastered",
	});

	return (
		<div className="max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-32 py-2 sm:py-2 lg:py-4">
			<h1 className="text-3xl font-bold mb-8">My Reading Collection</h1>

			<Tabs
				defaultValue="marked"
				className="w-full"
				onValueChange={setActiveTab}
			>
				<TabsList className="mb-6">
					<TabsTrigger value="marked">Marked Articles</TabsTrigger>
					<TabsTrigger value="history">Reading History</TabsTrigger>
					<TabsTrigger value="mastered">Mastered Articles</TabsTrigger>
				</TabsList>

				<TabsContent value="marked">
					<div className="flex flex-col justify-between min-h-[70vh]">
						<div>
							{isMarkedLoading && <Spinner />}
							{markedError && (
								<p className="text-red-500">
									{markedError instanceof Error
										? markedError.message
										: "Failed to load marked articles"}
								</p>
							)}
							{markedData &&
								(markedData.articles.length === 0 ? (
									<div className="text-center py-10">
										<p className="text-gray-500">
											You haven't marked any articles yet.
										</p>
										<Link
											href="/"
											className="text-blue-600 hover:underline mt-2 inline-block"
										>
											Browse articles
										</Link>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
										{markedData.articles.map((item) => (
											<div key={item.article.id}>
												<div className="sm:hidden">
													<HorizontalCard
														readCount={null}
														article={item.article}
													/>
												</div>
												<div className="hidden sm:block h-full">
													<VerticalCard
														readCount={null}
														key={item.article.id}
														article={item.article}
													/>
												</div>
											</div>
										))}
									</div>
								))}
						</div>
						<div className="mt-8">
							{markedData && markedData.total > 0 && (
								<PaginationControls
									total={markedData.total}
									page={markedPage}
									limit={LIMIT}
									onPageChange={setMarkedPage}
								/>
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="history">
					<div className="flex flex-col justify-between min-h-[70vh]">
						<div>
							{isHistoryLoading && <Spinner />}
							{historyError && (
								<p className="text-red-500">
									{historyError instanceof Error
										? historyError.message
										: "Failed to load read history"}
								</p>
							)}
							{historyData &&
								(historyData.history.length === 0 ? (
									<div className="text-center py-10">
										<p className="text-gray-500">
											You haven't read any articles yet.
										</p>
										<Link
											href="/"
											className="text-blue-600 hover:underline mt-2 inline-block"
										>
											Browse articles
										</Link>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
										{historyData.history.map((item) => (
											<div key={item.article.id}>
												<div className="sm:hidden">
													<HorizontalCard
														readCount={item.times}
														article={item.article}
													/>
												</div>
												<div className="hidden sm:block h-full">
													<VerticalCard
														key={item.article.id}
														article={item.article}
														readCount={item.times}
													/>
												</div>
											</div>
										))}
									</div>
								))}
						</div>
						<div className="mt-8">
							{historyData && historyData.total > 0 && (
								<PaginationControls
									total={historyData.total}
									page={historyPage}
									limit={LIMIT}
									onPageChange={setHistoryPage}
								/>
							)}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="mastered">
					<div className="flex flex-col justify-between min-h-[70vh]">
						<div>
							{isMasteredLoading && <Spinner />}
							{masteredError && (
								<p className="text-red-500">
									{masteredError instanceof Error
										? masteredError.message
										: "Failed to load mastered articles"}
								</p>
							)}
							{masteredData &&
								(masteredData.articles.length === 0 ? (
									<div className="text-center py-10">
										<p className="text-gray-500">
											You haven't mastered any articles yet.
										</p>
										<Link
											href="/"
											className="text-blue-600 hover:underline mt-2 inline-block"
										>
											Browse articles
										</Link>
									</div>
								) : (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
										{masteredData.articles.map((item) => (
											<div key={item.article.id}>
												<div className="sm:hidden">
													<HorizontalCard
														readCount={null}
														article={item.article}
													/>
												</div>
												<div className="hidden sm:block h-full">
													<VerticalCard
														key={item.article.id}
														article={item.article}
														readCount={null}
													/>
												</div>
											</div>
										))}
									</div>
								))}
						</div>
						<div className="mt-8">
							{masteredData && masteredData.total > 0 && (
								<PaginationControls
									total={masteredData.total}
									page={masteredPage}
									limit={LIMIT}
									onPageChange={setMasteredPage}
								/>
							)}
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
