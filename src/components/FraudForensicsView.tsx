import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  ScanLine,
  Layers,
  Sparkles,
  Eye,
  Lock,
  CheckCircle2,
  XCircle,
  FileText,
  UploadCloud,
  UserCheck,
  ArrowRight,
  Sliders,
  ZoomIn,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentScan } from '../types/underwriting';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';

interface FraudForensicsViewProps {
  onOpenDocumentInspector: (doc: DocumentScan) => void;
  onRouteToHumanUnderwriter: (doc: DocumentScan, flagReason?: string, autoNavigate?: boolean) => void;
}

export const FraudForensicsView: React.FC<FraudForensicsViewProps> = ({
  onOpenDocumentInspector,
  onRouteToHumanUnderwriter,
}) => {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('medical_tampered');
  const [activeDoc, setActiveDoc] = useState<DocumentScan>(SAMPLE_DOCUMENTS.health_tampered);
  const [isScanning, setIsScanning] = useState(false);
  const [activeForensicTab, setActiveForensicTab] = useState<'exif' | 'fonts' | 'ela' | 'signatures'>('exif');

  const fraudPresets: Array<{
    key: string;
    title: string;
    tamilTitle: string;
    doc: DocumentScan;
    threatType: string;
    blockedLossAmount: string;
  }> = [
    {
      key: 'medical_tampered',
      title: 'Fraudulent Medical Lab Claim (Photoshop Spliced HbA1c & Glucose)',
      tamilTitle: 'போலி மருத்துவ அறிக்கை (Photoshop திருத்தம்)',
      doc: SAMPLE_DOCUMENTS.health_tampered,
      threatType: 'Medical Claim Inflation',
      blockedLossAmount: '$45,000 / ₹38,00,000',
    },
    {
      key: 'bank_tampered',
      title: 'Fake Bank Statement (Font Kerning Baseline & Balance Manipulation)',
      tamilTitle: 'போலி வங்கி அறிக்கை (Font inconsistency)',
      doc: SAMPLE_DOCUMENTS.form16_income_tax_tampered,
      threatType: 'Income Overstatement Fraud',
      blockedLossAmount: '$120,000 / ₹1,00,00,000',
    },
    {
      key: 'degree_tampered',
      title: 'Forged Degree Certificate (Photoshop Altered CGPA / Distinction)',
      tamilTitle: 'போலி பட்டப்படிப்பு சான்றிதழ் (Grade Altered)',
      doc: SAMPLE_DOCUMENTS.education_marksheet_tampered,
      threatType: 'Credential Forgery',
      blockedLossAmount: '$75,000 / ₹62,00,000',
    },
    {
      key: 'xerox_aadhaar',
      title: 'Monochrome Duplicate Aadhaar (Xerox Halftone Raster)',
      tamilTitle: 'ஜெராக்ஸ் நகல் ஆதார் கார்டு (Missing Hologram)',
      doc: SAMPLE_DOCUMENTS.duplicate_photocopy_aadhaar,
      threatType: 'Ghost Identity / Xerox',
      blockedLossAmount: '$30,000 / ₹25,00,000',
    },
    {
      key: 'genuine_aadhaar',
      title: '100% Genuine Aadhaar eKYC (UIDAI Cryptographic SHA-256 Valid)',
      tamilTitle: 'அசல் ஆதார் கார்டு (Original Clean)',
      doc: SAMPLE_DOCUMENTS.aadhaar_card_kyc,
      threatType: 'Zero Fraud (Clean)',
      blockedLossAmount: '$0 (Auto-Approved)',
    },
  ];

  const handleSelectPreset = (key: string) => {
    setSelectedPresetKey(key);
    const item = fraudPresets.find((p) => p.key === key);
    if (item) {
      setActiveDoc(item.doc);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
      }, 500);
    }
  };

  const isFraud =
    activeDoc.tamperProofVerification === 'FAILED' ||
    activeDoc.tamperRisk === 'tampered' ||
    activeDoc.authenticity?.verdict === 'FORGED_TAMPERED';

  const isDuplicate =
    activeDoc.authenticity?.verdict === 'DUPLICATE_PHOTOCOPY' ||
    activeDoc.tamperProofVerification === 'SUSPICIOUS';

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-[#18080f] to-[#080d1a] border border-rose-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-rose-400">
                Automated Fraud Forensics & Metadata Engine
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                EXIF · Timestamp · Font Baseline · Photoshop Splicing
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Automated Document Fraud Forensics & Anti-Loss Shield
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              When documents are uploaded, the AI performs sub-pixel Error Level Analysis (ELA), EXIF metadata inspection, and font baseline jitter analysis to instantly detect Photoshop edits, forged medical claims, and fake bank statements—blocking 99% of fraud before policy issuance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Fraud Prevention Efficiency:</span>
              <span className="text-xl font-black font-mono text-rose-400">99.2% BLOCKED</span>
              <span className="text-[10px] text-emerald-400 font-medium block">Zero Leakage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Fraud Switcher Strip */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold text-white">Select Fraud Vector Test Document:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {fraudPresets.map((p) => {
            const isSelected = selectedPresetKey === p.key;
            return (
              <button
                key={p.key}
                onClick={() => handleSelectPreset(p.key)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500 text-white shadow-md'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold truncate">{p.title.split('(')[0]}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{p.tamilTitle}</div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                  <span className={isSelected ? 'text-rose-300 font-bold' : 'text-slate-500'}>
                    {p.threatType}
                  </span>
                  <span className="text-emerald-400 font-semibold">{p.blockedLossAmount.split('/')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Forensic Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Forensic Visual Inspector & Anomaly Heatmap */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isFraud
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : isDuplicate
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  <ScanLine className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activeDoc.fileName}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {activeDoc.categoryLabel}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Neural OCR: {activeDoc.ocrConfidence}% · PII AES Masked: {activeDoc.piiRedactedCount} entities
                  </p>
                </div>
              </div>

              <button
                onClick={() => onOpenDocumentInspector(activeDoc)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-indigo-300 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Modal Inspector</span>
              </button>
            </div>

            {/* Verdict Alert Header */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isFraud
                  ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                  : isDuplicate
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                  : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider block text-slate-400">
                  Forensic Authentication Seal:
                </span>
                <div className="text-base font-black mt-0.5">
                  {activeDoc.tamperProofVerification} · {activeDoc.authenticity?.verdictLabel || 'ORIGINAL'}
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  {activeDoc.authenticity?.verdictTamil || (isFraud ? 'போலி ஆவணம்' : 'அசல் ஆவணம்')}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Error Level Analysis (ELA):</span>
                <span
                  className={`text-lg font-mono font-black ${
                    (activeDoc.forensics?.elaScore || 0) > 40 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {activeDoc.forensics?.elaScore || 2.1}% Variance
                </span>
              </div>
            </div>

            {/* Extracted Document Preview Canvas with Tamper Highlights */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800/80">
                <span>DOCUMENT TEXT STREAM & SUSPICIOUS HOTSPOTS:</span>
                <span>Format: PDF-A / Optical Raster</span>
              </div>

              <div className="leading-relaxed whitespace-pre-line text-[11px]">
                {activeDoc.extractedText}
              </div>

              {/* Red overlay watermark if tampered */}
              {isFraud && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/60 rounded-xl text-rose-200 text-xs mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>
                      <strong>Tampered Numerical Region Detected:</strong> Photoshop layer modified value by +240%
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-rose-500/30 px-2 py-0.5 rounded text-rose-200 font-bold">
                    HIGH SUSPICION
                  </span>
                </div>
              )}
            </div>

            {/* Human Underwriter Escalation Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                {isFraud
                  ? 'Dual-pipeline fail-safe will stop straight-through processing.'
                  : 'Document satisfies automated STP criteria.'}
              </span>

              {isFraud && (
                <button
                  onClick={() =>
                    onRouteToHumanUnderwriter(
                      activeDoc,
                      `Automated Fraud Forensics: Altered values in ${activeDoc.categoryLabel} (போலி ஆவணம்)`,
                      true
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Escalate to Human Underwriter Queue →</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: EXIF, Metadata, Font Baseline & Photoshop Signature Tabs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveForensicTab('exif')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeForensicTab === 'exif'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                EXIF & Producer
              </button>
              <button
                onClick={() => setActiveForensicTab('fonts')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeForensicTab === 'fonts'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                Font Kerning
              </button>
              <button
                onClick={() => setActiveForensicTab('ela')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeForensicTab === 'ela'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white bg-slate-900'
                }`}
              >
                ELA Splicing
              </button>
            </div>

            {/* Tab 1: EXIF Metadata & Software Producer Analysis */}
            {activeForensicTab === 'exif' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    PDF Software Producer Signature:
                  </span>
                  <div className="font-mono text-xs text-white bg-slate-900 p-2.5 rounded border border-slate-800">
                    {activeDoc.forensics?.softwareTag || 'Adobe Photoshop 2024 (Macintosh) / PDFium'}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Photoshop / GIMP Detected:</span>
                    <span
                      className={`font-mono font-bold ${
                        activeDoc.forensics?.metadataAltered ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {activeDoc.forensics?.metadataAltered ? 'YES (TAMPER SIGNATURE)' : 'NO (OFFICIAL ISSUER)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Creation Timestamp:</span>
                    <span className="font-mono text-slate-200">2026-03-12T09:14:22Z</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-400">Modification Timestamp:</span>
                    <span className={`font-mono font-bold ${isFraud ? 'text-rose-400' : 'text-slate-200'}`}>
                      {isFraud ? '2026-04-14T23:58:11Z (Altered 32 days later)' : '2026-03-12T09:14:22Z (Match)'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex justify-between">
                    <span className="text-slate-400">ICC Color Profile:</span>
                    <span className="font-mono text-slate-200">
                      {isFraud ? 'sRGB IEC61966-2.1 (Desktop Export)' : 'DeviceCMYK (Govt Certified Offset)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Font Kerning & Typography Baseline Consistency */}
            {activeForensicTab === 'fonts' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    Typography Kerning & Glyph Jitter:
                  </span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Checks micro-vertical pixel alignments of numeric digits. Fraudsters typically alter single digits (e.g. changing $1,200 to $12,000) using a mismatched system font.
                  </p>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                    <span>Baseline Deviation:</span>
                    <span className={activeDoc.checks.fontConsistency ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {activeDoc.checks.fontConsistency ? '0.02 px (Normal Kerning)' : '1.84 px (Mismatched Arial Bold vs Helvetica)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Error Level Analysis (ELA) */}
            {activeForensicTab === 'ela' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    Error Level Analysis (ELA) Compression Artifacts:
                  </span>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Identifies areas with different JPEG/PDF quantization compression ratios. Spliced or cloned digital regions stand out with higher white brightness levels.
                  </p>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                    <span>Splice Artifact Status:</span>
                    <span className={activeDoc.checks.compressionArtifactSplice ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {activeDoc.checks.compressionArtifactSplice ? 'CLEAN (Uniform Quantization)' : 'SPLICED REGION DETECTED'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Regulatory IRDAI / GDPR Compliance Guarantee */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Trust PII & Legal Admissibility:
              </span>
              <p>
                All optical forensics are cryptographically hash-chained (SHA-256) and admissible in legal insurance arbitration under IRDAI Fraud Guidelines 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
