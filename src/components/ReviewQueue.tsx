import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Sliders,
  AlertOctagon,
  Bot,
  Layers,
  ChevronRight,
  ShieldCheck,
  FileText,
  UserCheck,
  Scan,
  Smartphone,
} from 'lucide-react';
import { UnderwriterQueueItem, DocumentScan } from '../types/underwriting';
import { FraudForensicsBadge } from './FraudForensicsBadge';

interface ReviewQueueProps {
  queue: UnderwriterQueueItem[];
  onOpenAuditModal: (item: UnderwriterQueueItem) => void;
  onOpenCopilot: (item: UnderwriterQueueItem) => void;
  onClearResolved: () => void;
  onInspectDocument: (doc: DocumentScan) => void;
  onQuickDecision?: (itemId: string, action: 'approved' | 'rejected') => void;
  selectedCaseId?: string;
  onSelectCaseId?: (id: string) => void;
  onNavigateToCertificateScanner?: (doc: DocumentScan) => void;
}

export const ReviewQueue: React.FC<ReviewQueueProps> = ({
  queue,
  onOpenAuditModal,
  onOpenCopilot,
  onClearResolved,
  onInspectDocument,
  onQuickDecision,
  selectedCaseId: propSelectedCaseId,
  onSelectCaseId,
  onNavigateToCertificateScanner,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [filterFakeOnly, setFilterFakeOnly] = useState<boolean>(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    propSelectedCaseId || queue[0]?.id || ''
  );

  useEffect(() => {
    if (propSelectedCaseId) {
      setSelectedCaseId(propSelectedCaseId);
    }
  }, [propSelectedCaseId]);

  const handleSelectCase = (id: string) => {
    setSelectedCaseId(id);
    if (onSelectCaseId) {
      onSelectCaseId(id);
    }
  };

  const isFakeCertificateItem = (item: UnderwriterQueueItem) => {
    const docBatch = item.applicant.documents || [item.applicant.document];
    return (
      docBatch.some(
        (d) =>
          d.authenticity?.verdict === 'FORGED_TAMPERED' ||
          d.authenticity?.verdict === 'DUPLICATE_PHOTOCOPY' ||
          d.tamperRisk === 'tampered' ||
          d.tamperProofVerification === 'FAILED'
      ) ||
      item.flagReason.toLowerCase().includes('fake') ||
      item.flagReason.toLowerCase().includes('forged') ||
      item.flagReason.toLowerCase().includes('certificate') ||
      item.flagReason.toLowerCase().includes('xerox') ||
      item.flagReason.toLowerCase().includes('duplicate') ||
      item.flagReason.toLowerCase().includes('tamper')
    );
  };

  const fakeCertCount = queue.filter(isFakeCertificateItem).length;

  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.flagReason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLine = selectedLine === 'all' || item.applicant.line === selectedLine;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesFakeOnly = !filterFakeOnly || isFakeCertificateItem(item);
    return matchesSearch && matchesLine && matchesStatus && matchesFakeOnly;
  });

  const pendingCount = queue.filter((q) => q.status === 'pending').length;
  const resolvedCount = queue.filter(
    (q) => q.status === 'approved' || q.status === 'rejected'
  ).length;

  const activeCase =
    queue.find((q) => q.id === selectedCaseId) || filteredQueue[0] || queue[0];

  return (
    <div className="space-y-5">
      {/* Top Banner & Queue Statistics */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Human-in-the-Loop (HITL) Actuary Console
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Applications exceeding risk thresholds (Risk Score &gt; 65), flagged with low OCR confidence, or containing forensic tampering anomalies requiring actuary oversight.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 font-mono">
              {pendingCount} Pending Review
            </div>
            {resolvedCount > 0 && (
              <button
                onClick={onClearResolved}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Clear Resolved ({resolvedCount})
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by applicant or flag reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#080d1a] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto">
            <div className="flex items-center gap-1 bg-[#080d1a] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setSelectedLine('all')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedLine === 'all'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Lines
              </button>
              <button
                onClick={() => setSelectedLine('health')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedLine === 'health'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Health
              </button>
              <button
                onClick={() => setSelectedLine('life')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedLine === 'life'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Life
              </button>
              <button
                onClick={() => setSelectedLine('motor')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedLine === 'motor'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Motor
              </button>
              <button
                onClick={() => setSelectedLine('home')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedLine === 'home'
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Home
              </button>
            </div>

            {/* Fake / Duplicate Certificate Quick Filter */}
            <button
              onClick={() => setFilterFakeOnly(!filterFakeOnly)}
              className={`px-3 py-1.5 text-xs rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-bold ${
                filterFakeOnly
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-500/50'
                  : 'text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>Fake / Duplicate Certs ({fakeCertCount})</span>
              <span className="text-[10px] hidden xl:inline font-mono text-rose-300">
                (போலி)
              </span>
            </button>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-[#080d1a] border border-slate-800 text-slate-300 rounded-xl px-2.5 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Audit</option>
              <option value="approved">Approved</option>
              <option value="rejected">Declined</option>
            </select>
          </div>
        </div>

        {/* Master-Detail Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          {/* Left Side: Cases Table (7 Cols) */}
          <div className="lg:col-span-7 overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080d1a] text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3.5 font-semibold">Applicant</th>
                  <th className="py-3 px-3.5 font-semibold">Line</th>
                  <th className="py-3 px-3.5 font-semibold">Risk Score</th>
                  <th className="py-3 px-3.5 font-semibold">Tamper Tag</th>
                  <th className="py-3 px-3.5 font-semibold">Status</th>
                  <th className="py-3 px-3.5 font-semibold text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#080d1a]/50">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                      <p className="text-sm font-medium text-slate-400">
                        No matching cases in the review queue
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((item) => {
                    const isSelected = item.id === activeCase?.id;
                    const docBatch = item.applicant.documents || [item.applicant.document];
                    const primaryDoc =
                      docBatch.find((d) => d.tamperProofVerification === 'FAILED') || docBatch[0];
                    const isFake = isFakeCertificateItem(item);

                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleSelectCase(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-indigo-600/15 border-l-2 border-indigo-500'
                            : 'hover:bg-slate-900/60'
                        }`}
                      >
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-white">
                            {item.applicant.name}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 font-mono">
                            <span>Age {item.applicant.age}</span>
                            <span>·</span>
                            <span>${(item.applicant.coverage / 1000).toFixed(0)}k</span>
                          </div>
                          {isFake && (
                            <span className="mt-1 px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-bold flex items-center gap-1 w-fit">
                              <AlertOctagon className="w-2.5 h-2.5 text-rose-400" />
                              <span>FAKE CERT / போலி சான்றிதழ்</span>
                            </span>
                          )}
                          {(item.flagReason.includes('WhatsApp') || item.applicant.name.includes('WhatsApp')) && (
                            <span className="mt-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold flex items-center gap-1 w-fit">
                              <Smartphone className="w-2.5 h-2.5 text-emerald-400" />
                              <span>WhatsApp Intake (வாட்ஸ்அப்)</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3.5">
                          <span className="font-mono uppercase text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-semibold border border-slate-800">
                            {item.applicant.line}
                          </span>
                        </td>

                        <td className="py-3 px-3.5">
                          <span
                            className={`font-mono font-bold ${
                              item.evaluation.compositeRiskScore > 75
                                ? 'text-rose-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {item.evaluation.compositeRiskScore} / 100
                          </span>
                        </td>

                        <td className="py-3 px-3.5">
                          <FraudForensicsBadge
                            document={primaryDoc}
                            onInspect={() => onInspectDocument(primaryDoc)}
                            compact
                          />
                        </td>

                        <td className="py-3 px-3.5">
                          {item.status === 'pending' && (
                            <span className="text-[10px] font-medium text-amber-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                          {item.status === 'approved' && (
                            <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Approved
                            </span>
                          )}
                          {item.status === 'rejected' && (
                            <span className="text-[10px] font-medium text-rose-400 flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              Declined
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3.5 text-right">
                          <ChevronRight
                            className={`w-4 h-4 ml-auto transition-transform ${
                              isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'
                            }`}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Right Side: Active Case Audit Detail Inspector (5 Cols) */}
          <div className="lg:col-span-5 bg-[#080d1a] border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
            {activeCase ? (
              <>
                <div className="space-y-4">
                  {/* Case Inspector Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-white">
                          {activeCase.applicant.name}
                        </h4>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {activeCase.id}
                        </span>
                        {(activeCase.flagReason.includes('WhatsApp') || activeCase.applicant.name.includes('WhatsApp')) && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-emerald-400" />
                            <span>WhatsApp Intake</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Flag: <strong className="text-rose-400">{activeCase.flagReason}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => onOpenCopilot(activeCase)}
                      className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Copilot</span>
                    </button>
                  </div>

                  {/* Core Metrics Strip */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#0b1120] p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Risk Score</span>
                      <strong className="text-base font-mono text-rose-400">
                        {activeCase.evaluation.compositeRiskScore} / 100
                      </strong>
                    </div>

                    <div className="bg-[#0b1120] p-2.5 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block text-[10px]">Annual Premium</span>
                      <strong className="text-base font-mono text-indigo-400">
                        ${activeCase.evaluation.recommendedPremium.toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  {/* SHAP Factors */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Top Actuarial Risk Drivers
                    </span>
                    {activeCase.evaluation.shapAttributions.slice(0, 2).map((shap, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-[#0b1120] border border-slate-800 text-[11px] flex items-center justify-between"
                      >
                        <span className="text-slate-300 truncate pr-2">{shap.factor}</span>
                        <span
                          className={`font-mono font-bold shrink-0 ${
                            shap.direction === 'positive' ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {shap.impactScore > 0 ? `+${shap.impactScore}` : shap.impactScore} pts
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Multi-Doc Batch Status */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Document Forensics ({activeCase.applicant.documents?.length || 1} Files)
                    </span>
                    <div className="space-y-1">
                      {(activeCase.applicant.documents || [activeCase.applicant.document]).map(
                        (doc) => {
                          const isFakeDoc =
                            doc.authenticity?.verdict !== 'ORIGINAL_GENUINE' ||
                            doc.tamperRisk === 'tampered' ||
                            doc.tamperProofVerification === 'FAILED';
                          return (
                            <div
                              key={doc.id}
                              onClick={() => onInspectDocument(doc)}
                              className={`p-2 rounded-lg border hover:border-slate-700 cursor-pointer flex items-center justify-between text-[11px] transition-colors ${
                                isFakeDoc
                                  ? 'bg-rose-950/20 border-rose-500/30'
                                  : 'bg-[#0b1120] border-slate-800'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate pr-2">
                                <FileText className={`w-3.5 h-3.5 shrink-0 ${isFakeDoc ? 'text-rose-400' : 'text-indigo-400'}`} />
                                <span className="text-slate-300 truncate font-medium">
                                  {doc.categoryLabel}
                                </span>
                              </div>
                              <span
                                className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                  doc.tamperProofVerification === 'FAILED' || doc.authenticity?.verdict === 'FORGED_TAMPERED'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : doc.authenticity?.verdict === 'DUPLICATE_PHOTOCOPY'
                                    ? 'bg-amber-500/20 text-amber-300'
                                    : 'bg-emerald-500/20 text-emerald-300'
                                }`}
                              >
                                {doc.authenticity?.verdict === 'FORGED_TAMPERED'
                                  ? 'FORGED / போலி'
                                  : doc.authenticity?.verdict === 'DUPLICATE_PHOTOCOPY'
                                  ? 'DUPLICATE / நகல்'
                                  : doc.tamperProofVerification}
                              </span>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Dedicated AI Certificate Scanner Quick-Inspection Link */}
                  {isFakeCertificateItem(activeCase) && (
                    <div className="p-3 bg-gradient-to-r from-rose-950/40 via-red-950/20 to-slate-900 border border-rose-500/40 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300 flex items-center gap-1.5 font-mono text-[11px] uppercase">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          <span>AI Certificate Authenticity Escalation</span>
                        </span>
                        <span className="text-[9px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-bold">
                          போலி சான்றிதழ்
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Neural microscopic scan intercepted physical/digital authenticity anomalies. Case enqueued for human underwriter sign-off.
                      </p>
                      {onNavigateToCertificateScanner && (
                        <button
                          onClick={() => {
                            const docBatch = activeCase.applicant.documents || [activeCase.applicant.document];
                            const suspiciousDoc =
                              docBatch.find(
                                (d) =>
                                  d.authenticity?.verdict !== 'ORIGINAL_GENUINE' ||
                                  d.tamperRisk === 'tampered'
                              ) || docBatch[0];
                            onNavigateToCertificateScanner(suspiciousDoc);
                          }}
                          className="w-full py-2 px-3 bg-indigo-600/25 hover:bg-indigo-600/35 text-indigo-200 border border-indigo-500/40 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Scan className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Open in 100x AI Certificate Scanner (அசல் vs நகல்)</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Audit Action CTAs */}
                <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onOpenAuditModal(activeCase)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    Deep Audit Modal
                  </button>

                  {activeCase.status === 'pending' && onQuickDecision && (
                    <>
                      <button
                        onClick={() => onQuickDecision(activeCase.id, 'approved')}
                        className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                        title="Quick Approve"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onQuickDecision(activeCase.id, 'rejected')}
                        className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer"
                        title="Quick Reject"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                Select a case from the queue to audit details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
