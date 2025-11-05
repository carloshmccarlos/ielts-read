"use client";

import { Button } from "@/components/ui/button";

export default function Page() {
	async function handleClick() {
		try {
			const response = await fetch("/api/cron", {
				method: "GET",
			});

			if (response.ok) {
				console.log("Cron job triggered successfully");
			} else {
				console.error("Failed to trigger cron job");
			}
		} catch (error) {
			console.error("Error calling cron API:", error);
		}
	}

	return <Button onClick={handleClick}>Generate</Button>;
}
