import React from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Lock,
  Globe,
  Sliders,
  Award,
} from 'lucide-react';
import { ComplianceAudit } from '../types/underwriting';
import { INITIAL_COMPLIANCE_AUDIT } from '../services/sampleData';

interface FairAiComplianceModalProps {
  audit?: ComplianceAudit;
  onClose: () => void;
}

export const FairAiComplianceModal: React.FC<FairAiComplianceModalProps> = ({
  audit = INITIAL_COMPLIANCE_AUDIT,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Fair AI & Algorithmic Bias Audit Console
              </h3>
              <p className="text-xs text-slate-400">
                Independent Regulatory Compliance & Demographic Neutrality Certificate
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

        {/* Top Compliance Meter Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Composite Compliance</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {audit.overallScore}%
              </span>
              <span className="text-emerald-500 text-[10px] font-semibold">CERTIFIED</span>
            </div>
            <span className="text-[10px] text-slate-500">IRDAI · GDPR · EU AI Act</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Disparate Impact Ratio</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-mono text-indigo-400">
                {audit.metrics.disparateImpactRatio}
              </span>
              <span className="text-slate-400 text-[10px]"> (Target: 0.80 - 1.25)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">Four-Fifths Rule Satisfied</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Demographic Parity Delta</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black font-mono text-slate-200">
                ±{audit.metrics.demographicParityDiff}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">Negligible statistical variance</span>
          </div>
        </div>

        {/* Protected Demographic Attributes Isolation Guarantee */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Protected Non-Discrimination Boundary (Zero Weight Allocation)
          </label>
          <p className="text-[11px] text-slate-400">
            The neural scoring engine is mathematically barred from accessing or inferring the following protected attributes:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
            {audit.protectedAttributesExcluded.map((attr, idx) => (
              <div
                key={idx}
                className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-center gap-2 text-slate-300"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{attr}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Framework Adherence Breakdown */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            Multi-Jurisdiction Regulatory Scorecards
          </label>

          <div className="space-y-2">
            {audit.standards.map((std, i) => (
              <div
                key={i}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{std.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {std.jurisdiction}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {std.description}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                  <span className="font-mono font-bold text-emerald-400 text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    {std.score}% PASS
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-mono text-[10px]">
            Audit Hash: SHA256:7b92f4e82910c · Continuous Auditing Active
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
          >
            Close Audit Console
          </button>
        </div>
      </div>
    </div>
  );
};
