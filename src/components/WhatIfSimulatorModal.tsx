import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  DollarSign,
  Heart,
  Car,
  Home,
  Check,
} from 'lucide-react';
import { ApplicantData, EvaluationResult } from '../types/underwriting';
import { evaluateApplicant } from '../services/underwritingEngine';

interface WhatIfSimulatorModalProps {
  currentApplicant: ApplicantData;
  currentEvaluation: EvaluationResult | null;
  onClose: () => void;
  onApplySimulated: (updatedApplicant: ApplicantData) => void;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  currentApplicant,
  currentEvaluation,
  onClose,
  onApplySimulated,
}) => {
  // Local simulated sandbox state
  const [simulatedData, setSimulatedData] = useState<ApplicantData>({
    ...currentApplicant,
    // Ensure standard numbers
    bmi: currentApplicant.bmi ?? 24.2,
    smoker: currentApplicant.smoker ?? 'no',
    coverage: currentApplicant.coverage ?? 250000,
    creditScore: currentApplicant.creditScore ?? 740,
    telematicsScore: currentApplicant.telematicsScore ?? 85,
    previousClaims: currentApplicant.previousClaims ?? 0,
    floodRisk: currentApplicant.floodRisk ?? 'low',
    securitySystem: currentApplicant.securitySystem ?? 'advanced',
  });

  // Evaluate baseline if currentEvaluation is null
  const baseEval = currentEvaluation || evaluateApplicant(currentApplicant);
  const simEval = evaluateApplicant(simulatedData);

  const riskDelta = simEval.compositeRiskScore - baseEval.compositeRiskScore;
  const premiumDelta = simEval.recommendedPremium - baseEval.recommendedPremium;
  const isSaving = premiumDelta < 0;

  const handleApply = () => {
    onApplySimulated(simulatedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Interactive "What-If" Underwriting & Premium Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Adjust underwriting levers in real-time to observe dynamic risk and pricing deltas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Delta Comparative Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Composite Risk Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-white">
                {simEval.compositeRiskScore}
              </span>
              <span
                className={`font-mono text-xs font-bold ${
                  riskDelta < 0 ? 'text-emerald-400' : riskDelta > 0 ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                {riskDelta < 0 ? `${riskDelta}` : riskDelta > 0 ? `+${riskDelta}` : '0'} pts
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Baseline: {baseEval.compositeRiskScore}/100</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Simulated Premium ($/yr)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black font-mono text-indigo-400">
                ${simEval.recommendedPremium.toLocaleString()}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono font-semibold ${
                isSaving ? 'text-emerald-400' : premiumDelta > 0 ? 'text-rose-400' : 'text-slate-400'
              }`}
            >
              {isSaving
                ? `Save $${Math.abs(premiumDelta).toLocaleString()} / year`
                : premiumDelta > 0
                ? `+$${premiumDelta.toLocaleString()} surcharge`
                : 'Identical'}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 block text-[11px]">Adjudication Tier</span>
            <div className="text-xs font-bold text-white mt-1.5 truncate">
              {simEval.decision === 'straight_through' ? (
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Auto STP Approved
                </span>
              ) : simEval.decision === 'conditional_loading' ? (
                <span className="text-amber-400 font-semibold">Conditional (+{simEval.loadingPercentage}%)</span>
              ) : (
                <span className="text-rose-400 font-semibold">Human Review Required</span>
              )}
            </div>
            <span className="text-[10px] text-slate-500">Tier: {simEval.riskTier.split(' ')[0]}</span>
          </div>
        </div>

        {/* Interactive Sliders & Levers */}
        <div className="space-y-4 text-xs">
          {/* Lever 1: Coverage Amount */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-300">Requested Coverage Limit</span>
              <span className="font-mono text-indigo-400 font-bold">
                ${simulatedData.coverage.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="25000"
              value={simulatedData.coverage}
              onChange={(e) =>
                setSimulatedData({ ...simulatedData, coverage: parseInt(e.target.value) })
              }
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>$50k</span>
              <span>$500k</span>
              <span>$1.0M (Jumbo threshold)</span>
              <span>$2.0M</span>
            </div>
          </div>

          {/* Lever 2: Tobacco Smoker Switch */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-300 block">Tobacco / Nicotine Usage</span>
              <span className="text-[11px] text-slate-400">
                Quitting smoking eliminates oncology surcharge and drops risk by ~26 points
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSimulatedData({ ...simulatedData, smoker: 'no' })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  simulatedData.smoker === 'no'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Non-Smoker
              </button>
              <button
                type="button"
                onClick={() => setSimulatedData({ ...simulatedData, smoker: 'yes' })}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  simulatedData.smoker === 'yes'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Smoker Active
              </button>
            </div>
          </div>

          {/* Lever 3: Health BMI Slider (if health) or Motor Telematics */}
          {simulatedData.line === 'health' && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-300">Body Mass Index (BMI)</span>
                <span className="font-mono text-indigo-400 font-bold">
                  {simulatedData.bmi} ({simulatedData.bmi! > 30 ? 'Obese' : simulatedData.bmi! > 25 ? 'Overweight' : 'Normal'})
                </span>
              </div>
              <input
                type="range"
                min="18.5"
                max="40"
                step="0.5"
                value={simulatedData.bmi}
                onChange={(e) =>
                  setSimulatedData({ ...simulatedData, bmi: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>18.5 (Normal)</span>
                <span>25.0</span>
                <span>30.0 (High Risk)</span>
                <span>40.0</span>
              </div>
            </div>
          )}

          {simulatedData.line === 'motor' && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-300">Telematics Driving Safety Score</span>
                <span className="font-mono text-indigo-400 font-bold">
                  {simulatedData.telematicsScore} / 100
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="98"
                step="1"
                value={simulatedData.telematicsScore}
                onChange={(e) =>
                  setSimulatedData({ ...simulatedData, telematicsScore: parseInt(e.target.value) })
                }
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>40 (Aggressive)</span>
                <span>70 (Average)</span>
                <span>85+ (Safe Driver Discount)</span>
              </div>
            </div>
          )}

          {simulatedData.line === 'home' && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-300 block">Smart Leak Sensor & Central Alarm</span>
                <span className="text-[11px] text-slate-400">
                  Installing IoT shutoff valves reduces flood/burst severity by 82% (-14 risk pts)
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSimulatedData({ ...simulatedData, securitySystem: 'advanced' })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    simulatedData.securitySystem === 'advanced'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Installed
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatedData({ ...simulatedData, securitySystem: 'none' })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    simulatedData.securitySystem === 'none'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  None
                </button>
              </div>
            </div>
          )}

          {/* Lever: Credit Score */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-300">Credit Bureau Score</span>
              <span className="font-mono text-indigo-400 font-bold">
                {simulatedData.creditScore} ({simulatedData.creditScore >= 750 ? 'Prime (-12 pts)' : 'Standard'})
              </span>
            </div>
            <input
              type="range"
              min="550"
              max="820"
              step="10"
              value={simulatedData.creditScore}
              onChange={(e) =>
                setSimulatedData({ ...simulatedData, creditScore: parseInt(e.target.value) })
              }
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>550 (Subprime)</span>
              <span>680</span>
              <span>750+ (Prime Discount)</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-indigo-600/20"
          >
            <Check className="w-4 h-4" />
            <span>Apply Simulated Profile to Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};
