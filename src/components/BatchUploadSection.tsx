import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  Plus,
  Layers,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { DocumentScan } from '../types/underwriting';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';

interface BatchUploadSectionProps {
  documents: DocumentScan[];
  onUpdateDocuments: (docs: DocumentScan[]) => void;
  onInspectDocument: (doc: DocumentScan) => void;
  line?: string;
}

export const BatchUploadSection: React.FC<BatchUploadSectionProps> = ({
  documents = [],
  onUpdateDocuments,
  onInspectDocument,
  line = 'health',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const safeDocs = Array.isArray(documents)
    ? documents.filter((d): d is DocumentScan => Boolean(d && d.id))
    : [];
  const fallbackDoc =
    SAMPLE_DOCUMENTS.doctor_medical_certificate || SAMPLE_DOCUMENTS.aadhaar_card_kyc;
  const [activeTabId, setActiveTabId] = useState<string>(safeDocs[0]?.id || fallbackDoc.id);

  const handleSimulateBatchUpload = (
    presetBatchType: 'all_clean' | 'include_duplicate' | 'include_fraud' | 'include_education'
  ) => {
    let cleanBatch: DocumentScan[] = [];

    if (line === 'motor') {
      cleanBatch = [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.rc_book_vehicle,
        SAMPLE_DOCUMENTS.puc_certificate_motor,
        SAMPLE_DOCUMENTS.ncb_certificate_motor,
      ].filter((d): d is DocumentScan => Boolean(d && d.id));
    } else if (line === 'home') {
      cleanBatch = [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.property_tax_receipt,
        SAMPLE_DOCUMENTS.building_valuation_cert,
      ].filter((d): d is DocumentScan => Boolean(d && d.id));
    } else if (line === 'life') {
      cleanBatch = [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.form16_income_tax,
        SAMPLE_DOCUMENTS.education_degree_certificate_original,
      ].filter((d): d is DocumentScan => Boolean(d && d.id));
    } else {
      // Health
      cleanBatch = [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.form16_income_tax,
        SAMPLE_DOCUMENTS.doctor_medical_certificate,
      ].filter((d): d is DocumentScan => Boolean(d && d.id));
    }

    if (presetBatchType === 'all_clean') {
      onUpdateDocuments(cleanBatch);
      if (cleanBatch[0]?.id) setActiveTabId(cleanBatch[0].id);
    } else if (presetBatchType === 'include_duplicate') {
      const duplicateBatch = [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.education_degree_certificate_duplicate,
        SAMPLE_DOCUMENTS.duplicate_photocopy_aadhaar,
        cleanBatch[2] || SAMPLE_DOCUMENTS.form16_income_tax,
      ].filter((d): d is DocumentScan => Boolean(d && d.id));
      onUpdateDocuments(duplicateBatch);
      if (SAMPLE_DOCUMENTS.education_degree_certificate_duplicate?.id) {
        setActiveTabId(SAMPLE_DOCUMENTS.education_degree_certificate_duplicate.id);
      } else if (duplicateBatch[0]?.id) {
        setActiveTabId(duplicateBatch[0].id);
      }
    } else if (presetBatchType === 'include_education') {
      const eduBatch = [
        SAMPLE_DOCUMENTS.education_degree_certificate_original,
        SAMPLE_DOCUMENTS.education_marksheet_tampered,
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.form16_income_tax,
      ].filter((d): d is DocumentScan => Boolean(d && d.id));
      onUpdateDocuments(eduBatch);
      if (SAMPLE_DOCUMENTS.education_degree_certificate_original?.id) {
        setActiveTabId(SAMPLE_DOCUMENTS.education_degree_certificate_original.id);
      } else if (eduBatch[0]?.id) {
        setActiveTabId(eduBatch[0].id);
      }
    } else {
      const tamperedBatch = [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.health_tampered,
        cleanBatch[3] || SAMPLE_DOCUMENTS.form16_income_tax,
      ].filter((d): d is DocumentScan => Boolean(d && d.id));
      onUpdateDocuments(tamperedBatch);
      if (SAMPLE_DOCUMENTS.health_tampered?.id) {
        setActiveTabId(SAMPLE_DOCUMENTS.health_tampered.id);
      } else if (tamperedBatch[0]?.id) {
        setActiveTabId(tamperedBatch[0].id);
      }
    }
  };

  const handleRemoveDoc = (id: string) => {
    if (safeDocs.length <= 1) return; // Keep at least one
    const updated = safeDocs.filter((d) => d && d.id !== id);
    onUpdateDocuments(updated);
    if (activeTabId === id) {
      setActiveTabId(updated[0]?.id || '');
    }
  };

  const activeDoc = safeDocs.find((d) => Boolean(d && d.id === activeTabId)) || safeDocs[0] || fallbackDoc;

  return (
    <div className="space-y-3 pt-2 border-t border-slate-800/80">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-400" />
          Multi-Document Batch Intake & OCR Splitting ({safeDocs.length} Files)
        </label>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleSimulateBatchUpload('all_clean')}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium cursor-pointer"
          >
            4 Clean Originals (அசல்)
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => handleSimulateBatchUpload('include_education')}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium cursor-pointer"
          >
            Edu Certificates (கல்வி)
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => handleSimulateBatchUpload('include_duplicate')}
            className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors font-medium cursor-pointer"
          >
            Duplicate Xerox (நகல்)
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => handleSimulateBatchUpload('include_fraud')}
            className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors font-medium cursor-pointer"
          >
            Tampered (போலி)
          </button>
        </div>
      </div>

      {/* Drag & Drop Multi-File Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleSimulateBatchUpload('all_clean');
        }}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
        }`}
        onClick={() => handleSimulateBatchUpload('all_clean')}
      >
        <UploadCloud className="w-6 h-6 text-indigo-400 mx-auto mb-1.5" />
        <div className="text-xs font-medium text-slate-300">
          Drop ID, Bank Statement, Medical Lab & Tax Receipt simultaneously
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          AI will automatically split, categorize, redact PII, and run tamper checks on each file
        </p>
      </div>

      {/* Document Pills / Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {safeDocs.map((doc) => {
          if (!doc) return null;
          const isSelected = doc.id === activeDoc?.id;
          const isTampered = doc.tamperProofVerification === 'FAILED';

          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => setActiveTabId(doc.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? isTampered
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                    : 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{doc.categoryLabel}</span>
              {isTampered ? (
                <ShieldAlert className="w-3 h-3 text-rose-400" />
              ) : (
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Document Splitting Preview Card */}
      {activeDoc && (
        <div
          className={`p-3.5 rounded-xl border bg-slate-950/70 space-y-3 ${
            activeDoc.tamperProofVerification === 'FAILED'
              ? 'border-rose-500/50 bg-rose-950/15'
              : 'border-slate-800'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  activeDoc.tamperProofVerification === 'FAILED'
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-indigo-500/10 text-indigo-400'
                }`}
              >
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{activeDoc.fileName}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {activeDoc.categoryLabel}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{activeDoc.fileSize}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-mono">
                    OCR: {activeDoc.ocrConfidence}%
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-400">
                    {activeDoc.piiRedactedCount} PII Redacted (AES)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onInspectDocument(activeDoc)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-700/80 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Examine</span>
              </button>
              {documents.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveDoc(activeDoc.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors"
                  title="Remove from batch"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Extracted Text Snippet */}
          <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800/80 text-[11px] font-mono text-slate-300 leading-relaxed max-h-24 overflow-y-auto">
            {activeDoc.redactedPreview}
          </div>

          {/* Tamper & Authenticity Verification Stamp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400">AI Certificate Check:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded border text-[10px] ${
                  activeDoc.authenticity?.verdict === 'ORIGINAL_GENUINE'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : activeDoc.authenticity?.verdict === 'DUPLICATE_PHOTOCOPY'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                }`}
              >
                {activeDoc.authenticity?.verdictLabel || activeDoc.tamperProofVerification} (
                {activeDoc.authenticity?.verdictTamil || (activeDoc.tamperProofVerification === 'PASSED' ? 'அசல்' : 'போலி')})
              </span>
            </div>

            <button
              type="button"
              onClick={() => onInspectDocument(activeDoc)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Original vs Duplicate Forensics →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
