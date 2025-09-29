"use client";

import { useEffect, useState } from "react";

interface ClientErrorDetailsProps {
	error: Error;
}

export function ClientErrorDetails({ error }: ClientErrorDetailsProps) {
	const [isDevelopment, setIsDevelopment] = useState(false);

	useEffect(() => {
		// Check if we're in development mode on the client side
		setIsDevelopment(process.env.NODE_ENV === "development");
	}, []);

	if (!isDevelopment || !error) {
		return null;
	}

	return (
		<details className="mb-4 p-4 bg-gray-100 rounded-lg text-left max-w-2xl">
			<summary className="cursor-pointer font-semibold">Error Details</summary>
			<pre className="mt-2 text-sm overflow-auto">
				{error.stack}
			</pre>
		</details>
	);
}
