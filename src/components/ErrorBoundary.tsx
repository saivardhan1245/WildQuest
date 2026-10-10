import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Compass } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[WildQuest ErrorBoundary caught error]:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      if (typeof window !== 'undefined') {
        if ('caches' in window) {
          caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
        }
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((regs) => {
            regs.forEach((r) => r.unregister());
          });
        }
        window.location.reload();
      }
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f6f3e9] dark:bg-[#0b120a] text-[#142312] dark:text-[#edebe1] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-[#122011] border-2 border-[#dad1be] dark:border-[#22391b] rounded-3xl p-6 sm:p-8 text-center shadow-lg space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#44662d]/10 dark:bg-[#8bc34a]/15 flex items-center justify-center text-[#44662d] dark:text-[#8bc34a]">
              <Compass className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-serif text-2xl font-bold">WildQuest Ready</h1>
              <p className="text-sm text-[#54664d] dark:text-[#9bb195]">
                A display synchronization reset is required to render your active outdoor session.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#2d4d1f] hover:bg-[#385e27] text-[#f7f5ed] font-medium transition-all shadow-md cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Application</span>
              </button>
            </div>

            {this.state.error && (
              <details className="text-left text-[11px] font-mono text-[#778870] dark:text-[#6a8064] bg-[#f7f5ed] dark:bg-[#080d07] p-3 rounded-xl border border-[#dad1be] dark:border-[#22391b] overflow-auto max-h-32">
                <summary className="cursor-pointer font-bold text-[#44662d] dark:text-[#8bc34a]">Diagnostic Details</summary>
                <p className="mt-1 whitespace-pre-wrap">{this.state.error.message || String(this.state.error)}</p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
