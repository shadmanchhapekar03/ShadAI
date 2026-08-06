import * as React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ShadAI crashed:", error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
              <path
                d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Something went wrong</h1>
            <p className="mt-1 text-sm text-text-secondary">
              An unexpected error occurred. Reloading usually fixes it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              this.handleReset();
              window.location.reload();
            }}
            className="rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:brightness-110"
          >
            Reload ShadAI
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
