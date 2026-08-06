import React, { Component } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[SOC Error Boundary Caught Exception]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/app/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="glass-panel p-8 rounded-2xl border border-rose-500/30 max-w-lg space-y-6 bg-[#0B1220]/80 shadow-glow-cyber">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">SOC Telemetry Interrupted</h2>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                An unhandled UI runtime exception occurred on this route. AegisAI Error Boundary isolated the failure to prevent system blackout.
              </p>
              {this.state.error?.message && (
                <div className="p-3 rounded-xl bg-[#04070D] border border-slate-800 text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="btn-soc-neon px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-glow-cyber flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload SOC Telemetry</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="px-5 py-2.5 rounded-xl glass-panel text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
