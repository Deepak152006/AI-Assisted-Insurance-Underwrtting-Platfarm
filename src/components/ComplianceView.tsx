import React from 'react';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Globe,
  FileCheck2,
  Layers,
  Award,
} from 'lucide-react';
import { ComplianceAudit } from '../types/underwriting';
import { INITIAL_COMPLIANCE_AUDIT } from '../services/sampleData';

interface ComplianceViewProps {
  audit?: ComplianceAudit;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  audit = INITIAL_COMPLIANCE_AUDIT,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Fair AI & Algorithmic Governance Console
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Multi-Jurisdiction Non-Discrimination Audit & Model Explainability Verification
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              IRDAI · EU AI ACT · GDPR PASS
            </span>
          </div>
        </div>

        {/* 4 Compliance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="bg-[#080d1a] border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs block font-medium">Composite Compliance Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-emerald-400">
                {audit.overallScore}%
              </span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase font-mono">
                Certified
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Full algorithmic audit passed</p>
          </div>

          <div className="bg-[#080d1a] border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs block font-medium">Disparate Impact Ratio</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-indigo-400">
                {audit.metrics.disparateImpactRatio}
              </span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">
              Satisfies 80% four-fifths rule (0.80 - 1.25)
            </p>
          </div>

          <div className="bg-[#080d1a] border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs block font-medium">Demographic Parity Variance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-white">
                ±{audit.metrics.demographicParityDiff}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Negligible demographic deviation</p>
          </div>

          <div className="bg-[#080d1a] border border-slate-800 rounded-xl p-4">
            <span className="text-slate-400 text-xs block font-medium">SHAP Explainability Index</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-mono text-emerald-400">
                {audit.metrics.transparencyScore}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Every inference is 100% decomposed</p>
          </div>
        </div>

        {/* Protected Demographic Attributes Isolation Box */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                Protected Attributes Zero-Weight Isolation
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                The neural scoring pipeline strictly excises these protected demographic variables from model ingestion:
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              ZERO BIAS VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            {audit.protectedAttributesExcluded.map((attr, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#080d1a] rounded-xl border border-slate-800/80 flex flex-col gap-1 text-slate-200"
              >
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase">Excluded</span>
                </div>
                <span className="font-semibold text-xs mt-1 truncate">{attr}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Framework Scorecards */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-400" />
            Active Regulatory Framework Scorecards
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audit.standards.map((std, i) => (
              <div
                key={i}
                className="p-4 bg-[#080d1a] rounded-xl border border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-white">{std.name}</span>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 shrink-0">
                      {std.score}% PASS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase mt-0.5 block">
                    Jurisdiction: {std.jurisdiction}
                  </span>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {std.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Status: Fully Compliant</span>
                  <span>Audit Cycle: Continuous</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
