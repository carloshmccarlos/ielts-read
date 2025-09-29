"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import type React from "react";
import { ClientErrorDetails } from "./ClientErrorDetails";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		this.props.onError?.(error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
					<AlertCircle className="w-16 h-16 text-red-500 mb-4" />
					<h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
					<p className="text-gray-600 mb-6 max-w-md">
						We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
					</p>
					{this.state.error && <ClientErrorDetails error={this.state.error} />}
					<div className="flex gap-4">
						<Button onClick={this.handleReset} variant="outline">
							<RefreshCw className="w-4 h-4 mr-2" />
							Try Again
						</Button>
						<Button onClick={() => window.location.reload()}>
							Refresh Page
						</Button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

// Hook version for functional components
export function withErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	fallback?: ReactNode
) {
	return function WrappedComponent(props: P) {
		return (
			<ErrorBoundary fallback={fallback}>
				<Component {...props} />
			</ErrorBoundary>
		);
	};
}
