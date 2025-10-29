"use client"; // Error boundaries must be Client Components

import MaintenanceNotice from "@/components/MaintenanceNotice";

export default function error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return <MaintenanceNotice />;
}
