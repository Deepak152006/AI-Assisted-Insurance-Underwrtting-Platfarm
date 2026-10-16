/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { IntakeForm } from './components/IntakeForm';
import { EvaluationResult } from './components/EvaluationResult';
import { ReviewQueue } from './components/ReviewQueue';
import { PortfolioAnalytics } from './components/PortfolioAnalytics';
import { ComplianceView } from './components/ComplianceView';
import { ArchitectureView } from './components/ArchitectureView';
import { DocumentInspectorModal } from './components/DocumentInspectorModal';
import { AuditModal } from './components/AuditModal';
import { PolicyCertificateModal } from './components/PolicyCertificateModal';
import { AiCopilotDrawer } from './components/AiCopilotDrawer';
import { FairAiComplianceModal } from './components/FairAiComplianceModal';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { CertificateScannerView } from './components/CertificateScannerView';
import { FraudForensicsView } from './components/FraudForensicsView';
import { WhatsAppIntakeView } from './components/WhatsAppIntakeView';
import { CrossLineBundlingView } from './components/CrossLineBundlingView';
import { AppTabType } from './components/Header';
import {
  ApplicantData,
  EvaluationResult as IEvaluationResult,
  DocumentScan,
  UnderwriterQueueItem,
  PortfolioKPIs,
} from './types/underwriting';
import {
  SAMPLE_PRESETS,
  SAMPLE_DOCUMENTS,
  INITIAL_QUEUE,
  INITIAL_PORTFOLIO_KPIS,
  INITIAL_COMPLIANCE_AUDIT,
} from './services/sampleData';
import { evaluateApplicant } from './services/underwritingEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabType>('intake');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SAMPLE_PRESETS[0].id);
  const [currentApplicant, setCurrentApplicant] = useState<ApplicantData>(
    SAMPLE_PRESETS[0].data
  );
  const [evaluationResult, setEvaluationResult] = useState<IEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // HITL Queue State
  const [queue, setQueue] = useState<UnderwriterQueueItem[]>(INITIAL_QUEUE);
  const [portfolioKpis, setPortfolioKpis] = useState<PortfolioKPIs>(INITIAL_PORTFOLIO_KPIS);
  const [selectedQueueCaseId, setSelectedQueueCaseId] = useState<string>('');

  // Modals & Drawers
  const [inspectedDoc, setInspectedDoc] = useState<DocumentScan | null>(null);
  const [auditItem, setAuditItem] = useState<UnderwriterQueueItem | null>(null);
  const [copilotItem, setCopilotItem] = useState<UnderwriterQueueItem | null>(null);
  const [certificateEvaluation, setCertificateEvaluation] = useState<IEvaluationResult | null>(null);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState<boolean>(false);
  const [isFairAiOpen, setIsFairAiOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleRouteCertificateToUnderwriter = (
    doc: DocumentScan,
    flagReason?: string,
    autoNavigate: boolean = false
  ) => {
    const existing = queue.find(
      (item) =>
        item.applicant.document.id === doc.id ||
        item.applicant.documents?.some((d) => d.id === doc.id)
    );

    let caseId = '';
    if (existing) {
      caseId = existing.id;
    } else {
      caseId = `rev-cert-${Date.now().toString().slice(-4)}`;
      const line =
        doc.docCategory === 'driving_record'
          ? 'motor'
          : doc.docCategory === 'medical_report'
          ? 'health'
          : doc.docCategory === 'property_tax'
          ? 'home'
          : 'life';

      const applicantForCert: ApplicantData = {
        id: `app-${Date.now().toString().slice(-4)}`,
        name: doc.extractedText.includes('PRIYA') ? 'Priya Sharma' : 'Applicant (Certificate Scan)',
        age: 34,
        coverage: line === 'motor' ? 65000 : line === 'home' ? 500000 : line === 'health' ? 250000 : 750000,
        creditScore: 690,
        line,
        document: doc,
        documents: [doc, SAMPLE_DOCUMENTS.aadhaar_card_kyc, SAMPLE_DOCUMENTS.pan_card_kyc],
      };

      const evalResult = evaluateApplicant(applicantForCert);
      const isTampered = doc.authenticity?.verdict === 'FORGED_TAMPERED';
      const reason =
        flagReason ||
        (isTampered
          ? `AI Certificate Scanner Alert: FORGED / TAMPERED (${doc.categoryLabel}) - ELA Quantization Splice (போலி சான்றிதழ்)`
          : `AI Certificate Scanner Alert: DUPLICATE / PHOTOCOPY XEROX (${doc.categoryLabel}) - Flat Toner Print (நகல் சான்றிதழ்)`);

      const newQueueItem: UnderwriterQueueItem = {
        id: caseId,
        applicant: applicantForCert,
        evaluation: {
          ...evalResult,
          decision: 'human_review',
          decisionLabel: isTampered
            ? 'FRAUD ALERT: FAKE / TAMPERED CERTIFICATE (ROUTED TO HUMAN UNDERWRITER)'
            : 'ALERT: DUPLICATE XEROX CERTIFICATE (ROUTED TO HUMAN UNDERWRITER)',
        },
        flagReason: reason,
        timestamp: 'Just now',
        status: 'pending',
      };

      setQueue((prev) => [newQueueItem, ...prev]);
    }

    showToast(
      `🚨 Fake Certificate Escalation: ${doc.fileName} routed to Human Underwriter Queue! (மனித அண்டர்ரைட்டர் ஆய்வுக்கு அனுப்பப்பட்டது)`
    );

    if (autoNavigate) {
      setSelectedQueueCaseId(caseId);
      setActiveTab('queue');
    }
  };

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const result = evaluateApplicant(currentApplicant);
      setEvaluationResult(result);
      setIsEvaluating(false);

      if (result.decision === 'straight_through') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#6366f1', '#38bdf8'],
        });
        showToast(`Policy for ${currentApplicant.name} Auto-Approved (Straight-Through STP in 1.2s)!`);
      } else if (result.decision === 'conditional_loading') {
        showToast(
          `Conditional Approval: Policy rate loaded by +${result.loadingPercentage}% for ${currentApplicant.name}`
        );
      } else {
        const flag =
          result.shapAttributions.find((s) => s.direction === 'positive')?.factor ||
          'Composite Risk Exceeds Retention Guidelines';

        const newQueueItem: UnderwriterQueueItem = {
          id: `rev-${Date.now().toString().slice(-4)}`,
          applicant: currentApplicant,
          evaluation: result,
          flagReason: flag,
          timestamp: 'Just now',
          status: 'pending',
        };

        setQueue((prev) => [newQueueItem, ...prev]);
        showToast(
          `Dual-Pipeline Fail-Safe: Case routed to Human Underwriter Queue (${flag})`
        );
      }
    }, 400);
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCurrentApplicant({ ...preset.data });
      setEvaluationResult(null);
      showToast(`Loaded ${preset.name} into workbench.`);
    }
  };

  const handleAuditDecision = (
    itemId: string,
    action: 'approved' | 'rejected' | 'needs_info',
    notes: string,
    adjustedPremium?: number
  ) => {
    setQueue((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            status: action === 'needs_info' ? 'needs_info' : action,
            auditorNotes: notes,
            auditedAt: new Date().toLocaleTimeString(),
            auditedBy: 'Senior Actuary (Underwriter)',
            overridePremium: adjustedPremium,
          };
        }
        return item;
      })
    );

    setAuditItem(null);

    if (action === 'approved') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#6366f1'],
      });
      showToast('Case manually approved by underwriter. Ledger status updated.');
    } else if (action === 'rejected') {
      showToast('Case formally rejected. Adverse underwriting notice issued.');
    } else {
      showToast('Notification sent to applicant requesting additional verification.');
    }
  };

  const handleQuickDecision = (itemId: string, action: 'approved' | 'rejected') => {
    handleAuditDecision(
      itemId,
      action,
      `Quick decision recorded by underwriter during triage.`
    );
  };

  const handleClearResolved = () => {
    setQueue((prev) => prev.filter((item) => item.status === 'pending'));
    showToast('Resolved cases archived from queue.');
  };

  const handleResetDemo = () => {
    setCurrentApplicant(SAMPLE_PRESETS[0].data);
    setSelectedPresetId(SAMPLE_PRESETS[0].id);
    setEvaluationResult(null);
    setQueue(INITIAL_QUEUE);
    setPortfolioKpis(INITIAL_PORTFOLIO_KPIS);
    setCopilotItem(null);
    setAuditItem(null);
    showToast('Demo reset to initial state.');
  };

  const handleApplySimulated = (updatedApplicant: ApplicantData) => {
    setCurrentApplicant(updatedApplicant);
    const newEval = evaluateApplicant(updatedApplicant);
    setEvaluationResult(newEval);
    showToast('Simulated parameters applied to active underwriting intake.');
  };

  const handleToggleCopilot = () => {
    if (copilotItem) {
      setCopilotItem(null);
    } else {
      if (evaluationResult) {
        setCopilotItem({
          id: evaluationResult.id,
          applicant: currentApplicant,
          evaluation: evaluationResult,
          flagReason: evaluationResult.decisionLabel,
          timestamp: 'Live Session',
          status: 'pending',
        });
      } else if (queue.length > 0) {
        setCopilotItem(queue[0]);
      }
    }
  };

  const pendingCount = queue.filter((q) => q.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        pendingQueueCount={pendingCount}
        onResetDemo={handleResetDemo}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
        onOpenFairAi={() => setIsFairAiOpen(true)}
        onToggleCopilot={handleToggleCopilot}
        isCopilotOpen={!!copilotItem}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b1120] border border-slate-700 text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span>{toast}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white ml-2 text-sm font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Tab 1: Intake & Risk Evaluation Wizard */}
        {activeTab === 'intake' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <IntakeForm
                currentApplicant={currentApplicant}
                onChangeApplicant={(data) => setCurrentApplicant(data)}
                onSubmitEvaluation={handleRunEvaluation}
                isEvaluating={isEvaluating}
                onOpenDocumentModal={(doc) => setInspectedDoc(doc)}
                onOpenWhatIfSimulator={() => setIsWhatIfOpen(true)}
                onOpenFairAiAudit={() => setIsFairAiOpen(true)}
              />
            </div>

            <div className="lg:col-span-7">
              <EvaluationResult
                result={evaluationResult}
                onOpenCertificate={(res) => setCertificateEvaluation(res)}
                onOpenDocumentModal={(doc) => setInspectedDoc(doc)}
                onNavigateToQueue={() => setActiveTab('queue')}
                onOpenWhatIfSimulator={() => setIsWhatIfOpen(true)}
                onOpenFairAiAudit={() => setIsFairAiOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Tab: Dedicated AI Certificate Authenticity & Original vs Duplicate Engine */}
        {activeTab === 'certificate-scanner' && (
          <CertificateScannerView
            onSelectForWorkbench={(doc) => {
              setCurrentApplicant((prev) => ({
                ...prev,
                document: doc,
                documents: [doc, ...prev.documents.filter((d) => d.id !== doc.id)],
              }));
              setActiveTab('intake');
              showToast(`Attached ${doc.fileName} to active policy intake.`);
            }}
            onOpenDocumentInspector={(doc) => setInspectedDoc(doc)}
            onRouteToHumanUnderwriter={handleRouteCertificateToUnderwriter}
            escalatedDocIds={queue.map((q) => q.applicant?.document?.id).filter((id): id is string => Boolean(id))}
            pendingQueueCount={pendingCount}
          />
        )}

        {/* Tab: Automated Fraud Forensics & Metadata Analysis (EXIF, Font Kerning, Photoshop) */}
        {activeTab === 'fraud-forensics' && (
          <FraudForensicsView
            onOpenDocumentInspector={(doc) => setInspectedDoc(doc)}
            onRouteToHumanUnderwriter={handleRouteCertificateToUnderwriter}
          />
        )}

        {/* Tab: WhatsApp / Multi-Channel Conversational Intake */}
        {activeTab === 'whatsapp' && (
          <WhatsAppIntakeView
            onRouteToHumanUnderwriter={handleRouteCertificateToUnderwriter}
            onOpenDocumentInspector={(doc) => setInspectedDoc(doc)}
            onLoadIntoWorkbench={(applicantData) => {
              setCurrentApplicant(applicantData);
              setActiveTab('intake');
              showToast(`Imported ${applicantData.name} into Actuarial Workbench.`);
            }}
          />
        )}

        {/* Tab: Cross-Line Portfolio Risk Bundling */}
        {activeTab === 'bundling' && (
          <CrossLineBundlingView
            onLoadIntoWorkbench={(applicantData) => {
              setCurrentApplicant(applicantData);
              setActiveTab('intake');
              showToast(`Loaded ${applicantData.name} into Actuarial Workbench.`);
            }}
          />
        )}

        {/* Tab 2: Human Underwriter Review Queue */}
        {activeTab === 'queue' && (
          <ReviewQueue
            queue={queue}
            onOpenAuditModal={(item) => setAuditItem(item)}
            onOpenCopilot={(item) => setCopilotItem(item)}
            onClearResolved={handleClearResolved}
            onInspectDocument={(doc) => setInspectedDoc(doc)}
            onQuickDecision={handleQuickDecision}
            selectedCaseId={selectedQueueCaseId}
            onSelectCaseId={(id) => setSelectedQueueCaseId(id)}
            onNavigateToCertificateScanner={(doc) => {
              setActiveTab('certificate-scanner');
              showToast(`Opened ${doc.fileName} in AI Certificate Authenticity Scanner.`);
            }}
          />
        )}

        {/* Tab 3: Dedicated Full-View Fair AI & Compliance */}
        {activeTab === 'compliance' && (
          <ComplianceView
            audit={evaluationResult?.complianceAudit || INITIAL_COMPLIANCE_AUDIT}
          />
        )}

        {/* Tab 4: Enterprise Architecture & Microservices Console */}
        {activeTab === 'architecture' && <ArchitectureView />}

        {/* Tab 5: Portfolio Analytics */}
        {activeTab === 'portfolio' && <PortfolioAnalytics kpis={portfolioKpis} />}
      </main>

      {/* Modals & Drawers */}

      {/* Forensics & Document Inspector Modal */}
      {inspectedDoc && (
        <DocumentInspectorModal
          document={inspectedDoc}
          onClose={() => setInspectedDoc(null)}
        />
      )}

      {/* Deep Case Audit Modal */}
      {auditItem && (
        <AuditModal
          item={auditItem}
          onClose={() => setAuditItem(null)}
          onAuditDecision={handleAuditDecision}
          onOpenDocumentModal={(doc) => setInspectedDoc(doc)}
          onOpenCopilot={(item) => setCopilotItem(item)}
        />
      )}

      {/* AI Underwriter Copilot Drawer */}
      <AiCopilotDrawer
        item={copilotItem}
        isOpen={!!copilotItem}
        onClose={() => setCopilotItem(null)}
      />

      {/* Fair AI & Bias Auditing Modal */}
      {isFairAiOpen && (
        <FairAiComplianceModal
          audit={evaluationResult?.complianceAudit || INITIAL_COMPLIANCE_AUDIT}
          onClose={() => setIsFairAiOpen(false)}
        />
      )}

      {/* Interactive What-If Premium Simulator Modal */}
      {isWhatIfOpen && (
        <WhatIfSimulatorModal
          currentApplicant={currentApplicant}
          currentEvaluation={evaluationResult}
          onClose={() => setIsWhatIfOpen(false)}
          onApplySimulated={handleApplySimulated}
        />
      )}

      {/* Certificate Modal */}
      {certificateEvaluation && (
        <PolicyCertificateModal
          evaluation={certificateEvaluation}
          onClose={() => setCertificateEvaluation(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-[#070b14] py-6 text-xs text-slate-500">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            UnderwriteAI™ Enterprise · Autonomous Multi-Line Risk, OCR & Decision Architecture
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveTab('architecture')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
            >
              REST/FastAPI Microservices
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('compliance')}
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors cursor-pointer"
            >
              Zero-Trust PII & Fair AI (98.6%)
            </button>
            <span aria-hidden="true">·</span>
            <span>Kubernetes HPA Scalable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
