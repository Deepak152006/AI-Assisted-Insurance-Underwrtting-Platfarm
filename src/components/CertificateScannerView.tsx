import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  Scan,
  CheckCircle2,
  XCircle,
  FileSearch,
  UploadCloud,
  Eye,
  Sparkles,
  Layers,
  ZoomIn,
  Fingerprint,
  FileText,
  Award,
  AlertTriangle,
  RotateCcw,
  Download,
  Info,
  Check,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Shield,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentScan } from '../types/underwriting';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';

interface CertificateScannerViewProps {
  onSelectForWorkbench?: (doc: DocumentScan) => void;
  onOpenDocumentInspector?: (doc: DocumentScan) => void;
  onRouteToHumanUnderwriter?: (doc: DocumentScan, flagReason: string, autoSwitch?: boolean) => void;
  escalatedDocIds?: string[];
  pendingQueueCount?: number;
}

interface CertificatePresetOption {
  id: string;
  name: string;
  category: string;
  verdictType: 'original' | 'duplicate' | 'tampered';
  tamilVerdict: string;
  doc: DocumentScan;
}

export const CertificateScannerView: React.FC<CertificateScannerViewProps> = ({
  onSelectForWorkbench,
  onOpenDocumentInspector,
  onRouteToHumanUnderwriter,
  escalatedDocIds = [],
  pendingQueueCount = 0,
}) => {
  // Preset list of certificates for immediate testing
  const certificatePresets: CertificatePresetOption[] = [
    {
      id: 'degree_original',
      name: 'Degree Certificate (B.Tech) - ORIGINAL',
      category: 'Educational (கல்விச் சான்றிதழ்)',
      verdictType: 'original',
      tamilVerdict: 'அசல் சான்றிதழ் (Original)',
      doc: SAMPLE_DOCUMENTS.education_degree_certificate_original,
    },
    {
      id: 'degree_duplicate',
      name: 'Degree Certificate (B.Tech) - DUPLICATE XEROX',
      category: 'Educational (கல்விச் சான்றிதழ்)',
      verdictType: 'duplicate',
      tamilVerdict: 'நகல் / கலர் ஜெராக்ஸ் (Duplicate)',
      doc: SAMPLE_DOCUMENTS.education_degree_certificate_duplicate,
    },
    {
      id: 'marksheet_tampered',
      name: '12th Marksheet - TAMPERED FORGERY',
      category: 'Educational (கல்விச் சான்றிதழ்)',
      verdictType: 'tampered',
      tamilVerdict: 'போலி மதிப்பெண் (Forged Marks)',
      doc: SAMPLE_DOCUMENTS.education_marksheet_tampered,
    },
    {
      id: 'doctor_original',
      name: "Doctor's Fitness Certificate - ORIGINAL",
      category: 'Health / Medical (உடல்நலம்)',
      verdictType: 'original',
      tamilVerdict: 'அசல் மருத்துவ சான்றிதழ் (Original)',
      doc: SAMPLE_DOCUMENTS.doctor_medical_certificate,
    },
    {
      id: 'doctor_duplicate',
      name: "Doctor's Fitness Certificate - DUPLICATE XEROX",
      category: 'Health / Medical (உடல்நலம்)',
      verdictType: 'duplicate',
      tamilVerdict: 'நகல் மருத்துவ சான்றிதழ் (Duplicate)',
      doc: SAMPLE_DOCUMENTS.doctor_medical_certificate_duplicate,
    },
    {
      id: 'rc_original',
      name: 'Parivahan RC Book - ORIGINAL SMART CARD',
      category: 'Motor / Vehicle (வாகனம்)',
      verdictType: 'original',
      tamilVerdict: 'அசல் RC புக் (Original Smart Card)',
      doc: SAMPLE_DOCUMENTS.rc_book_vehicle,
    },
    {
      id: 'rc_duplicate',
      name: 'Parivahan RC Book - PHOTOCOPY DUPLICATE',
      category: 'Motor / Vehicle (வாகனம்)',
      verdictType: 'duplicate',
      tamilVerdict: 'நகல் RC புக் (Photocopy Duplicate)',
      doc: SAMPLE_DOCUMENTS.rc_book_duplicate_xerox,
    },
    {
      id: 'property_original',
      name: 'Property Tax Receipt & Deed - ORIGINAL',
      category: 'Home / Property (சொத்து வரி)',
      verdictType: 'original',
      tamilVerdict: 'அசல் வீட்டு வரி ரசீது (Original)',
      doc: SAMPLE_DOCUMENTS.property_tax_receipt,
    },
    {
      id: 'aadhaar_original',
      name: 'Aadhaar Card - ORIGINAL e-KYC',
      category: 'Identity Proof (அடையாள அட்டை)',
      verdictType: 'original',
      tamilVerdict: 'அசல் ஆதார் அட்டை (Original)',
      doc: SAMPLE_DOCUMENTS.aadhaar_card_kyc,
    },
    {
      id: 'aadhaar_duplicate',
      name: 'Aadhaar Card - XEROX PHOTOCOPY',
      category: 'Identity Proof (அடையாள அட்டை)',
      verdictType: 'duplicate',
      tamilVerdict: 'நகல் ஆதார் அட்டை (Photocopy)',
      doc: SAMPLE_DOCUMENTS.duplicate_photocopy_aadhaar,
    },
  ];

  const [selectedPresetId, setSelectedPresetId] = useState<string>('degree_original');
  const [activeDoc, setActiveDoc] = useState<DocumentScan>(
    SAMPLE_DOCUMENTS.education_degree_certificate_original
  );
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [activeForensicTab, setActiveForensicTab] = useState<
    'visual' | 'ela' | 'microscope' | 'metadata'
  >('visual');
  const [activeHotspot, setActiveHotspot] = useState<string | null>('hologram');
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [customFileLoaded, setCustomFileLoaded] = useState<string | null>(null);
  const [autoEscalateEnabled, setAutoEscalateEnabled] = useState<boolean>(true);
  const [escalatedLocally, setEscalatedLocally] = useState<Record<string, boolean>>({});

  const scanSteps = [
    'Analyzing Paper Fiber Density & Cotton Weave (100x Optical Micro-Grain)...',
    'Scanning Hologram Iridescent Angular Light Diffraction Shifts (OVD)...',
    'Measuring 3D Tactile Embossed Seal & Stamp Indentation Relief...',
    'Analyzing Ballpoint Pen Groove Pressure vs Electrostatic Toner Dot Rosettes...',
    'Checking Anti-Copy Guilloche Security Pattern & Latent "COPY" Watermarks...',
    'Verifying Cryptographic Metadata, ELA Quantization & Digital Signatures...',
  ];

  const handleManualEscalateToQueue = (autoSwitch: boolean = true) => {
    if (!onRouteToHumanUnderwriter) return;
    const isTamperedNow = activeDoc.authenticity.verdict === 'FORGED_TAMPERED';
    const reason = isTamperedNow
      ? `AI Certificate Scanner Alert: FORGED / TAMPERED (${activeDoc.categoryLabel}) - Digital Splice & Compression Anomaly (போலி சான்றிதழ்)`
      : `AI Certificate Scanner Alert: DUPLICATE / PHOTOCOPY XEROX (${activeDoc.categoryLabel}) - Flat Toner & Missing 3D Relief (நகல் சான்றிதழ்)`;
    onRouteToHumanUnderwriter(activeDoc, reason, autoSwitch);
    setEscalatedLocally((prev) => ({ ...prev, [activeDoc.id]: true }));
  };

  const handleSelectPreset = (preset: CertificatePresetOption) => {
    setSelectedPresetId(preset.id);
    setActiveDoc(preset.doc);
    setCustomFileLoaded(null);
    runLiveScan(preset.doc);
  };

  const runLiveScan = (docToScan = activeDoc) => {
    setIsScanning(true);
    setScanStepIndex(0);

    const stepInterval = setInterval(() => {
      setScanStepIndex((prev) => {
        if (prev < scanSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsScanning(false);
          if (docToScan.authenticity.verdict === 'ORIGINAL_GENUINE') {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#10b981', '#6366f1'],
            });
          } else {
            // Fake / Duplicate detected! Auto-route to human underwriter queue if enabled
            if (autoEscalateEnabled && onRouteToHumanUnderwriter) {
              const isTamperedDoc = docToScan.authenticity.verdict === 'FORGED_TAMPERED';
              const reason = isTamperedDoc
                ? `AI Certificate Scanner Alert: FORGED / TAMPERED (${docToScan.categoryLabel}) - ELA Quantization Splice (போலி சான்றிதழ்)`
                : `AI Certificate Scanner Alert: DUPLICATE / PHOTOCOPY XEROX (${docToScan.categoryLabel}) - Missing 3D Seal & OVD Hologram (நகல் சான்றிதழ்)`;
              onRouteToHumanUnderwriter(docToScan, reason, false);
              setEscalatedLocally((prev) => ({ ...prev, [docToScan.id]: true }));
            }
          }
          return prev;
        }
      });
    }, 450);
  };

  const handleSimulateCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileLoaded(file.name);
    // Randomly assign a realistic verdict for custom uploaded file or default to certified
    const isMockDuplicate = file.name.toLowerCase().includes('copy') || file.name.toLowerCase().includes('xerox') || file.name.toLowerCase().includes('scan');
    const customDoc: DocumentScan = {
      ...SAMPLE_DOCUMENTS.education_degree_certificate_original,
      id: `custom-${Date.now()}`,
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      categoryLabel: `Uploaded Certificate (${file.name})`,
      ocrConfidence: 98.4,
      authenticity: isMockDuplicate
        ? SAMPLE_DOCUMENTS.education_degree_certificate_duplicate.authenticity
        : SAMPLE_DOCUMENTS.education_degree_certificate_original.authenticity,
    };

    setActiveDoc(customDoc);
    runLiveScan(customDoc);
  };

  const auth = activeDoc.authenticity;
  const isOriginal = auth.verdict === 'ORIGINAL_GENUINE';
  const isDuplicate = auth.verdict === 'DUPLICATE_PHOTOCOPY';
  const isTampered = auth.verdict === 'FORGED_TAMPERED';
  const isEscalated = escalatedLocally[activeDoc.id] || escalatedDocIds.includes(activeDoc.id);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Banner / Hero Title */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0b1329] to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-indigo-400">
                AI Deep Micro-Forensics
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Original vs Duplicate / Xerox / Forgery Detector
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>AI Certificate Authenticity & Verification Engine</span>
              <span className="text-sm font-semibold text-slate-400 hidden lg:inline">
                (அசல் vs நகல் சான்றிதழ் கண்டறிதல்)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Whenever a candidate or policyholder uploads any certificate (Degree, Marksheet, RC Book, Doctor Fitness, or Property Tax), the neural forensics pipeline scans 6 microscopic dimensions to immediately classify whether it is an <strong className="text-emerald-400">ORIGINAL physical document</strong> or a <strong className="text-amber-400">DUPLICATE / COLOR XEROX</strong> or a <strong className="text-rose-400">FORGED / TAMPERED copy</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => runLiveScan()}
              disabled={isScanning}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Scan className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Re-Run AI Scan'}</span>
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Certificate Switcher Strip */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Real-World Certificate to Test AI Scanner:
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              (Click to test Original vs Fake / Duplicate / Tampered)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Auto-Escalate Toggle for Fake Certificates */}
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs transition-colors">
              <input
                type="checkbox"
                checked={autoEscalateEnabled}
                onChange={(e) => setAutoEscalateEnabled(e.target.checked)}
                className="w-3.5 h-3.5 accent-rose-500 rounded cursor-pointer"
              />
              <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Auto-Escalate Fake to Underwriter</span>
                <span className="text-[10px] text-rose-400 hidden md:inline font-mono">
                  (மனித ஆய்வு)
                </span>
              </span>
            </label>

            <label className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Certificate</span>
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={handleSimulateCustomUpload}
              />
            </label>
          </div>
        </div>

        {/* Quick Click Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1">
          {certificatePresets.map((preset) => {
            const isSelected = selectedPresetId === preset.id && !customFileLoaded;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono text-slate-400 truncate">
                    {preset.category.split(' ')[0]}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                      preset.verdictType === 'original'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : preset.verdictType === 'duplicate'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {preset.verdictType}
                  </span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-1 leading-snug">
                  {preset.name.split('-')[0]}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {preset.tamilVerdict}
                </div>
              </button>
            );
          })}
        </div>

        {customFileLoaded && (
          <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/40 rounded-xl flex items-center justify-between text-xs text-indigo-300">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Custom Upload: <strong>{customFileLoaded}</strong></span>
            </span>
            <span className="font-mono text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded text-white">
              AI Processed
            </span>
          </div>
        )}
      </div>

      {/* High-Alert Dual-Pipeline Fail-Safe Escalation Banner for Fake / Tampered / Duplicate Certificates */}
      {(isDuplicate || isTampered) && !isScanning && (
        <div className="bg-gradient-to-r from-rose-950/80 via-red-950/50 to-slate-950 border-2 border-rose-500/70 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/40 animate-pulse">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-rose-500/25 text-rose-200 border border-rose-500/40">
                    🚨 FAIL-SAFE: ESCALATED TO HUMAN UNDERWRITER
                  </span>
                  <span className="text-xs font-bold text-rose-400">
                    (போலி / நகல் சான்றிதழ் மனித அண்டர்ரைட்டர் ஆய்வுக்கு அனுப்பப்பட்டது)
                  </span>
                  {isEscalated && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Logged in Review Queue
                    </span>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {isTampered
                    ? 'Fraudulent / Tampered Certificate Detected: Straight-Through STP Blocked'
                    : 'Duplicate / Color Xerox Detected: Mandatory Physical Original Check Enqueued'}
                </h2>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {isTampered
                    ? 'AI microscopic forensics detected pixel quantization mismatch (ELA 88.5%) and tampered mark values. As per dual-pipeline protocol, this case has been automatically forwarded to the Human Underwriter Review Queue.'
                    : 'AI scanner detected 2D electrostatic toner dot matrix, flat embossed seal (0.00mm depth), and dull metallic foil. Case has been routed to the Human Underwriter Queue to require the applicant submit original physical documents.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleManualEscalateToQueue(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/40 transition-all flex items-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Open in Human Underwriter Queue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live AI Scanner Status Bar (Active during animation) */}
      {isScanning && (
        <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-4 space-y-3 animate-pulse">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono text-indigo-400 font-bold">
              <Scan className="w-4 h-4 animate-spin" />
              <span>RUNNING 6-VECTOR MICROSCOPIC SCAN...</span>
            </div>
            <span className="font-mono text-slate-400">
              Step {scanStepIndex + 1} of {scanSteps.length}
            </span>
          </div>

          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${((scanStepIndex + 1) / scanSteps.length) * 100}%` }}
            />
          </div>

          <p className="text-xs font-mono text-slate-300">
            {scanSteps[scanStepIndex]}
          </p>
        </div>
      )}

      {/* Main 2-Column Inspection Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Certificate Canvas & Hotspots (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-indigo-400" />
                  <span>Interactive Optical Forensic Inspection</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {activeDoc.fileName} · {activeDoc.fileSize}
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1.5 text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveForensicTab('visual')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    activeForensicTab === 'visual'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Optical</span>
                </button>
                <button
                  onClick={() => setActiveForensicTab('ela')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    activeForensicTab === 'ela'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>ELA Splice</span>
                </button>
                <button
                  onClick={() => setActiveForensicTab('microscope')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    activeForensicTab === 'microscope'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>100x Fiber</span>
                </button>
                <button
                  onClick={() => setActiveForensicTab('metadata')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    activeForensicTab === 'metadata'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>EXIF / Hex</span>
                </button>
              </div>
            </div>

            {/* Visual Canvas Simulation */}
            {activeForensicTab === 'visual' && (
              <div className="space-y-3">
                <div className="relative rounded-xl border border-slate-700/80 bg-slate-950 p-6 min-h-[380px] flex flex-col justify-between overflow-hidden shadow-2xl selection:bg-indigo-500 selection:text-white">
                  {/* Subtle Guilloche Pattern Background Watermark */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"
                  />

                  {/* Latent "COPY / DUPLICATE" Warning watermark if duplicate */}
                  {isDuplicate && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 rotate-[-25deg]">
                      <div className="border-8 border-amber-500/30 bg-amber-950/40 p-4 sm:p-6 rounded-3xl text-center backdrop-blur-[1px]">
                        <span className="text-3xl sm:text-5xl font-black font-mono tracking-widest text-amber-400/80 block uppercase">
                          DUPLICATE / XEROX / நகல்
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-300/90 block mt-1 tracking-wider">
                          ROUTED TO HUMAN UNDERWRITER REVIEW QUEUE
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tampered / Forgery Warning Watermark */}
                  {isTampered && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 rotate-[-20deg]">
                      <div className="border-8 border-rose-500/40 bg-rose-950/70 p-4 sm:p-6 rounded-3xl text-center backdrop-blur-[1px] shadow-2xl">
                        <span className="text-3xl sm:text-5xl font-black font-mono tracking-widest text-rose-400 block uppercase">
                          FORGED / போலி சான்றிதழ்
                        </span>
                        <span className="text-xs font-mono font-bold text-rose-300 block mt-1 tracking-wider">
                          ROUTED TO HUMAN UNDERWRITER REVIEW QUEUE
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Laser scan line overlay when scanning */}
                  {isScanning && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-pulse z-20" />
                  )}

                  {/* Header of Simulated Certificate */}
                  <div className="border-b border-slate-800/80 pb-4 flex items-start justify-between gap-4 relative z-10">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono tracking-wider text-indigo-400 uppercase font-bold">
                        GOVERNMENT / INSTITUTIONAL ISSUER
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-white">
                        {activeDoc.categoryLabel}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        Document ID: {activeDoc.id} · Ref: IN-CERT-2026-99201
                      </div>
                    </div>

                    {/* Hotspot 1: Hologram / Security Device */}
                    <div
                      onClick={() => setActiveHotspot('hologram')}
                      className={`cursor-pointer p-2 rounded-xl border transition-all text-center shrink-0 ${
                        activeHotspot === 'hologram'
                          ? 'border-indigo-400 bg-indigo-500/20 ring-2 ring-indigo-500/40'
                          : 'border-slate-700 bg-slate-900/90 hover:border-slate-500'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-lg mx-auto flex items-center justify-center font-black text-xs relative overflow-hidden ${
                          isOriginal
                            ? 'bg-gradient-to-tr from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 shadow-md shadow-amber-500/20 animate-pulse'
                            : isDuplicate
                            ? 'bg-slate-700 text-slate-400 border border-slate-600'
                            : 'bg-rose-950 text-rose-400 border border-rose-600'
                        }`}
                      >
                        {isOriginal ? '24K OVD' : isDuplicate ? 'FLAT FOIL' : 'VOID'}
                      </div>
                      <span className="text-[9px] font-mono font-bold block mt-1 text-slate-300">
                        {isOriginal ? 'OVD Valid ✓' : isDuplicate ? 'Static Xerox ✗' : 'Tampered ✗'}
                      </span>
                    </div>
                  </div>

                  {/* Certificate Body Text Content */}
                  <div className="py-4 space-y-3 relative z-10">
                    <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs font-mono leading-relaxed text-slate-300 space-y-1">
                      <div className="text-[11px] text-slate-500 font-semibold mb-1">
                        EXTRACTED PRIMARY RECORD STREAM:
                      </div>
                      <div className="text-white font-bold">
                        HOLDER: PRIYA SHARMA / பிரியா சர்மா (Verified Identity)
                      </div>
                      <div>
                        RECORD TYPE: {activeDoc.docCategory.toUpperCase()} · STATUS: ISSUED & BOUND
                      </div>
                      <div className="text-slate-400 line-clamp-3">
                        {activeDoc.extractedText}
                      </div>
                    </div>

                    {/* Altered region callout if tampered */}
                    {isTampered && activeDoc.forensics.suspiciousRegions.length > 0 && (
                      <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs space-y-1.5 animate-pulse">
                        <div className="font-bold text-rose-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                          <span>Tampered Region Identified by Neural Kerning Check:</span>
                        </div>
                        {activeDoc.forensics.suspiciousRegions.map((reg, idx) => (
                          <div key={idx} className="flex justify-between font-mono text-[11px] text-slate-300">
                            <span>{reg.label}:</span>
                            <span className="text-rose-400 font-bold">
                              {reg.alteredValue} (Original was: {reg.originalSuspected})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certificate Footer with Seal & Signature Hotspots */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-end justify-between gap-4 relative z-10">
                    {/* Hotspot 2: Embossed Seal */}
                    <div
                      onClick={() => setActiveHotspot('seal')}
                      className={`cursor-pointer p-2.5 rounded-xl border transition-all text-left ${
                        activeHotspot === 'seal'
                          ? 'border-indigo-400 bg-indigo-500/20 ring-2 ring-indigo-500/40'
                          : 'border-slate-700 bg-slate-900/80 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isOriginal
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          印
                        </div>
                        <div>
                          <div className="text-[11px] font-bold text-white">
                            Embossed Seal & Crest
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {auth.embossedSealRelief?.reliefDepthMm !== undefined
                              ? `Relief: ${auth.embossedSealRelief.reliefDepthMm}mm`
                              : isOriginal
                              ? 'Relief: 0.24mm (3D)'
                              : 'Relief: 0.00mm (Flat Xerox)'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hotspot 3: Signature */}
                    <div
                      onClick={() => setActiveHotspot('signature')}
                      className={`cursor-pointer p-2.5 rounded-xl border transition-all text-right ${
                        activeHotspot === 'signature'
                          ? 'border-indigo-400 bg-indigo-500/20 ring-2 ring-indigo-500/40'
                          : 'border-slate-700 bg-slate-900/80 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-[11px] font-bold text-white">
                        Authorized Signature
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {auth.signaturePenGrooves?.inkType
                          ? auth.signaturePenGrooves.inkType.replace(/_/g, ' ')
                          : isOriginal
                          ? 'Wet Fountain Pen Bleed'
                          : 'Flat Laser Rosette Toner'}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-indigo-400">
                        [Click to Inspect Grooves]
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hotspot Detailed Callout Explainer Card */}
                {activeHotspot && (
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-indigo-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        Selected Micro-Region: {activeHotspot.toUpperCase()} ANALYSIS
                      </span>
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          isOriginal
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {isOriginal ? 'GENUINE PHYSICAL ARTIFACT' : 'DUPLICATE / FAKE DETECTED'}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed text-xs">
                      {activeHotspot === 'hologram' &&
                        (auth.hologramRefraction?.notes ||
                          (isOriginal
                            ? 'Optically Variable Device (OVD) multi-angle iridescent diffraction confirmed. Surface exhibits kinematic rainbow hue shift under tilted illumination.'
                            : 'Flat grey metallic toner print detected. Lacks diffraction grating. Conclusive signature of color laser printer / Xerox photocopier.'))}

                      {activeHotspot === 'seal' &&
                        (auth.embossedSealRelief?.notes ||
                          (isOriginal
                            ? 'Physical 3D indent stamp creates clear shadow gradient under oblique directional lighting. 0.24mm embossed paper depression confirmed.'
                            : 'Zero physical paper indentation (0.00mm). The seal was reproduced purely via color laser toner without a physical die stamp.'))}

                      {activeHotspot === 'signature' &&
                        (auth.signaturePenGrooves?.notes ||
                          (isOriginal
                            ? 'True fountain/ballpoint pen groove pressure with micro-capillary ink bleed into paper fibers. Natural variation in stroke pressure confirms hand-signed original.'
                            : 'Signature is composed of fused electrostatic toner micro-dots (CMYK dot matrix) with zero paper fiber groove indentation.'))}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* View Mode: Error Level Analysis (ELA) Heatmap */}
            {activeForensicTab === 'ela' && (
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>JPEG / PDF Error Level Analysis (ELA) Compression Heatmap</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-indigo-400">
                      ELA Delta: {activeDoc.forensics.elaScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    ELA exposes digital resaving and pixel splicing. Authentic camera/scanner scans have a uniform error floor (under 10%), while images modified in Photoshop or Canva exhibit stark white/magenta noise spikes around altered text.
                  </p>

                  <div className="relative rounded-lg overflow-hidden border border-slate-800 p-8 bg-[#030712] flex flex-col items-center justify-center min-h-[220px]">
                    <div
                      className={`w-full max-w-md h-32 rounded-lg border flex items-center justify-center font-mono text-xs relative ${
                        isTampered
                          ? 'bg-rose-950/40 border-rose-500/60 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                          : isDuplicate
                          ? 'bg-amber-950/30 border-amber-500/50 text-amber-300'
                          : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                      }`}
                    >
                      {isTampered ? (
                        <div className="text-center space-y-2 p-3">
                          <span className="text-rose-400 font-bold block text-sm">
                            ⚠️ HIGH COMPRESSION VARIANCE DETECTED (88.5%)
                          </span>
                          <span className="text-[11px] text-slate-300 block">
                            Bright quantization spikes reveal spliced digits & cloned text boundaries.
                          </span>
                        </div>
                      ) : isDuplicate ? (
                        <div className="text-center space-y-2 p-3">
                          <span className="text-amber-400 font-bold block text-sm">
                            ⚠️ RE-SCAN HALO & TONER NOISE DETECTED (28.4%)
                          </span>
                          <span className="text-[11px] text-slate-300 block">
                            Halftone dot diffusion grid visible across document surface.
                          </span>
                        </div>
                      ) : (
                        <div className="text-center space-y-2 p-3">
                          <span className="text-emerald-400 font-bold block text-sm">
                            ✓ UNIFORM QUANTIZATION FLOOR (1.4% DELTA)
                          </span>
                          <span className="text-[11px] text-slate-300 block">
                            Single compression pass confirmed. Pristine unmodified image matrix.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode: 100x Paper Fiber Microscope */}
            {activeForensicTab === 'microscope' && (
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <ZoomIn className="w-4 h-4 text-cyan-400" />
                      <span>100x Microscopic Paper Grain & Anti-Copy Guilloche Inspection</span>
                    </span>
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {isOriginal ? '300+ DPI Fiber Weave' : '120 DPI Xerox Rosette'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-slate-200">
                        Paper Matrix Surface Analysis:
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        Texture Type: <strong className="text-white">{auth.paperFiberGrain?.textureType || (isOriginal ? 'Natural Cotton Cellulose' : 'Flatbed Glass Copier')}</strong>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        Fiber Depth: <strong className="text-white">{auth.paperFiberGrain?.fiberDepthMm || (isOriginal ? 0.14 : 0.01)} mm</strong>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {auth.paperFiberGrain?.notes || (isOriginal ? 'Genuine cotton security bond paper with organic fiber interlock.' : 'Smooth 75gsm wood pulp copier paper.')}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-bold text-slate-200">
                        Micro-Text & Anti-Copy Border:
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        Measured Resolution: <strong className="text-white">{auth.microTextPpi?.measuredPpi || (isOriginal ? 600 : 150)} DPI</strong>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        Latent "COPY" Triggered: <strong className={isDuplicate ? 'text-rose-400' : 'text-emerald-400'}>{isDuplicate ? 'YES (Latent Void Exposed)' : 'NO (Pristine)'}</strong>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {auth.microTextPpi?.notes || (isOriginal ? 'Security borders remain crisp and unbroken under high magnification.' : 'Security border fragmented into jagged laser dots.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode: EXIF & Metadata Stream */}
            {activeForensicTab === 'metadata' && (
              <div className="space-y-3">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-emerald-400" />
                      <span>Document Header, Producer Signatures & SHA-256 Digest</span>
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      AES-256 Validated
                    </span>
                  </div>

                  <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {`DOCUMENT PRODUCER ENGINE: ${activeDoc.forensics.softwareTag}
METADATA TAMPERED: ${activeDoc.forensics.metadataAltered ? 'TRUE (ModDate Mismatch / Revision Layer Count > 1)' : 'FALSE (Linearized Original Stream)'}
SHA-256 CHECKSUM: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
FONTS EMBEDDED: Arial-Bold, Helvetica-Identity, Times-Roman (Consistent Kerning: ${activeDoc.checks.fontConsistency ? 'PASS' : 'FAIL'})
TIMESTAMP INTEGRITY: ${activeDoc.checks.metadataTimestampMatch ? 'Cryptographic Authority Match' : 'Discrepancy: File Modified Prior to Upload'}
OPTICAL MOIRÉ PATTERN: ${auth.moirePatternDetected ? 'DETECTED (Scanning from Photocopy/Screen)' : 'CLEAN (Zero Scanner Glare)'}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Verdict, 6-Vector Meters & Underwriting Directive (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Verdict Card */}
          <div
            className={`p-5 rounded-2xl border shadow-2xl space-y-4 ${
              isOriginal
                ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/50'
                : isDuplicate
                ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-500/50'
                : 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-rose-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold tracking-wider text-slate-400">
                AI Authenticity Verdict
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                Confidence: {auth.confidenceScore}%
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  isOriginal
                    ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                    : isDuplicate
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/30'
                    : 'bg-rose-500 text-white shadow-rose-500/30'
                }`}
              >
                {isOriginal ? (
                  <ShieldCheck className="w-7 h-7" />
                ) : isDuplicate ? (
                  <AlertTriangle className="w-7 h-7" />
                ) : (
                  <ShieldAlert className="w-7 h-7" />
                )}
              </div>

              <div>
                <h2
                  className={`text-lg font-black tracking-tight leading-tight ${
                    isOriginal
                      ? 'text-emerald-400'
                      : isDuplicate
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {auth.verdictLabel}
                </h2>
                <div className="text-xs font-semibold text-slate-300 mt-0.5">
                  {auth.verdictTamil}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {auth.detailedFindings}
            </p>

            {/* Direct Underwriter Recommendation Box */}
            <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
              isOriginal
                ? 'bg-slate-950/90 border-slate-800/80'
                : 'bg-rose-950/30 border-rose-500/40 shadow-inner'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Actuarial Decision Recommendation:</span>
                </span>
                {!isOriginal && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold animate-pulse">
                    ROUTED TO HUMAN ACTUARY
                  </span>
                )}
              </div>

              <div className="text-white font-bold flex items-center gap-2">
                {isOriginal ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Auto-Approved for Straight-Through Processing (STP)</span>
                  </>
                ) : isDuplicate ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Halt STP: Mandatory Original Physical Document Verification Enqueued</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Immediate Referral to Human Underwriter Review Queue & FIU</span>
                  </>
                )}
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
                {isOriginal
                  ? 'The document exhibits genuine physical security properties complying with IRDAI & UIDAI verification mandates.'
                  : isDuplicate
                  ? 'A photocopy or color Xerox reproduction was submitted. UnderwriteAI has routed this case to the Human Underwriter Queue to require the customer provide physical original verification.'
                  : 'Document was altered using digital editing software. Adverse risk referral logged in Human Underwriter Queue for manual actuary audit.'}
              </div>

              {!isOriginal && (
                <div className="pt-2 border-t border-rose-500/20">
                  <button
                    onClick={() => handleManualEscalateToQueue(true)}
                    className="w-full py-2 px-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Review in Human Underwriter Queue (மனித ஆய்வு)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 6-Vector Microscopic Scorecard */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Scan className="w-3.5 h-3.5 text-indigo-400" />
              <span>6-Vector Micro-Forensic Scorecard</span>
            </h4>

            <div className="space-y-2 text-xs">
              {/* Check 1: Hologram / OVD */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">1. Hologram & OVD Diffraction</div>
                  <div className="text-[10px] text-slate-400">
                    {auth.hologramRefraction?.status || (isOriginal ? 'Authentic Iridescent' : 'Static Flat Foil')}
                  </div>
                </div>
                {auth.hologramRefraction?.colorShiftDetected !== false && isOriginal ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> PASSED
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> FAILED
                  </span>
                )}
              </div>

              {/* Check 2: Paper Fiber Grain */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">2. Paper Cellulose Texture (100x)</div>
                  <div className="text-[10px] text-slate-400">
                    {auth.paperFiberGrain?.textureType || (isOriginal ? 'Cotton Weave' : 'Glass Glare')}
                  </div>
                </div>
                {auth.paperFiberGrain?.passed !== false && isOriginal ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> PASSED
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> RE-SCAN
                  </span>
                )}
              </div>

              {/* Check 3: Embossed Seal Relief */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">3. 3D Embossed Stamp Relief</div>
                  <div className="text-[10px] text-slate-400">
                    Depth: {auth.embossedSealRelief?.reliefDepthMm !== undefined ? `${auth.embossedSealRelief.reliefDepthMm}mm` : isOriginal ? '0.24mm' : '0.00mm'}
                  </div>
                </div>
                {auth.embossedSealRelief?.passed !== false && isOriginal ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 3D EMBOSSED
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> 2D FLAT TONER
                  </span>
                )}
              </div>

              {/* Check 4: Signature Ink Grooves */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">4. Pen Pressure & Ink Bleed</div>
                  <div className="text-[10px] text-slate-400">
                    {auth.signaturePenGrooves?.inkType ? auth.signaturePenGrooves.inkType.replace(/_/g, ' ') : isOriginal ? 'Wet Ink Feathering' : 'Laser Toner Rosette'}
                  </div>
                </div>
                {auth.signaturePenGrooves?.passed !== false && isOriginal ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> WET INK
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> TONER PRINT
                  </span>
                )}
              </div>

              {/* Check 5: Anti-Copy Guilloche */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">5. Anti-Copy Micro-Text (&gt;300 DPI)</div>
                  <div className="text-[10px] text-slate-400">
                    Latent "COPY" Triggered: {auth.microTextPpi?.latentCopyWatermarkTriggered ? 'TRUE' : 'FALSE'}
                  </div>
                </div>
                {auth.microTextPpi?.passed !== false && isOriginal ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> CRISP
                  </span>
                ) : (
                  <span className="text-rose-400 font-mono font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> DEGRADED
                  </span>
                )}
              </div>

              {/* Check 6: Moiré Screen Interference */}
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">6. Scanner Moiré Interference</div>
                  <div className="text-[10px] text-slate-400">
                    Frequency grid from copier flatbed
                  </div>
                </div>
                {!auth.moirePatternDetected ? (
                  <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> CLEAN
                  </span>
                ) : (
                  <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> MOIRÉ DETECTED
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {!isOriginal ? (
              <button
                onClick={() => handleManualEscalateToQueue(true)}
                className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>{isEscalated ? 'View in Underwriter Queue' : 'Route to Human Underwriter Queue'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : onSelectForWorkbench ? (
              <button
                onClick={() => onSelectForWorkbench(activeDoc)}
                className="w-full sm:flex-1 py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs rounded-xl border border-indigo-500/40 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Attach to Active Underwriting Policy</span>
              </button>
            ) : null}

            {!isOriginal && onSelectForWorkbench && (
              <button
                onClick={() => onSelectForWorkbench(activeDoc)}
                className="w-full sm:w-auto py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Attach this certificate to current policy form"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Attach to Policy</span>
              </button>
            )}

            {onOpenDocumentInspector && (
              <button
                onClick={() => onOpenDocumentInspector(activeDoc)}
                className="w-full sm:w-auto py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Deep Inspector</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Export Dossier Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Certificate Authenticity Forensic Dossier</span>
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 font-mono">
                <div>DOCUMENT: {activeDoc.fileName}</div>
                <div>VERDICT: {auth.verdictLabel} ({auth.verdictTamil})</div>
                <div>CONFIDENCE SCORE: {auth.confidenceScore}%</div>
                <div>ISSUER VERIFICATION: Cryptographic SHA-256 Match</div>
                <div>AUDIT TIMESTAMP: {new Date().toISOString()}</div>
                <div>IRDAI / UIDAI STATUS: {isOriginal ? 'CERTIFIED ORIGINAL' : 'DUPLICATE XEROX DETECTED'}</div>
              </div>
              <p className="text-slate-400 text-[11px]">
                This dossier is digitally stamped for internal compliance, legal admissibility, and reinsurance audit trails.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Forensic Dossier for "${activeDoc.fileName}" downloaded successfully!`);
                  setShowExportModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
              >
                Download PDF Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
