"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { addResourceHints, monitorMemoryUsage } from "@/lib/performance/optimization";

interface PerformanceContextType {
	isOptimizationEnabled: boolean;
	connectionType: string;
	isSlowConnection: boolean;
}

const PerformanceContext = createContext<PerformanceContextType>({
	isOptimizationEnabled: true,
	connectionType: "unknown",
	isSlowConnection: false,
});

export const usePerformanceContext = () => useContext(PerformanceContext);

interface PerformanceProviderProps {
	children: React.ReactNode;
}

export default function PerformanceProvider({ children }: PerformanceProviderProps) {
	const [connectionType, setConnectionType] = useState("unknown");
	const [isSlowConnection, setIsSlowConnection] = useState(false);

	useEffect(() => {
		// Add resource hints for better loading
		addResourceHints();

		// Monitor memory usage in development
		if (process.env.NODE_ENV === "development") {
			const interval = setInterval(monitorMemoryUsage, 30000); // Every 30 seconds
			return () => clearInterval(interval);
		}
	}, []);

	useEffect(() => {
		// Detect connection type and speed
		if (typeof navigator !== "undefined" && "connection" in navigator) {
			const connection = (navigator as any).connection;
			if (connection) {
				setConnectionType(connection.effectiveType || "unknown");
				setIsSlowConnection(
					connection.effectiveType === "slow-2g" ||
					connection.effectiveType === "2g" ||
					connection.saveData === true
				);

				const handleConnectionChange = () => {
					setConnectionType(connection.effectiveType || "unknown");
					setIsSlowConnection(
						connection.effectiveType === "slow-2g" ||
						connection.effectiveType === "2g" ||
						connection.saveData === true
					);
				};

				connection.addEventListener("change", handleConnectionChange);
				return () => connection.removeEventListener("change", handleConnectionChange);
			}
		}
	}, []);

	const value: PerformanceContextType = {
		isOptimizationEnabled: true,
		connectionType,
		isSlowConnection,
	};

	return (
		<PerformanceContext.Provider value={value}>
			{children}
		</PerformanceContext.Provider>
	);
}
