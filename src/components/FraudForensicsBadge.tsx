import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  Scan,
  CheckCircle2,
  XCircle,
  FileSearch,
} from 'lucide-react';
import { DocumentScan } from '../types/underwriting';

interface FraudForensicsBadgeProps {
  document: DocumentScan;
  onInspect: () => void;
  compact?: boolean;
}

export const FraudForensicsBadge: React.FC<FraudForensicsBadgeProps> = ({
  document,
  onInspect,
  compact = false,
}) => {
  const isFailed = document.tamperProofVerification === 'FAILED' || document.tamperRisk === 'tampered';
  const isSuspicious = document.tamperProofVerification === 'SUSPICIOUS' || document.tamperRisk === 'suspicious';

  if (compact) {
    return (
      <button
        type="button"
        onClick={onInspect}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
          isFailed
            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
            : isSuspicious
            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
        }`}
        title="Click to view digital forensics report"
      >
        {isFailed ? (
          <XCircle className="w-3.5 h-3.5" />
        ) : isSuspicious ? (
          <AlertOctagon className="w-3.5 h-3.5" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5" />
        )}
        <span>TAMPER-PROOF: {document.tamperProofVerification}</span>
      </button>
    );
  }

  return (
    <div
      onClick={onInspect}
      className={`border rounded-xl p-3.5 cursor-pointer transition-all ${
        isFailed
          ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
          : isSuspicious
          ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500'
          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              isFailed
                ? 'bg-rose-500/20 text-rose-400'
                : isSuspicious
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {isFailed ? (
              <ShieldAlert className="w-4 h-4" />
            ) : isSuspicious ? (
              <AlertOctagon className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white tracking-tight">
                Forensic Verification:
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isFailed
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : isSuspicious
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {document.tamperProofVerification}
              </span>

              {document.authenticity && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    document.authenticity.verdict === 'ORIGINAL_GENUINE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : document.authenticity.verdict === 'DUPLICATE_PHOTOCOPY'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}
                >
                  {document.authenticity.verdictLabel.split(' ')[0]} (
                  {document.authenticity.verdictTamil || (document.authenticity.verdict === 'ORIGINAL_GENUINE' ? 'அசல்' : 'நகல்')})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {document.authenticity?.detailedFindings || document.forensics?.tamperSummary || 'Zero compression or pixel edits detected.'}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
            <FileSearch className="w-3.5 h-3.5" />
            <span>Original vs Duplicate Scan →</span>
          </span>
        </div>
      </div>

      {isFailed && document.forensics?.suspiciousRegions && document.forensics.suspiciousRegions.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-rose-500/20 text-[11px] text-rose-300 space-y-1">
          {document.forensics.suspiciousRegions.map((region, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2">
              <span className="font-medium text-rose-400">⚠️ {region.label}:</span>
              <span className="text-slate-300 text-right">
                Altered: <strong className="text-rose-400">{region.alteredValue}</strong> (Original: {region.originalSuspected})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
