import React, { useState } from 'react';
import {
  Layers,
  Heart,
  Car,
  Home,
  Shield,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Download,
  Percent,
  SlidersHorizontal,
  FileCheck2,
  PieChart,
  Users,
  Award,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InsuranceLine, MultiLineBundleConfig, MultiLineBundleQuote } from '../types/underwriting';

interface CrossLineBundlingViewProps {
  onLoadIntoWorkbench?: (applicantData: any) => void;
  onOpenCertificateModal?: (bundleQuote: MultiLineBundleQuote) => void;
}

export const CrossLineBundlingView: React.FC<CrossLineBundlingViewProps> = ({
  onLoadIntoWorkbench,
}) => {
  // Config state for the 4 lines
  const [config, setConfig] = useState<MultiLineBundleConfig>({
    health: true,
    motor: true,
    home: true,
    life: false,
    coverageLevels: {
      health: 500000,
      motor: 65000,
      home: 450000,
      life: 750000,
    },
  });

  const [customerName, setCustomerName] = useState('Priya Sharma');
  const [customerAge, setCustomerAge] = useState(34);
  const [customerCredit, setCustomerCredit] = useState(740);
  const [activePreset, setActivePreset] = useState<'family' | 'executive' | 'urban'>('family');
  const [isGenerated, setIsGenerated] = useState(false);

  // Standalone Base Rates
  const baseHealthPremium = Math.round(
    (config.coverageLevels.health / 1000) * 1.8 * (customerAge > 40 ? 1.4 : 1.0)
  );
  const baseMotorPremium = Math.round((config.coverageLevels.motor / 1000) * 18.5);
  const baseHomePremium = Math.round((config.coverageLevels.home / 1000) * 1.6);
  const baseLifePremium = Math.round(
    (config.coverageLevels.life / 1000) * 1.2 * (customerAge > 40 ? 1.5 : 1.0)
  );

  // Standalone sum
  let standaloneSum = 0;
  const selectedLines: InsuranceLine[] = [];
  if (config.health) {
    standaloneSum += baseHealthPremium;
    selectedLines.push('health');
  }
  if (config.motor) {
    standaloneSum += baseMotorPremium;
    selectedLines.push('motor');
  }
  if (config.home) {
    standaloneSum += baseHomePremium;
    selectedLines.push('home');
  }
  if (config.life) {
    standaloneSum += baseLifePremium;
    selectedLines.push('life');
  }

  const lineCount = selectedLines.length;

  // Actuarial Multi-Policy Discount Matrix
  const discountRate =
    lineCount === 4 ? 0.28 : lineCount === 3 ? 0.20 : lineCount === 2 ? 0.12 : 0.0;

  const totalAnnualSavings = Math.round(standaloneSum * discountRate);
  const bundledPremium = standaloneSum - totalAnnualSavings;
  const monthlyBundled = Math.round(bundledPremium / 12);

  // Covariance risk reduction (diversification benefits)
  const baseCompositeRisk = 48;
  const diversificationPts =
    lineCount === 4 ? 16.4 : lineCount === 3 ? 12.2 : lineCount === 2 ? 7.5 : 0;
  const bundleRiskScore = Math.max(12, Math.round(baseCompositeRisk - diversificationPts));

  // Insurer LTV & Retention projections
  const retentionProb =
    lineCount === 4 ? 91 : lineCount === 3 ? 84 : lineCount === 2 ? 72 : 55;
  const projectedLtv = Math.round(bundledPremium * (lineCount >= 3 ? 6.8 : 4.2));

  const handleApplyPreset = (type: 'family' | 'executive' | 'urban') => {
    setActivePreset(type);
    if (type === 'family') {
      setConfig({
        health: true,
        motor: true,
        home: true,
        life: false,
        coverageLevels: { health: 500000, motor: 60000, home: 400000, life: 500000 },
      });
      setCustomerName('Priya Sharma');
      setCustomerAge(34);
    } else if (type === 'executive') {
      setConfig({
        health: true,
        motor: true,
        home: true,
        life: true,
        coverageLevels: { health: 1000000, motor: 120000, home: 900000, life: 1500000 },
      });
      setCustomerName('Vikramaditya Mehta');
      setCustomerAge(42);
    } else {
      setConfig({
        health: true,
        motor: true,
        home: false,
        life: false,
        coverageLevels: { health: 300000, motor: 45000, home: 250000, life: 500000 },
      });
      setCustomerName('Ananya Iyer');
      setCustomerAge(27);
    }
  };

  const handleIssueMasterPolicy = () => {
    setIsGenerated(true);
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#38bdf8', '#fbbf24'],
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-[#101935] to-[#071329] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-indigo-400">
                Multi-Line Actuarial Architecture
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                Health + Motor + Home + Life Bundling
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Cross-Line Portfolio Risk Bundling & Multi-Policy Discount Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              When a policyholder bundles multiple lines (Health + Motor + Home), actuarial covariance decreases systemic loss ratios. Calculate diversified cross-policy risk scores, offer up to 28% bundle savings, and boost insurer customer lifetime value (LTV).
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Bundle Presets:</span>
            <button
              onClick={() => handleApplyPreset('family')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activePreset === 'family'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Triple Shield (Health+Motor+Home)
            </button>
            <button
              onClick={() => handleApplyPreset('executive')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activePreset === 'executive'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              4-Line Executive Master
            </button>
            <button
              onClick={() => handleApplyPreset('urban')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                activePreset === 'urban'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Dual Starter (Health+Motor)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: 7 Cols Left Interactive Line Config, 5 Cols Right Real-time Bundle Actuarial Pricing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Multi-Line Selection & Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Select Participating Insurance Lines for {customerName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Toggle coverages to dynamically simulate cross-line actuarial covariance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-emerald-400 font-bold">
                  {lineCount} Lines Active ({Math.round(discountRate * 100)}% Bundle Discount)
                </span>
              </div>
            </div>

            {/* Line 1: Health Shield */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                config.health
                  ? 'bg-[#081224] border-indigo-500/50 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">1. Comprehensive Health Shield</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        Inpatient + OPD
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Cashless hospitalization, annual preventive wellness & biometric health sync
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">
                      ${baseHealthPremium}/yr
                    </span>
                    <span className="text-[10px] text-slate-500 block">standalone</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.health}
                    onChange={(e) => setConfig({ ...config, health: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {config.health && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Coverage Sum Insured:</span>
                    <span className="font-mono font-bold text-indigo-400">
                      ${config.coverageLevels.health.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="1500000"
                    step="50000"
                    value={config.coverageLevels.health}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        coverageLevels: {
                          ...config.coverageLevels,
                          health: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Line 2: Motor Shield */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                config.motor
                  ? 'bg-[#081224] border-cyan-500/50 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">2. Private Motor & EV Shield</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        Zero Dep + Roadside
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Telematics-backed driver rating, battery warranty & 24/7 accident towing
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">
                      ${baseMotorPremium}/yr
                    </span>
                    <span className="text-[10px] text-slate-500 block">standalone</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.motor}
                    onChange={(e) => setConfig({ ...config, motor: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {config.motor && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Vehicle Insured Declared Value (IDV):</span>
                    <span className="font-mono font-bold text-cyan-400">
                      ${config.coverageLevels.motor.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="200000"
                    step="5000"
                    value={config.coverageLevels.motor}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        coverageLevels: {
                          ...config.coverageLevels,
                          motor: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Line 3: Home & Property Shield */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                config.home
                  ? 'bg-[#081224] border-emerald-500/50 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">3. Home Property & Structure</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Fire, Flood & Contents
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      IoT flood sensors, structural earthquake coverage & smart home discount
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">
                      ${baseHomePremium}/yr
                    </span>
                    <span className="text-[10px] text-slate-500 block">standalone</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.home}
                    onChange={(e) => setConfig({ ...config, home: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {config.home && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Structure & Contents Value:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      ${config.coverageLevels.home.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="1500000"
                    step="50000"
                    value={config.coverageLevels.home}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        coverageLevels: {
                          ...config.coverageLevels,
                          home: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Line 4: Term Life & Critical Disability */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                config.life
                  ? 'bg-[#081224] border-amber-500/50 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">4. Term Life & Accidental Disability</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Pure Term Protection
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Family financial continuity, terminal illness rider & zero tobacco benefit
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">
                      ${baseLifePremium}/yr
                    </span>
                    <span className="text-[10px] text-slate-500 block">standalone</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.life}
                    onChange={(e) => setConfig({ ...config, life: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-700 text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {config.life && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Life Sum Assured:</span>
                    <span className="font-mono font-bold text-amber-400">
                      ${config.coverageLevels.life.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="250000"
                    max="2000000"
                    step="50000"
                    value={config.coverageLevels.life}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        coverageLevels: {
                          ...config.coverageLevels,
                          life: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Bundle Actuarial Pricing & Covariance Output (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Multi-Policy Actuarial Pricing Quote
                </h3>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                {Math.round(discountRate * 100)}% BUNDLE DISCOUNT
              </span>
            </div>

            {/* Pricing Delta Comparison */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Sum of Standalone Policies:</span>
                <span className="font-mono line-through text-slate-500 text-sm">
                  ${standaloneSum.toLocaleString()}/yr
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
                    Bundled Annual Premium:
                  </span>
                  <div className="text-3xl font-black font-mono text-white mt-0.5">
                    ${bundledPremium.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400">/yr</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 block">
                    Save ${totalAnnualSavings.toLocaleString()} / year
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    (${monthlyBundled}/month)
                  </span>
                </div>
              </div>
            </div>

            {/* Covariance & Risk Diversification Meter */}
            <div className="p-4 bg-[#080d1a] border border-slate-800/80 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  Actuarial Covariance Diversification:
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  -{diversificationPts.toFixed(1)} pts
                </span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (diversificationPts / 20) * 100)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Combined Bundle Risk:</span>
                  <span className="font-mono font-bold text-white">{bundleRiskScore}/100 (Low Risk)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">5-Yr Retention Jump:</span>
                  <span className="font-mono font-bold text-indigo-400">{retentionProb}% (+36% lift)</span>
                </div>
              </div>
            </div>

            {/* Why Bundling Reduces Loss Ratio (Actuarial Justification) */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                Actuarial Covariance Synergy Insights:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-400">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Home + Auto Synergy:</strong> Garaged vehicle at insured home location experiences 41% fewer night-time vandalism claims.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Health + Life Synergy:</strong> Annual biometric health screenings correlate with 29% lower mortality and critical illness incidence.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Moral Hazard Mitigation:</strong> Multi-policy accounts display a 99.2% lower frequency of fraudulent claims compared to single-line contracts.
                  </span>
                </li>
              </ul>
            </div>

            {/* Master Policy Issued Confirmation */}
            {isGenerated ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-xl space-y-2 text-emerald-200">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-300">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>MULTI-POLICY MASTER BINDER GENERATED (#MPB-2026-9812)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Master Multi-Line Contract ready for {customerName}. All {lineCount} policy certificates combined into single billing account with {Math.round(discountRate * 100)}% cross-sell discount applied.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onLoadIntoWorkbench) {
                        onLoadIntoWorkbench({
                          name: `${customerName} (Bundle Package)`,
                          age: customerAge,
                          coverage: config.coverageLevels.health,
                          creditScore: customerCredit,
                          line: 'health',
                        });
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Inspect in Workbench →</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleIssueMasterPolicy}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Issue Multi-Line Master Policy ({Math.round(discountRate * 100)}% Discount)</span>
              </button>
            )}

            {/* Projected Lifetime Value Lift */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Projected Insurer 5-Yr LTV:</span>
              <span className="font-mono font-bold text-white text-sm">
                ${projectedLtv.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
