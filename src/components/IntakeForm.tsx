import React, { useState } from 'react';
import {
  Heart,
  Shield,
  Car,
  Home,
  FileText,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Scale,
  Upload,
  Info,
} from 'lucide-react';
import { ApplicantData, InsuranceLine, DocumentScan } from '../types/underwriting';
import { SAMPLE_DOCUMENTS, SAMPLE_PRESETS } from '../services/sampleData';
import { BatchUploadSection } from './BatchUploadSection';

interface IntakeFormProps {
  currentApplicant: ApplicantData;
  onChangeApplicant: (data: ApplicantData) => void;
  onSubmitEvaluation: () => void;
  isEvaluating: boolean;
  onOpenDocumentModal: (doc: DocumentScan) => void;
  onOpenWhatIfSimulator: () => void;
  onOpenFairAiAudit: () => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({
  currentApplicant,
  onChangeApplicant,
  onSubmitEvaluation,
  isEvaluating,
  onOpenDocumentModal,
  onOpenWhatIfSimulator,
  onOpenFairAiAudit,
}) => {
  const handleLineChange = (line: InsuranceLine) => {
    let doc = SAMPLE_DOCUMENTS.doctor_medical_certificate;
    let docs = [
      SAMPLE_DOCUMENTS.aadhaar_card_kyc,
      SAMPLE_DOCUMENTS.pan_card_kyc,
      SAMPLE_DOCUMENTS.form16_income_tax,
      SAMPLE_DOCUMENTS.doctor_medical_certificate,
    ].filter(Boolean);

    if (line === 'life') {
      doc = SAMPLE_DOCUMENTS.education_degree_certificate_original;
      docs = [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.form16_income_tax,
        SAMPLE_DOCUMENTS.education_degree_certificate_original,
      ].filter(Boolean);
    } else if (line === 'motor') {
      doc = SAMPLE_DOCUMENTS.rc_book_vehicle;
      docs = [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.rc_book_vehicle,
        SAMPLE_DOCUMENTS.puc_certificate_motor,
        SAMPLE_DOCUMENTS.ncb_certificate_motor,
      ].filter(Boolean);
    } else if (line === 'home') {
      doc = SAMPLE_DOCUMENTS.property_tax_receipt;
      docs = [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.property_tax_receipt,
        SAMPLE_DOCUMENTS.building_valuation_cert,
      ].filter(Boolean);
    }

    onChangeApplicant({
      ...currentApplicant,
      line,
      document: doc,
      documents: docs,
      bmi: line === 'health' ? 24.2 : undefined,
      smoker: line === 'health' ? 'no' : undefined,
      healthCondition: line === 'health' ? 'none' : undefined,
      exerciseFrequency: line === 'health' ? 'active' : undefined,
      termYears: line === 'life' ? 20 : undefined,
      hobbies: line === 'life' ? 'none' : undefined,
      annualIncome: line === 'life' ? 95000 : undefined,
      vehicleAge: line === 'motor' ? 3 : undefined,
      telematicsScore: line === 'motor' ? 84 : undefined,
      previousClaims: line === 'motor' ? 0 : undefined,
      vehicleType: line === 'motor' ? 'sedan' : undefined,
      propertyValue: line === 'home' ? 450000 : undefined,
      floodRisk: line === 'home' ? 'low' : undefined,
      securitySystem: line === 'home' ? 'advanced' : undefined,
      constructionYear: line === 'home' ? 2018 : undefined,
    });
  };

  const handleInputChange = (field: keyof ApplicantData, value: any) => {
    onChangeApplicant({
      ...currentApplicant,
      [field]: value,
    });
  };

  const handleUpdateDocuments = (newDocs: DocumentScan[]) => {
    onChangeApplicant({
      ...currentApplicant,
      documents: newDocs,
      document: newDocs[0] || currentApplicant.document,
    });
  };

  return (
    <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header Strip */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <span>Actuarial Intake Dossier</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure applicant risk vectors and batch multi-source verification streams
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>OCR Pipeline Ready</span>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitEvaluation();
        }}
        className="space-y-5"
      >
        {/* Line Selector Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Insurance Product Line
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleLineChange('health')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                currentApplicant.line === 'health'
                  ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Heart
                  className={`w-4 h-4 ${
                    currentApplicant.line === 'health' ? 'text-indigo-400' : 'text-slate-500'
                  }`}
                />
                {currentApplicant.line === 'health' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold block">Health Care</span>
                <span className="text-[10px] text-slate-500">Morbidity & Labs</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLineChange('life')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                currentApplicant.line === 'life'
                  ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Shield
                  className={`w-4 h-4 ${
                    currentApplicant.line === 'life' ? 'text-indigo-400' : 'text-slate-500'
                  }`}
                />
                {currentApplicant.line === 'life' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold block">Life Insurance</span>
                <span className="text-[10px] text-slate-500">Mortality & Term</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLineChange('motor')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                currentApplicant.line === 'motor'
                  ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Car
                  className={`w-4 h-4 ${
                    currentApplicant.line === 'motor' ? 'text-indigo-400' : 'text-slate-500'
                  }`}
                />
                {currentApplicant.line === 'motor' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold block">Motor / Auto</span>
                <span className="text-[10px] text-slate-500">Telematics & Crash</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleLineChange('home')}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                currentApplicant.line === 'home'
                  ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm ring-1 ring-indigo-500/30'
                  : 'border-slate-800/80 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <Home
                  className={`w-4 h-4 ${
                    currentApplicant.line === 'home' ? 'text-indigo-400' : 'text-slate-500'
                  }`}
                />
                {currentApplicant.line === 'home' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold block">Property & Home</span>
                <span className="text-[10px] text-slate-500">Flood & Hazard</span>
              </div>
            </button>
          </div>
        </div>

        {/* Universal Core Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Insured Name
            </label>
            <input
              type="text"
              required
              value={currentApplicant.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Priya Sharma"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Applicant Age (Years)
            </label>
            <input
              type="number"
              min="18"
              max="90"
              required
              value={currentApplicant.age}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 18)}
              className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Requested Coverage Limit ($)
            </label>
            <input
              type="number"
              step="5000"
              min="10000"
              required
              value={currentApplicant.coverage}
              onChange={(e) => handleInputChange('coverage', parseInt(e.target.value) || 10000)}
              className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Credit Bureau Score
              </label>
              <span className="text-[10px] font-mono text-slate-400">
                {currentApplicant.creditScore >= 750
                  ? 'Prime Tier (-12 Risk)'
                  : currentApplicant.creditScore >= 670
                  ? 'Standard Tier'
                  : 'Subprime (+22 Risk)'}
              </span>
            </div>
            <input
              type="number"
              min="300"
              max="850"
              required
              value={currentApplicant.creditScore}
              onChange={(e) =>
                handleInputChange('creditScore', parseInt(e.target.value) || 300)
              }
              className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Fields Section */}
        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              {currentApplicant.line.toUpperCase()} Parameters
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Actuarial Matrix Active
            </span>
          </div>

