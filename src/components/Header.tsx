import React from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Scale,
  SlidersHorizontal,
  Bot,
  Layers,
  Network,
  ChevronDown,
  Scan,
  Smartphone,
  ShieldAlert,
  Boxes,
} from 'lucide-react';
import { SAMPLE_PRESETS } from '../services/sampleData';

export type AppTabType =
  | 'intake'
  | 'queue'
  | 'certificate-scanner'
  | 'fraud-forensics'
  | 'whatsapp'
  | 'bundling'
  | 'compliance'
  | 'architecture'
  | 'portfolio';

interface HeaderProps {
  activeTab: AppTabType;
  onTabChange: (tab: AppTabType) => void;
  pendingQueueCount: number;
  onResetDemo: () => void;
  selectedPresetId: string;
  onSelectPreset: (presetId: string) => void;
  onOpenWhatIf: () => void;
  onOpenFairAi: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  pendingQueueCount,
  onResetDemo,
  selectedPresetId,
  onSelectPreset,
  onOpenWhatIf,
  onOpenFairAi,
  onToggleCopilot,
  isCopilotOpen,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080d1a]/95 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                UnderwriteAI
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                ENTERPRISE v4.8
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Autonomous Multi-Line Actuarial Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Single line, quiet underline on active) */}
        <nav className="flex items-center gap-1 sm:gap-5 overflow-x-auto py-1">
          <button
            onClick={() => onTabChange('intake')}
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap py-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'intake'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Workbench</span>
          </button>

          <button
            onClick={() => onTabChange('certificate-scanner')}
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap py-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'certificate-scanner'
                ? 'border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scan className="w-4 h-4 text-cyan-400" />
            <span>Cert Scanner (அசல்/நகல்)</span>
          </button>

          <button
            onClick={() => onTabChange('fraud-forensics')}
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap py-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'fraud-forensics'
                ? 'border-rose-500 text-rose-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Fraud Forensics</span>
            <span className="font-mono text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.2 rounded hidden xl:inline">
              99% Block
            </span>
          </button>

          <button
            onClick={() => onTabChange('whatsapp')}
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap py-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'border-emerald-500 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Intake</span>
          </button>

          <button
            onClick={() => onTabChange('bundling')}
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap py-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'bundling'
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4 text-amber-400" />
            <span>Cross-Line Bundling</span>
          </button>

          <button
            onClick={() => onTabChange('queue')}
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap py-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'queue'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Review Queue</span>
            {pendingQueueCount > 0 && (
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {pendingQueueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('compliance')}
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap py-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'compliance'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Fair AI</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 hidden xl:inline">
              98.6%
            </span>
          </button>

          <button
            onClick={() => onTabChange('architecture')}
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap py-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-4 h-4" />
            <span className="hidden lg:inline">Architecture</span>
          </button>

          <button
            onClick={() => onTabChange('portfolio')}
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap py-5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'portfolio'
                ? 'border-indigo-500 text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Portfolio</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Persona Selector */}
          <div className="hidden 2xl:flex items-center gap-2 bg-[#0b1120] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Persona:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer max-w-[140px] truncate"
            >
              {SAMPLE_PRESETS.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive What-If Simulator Trigger */}
          <button
            onClick={onOpenWhatIf}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-all whitespace-nowrap shadow-sm cursor-pointer"
            title="Open Interactive What-If Premium Simulator"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">What-If Simulator</span>
          </button>

          {/* Fair AI Audit Meter Button */}
          <button
            onClick={onOpenFairAi}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-all whitespace-nowrap shadow-sm cursor-pointer"
            title="Open Real-time Fair AI & Bias Audit Meter"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Fair AI Audit</span>
          </button>

          {/* AI Copilot Side Drawer Toggle */}
          <button
            onClick={onToggleCopilot}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap shadow-sm cursor-pointer ${
              isCopilotOpen
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30'
                : 'bg-[#0b1120] text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle AI Underwriter Copilot"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          {/* Reset Demo */}
          <button
            onClick={onResetDemo}
            className="p-2 text-slate-400 hover:text-white bg-[#0b1120] hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Reset demo parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
