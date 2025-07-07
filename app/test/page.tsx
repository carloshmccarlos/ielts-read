"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TestPage() {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<string | null>(null);

	const handleGenerate = async () => {
		setLoading(true);
		setResult(null);
		try {
			const response = await fetch("/api/admin/generate-article", {
				method: "POST",
			});
			const data = await response.json();
			if (response.ok) {
				setResult(`Success: Article created with ID: ${data.articleId}`);
			} else {
				setResult(`Error: ${data.error}`);
			}
		} catch (error) {
			if (error instanceof Error) {
				setResult(`Error: ${error.message}`);
			} else {
				setResult("An unknown error occurred");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Test Page</h1>
			<div className="flex flex-col gap-4">
				<p>Click the button to generate a new article using AI.</p>
				<p className="text-sm text-muted-foreground">
					Note: You must be logged in as an admin to use this feature.
				</p>
				<Button onClick={handleGenerate} disabled={loading}>
					{loading ? "Generating..." : "Generate Article"}
				</Button>
				{result && (
					<div className="mt-4 p-4 border rounded bg-gray-50 dark:bg-gray-800">
						<h2 className="text-lg font-semibold">Result:</h2>
						<pre className="whitespace-pre-wrap break-all">{result}</pre>
					</div>
				)}
			</div>
		</div>
	);
}
