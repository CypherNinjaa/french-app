import React, { Component } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
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

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: undefined });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
					<div
						className="card text-center"
						style={{ maxWidth: "28rem", width: "100%" }}
					>
						<div className="card-body">
							<div
								className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
								style={{ width: "64px", height: "64px" }}
							>
								<AlertTriangle
									className="text-danger"
									style={{ width: "40px", height: "40px" }}
								/>
							</div>

							<h2 className="h4 fw-bold mb-3">Something went wrong</h2>

							<p className="text-muted mb-4">
								We're sorry, but something unexpected happened. Please try
								refreshing the page.
							</p>

							{this.state.error && (
								<details className="text-start mb-4">
									<summary
										className="text-muted small mb-2"
										style={{ cursor: "pointer" }}
									>
										Technical details
									</summary>
									<pre
										className="small bg-light p-2 rounded text-danger text-start"
										style={{ overflow: "auto" }}
									>
										{this.state.error.message}
									</pre>
								</details>
							)}

							<div className="d-grid gap-2">
								<button
									onClick={this.handleRetry}
									className="btn btn-primary d-flex align-items-center justify-content-center"
								>
									<RefreshCw
										className="me-2"
										style={{ width: "16px", height: "16px" }}
									/>
									Try Again
								</button>

								<button
									onClick={() => window.location.reload()}
									className="btn btn-outline-secondary"
								>
									Refresh Page
								</button>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