          {currentApplicant.line === 'health' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Body Mass Index (BMI)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="15"
                    max="55"
                    value={currentApplicant.bmi ?? 24.2}
                    onChange={(e) => handleInputChange('bmi', parseFloat(e.target.value) || 20)}
                    className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Tobacco / Smoker
                  </label>
                  <select
                    value={currentApplicant.smoker ?? 'no'}
                    onChange={(e) => handleInputChange('smoker', e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="no">Non-Smoker (Standard)</option>
                    <option value="yes">Smoker / Tobacco Active</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Clinical History
                  </label>
                  <select
                    value={currentApplicant.healthCondition ?? 'none'}
                    onChange={(e) => handleInputChange('healthCondition', e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="none">None (Clean Health Profile)</option>
                    <option value="hypertension">Mild Hypertension</option>
                    <option value="diabetes">Type-2 Diabetes</option>
                    <option value="cardiac">Cardiac / Arrhythmia History</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Physical Exercise
                  </label>
                  <select
                    value={currentApplicant.exerciseFrequency ?? 'active'}
                    onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="active">Active (3+ times/wk)</option>
                    <option value="moderate">Moderate (1-2 times/wk)</option>
                    <option value="sedentary">Sedentary (No regular workout)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentApplicant.line === 'life' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Policy Term (Years)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="40"
                    value={currentApplicant.termYears ?? 20}
                    onChange={(e) => handleInputChange('termYears', parseInt(e.target.value) || 20)}
                    className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Hazardous Avocations
                  </label>
                  <select
                    value={currentApplicant.hobbies ?? 'none'}
                    onChange={(e) => handleInputChange('hobbies', e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="none">None (Standard Lifestyle)</option>
                    <option value="aviation">Private Aviation / Pilot</option>
                    <option value="racing">Motor Racing / Track</option>
                    <option value="climbing">High Altitude Mountaineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Verified Annual Earned Income ($)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={currentApplicant.annualIncome ?? 95000}
                  onChange={(e) =>
                    handleInputChange('annualIncome', parseInt(e.target.value) || 50000)
                  }
                  className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {currentApplicant.line === 'motor' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Vehicle Age (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={currentApplicant.vehicleAge ?? 3}
                    onChange={(e) => handleInputChange('vehicleAge', parseInt(e.target.value) || 0)}
                    className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Telematics Score (0-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={currentApplicant.telematicsScore ?? 85}
                    onChange={(e) =>
                      handleInputChange('telematicsScore', parseInt(e.target.value) || 50)
                    }
                    className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Prior At-Fault Claims (36 Mo.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={currentApplicant.previousClaims ?? 0}
                    onChange={(e) =>
                      handleInputChange('previousClaims', parseInt(e.target.value) || 0)
                    }
                    className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Vehicle Class
                  </label>
                  <select
                    value={currentApplicant.vehicleType ?? 'sedan'}
                    onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="sedan">Standard Sedan</option>
                    <option value="suv">Family SUV / Crossover</option>
                    <option value="electric">Electric Vehicle (EV)</option>
                    <option value="sports">High-Performance Sports Car</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentApplicant.line === 'home' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Property Replacement ($)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={currentApplicant.propertyValue ?? 450000}
                    onChange={(e) =>
                      handleInputChange('propertyValue', parseInt(e.target.value) || 200000)
                    }
                    className="w-full font-mono bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    FEMA Flood Hazard Zone
                  </label>
                  <select
                    value={currentApplicant.floodRisk ?? 'low'}
                    onChange={(e) => handleInputChange('floodRisk', e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low Risk Zone (Zone X Unshaded)</option>
                    <option value="moderate">Moderate Zone (500-Year Surge)</option>
                    <option value="high">High Risk Floodplain (Zone AE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Mitigation & Loss Prevention
                </label>
                <select
                  value={currentApplicant.securitySystem ?? 'advanced'}
                  onChange={(e) => handleInputChange('securitySystem', e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="advanced">Central Alarm + Smart Water Shutoff</option>
                  <option value="basic">Standard Local Smoke Detectors</option>
                  <option value="none">None / Unmonitored Property</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Feature 1: Multi-Document Batch Upload & OCR Splitting */}
        <BatchUploadSection
          documents={
            currentApplicant.documents && currentApplicant.documents.length > 0
              ? currentApplicant.documents
              : [currentApplicant.document]
          }
          onUpdateDocuments={handleUpdateDocuments}
          onInspectDocument={onOpenDocumentModal}
          line={currentApplicant.line}
        />

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isEvaluating}
          className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isEvaluating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Cross-Referencing Batch Docs & Computing SHAP Model...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Execute Actuarial Underwriting Engine</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
