import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { PortfolioKPIs } from '../types/underwriting';

interface PortfolioAnalyticsProps {
  kpis: PortfolioKPIs;
}

export const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({ kpis }) => {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  // Calculate highest monthly volume for SVG scaling
  const maxVolume = Math.max(
    ...kpis.monthlyVolumes.map((v) => v.stp + v.manual + v.fraud)
  );

  return (
    <div className="space-y-6">
      {/* 4 KPI Metric Strips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur">
          <div className="text-xs text-slate-400 font-medium">Total Processed YTD</div>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {kpis.totalProcessedYTD.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1.5 flex items-center gap-1 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% from prior period</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur">
          <div className="text-xs text-slate-400 font-medium">
            Straight-Through Processing (STP)
          </div>
          <div className="text-2xl font-black font-mono text-indigo-400 mt-1">
            {kpis.stpRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            Average autonomous runtime: <span className="text-indigo-300 font-mono">1.2s</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur">
          <div className="text-xs text-slate-400 font-medium">
            Fraud & Tamper Intercept Rate
          </div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {kpis.fraudDetectionRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1.5">
            <span className="text-amber-300 font-mono">72</span> altered PDFs quarantined
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-xl backdrop-blur">
          <div className="text-xs text-slate-400 font-medium">Portfolio Loss Ratio</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {kpis.portfolioLossRatio}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1.5">
            -4.1% below industry target margin
          </div>
        </div>
      </div>

      {/* 2 Interactive SVG Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Monthly Volume Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  Monthly STP vs Manual Review Volume
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparison of auto-adjudicated policies vs escalated underwriter cases
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                  STP Auto
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                  Manual Review
                </span>
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="h-64 w-full pt-4">
              <svg className="w-full h-full" viewBox="0 0 600 220" preserveAspectRatio="none">
                {/* Grid horizontal lines */}
                <line x1="40" y1="20" x2="580" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="75" x2="580" y2="75" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="130" x2="580" y2="130" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="40" y1="185" x2="580" y2="185" stroke="#334155" />

                {/* Y-Axis Labels */}
                <text x="32" y="24" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
                  3,000
                </text>
                <text x="32" y="79" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
                  2,000
                </text>
                <text x="32" y="134" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
                  1,000
                </text>
                <text x="32" y="189" fill="#64748b" fontSize="10" textAnchor="end" fontFamily="JetBrains Mono">
                  0
                </text>

                {/* Bars for each month */}
                {kpis.monthlyVolumes.map((item, index) => {
                  const x = 70 + index * 85;
                  const totalHeight = 165;
                  const stpHeight = (item.stp / 3000) * totalHeight;
                  const manualHeight = (item.manual / 3000) * totalHeight;

                  const yStp = 185 - stpHeight;
                  const yManual = yStp - manualHeight;

                  return (
                    <g
                      key={item.month}
                      onMouseEnter={() => setHoveredMonth(item.month)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      className="cursor-pointer transition-opacity"
                      opacity={hoveredMonth && hoveredMonth !== item.month ? 0.45 : 1}
                    >
                      {/* STP Bar */}
                      <rect
                        x={x}
                        y={yStp}
                        width="42"
                        height={stpHeight}
                        rx="4"
                        fill="#6366f1"
                        className="transition-all hover:brightness-110"
                      />

                      {/* Manual Review Bar Stack */}
                      <rect
                        x={x}
                        y={yManual}
                        width="42"
                        height={manualHeight}
                        rx="4"
                        fill="#f43f5e"
                        className="transition-all hover:brightness-110"
                      />

                      {/* X-axis label */}
                      <text
                        x={x + 21}
                        y="205"
                        fill="#94a3b8"
                        fontSize="11"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {item.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>YTD Auto-STP Ratio: <strong className="text-indigo-400 font-mono">76.4%</strong></span>
            <span>Manual Audit Escalation: <strong className="text-rose-400 font-mono">23.6%</strong></span>
          </div>
        </div>

        {/* Right Chart: Risk Tier Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" />
                  Portfolio Risk Tier Distribution
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Breakdown across automated, conditional, and manual pools
                </p>
              </div>
            </div>

            {/* SVG Donut */}
            <div className="flex items-center justify-center py-4">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#0f172a"
                    strokeWidth="14"
                  />
                  {/* Segment 1: Low Risk (65%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeDasharray="155.2 238.8"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Medium Risk (22%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="14"
                    strokeDasharray="52.5 238.8"
                    strokeDashoffset="-155.2"
                  />
                  {/* Segment 3: High Risk (13%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f43f5e"
                    strokeWidth="14"
                    strokeDasharray="31.1 238.8"
                    strokeDashoffset="-207.7"
                  />
                </svg>

                {/* Center text in donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold font-mono text-white">
                    {kpis.riskDistribution.low}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    Low Risk (STP)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Tier 1: Preferred / Low Risk
              </span>
              <span className="font-mono font-bold text-white">65%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Tier 2: Conditional Premium Loaded
              </span>
              <span className="font-mono font-bold text-white">22%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Tier 3 & 4: Manual Actuary Review
              </span>
              <span className="font-mono font-bold text-white">13%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Line Performance Table */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur">
        <h3 className="text-sm font-bold text-white tracking-tight mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          Underwriting Performance by Product Line
        </h3>

        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800/80">
              <tr>
                <th className="py-3 px-4 font-semibold">Insurance Line</th>
                <th className="py-3 px-4 font-semibold">In-Force Policies</th>
                <th className="py-3 px-4 font-semibold">Actuarial Loss Ratio</th>
                <th className="py-3 px-4 font-semibold">Average Annual Premium</th>
                <th className="py-3 px-4 font-semibold">Volume Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/30">
              {kpis.linePerformance.map((lp) => (
                <tr key={lp.line} className="hover:bg-slate-950/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {lp.label}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {lp.activePolicies.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`font-mono font-bold ${
                        lp.lossRatio < 55
                          ? 'text-emerald-400'
                          : lp.lossRatio < 65
                          ? 'text-slate-200'
                          : 'text-amber-400'
                      }`}
                    >
                      {lp.lossRatio}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-indigo-300">
                    ${lp.avgPremium.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-medium">
                    {lp.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
