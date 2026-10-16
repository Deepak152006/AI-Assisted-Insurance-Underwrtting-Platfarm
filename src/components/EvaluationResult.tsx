import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  Download,
  FileText,
  Lock,
  ArrowRight,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Scale,
  Bot,
  SlidersHorizontal,
  Layers,
  Sparkles,
} from 'lucide-react';
import { EvaluationResult as IEvaluationResult, DocumentScan } from '../types/underwriting';
import { FraudForensicsBadge } from './FraudForensicsBadge';

interface EvaluationResultProps {
  result: IEvaluationResult | null;
  onOpenCertificate: (result: IEvaluationResult) => void;
  onOpenDocumentModal: (doc: DocumentScan) => void;
  onNavigateToQueue: () => void;
  onOpenWhatIfSimulator: () => void;
  onOpenFairAiAudit: () => void;
}

export const EvaluationResult: React.FC<EvaluationResultProps> = ({
  result,
  onOpenCertificate,
  onOpenDocumentModal,
  onNavigateToQueue,
  onOpenWhatIfSimulator,
  onOpenFairAiAudit,
}) => {
  const [deductibleMultiplier, setDeductibleMultiplier] = useState<number>(1);

  if (!result) {
    return (
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-8 shadow-2xl min-h-[560px] flex flex-col justify-center items-center text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl mx-auto flex items-center justify-center border border-indigo-500/20 shadow-inner">
            <FileText className="w-8 h-8 opacity-80" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">
              Actuarial Decision Console Idle
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Select an insurance product line, configure risk vectors on the left, and execute the autonomous underwriting engine.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 border-t border-slate-800/80">
            <button
              onClick={onOpenWhatIfSimulator}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Launch "What-If" Sandbox</span>
            </button>

            <button
              onClick={onOpenFairAiAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:text-white transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fair AI Compliance (98.6%)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    applicant,
    compositeRiskScore,
    riskTier,
    decision,
    decisionLabel,
    basePremium,
    recommendedPremium,
    shapAttributions,
    evaluatedAt,
    underwritingConfidence,
    complianceAudit,
  } = result;

  const activePremium = Math.round(
    recommendedPremium *
      (deductibleMultiplier === 1 ? 1 : deductibleMultiplier === 0.85 ? 0.9 : 1.15)
  );
  const activeMonthly = Math.round(activePremium / 12);

  const getDecisionBadge = () => {
    switch (decision) {
      case 'straight_through':
        return {
          bg: 'bg-emerald-500/15',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
        };
      case 'conditional_loading':
        return {
          bg: 'bg-amber-500/15',
          text: 'text-amber-400',
          border: 'border-amber-500/30',
          icon: <Sliders className="w-4 h-4 text-amber-400" />,
        };
      default:
        return {
          bg: 'bg-rose-500/15',
          text: 'text-rose-400',
          border: 'border-rose-500/30',
          icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
        };
    }
  };

  const badge = getDecisionBadge();

  // Find primary document or tampered doc in batch
  const docBatch = applicant.documents || [applicant.document];
  const primaryDoc =
    docBatch.find((d) => d.tamperProofVerification === 'FAILED') || docBatch[0];

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `UnderwriteAI_Dossier_${applicant.name.replace(/\s+/g, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Find max impact score for relative bar charts
  const maxImpact = Math.max(...shapAttributions.map((s) => Math.abs(s.impactScore)), 1);

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Top Decision Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-extrabold text-xl text-white tracking-tight">
              {applicant.name}
            </h3>
            <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
              {applicant.line} LINE
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span>Age: {applicant.age}</span>
            <span aria-hidden="true">·</span>
            <span>Coverage: ${applicant.coverage.toLocaleString()}</span>
            <span aria-hidden="true">·</span>
            <span>Evaluated: {evaluatedAt.substring(11)}</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold ${badge.bg} ${badge.text} ${badge.border}`}
        >
          {badge.icon}
          <span>{decisionLabel}</span>
        </div>
      </div>

      {/* KPI Cards: Composite Risk Score & Premium Quotation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Risk Score */}
        <div className="bg-[#080d1a] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-300">Composite Risk Score</span>
              <span className="font-mono text-slate-500">Scale: 0 - 100</span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-5xl font-black font-mono tracking-tight ${
                  compositeRiskScore > 65
                    ? 'text-rose-400'
                    : compositeRiskScore > 35
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {compositeRiskScore}
              </span>
              <span className="text-sm text-slate-500 font-medium font-mono">/ 100</span>
            </div>

            <div className="text-xs font-semibold text-slate-200 mt-1">
              {riskTier}
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-4">
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  compositeRiskScore > 65
                    ? 'bg-rose-500'
                    : compositeRiskScore > 35
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${compositeRiskScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
              <span>0 (Preferred)</span>
              <span>35 (Standard)</span>
              <span>68 (Manual Queue)</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* Premium Quotation */}
        <div className="bg-[#080d1a] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-300">Actuarial Annual Premium</span>
              <span className="text-indigo-400 font-mono text-[11px]">
                Base: ${basePremium.toLocaleString()}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-5xl font-black font-mono text-indigo-400 tracking-tight">
                ${activePremium.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (${activeMonthly.toLocaleString()}/mo)
              </span>
            </div>

            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>
                Rate Loading:{' '}
                <strong
                  className={
                    result.loadingPercentage > 0
                      ? 'text-amber-400 font-mono'
                      : 'text-emerald-400 font-mono'
                  }
                >
                  {result.loadingPercentage > 0
                    ? `+${result.loadingPercentage}%`
                    : 'Standard Flat'}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Deductible:{' '}
                <strong className="text-slate-200 font-mono">
                  ${result.deductible.toLocaleString()}
                </strong>
              </span>
            </div>
          </div>

          {/* Deductible Tier Adjuster */}
          <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Deductible Tier:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setDeductibleMultiplier(1.15)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  deductibleMultiplier === 1.15
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                $500
              </button>
              <button
                type="button"
                onClick={() => setDeductibleMultiplier(1)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  deductibleMultiplier === 1
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ${result.deductible}
              </button>
              <button
                type="button"
                onClick={() => setDeductibleMultiplier(0.85)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  deductibleMultiplier === 0.85
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                $5,000
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 4: Interactive What-If Simulator Quick Banner */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-950/60 rounded-xl border border-indigo-500/30 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">
              Interactive "What-If" Sensitivity Simulator
            </div>
            <p className="text-[11px] text-slate-400">
              Simulate changing Smoker status, Coverage limits, or Telematics scores to observe real-time premium drops.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenWhatIfSimulator}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm cursor-pointer"
        >
          Launch Simulator
        </button>
      </div>

      {/* Feature 3: Fair AI & Bias Auditing Meter Banner */}
      <div
        onClick={onOpenFairAiAudit}
        className="p-3.5 bg-[#080d1a] rounded-xl border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              <span>Fair AI & Non-Discrimination Audit</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                {complianceAudit.overallScore}% COMPLIANT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              IRDAI & GDPR Verified · Disparate Impact Ratio: <strong className="text-emerald-400 font-mono">{complianceAudit.metrics.disparateImpactRatio}</strong> (Protected attributes isolated)
            </p>
          </div>
        </div>

        <span className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 whitespace-nowrap">
          View Audit Details →
        </span>
      </div>

      {/* SHAP Feature Attribution Breakdown with Visual Bars */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Explainable AI (SHAP Actuarial Attribution)
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Model Confidence: {underwritingConfidence}%
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {shapAttributions.map((item, idx) => {
            const barWidth = Math.min(100, (Math.abs(item.impactScore) / maxImpact) * 100);

            return (
              <div
                key={idx}
                className="bg-[#080d1a] border border-slate-800 rounded-xl p-3 space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span>{item.factor}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {item.rationale}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center self-start sm:self-center">
                    <span
                      className={`font-mono font-bold text-xs px-2.5 py-1 rounded-lg ${
                        item.direction === 'positive'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {item.impactScore > 0 ? `+${item.impactScore}` : item.impactScore} Risk Pts
                    </span>
                  </div>
                </div>

                {/* Relative Weight Bar */}
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      item.direction === 'positive' ? 'bg-rose-500/80' : 'bg-emerald-500/80'
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature 5: Fraud Forensics Badge & Tamper-Proof Tag */}
      <FraudForensicsBadge
        document={primaryDoc}
        onInspect={() => onOpenDocumentModal(primaryDoc)}
      />

      {/* Footer Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
        <button
          type="button"
          onClick={handleExportJSON}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 bg-[#080d1a] border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Dossier (JSON)</span>
        </button>

        <div className="w-full sm:w-auto flex items-center gap-2">
          {decision === 'human_review' ? (
            <button
              type="button"
              onClick={onNavigateToQueue}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <span>Audit in Review Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenCertificate(result)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Issue Policy Certificate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
