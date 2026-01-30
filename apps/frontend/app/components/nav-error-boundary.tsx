'use client';

import * as React from 'react';
import Link from 'next/link';

interface Props {
  children?: React.ReactNode;
  fallback?: React.ReactNode; // Optional: custom fallback UI
}

interface State {
  hasError: boolean;
}

export class NavErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Error in Nav component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <header className="border-b border-[var(--color-border)]">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <Link href="/" className="text-xl font-bold text-[var(--color-primary)]">
              Anvara
            </Link>

            <div className="flex items-center gap-6">
              <Link
                href="/marketplace"
                className="text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                Marketplace
              </Link>

              <div className="nav-login-disabled-container">
                <Link
                  href="/login"
                  className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm text-white login-button-disabled"
                >
                  Login
                </Link>
                <div className="tooltip">Login temporarily disabled due to error</div>
              </div>
            </div>
          </nav>
        </header>
      );
    }

    return this.props.children;
  }
}
