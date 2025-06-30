"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }: { content: string }) => {
	// to prevent the leading space break Markdown format.
	const markdownContent = content
		.split("\n")
		.map((line) => line.trimStart())
		.join("\n");
	return (
		<div className="leading-10 text-lg md:text-[22px]  font-sans space-y-8 prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:text-gray-500">
			<ReactMarkdown remarkPlugins={[remarkGfm]}>
				{markdownContent}
			</ReactMarkdown>
		</div>
	);
};

export default MarkdownRenderer;
