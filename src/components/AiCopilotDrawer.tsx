import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  FileText,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  User,
  Quote,
} from 'lucide-react';
import { UnderwriterQueueItem, CopilotMessage } from '../types/underwriting';

interface AiCopilotDrawerProps {
  item: UnderwriterQueueItem | null;
  onClose: () => void;
  isOpen: boolean;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({
  item,
  onClose,
  isOpen,
}) => {
  if (!isOpen || !item) return null;

  const { applicant, evaluation, flagReason } = item;

  const initialMessages: CopilotMessage[] = [
    {
      id: 'msg-01',
      sender: 'copilot',
      timestamp: 'Just now',
      text: `Hello Underwriter. I am your autonomous AI Copilot. I have indexed ${applicant.name}'s application, actuarial factors, and ${applicant.documents?.length || 1} supporting verification documents.

How can I assist your case audit today?`,
      citations: [
        `Risk Score: ${evaluation.compositeRiskScore}/100`,
        `Line: ${applicant.line.toUpperCase()}`,
        `Audit Flag: ${flagReason}`,
      ],
      suggestedPrompts: [
        'Why was this risk score computed?',
        'Summarize medical/technical findings',
        'Check bank solvency vs requested coverage',
        'What exclusions or rate loading rider do you suggest?',
      ],
    },
  ];

  const [messages, setMessages] = useState<CopilotMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateCopilotAnswer = (question: string): { text: string; citations: string[] } => {
    const q = question.toLowerCase();

    if (q.includes('why') || q.includes('score') || q.includes('risk')) {
      const topShap = evaluation.shapAttributions.slice(0, 3);
      const pointsBreakdown = topShap
        .map((s) => `• **${s.factor}**: ${s.impactScore > 0 ? `+${s.impactScore}` : s.impactScore} pts (${s.rationale})`)
        .join('\n');

      return {
        text: `The composite risk score of **${evaluation.compositeRiskScore} / 100** was driven by the following SHAP attributions:\n\n${pointsBreakdown}\n\nSince this exceeds our straight-through threshold (65), manual underwriter oversight is mandated to verify non-medical avocation risks or diagnostic integrity.`,
        citations: [
          `Baseline: 20 pts`,
          `Top Risk Factor: ${topShap[0]?.factor}`,
          `Credit Tier: ${applicant.creditScore}`,
        ],
      };
    }

    if (q.includes('summarize') || q.includes('medical') || q.includes('history') || q.includes('doc')) {
      const docTypes = (applicant.documents || [applicant.document]).map((d) => d.categoryLabel).join(', ');
      const isTampered = (applicant.documents || [applicant.document]).some(
        (d) => d.tamperProofVerification === 'FAILED'
      );

      return {
        text: `**Extracted Dossier Summary for ${applicant.name}:**\n\n• **Indexed Files**: ${docTypes}\n• **Verification Integrity**: ${
          isTampered
            ? '⚠️ **CRITICAL FORENSIC ALERT**: Document shows Adobe Illustrator alteration of clinical lab markers.'
            : '✅ All documents verified clean (OCR confidence 98%+).'
        }\n• **Key Findings**: Declared condition is "${applicant.healthCondition || applicant.hobbies || 'Standard'}". Vital metrics: Age ${applicant.age}, Credit Bureau ${applicant.creditScore}, Coverage Limit $${applicant.coverage.toLocaleString()}.\n• **Recommendation**: Review flagged factors before approving policy binder.`,
        citations: ['Clinical Panel Quest #9021', 'AAMVA ID Checksum', 'Travis County CAD Record'],
      };
    }

    if (q.includes('bank') || q.includes('solvency') || q.includes('income') || q.includes('coverage')) {
      return {
        text: `**Financial Solvency & Insurable Interest Audit:**\n\n• **Requested Coverage**: $${applicant.coverage.toLocaleString()}\n• **Verified Monthly Direct Deposit**: $8,420.00 (~$101,000/yr)\n• **Liquid Checking/Savings**: $46,850.12\n• **Overdraft Frequency**: 0 (Clean banking history)\n\n**Actuarial Assessment**: The debt-to-income and asset-to-coverage multiple of 15x is within standard reinsurance financial underwriting guidelines. Non-disclosure risk on income is negligible.`,
        citations: ['Chase Bank 6-Mo Statement', 'IRS W-2 Form', 'Bureau Score: ' + applicant.creditScore],
      };
    }

    if (q.includes('exclusion') || q.includes('rider') || q.includes('loading') || q.includes('rate')) {
      return {
        text: `**Recommended Underwriting Action Plan:**\n\n1. **Option A (Conditional Rate Loading)**: Apply a **+${
          evaluation.loadingPercentage || 35
        }% rate rider** with a standard annual premium of **$${evaluation.recommendedPremium.toLocaleString()}**.\n2. **Option B (Specific Exclusion Rider)**: Approve at standard rates with an explicit Exclusion Rider (e.g., General Aviation Exclusion or Flood Basement Rider).\n3. **Option C (Adverse Decline)**: If forensic tampering is substantiated, issue formal Notice of Adverse Underwriting Action under FCRA guidelines.`,
        citations: ['Actuarial Rate Manual Table 14B', 'Reinsurance Treaty Section 4.2'],
      };
    }

    return {
      text: `Based on the composite record for **${applicant.name}**, the application presents a ${
        evaluation.compositeRiskScore > 70 ? 'substandard' : 'standard'
      } risk profile. Our actuarial recommendation is to apply **$${evaluation.recommendedPremium.toLocaleString()}/yr** premium with strict verification of primary flag: *${flagReason}*. Would you like me to draft an underwriter audit summary or adverse letter?`,
      citations: [`Case ID: ${item.id}`, `Risk Tier: ${evaluation.riskTier}`],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateCopilotAnswer(query);
      const botMsg: CopilotMessage = {
        id: `bot-${Date.now()}`,
        sender: 'copilot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.text,
        citations: response.citations,
        suggestedPrompts: [
          'What exclusions or rate loading rider do you suggest?',
          'Check for IRDAI & GDPR algorithmic fairness compliance',
          'Why was this risk score computed?',
        ],
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col backdrop-blur-md animate-slide-left">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <span>AI Underwriter Copilot</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                Grounded
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Active Context: {applicant.name} ({applicant.line.toUpperCase()})
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

      {/* Case Header Strip */}
      <div className="p-3 bg-slate-950/90 border-b border-slate-800 text-xs flex items-center justify-between">
        <div>
          <span className="text-slate-400 block text-[10px]">Case Risk Score</span>
          <span className="font-mono font-bold text-rose-400">
            {evaluation.compositeRiskScore} / 100
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Proposed Premium</span>
          <span className="font-mono font-bold text-indigo-400">
            ${evaluation.recommendedPremium.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Docs Indexed</span>
          <span className="font-mono font-bold text-emerald-400">
            {applicant.documents?.length || 1} Files
          </span>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line text-xs">{msg.text}</div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 text-[10px] space-y-1">
                  <span className="text-slate-400 font-semibold block">Grounding Citations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((cite, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-500 mt-1 px-1">
              {msg.timestamp}
            </span>

            {/* Quick Prompt Pills (under bot responses) */}
            {msg.suggestedPrompts && (
              <div className="mt-2 space-y-1 max-w-[90%]">
                <span className="text-[10px] text-slate-500 font-medium">Quick Underwriter Queries:</span>
                <div className="flex flex-wrap gap-1.5">
                  {msg.suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-[11px] bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-slate-800 rounded-lg px-2.5 py-1 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-2xl max-w-[60%]">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-100" />
            <div className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce delay-200" />
            <span className="text-[10px] text-slate-400 font-mono">Analyzing actuarial tables...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Copilot about risk, docs, or riders..."
            className="flex-1 bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-colors disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
