import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  User,
  CheckCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Bot,
  Layers,
} from 'lucide-react';
import { UnderwriterQueueItem, DocumentScan } from '../types/underwriting';
import { FraudForensicsBadge } from './FraudForensicsBadge';

interface AuditModalProps {
  item: UnderwriterQueueItem | null;
  onClose: () => void;
  onAuditDecision: (
    itemId: string,
    action: 'approved' | 'rejected' | 'needs_info',
    notes: string,
    adjustedPremium?: number
  ) => void;
  onOpenDocumentModal: (doc: DocumentScan) => void;
  onOpenCopilot: (item: UnderwriterQueueItem) => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({
  item,
  onClose,
  onAuditDecision,
  onOpenDocumentModal,
  onOpenCopilot,
}) => {
  if (!item) return null;

  const { applicant, evaluation, flagReason } = item;
  const docBatch = applicant.documents || [applicant.document];

  const [notes, setNotes] = useState(
    item.auditorNotes ||
      `Reviewed applicant risk profile, multi-document batch records, and verified supporting forensics. Risk factors evaluated in conjunction with reinsurance guidelines.`
  );
  const [customPremium, setCustomPremium] = useState<number>(
    item.overridePremium || evaluation.recommendedPremium
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Underwriter Audit & Manual Override
              </h3>
              <p className="text-xs text-slate-400">
                Case ID: {item.id} · Flagged: {flagReason}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Feature 2: Launch AI Copilot */}
            <button
              onClick={() => onOpenCopilot(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-semibold transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask AI Copilot</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Applicant Overview Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Applicant</span>
            <span className="font-semibold text-white">{applicant.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Line & Coverage</span>
            <span className="font-semibold text-white capitalize">
              {applicant.line} (${applicant.coverage.toLocaleString()})
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">AI Risk Score</span>
            <span className="font-mono font-bold text-rose-400">
              {evaluation.compositeRiskScore} / 100
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Proposed Premium</span>
            <span className="font-mono font-bold text-indigo-400">
              ${evaluation.recommendedPremium.toLocaleString()}/yr
            </span>
          </div>
        </div>

        {/* Primary Audit Trigger Details */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Actuarial Trigger Rationale & SHAP Decomposition
          </label>
          <div className="space-y-1.5">
            {evaluation.shapAttributions.map((shap, i) => (
              <div
                key={i}
                className="p-2.5 bg-slate-950/50 rounded-lg border border-slate-800 text-xs flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-semibold text-slate-200">{shap.factor}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{shap.rationale}</p>
                </div>
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                    shap.direction === 'positive'
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-emerald-400 bg-emerald-500/10'
                  }`}
                >
                  {shap.impactScore > 0 ? `+${shap.impactScore}` : shap.impactScore} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 1 & 5: Attached Multi-Document Batch & Tamper Forensics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Attached Multi-Document Batch ({docBatch.length} Records)
            </label>
            <span className="text-[10px] text-slate-500">
              Neural OCR & SHA-256 Validated
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {docBatch.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDocumentModal(doc)}
                className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                  doc.tamperProofVerification === 'FAILED'
                    ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="truncate pr-2">
                    <span className="text-xs font-semibold text-white block truncate">
                      {doc.categoryLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate font-mono">
                      {doc.fileName}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      doc.tamperProofVerification === 'FAILED'
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {doc.tamperProofVerification}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Override Adjustment */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Underwriter Adjusted Premium ($ / Year)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="100"
              value={customPremium}
              onChange={(e) => setCustomPremium(parseInt(e.target.value) || 0)}
              className="w-48 font-mono bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-slate-400 font-mono">
              ~${Math.round(customPremium / 12).toLocaleString()}/mo
            </span>
          </div>
        </div>

        {/* Auditor Notes Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Underwriter Audit Dossier Notes (Recorded in Audit Ledger)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
            placeholder="Add actuarial justification, reinsurance treaty reference, or specific rider exclusion..."
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={() => onAuditDecision(item.id, 'approved', notes, customPremium)}
            className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Override: Approve Policy</span>
          </button>

          <button
            type="button"
            onClick={() => onAuditDecision(item.id, 'rejected', notes)}
            className="w-full sm:flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Override: Reject Policy</span>
          </button>

          <button
            type="button"
            onClick={() => onAuditDecision(item.id, 'needs_info', notes)}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
          >
            Request Retest
          </button>
        </div>
      </div>
    </div>
  );
};
