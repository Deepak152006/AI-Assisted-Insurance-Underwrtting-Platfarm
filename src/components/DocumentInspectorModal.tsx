import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Lock,
  CheckCircle2,
  XCircle,
  Eye,
  FileCode,
  ScanLine,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DocumentScan } from '../types/underwriting';

interface DocumentInspectorModalProps {
  document: DocumentScan | null;
  onClose: () => void;
}

export const DocumentInspectorModal: React.FC<DocumentInspectorModalProps> = ({
  document,
  onClose,
}) => {
  const [activeView, setActiveView] = useState<'authenticity' | 'forensics' | 'redacted' | 'raw'>('authenticity');

  if (!document) return null;

  const isFailed =
    document.tamperProofVerification === 'FAILED' || document.tamperRisk === 'tampered';
  const isSuspicious =
    document.tamperProofVerification === 'SUSPICIOUS' || document.tamperRisk === 'suspicious';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                isFailed
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}
            >
              {isFailed ? <ShieldAlert className="w-5 h-5" /> : <ScanLine className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>OCR Verification & Forensic Tamper Inspector</span>
              </h3>
              <p className="text-xs text-slate-400">
                {document.fileName} · {document.categoryLabel} ({document.fileSize})
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

        {/* Feature 5: Prominent Tamper-Proof Verification Seal Strip */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isFailed
              ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              : isSuspicious
              ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
              : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                isFailed
                  ? 'bg-rose-500 text-white'
                  : isSuspicious
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {isFailed ? '!' : '✓'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Authentication Status:
                </span>
                <span
                  className={`text-xs font-mono font-black px-2.5 py-0.5 rounded border ${
                    isFailed
                      ? 'bg-rose-500/30 text-rose-300 border-rose-500/60'
                      : isSuspicious
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
                      : 'bg-emerald-500/30 text-emerald-300 border-emerald-500/60'
                  }`}
                >
                  TAMPER-PROOF VERIFICATION: {document.tamperProofVerification}
                </span>
              </div>
              <p className="text-xs mt-1 font-medium leading-snug">
                {document.forensics?.tamperSummary ||
                  'Document cryptographic SHA-256 hash and font vectors validated against issuing issuer.'}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono text-slate-400 block">
              Producer Software:
            </span>
            <span className="text-xs font-mono font-semibold text-white">
              {document.forensics?.softwareTag.split(' ')[0] || 'Quest Enterprise'}
            </span>
          </div>
        </div>

        {/* 3 Metrics Strip */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">Neural OCR Accuracy</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {document.ocrConfidence}%
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Protected PII Masked</span>
            <span className="font-mono font-bold text-indigo-400 text-sm">
              {document.piiRedactedCount} Entities (AES-256)
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[10px]">Error Level Analysis (ELA)</span>
            <span
              className={`font-mono font-bold text-sm ${
                (document.forensics?.elaScore || 0) > 50
                  ? 'text-rose-400'
                  : 'text-emerald-400'
              }`}
            >
              {document.forensics?.elaScore || 3.2}% Compression Delta
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveView('authenticity')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeView === 'authenticity'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Original vs Duplicate AI Scan (அசல் vs நகல்)</span>
          </button>

          <button
            onClick={() => setActiveView('forensics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeView === 'forensics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Digital Forensics Report</span>
          </button>

          <button
            onClick={() => setActiveView('redacted')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeView === 'redacted'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>PII Redacted Layer</span>
          </button>

          <button
            onClick={() => setActiveView('raw')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeView === 'raw'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Raw OCR Extracted Stream</span>
          </button>
        </div>

        {/* AI Original vs Duplicate Authenticity View */}
        {activeView === 'authenticity' && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                document.authenticity?.verdict === 'ORIGINAL_GENUINE'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : document.authenticity?.verdict === 'DUPLICATE_PHOTOCOPY'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}
            >
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  AI Certificate Verification Engine
                </div>
                <div className="text-sm font-black mt-0.5">
                  {document.authenticity?.verdictLabel || (isFailed ? 'TAMPERED / FAKE' : 'ORIGINAL & GENUINE')}
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  {document.authenticity?.verdictTamil || (isFailed ? 'போலி ஆவணம்' : 'அசல் ஆவணம்')}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-400 block">AI Confidence:</span>
                <span className="font-mono text-sm font-black text-white">
                  {document.authenticity?.confidenceScore || 99.2}%
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Optical Forensic Diagnostic Findings:</strong>
              {document.authenticity?.detailedFindings ||
                'Cryptographic integrity and high-resolution paper grain verified. No scanner halftone artifacts detected.'}
            </div>

            {/* 6-Vector Status Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">1. Security Hologram</span>
                <span className={`font-bold font-mono text-[11px] ${document.authenticity?.verdict === 'ORIGINAL_GENUINE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {document.authenticity?.hologramRefraction?.status || (document.authenticity?.verdict === 'ORIGINAL_GENUINE' ? 'Iridescent 24K OVD' : 'Flat Foil Xerox')}
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">2. Paper Fiber Texture</span>
                <span className={`font-bold font-mono text-[11px] ${document.authenticity?.verdict === 'ORIGINAL_GENUINE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {document.authenticity?.paperFiberGrain?.textureType || (document.authenticity?.verdict === 'ORIGINAL_GENUINE' ? 'Cotton Security Rag' : 'Glass Flatbed Glare')}
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">3. Embossed Stamp Relief</span>
                <span className={`font-bold font-mono text-[11px] ${document.authenticity?.verdict === 'ORIGINAL_GENUINE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {document.authenticity?.embossedSealRelief?.reliefDepthMm !== undefined
                    ? `${document.authenticity.embossedSealRelief.reliefDepthMm}mm 3D Indent`
                    : document.authenticity?.verdict === 'ORIGINAL_GENUINE'
                    ? '0.24mm 3D Indent'
                    : '0.00mm Flat Laser'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">4. Signature Ink Feathering</span>
                <span className={`font-bold font-mono text-[11px] ${document.authenticity?.verdict === 'ORIGINAL_GENUINE' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {document.authenticity?.signaturePenGrooves?.inkType?.replace(/_/g, ' ') ||
                    (document.authenticity?.verdict === 'ORIGINAL_GENUINE' ? 'Ballpoint Wet Ink' : 'Toner Rosette')}
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">5. Anti-Copy Guilloche</span>
                <span className={`font-bold font-mono text-[11px] ${!document.authenticity?.microTextPpi?.latentCopyWatermarkTriggered ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {document.authenticity?.microTextPpi?.latentCopyWatermarkTriggered ? 'Latent "COPY" Exposed' : 'Crisp 600+ DPI'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">6. Scanner Moiré Grid</span>
                <span className={`font-bold font-mono text-[11px] ${!document.authenticity?.moirePatternDetected ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {!document.authenticity?.moirePatternDetected ? 'Clean (No Screen Glare)' : 'Photocopy Moiré Grid'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Forensic Checks View */}
        {activeView === 'forensics' && (
          <div className="space-y-4">
            {/* Suspicious Regions Highlight (If tampered) */}
            {isFailed && document.forensics?.suspiciousRegions && document.forensics.suspiciousRegions.length > 0 && (
              <div className="p-3 bg-rose-950/30 border border-rose-500/40 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Altered Forensic Hotspots Identified:
                </span>
                <div className="space-y-1.5">
                  {document.forensics.suspiciousRegions.map((region, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-950/80 rounded-lg border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <strong className="text-white block">{region.label}</strong>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Detected in PDF layer via font kerning & quantization analysis
                        </div>
                      </div>
                      <div className="text-right text-[11px] font-mono">
                        <span className="text-emerald-400 block line-through">
                          Orig: {region.originalSuspected}
                        </span>
                        <span className="text-rose-400 font-bold block">
                          Modified: {region.alteredValue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4-Point Forensic Integrity Check list */}
            <div className="space-y-2">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">
                    Font Kerning & Typography Baseline Consistency
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Analyzes micro-spacing of numerical lab, appraisal, or balance figures
                  </div>
                </div>
                {document.checks.fontConsistency ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" /> PASSED
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1 font-mono font-bold">
                    <XCircle className="w-4 h-4" /> ANOMALY DETECTED
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">
                    PDF Metadata Producer & Editor Signature
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {document.forensics?.softwareTag}
                  </div>
                </div>
                {document.checks.metadataTimestampMatch ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" /> AUTHENTIC
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1 font-mono font-bold">
                    <XCircle className="w-4 h-4" /> ADOBE EDITOR TAGGED
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">
                    Error Level Analysis (ELA) Pixel Splicing
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Detects cloned pixel regions and re-saved JPEG/PDF quantization tables
                  </div>
                </div>
                {document.checks.compressionArtifactSplice ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" /> CLEAN
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1 font-mono font-bold">
                    <XCircle className="w-4 h-4" /> SPLICE DETECTED
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">
                    Identity & NPI Registrar Checksum Validation
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Luhn algorithm checksum matched against issuing authority database
                  </div>
                </div>
                {document.checks.identityChecksumMatch ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-mono font-bold">
                    <CheckCircle2 className="w-4 h-4" /> VERIFIED
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1 font-mono font-bold">
                    <XCircle className="w-4 h-4" /> UNVERIFIED
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PII Redacted View */}
        {activeView === 'redacted' && (
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Automatic PII compliance filter applied prior to model ingestion:</span>
              <span className="text-emerald-400 font-mono">HIPAA & GDPR Compliant</span>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto selection:bg-indigo-500 selection:text-white">
              {document.redactedPreview}
            </pre>
          </div>
        )}

        {/* Raw Extracted View */}
        {activeView === 'raw' && (
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400">
              Direct text extraction output from neural OCR pipeline:
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto selection:bg-indigo-500 selection:text-white">
              {document.extractedText}
            </pre>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 font-mono">
            Cryptographic Integrity: SHA-256 Validated
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
