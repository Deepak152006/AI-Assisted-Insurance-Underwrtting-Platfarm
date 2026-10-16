import React, { useState, useEffect, useRef } from 'react';
import {
  Smartphone,
  Send,
  Camera,
  Paperclip,
  CheckCheck,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  UserCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  Lock,
  Globe,
  Download,
  Building,
  Activity,
  Car,
  Heart,
  Home,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentScan, UnderwriterQueueItem, WhatsAppMessage } from '../types/underwriting';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';
import { evaluateApplicant } from '../services/underwritingEngine';

interface WhatsAppIntakeViewProps {
  onRouteToHumanUnderwriter: (doc: DocumentScan, flagReason?: string, autoNavigate?: boolean) => void;
  onOpenDocumentInspector: (doc: DocumentScan) => void;
  onLoadIntoWorkbench: (applicantData: any) => void;
}

export const WhatsAppIntakeView: React.FC<WhatsAppIntakeViewProps> = ({
  onRouteToHumanUnderwriter,
  onOpenDocumentInspector,
  onLoadIntoWorkbench,
}) => {
  const [language, setLanguage] = useState<'tamil' | 'english'>('tamil');
  const [activeScenario, setActiveScenario] = useState<'clean_health' | 'tampered_medical' | 'duplicate_rc'>('clean_health');
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [scannedDoc, setScannedDoc] = useState<DocumentScan | null>(null);
  const [isCaseEscalated, setIsCaseEscalated] = useState(false);
  const [policyIssued, setPolicyIssued] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial WhatsApp message thread based on selected scenario and language
  const getInitialMessages = (scen: string, lang: 'tamil' | 'english'): WhatsAppMessage[] => {
    if (lang === 'tamil') {
      if (scen === 'tampered_medical') {
        return [
          {
            id: 'm1',
            sender: 'bot',
            text: 'வணக்கம்! UnderwriteAI WhatsApp இன்சூரன்ஸ் சேவைக்கு வரவேற்கிறோம் 🛡️\n\nஉங்களுக்கு எந்த பாலிசி தேவைப்படுகிறது?',
            time: '10:14 AM',
            quickReplies: ['🏥 மருத்துவக் காப்பீடு (Health)', '🚗 வாகனக் காப்பீடு (Motor)', '🏠 வீட்டுக் காப்பீடு (Home)'],
          },
          {
            id: 'm2',
            sender: 'user',
            text: 'மருத்துவக் காப்பீடு (Health Shield) வேணும். நான் மதுரை-ல இருக்கேன்.',
            time: '10:15 AM',
            status: 'read',
          },
          {
            id: 'm3',
            sender: 'bot',
            text: 'மகிழ்ச்சி! உங்கள் ரத்தப் பரிசோதனை அல்லது மருத்துவ அறிக்கையை (Medical Lab Report) கேமரா மூலம் போட்டோ எடுத்து அனுப்பவும் 📸',
            time: '10:15 AM',
          },
        ];
      } else if (scen === 'duplicate_rc') {
        return [
          {
            id: 'm1',
            sender: 'bot',
            text: 'வணக்கம்! UnderwriteAI மோட்டார் காப்பீட்டு சேவைக்கு நல்வரவு 🚗\n\nஉங்கள் வாகனப் பதிவுச் சான்றிதழை (RC Book Xerox / Original) ஸ்கேன் செய்து அனுப்பவும்.',
            time: '10:14 AM',
          },
          {
            id: 'm2',
            sender: 'user',
            text: 'என் காரின் RC Book ஜெராக்ஸ் காப்பி போட்டோ அனுப்புறேன்.',
            time: '10:15 AM',
            status: 'read',
          },
        ];
      } else {
        return [
          {
            id: 'm1',
            sender: 'bot',
            text: 'வணக்கம்! UnderwriteAI WhatsApp விரைவு இன்சூரன்ஸ் சேவைக்கு நல்வரவு 🌟\n\nஎளிய 2 நிமிடங்களில் ஆவணங்களைச் சரிபார்த்து உடனடி பாலிசி ஒப்புதல் பெறலாம்.\n\nதயவுசெய்து உங்கள் ஆதார் கார்டு அல்லது அடையாள அட்டையை போட்டோ எடுத்து அனுப்பவும் 📸',
            time: '10:14 AM',
            quickReplies: ['ஆதார் கார்டு (Aadhaar)', 'பான் கார்டு (PAN)', 'மருத்துவ அறிக்கை (Medical)'],
          },
          {
            id: 'm2',
            sender: 'user',
            text: 'நான் என் ஆதார் கார்டை அனுப்புறேன்.',
            time: '10:15 AM',
            status: 'read',
          },
        ];
      }
    } else {
      if (scen === 'tampered_medical') {
        return [
          {
            id: 'm1',
            sender: 'bot',
            text: 'Hello! Welcome to UnderwriteAI Instant WhatsApp Insurance 🛡️\n\nWhich policy would you like to apply for today?',
            time: '10:14 AM',
            quickReplies: ['Health Insurance', 'Motor Vehicle', 'Home Shield'],
          },
          {
            id: 'm2',
            sender: 'user',
            text: 'I want Comprehensive Health Insurance. Location: Madurai.',
            time: '10:15 AM',
            status: 'read',
          },
          {
            id: 'm3',
            sender: 'bot',
            text: 'Great! Please snap and send a clear photo of your latest Medical Lab Certificate or Health Report 📸',
            time: '10:15 AM',
          },
        ];
      } else if (scen === 'duplicate_rc') {
        return [
          {
            id: 'm1',
            sender: 'bot',
            text: 'Hello! Welcome to UnderwriteAI Motor Shield 🚗\n\nPlease share your Vehicle RC Book or Certificate for instant rate calculation.',
            time: '10:14 AM',
          },
          {
            id: 'm2',
            sender: 'user',
            text: 'Here is a photo copy of my vehicle registration card.',
            time: '10:15 AM',
            status: 'read',
          },
        ];
      } else {
        return [
          {
            id: 'm1',
            sender: 'bot',
            text: 'Welcome to UnderwriteAI WhatsApp Multi-Channel Intake 🌟\n\nGet instant insurance approval in under 90 seconds without paperwork. Please share a photo of your Aadhaar or KYC ID 📸',
            time: '10:14 AM',
            quickReplies: ['Send Aadhaar eKYC', 'Send Medical Report', 'Send Vehicle RC'],
          },
          {
            id: 'm2',
            sender: 'user',
            text: 'Sending my verified Aadhaar card photo now.',
            time: '10:15 AM',
            status: 'read',
          },
        ];
      }
    }
  };

  const [messages, setMessages] = useState<WhatsAppMessage[]>(
    getInitialMessages(activeScenario, language)
  );

  useEffect(() => {
    setMessages(getInitialMessages(activeScenario, language));
    setScannedDoc(null);
    setIsCaseEscalated(false);
    setPolicyIssued(false);
  }, [activeScenario, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping, isScanningDoc]);

  // Simulate applicant uploading a document photo in WhatsApp
  const handleUploadDocumentPhoto = (docType: 'clean_aadhaar' | 'tampered_medical' | 'duplicate_rc') => {
    let targetDoc: DocumentScan;
    if (docType === 'tampered_medical') {
      targetDoc = SAMPLE_DOCUMENTS.health_tampered;
    } else if (docType === 'duplicate_rc') {
      targetDoc = SAMPLE_DOCUMENTS.rc_book_vehicle_duplicate;
    } else {
      targetDoc = SAMPLE_DOCUMENTS.aadhaar_card_kyc;
    }

    setScannedDoc(targetDoc);

    const userMsg: WhatsAppMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: language === 'tamil' ? '📸 ஆவணப் படம் அனுப்பப்பட்டது:' : '📸 Photo uploaded:',
      time: '10:16 AM',
      hasAttachment: true,
      attachmentType: 'image',
      attachmentDoc: targetDoc,
      attachmentName: targetDoc.fileName,
      status: 'read',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsScanningDoc(true);

    // AI OCR & Forensics scanning simulation
    setTimeout(() => {
      setIsScanningDoc(false);

      const isClean = targetDoc.authenticity?.verdict === 'ORIGINAL_GENUINE';
      const isDuplicate = targetDoc.authenticity?.verdict === 'DUPLICATE_PHOTOCOPY';
      const isTampered = targetDoc.authenticity?.verdict === 'FORGED_TAMPERED' || targetDoc.tamperProofVerification === 'FAILED';

      if (isClean) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });

        const botReply: WhatsAppMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'tamil'
            ? `✅ *ஆவணம் வெற்றிகரமாகச் சரிபார்க்கப்பட்டது (அசல் ஆவணம் - UIDAI QR Verified)!*\n\n📋 *பாலிசி சுருக்கம்:*\n• பெயர்: பிரியா சர்மா (Priya Sharma)\n• கவரேஜ்: ₹5,00,000 Health Shield\n• ஆபத்து மதிப்பீடு: 18/100 (Tier 1 Preferred)\n• மாதத் தவணை: *₹780 / மாதம்*\n\nவாழ்த்துக்கள்! உங்கள் பாலிசி உடனடியாக அங்கீகரிக்கப்பட்டது (Straight-Through STP). UPI மூலம் பிரீமியம் செலுத்தலாம்.`
            : `✅ *Document Verified (100% Original & Cryptographically Signed)!*\n\n📋 *Instant Policy Offer:*\n• Name: Priya Sharma\n• Coverage: $250,000 Comprehensive\n• Risk Score: 18/100 (Tier 1 Preferred)\n• Monthly Rate: *$65 / month*\n\n🎉 Instant STP Auto-Approved! Zero human paperwork needed. Pay via UPI to activate immediately.`,
          time: '10:17 AM',
          hasAttachment: true,
          attachmentType: 'card',
          quickReplies: language === 'tamil'
            ? ['📲 GPay / PhonePe மூலம் செலுத்துக', '📄 பாலிசி நகல் பதிவிறக்கு']
            : ['📲 Pay with UPI / Card', '📄 Download Binder PDF'],
        };
        setMessages((prev) => [...prev, botReply]);
        setPolicyIssued(true);
      } else {
        // Tampered or Duplicate detected! Auto-route to human underwriter!
        setIsCaseEscalated(true);
        const reason = isTampered
          ? (language === 'tamil'
              ? 'போலி ஆவணம் / Photoshop திருத்தம் கண்டறியப்பட்டது (Altered Glucose Lab Record)'
              : 'Photoshop Splicing & Altered Numeric Values Detected in Medical Record')
          : (language === 'tamil'
              ? 'நகல் / ஜெராக்ஸ் ஆவணம் கண்டறியப்பட்டது (Missing 3D Hologram & Optical Seal)'
              : 'Monochrome Photocopy Halftone Detected (Duplicate Xerox Document)');

        onRouteToHumanUnderwriter(targetDoc, `WhatsApp Channel Intake: ${reason}`, false);

        const botReply: WhatsAppMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'tamil'
            ? `⚠️ *கவனத்திற்கு: உங்கள் ஆவணத்தில் கூடுதல் சரிபார்ப்பு தேவைப்படுகிறது.*\n\nஎங்கள் AI ஸ்கேனர் (${isTampered ? 'போலி / திருத்தப்பட்ட ஆவணம்' : 'நகல் / ஜெராக்ஸ் பிரதி'}) என்று அடையாளம் கண்டுள்ளது.\n\n🛡️ *உங்கள் விண்ணப்பம் [Ref #WA-${Date.now().toString().slice(-4)}] மூத்த மனித அண்டர்ரைட்டர் (Senior Human Underwriter) ஆய்வுக்கு அனுப்பப்பட்டுள்ளது.*\n\nநேரடி முடிவு 15 நிமிடங்களில் WhatsApp-ல் உங்களுக்கு அறிவிக்கப்படும்.`
            : `⚠️ *Notice: Additional Verification Required*\n\nOur optical forensic scanner flagged this file as (${isTampered ? 'Altered / Tampered Medical Record' : 'Photocopy / Duplicate Certificate'}).\n\n🛡️ *Your case [Ref #WA-${Date.now().toString().slice(-4)}] has been routed to our Senior Human Underwriter review queue.*\n\nYou will receive a final decision via WhatsApp within 15 minutes.`,
          time: '10:17 AM',
          quickReplies: language === 'tamil'
            ? ['அசல் ஆவணத்தை மீண்டும் ஸ்கேன் செய்', 'அண்டர்ரைட்டருடன் பேசு']
            : ['Rescan Original Document', 'Speak with Underwriter'],
        };
        setMessages((prev) => [...prev, botReply]);
      }
    }, 1800);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMsg: WhatsAppMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsBotTyping(true);

    setTimeout(() => {
      setIsBotTyping(false);
      const botMsg: WhatsAppMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: language === 'tamil'
          ? 'நன்றி! உங்கள் தகவல்கள் பெறப்பட்டன. தயவுசெய்து உங்கள் ஆவணத்தை கேமரா ஐகான் மூலம் இணைத்து அனுப்பவும்.'
          : 'Thank you! Details recorded. Please attach your document via the camera icon below to generate an instant quote.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 900);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-[#062016] to-[#0b1329] border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-400">
                Omnichannel Conversational Underwriting
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                WhatsApp Bot & Vision OCR
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              WhatsApp Conversational Intake & Instant Decisioning
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Enables non-tech users and Tier-2 / Tier-3 city customers to snap documents, receive real-time OCR extraction, and get instant STP policy certificates—with automated fail-safe routing to human underwriters upon detecting fake or duplicate documents.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switcher */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-1 flex items-center gap-1 text-xs">
              <button
                onClick={() => setLanguage('tamil')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  language === 'tamil'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                தமிழ் (Tamil)
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  language === 'english'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Presets Strip */}
      <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">Select Conversational Scenario:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveScenario('clean_health')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeScenario === 'clean_health'
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            1. Genuine Aadhaar KYC → Instant STP (அசல்)
          </button>

          <button
            onClick={() => setActiveScenario('tampered_medical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeScenario === 'tampered_medical'
                ? 'bg-rose-600/20 text-rose-300 border-rose-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            2. Tampered Medical Lab → 99% Fraud Block (போலி)
          </button>

          <button
            onClick={() => setActiveScenario('duplicate_rc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              activeScenario === 'duplicate_rc'
                ? 'bg-amber-600/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            3. Photocopy Xerox RC → Human Review (நகல்)
          </button>
        </div>
      </div>

      {/* Dual Column Layout: Left Phone Mockup, Right Underwriting Bridge Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Simulated WhatsApp Phone (6 Cols) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[420px] bg-[#070b14] border-4 border-slate-800 rounded-[38px] shadow-2xl overflow-hidden flex flex-col h-[700px] relative">
            {/* Phone Top Speaker & Camera Notch */}
            <div className="bg-[#1f2c34] pt-2 pb-1 px-6 flex items-center justify-between text-[11px] text-slate-300 font-mono">
              <span>9:41 AM</span>
              <div className="w-20 h-4 bg-slate-950 rounded-full mx-auto" />
              <div className="flex items-center gap-1 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* WhatsApp App Header */}
            <div className="bg-[#1f2c34] text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-1.5">
                    <span>UnderwriteAI Verified Bot</span>
                    <span className="w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-black">
                      ✓
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    {isBotTyping ? 'typing...' : isScanningDoc ? 'analyzing document OCR...' : 'Online · Official Insurer Assistant'}
                  </div>
                </div>
              </div>

              <div className="text-slate-400 text-xs font-mono">
                WhatsApp API
              </div>
            </div>

            {/* WhatsApp Message Area (Dark WhatsApp Wallpaper Background) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0d1418] relative">
              <div className="text-center my-1">
                <span className="text-[10px] font-mono bg-[#182229] text-slate-400 px-3 py-1 rounded-full shadow-sm">
                  🔒 Messages are end-to-end encrypted & UIDAI compliant
                </span>
              </div>

              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                        isUser
                          ? 'bg-[#005c4b] text-white rounded-tr-none'
                          : 'bg-[#202c33] text-slate-100 rounded-tl-none border border-slate-800'
                      }`}
                    >
                      {/* Document Image Attachment Preview inside WhatsApp */}
                      {m.hasAttachment && m.attachmentType === 'image' && m.attachmentDoc && (
                        <div className="mb-2 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 p-2.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-1">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {m.attachmentDoc.categoryLabel}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {m.attachmentDoc.fileSize}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-300 bg-slate-900 p-2 rounded border border-slate-800 max-h-20 overflow-hidden line-clamp-3">
                            {m.attachmentDoc.redactedPreview}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 font-bold">
                              OCR: {m.attachmentDoc.ocrConfidence}%
                            </span>
                            <button
                              onClick={() => onOpenDocumentInspector(m.attachmentDoc!)}
                              className="text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer"
                            >
                              Inspect Forensics →
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Instant Policy Card Attachment */}
                      {m.hasAttachment && m.attachmentType === 'card' && (
                        <div className="mb-2 p-3 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/40 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                              Instant Policy Certificate
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                              STP APPROVED
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white">
                            UnderwriteAI Health Shield™ 2026
                          </div>
                          <div className="text-[11px] text-slate-300 font-mono">
                            Policy ID: POL-WA-9821 · Sum Insured: ₹5,00,000
                          </div>
                        </div>
                      )}

                      <div className="whitespace-pre-line">{m.text}</div>

                      <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                        <span>{m.time}</span>
                        {isUser && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                      </div>
                    </div>

                    {/* Quick Reply Action Buttons */}
                    {m.quickReplies && m.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {m.quickReplies.map((qr, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (qr.includes('ஆதார்') || qr.includes('Aadhaar')) {
                                handleUploadDocumentPhoto('clean_aadhaar');
                              } else if (qr.includes('மருத்துவ') || qr.includes('Medical')) {
                                handleUploadDocumentPhoto('tampered_medical');
                              } else if (qr.includes('RC') || qr.includes('வாகன')) {
                                handleUploadDocumentPhoto('duplicate_rc');
                              } else {
                                setInputMessage(qr);
                              }
                            }}
                            className="bg-[#202c33] hover:bg-[#2a3942] text-emerald-400 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-sm cursor-pointer transition-colors"
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Live OCR Scanning animation bubble inside WhatsApp */}
              {isScanningDoc && (
                <div className="bg-[#202c33] border border-cyan-500/40 rounded-2xl p-3 text-xs text-cyan-300 max-w-[85%] animate-pulse space-y-1.5">
                  <div className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span>AI Vision OCR & Forensic Neural Pipeline</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Scanning photo for ELA pixel alterations, halftone printer dots, and UIDAI QR cryptographic hash...
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full w-3/4 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Bot typing indicator */}
              {isBotTyping && (
                <div className="bg-[#202c33] text-slate-400 text-xs px-3 py-2 rounded-2xl w-20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Upload Action Bar (Simulate Phone Camera Snapshot) */}
            <div className="bg-[#1f2c34] px-3 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[10px] font-medium">📸 Snap Photo:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUploadDocumentPhoto('clean_aadhaar')}
                  className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded text-[10px] font-bold border border-emerald-500/30 cursor-pointer"
                  title="Upload Clean Original Aadhaar"
                >
                  Clean Aadhaar (அசல்)
                </button>
                <button
                  onClick={() => handleUploadDocumentPhoto('tampered_medical')}
                  className="bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 px-2 py-1 rounded text-[10px] font-bold border border-rose-500/30 cursor-pointer"
                  title="Upload Photoshop Tampered Medical Report"
                >
                  Tampered Medical (போலி)
                </button>
                <button
                  onClick={() => handleUploadDocumentPhoto('duplicate_rc')}
                  className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 px-2 py-1 rounded text-[10px] font-bold border border-amber-500/30 cursor-pointer"
                  title="Upload Duplicate Xerox RC"
                >
                  Xerox RC (நகல்)
                </button>
              </div>
            </div>

            {/* Bottom Input Area */}
            <div className="bg-[#1f2c34] p-2.5 flex items-center gap-2">
              <button
                onClick={() => handleUploadDocumentPhoto('clean_aadhaar')}
                className="text-slate-400 hover:text-emerald-400 p-2 rounded-full cursor-pointer"
                title="Camera snap document"
              >
                <Camera className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={language === 'tamil' ? 'செய்தியைத் தட்டச்சு செய்க...' : 'Type a message...'}
                className="flex-1 bg-[#2a3942] text-white text-xs px-3 py-2 rounded-xl focus:outline-none placeholder-slate-400"
              />

              <button
                onClick={handleSendMessage}
                className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Underwriting Telemetry & Omnichannel Bridge Console (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Real-time Telemetry Card */}
          <div className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Omnichannel Ingestion Bridge Telemetry
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Live ingestion socket for WhatsApp Webhooks, Twilio & Meta Cloud API
                  </p>
                </div>
              </div>

              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                WEBSOCKET LIVE (PORT 8080)
              </span>
            </div>

            {/* KPI Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block">Tier 2/3 Conversion</span>
                <span className="text-lg font-mono font-bold text-emerald-400">+340%</span>
                <span className="text-[10px] text-slate-500 block">vs web forms</span>
              </div>

              <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block">Avg Completion Time</span>
                <span className="text-lg font-mono font-bold text-indigo-400">1.8 mins</span>
                <span className="text-[10px] text-slate-500 block">Fully automated</span>
              </div>

              <div className="bg-[#080d1a] border border-slate-800/80 rounded-xl p-3">
                <span className="text-[10px] text-slate-400 block">Fraud Shield Stop</span>
                <span className="text-lg font-mono font-bold text-rose-400">99.1%</span>
                <span className="text-[10px] text-slate-500 block">Spliced files blocked</span>
              </div>
            </div>

            {/* Ingestion & Extracted OCR Details */}
            {scannedDoc ? (
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  scannedDoc.authenticity?.verdict === 'ORIGINAL_GENUINE'
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : scannedDoc.authenticity?.verdict === 'DUPLICATE_PHOTOCOPY'
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {scannedDoc.authenticity?.verdict === 'ORIGINAL_GENUINE' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-400" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-white">
                        {scannedDoc.fileName} · {scannedDoc.categoryLabel}
                      </div>
                      <div className="text-[11px] font-mono">
                        Status: {scannedDoc.authenticity?.verdictLabel || scannedDoc.tamperProofVerification} (
                        {scannedDoc.authenticity?.verdictTamil || (scannedDoc.tamperProofVerification === 'PASSED' ? 'அசல்' : 'போலி')})
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenDocumentInspector(scannedDoc)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Deep Inspector</span>
                  </button>
                </div>

                {/* Forensics Checklist */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400 block">OCR Confidence:</span>
                    <span className="font-mono font-bold text-white">{scannedDoc.ocrConfidence}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">PII Redacted:</span>
                    <span className="font-mono font-bold text-indigo-400">{scannedDoc.piiRedactedCount} Entities</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Producer Signature:</span>
                    <span className="font-mono text-slate-300 truncate block">
                      {scannedDoc.forensics?.softwareTag || 'UIDAI Secure Service'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ELA Compression Delta:</span>
                    <span className="font-mono font-bold text-white">
                      {scannedDoc.forensics?.elaScore || 2.4}%
                    </span>
                  </div>
                </div>

                {/* Human Underwriter Escalation Notice */}
                {isCaseEscalated && (
                  <div className="p-3 bg-rose-950/60 border border-rose-500/60 rounded-xl space-y-2 text-rose-200">
                    <div className="flex items-center gap-2 font-bold text-xs text-rose-300">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>DUAL-PIPELINE FAIL-SAFE TRIGGERED (மனித அண்டர்ரைட்டர் ஆய்வு)</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      Because this document was identified as a fake or duplicate photocopy, it has been automatically routed to the Human Underwriter Review Queue with all optical forensic markers preserved.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onRouteToHumanUnderwriter(scannedDoc, undefined, true)}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Open in Human Underwriter Queue →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 border border-dashed border-slate-800 rounded-xl text-center space-y-2 bg-slate-950/40">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-xs font-medium text-slate-400">
                  Awaiting document upload from WhatsApp phone simulator
                </div>
                <p className="text-[11px] text-slate-500">
                  Click one of the quick upload buttons inside the phone view to simulate real-time OCR ingestion
                </p>
              </div>
            )}

            {/* Structured JSON Payload Viewer */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 block uppercase font-bold">
                Structured Normalized JSON Stream (FHIR / ACORD Standard):
              </span>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 max-h-40 overflow-y-auto leading-relaxed">
                <pre>
{JSON.stringify(
  {
    channel: 'whatsapp_business_api',
    sender_msisdn: '+91-98402-XXXXX',
    language: language,
    session_id: 'wa_sess_90248',
    applicant: {
      name: 'Priya Sharma',
      locale: 'Madurai, Tamil Nadu',
      requested_line: activeScenario === 'duplicate_rc' ? 'motor' : 'health',
      document_status: scannedDoc
        ? {
            id: scannedDoc.id,
            category: scannedDoc.docCategory,
            authenticity: scannedDoc.authenticity?.verdict,
            tamper_score: scannedDoc.forensics?.elaScore,
            escalated_to_hitl: isCaseEscalated,
          }
        : 'awaiting_media',
    },
    actuarial_verdict: policyIssued ? 'STP_APPROVED' : isCaseEscalated ? 'HITL_REVIEW_PENDING' : 'IN_PROGRESS',
  },
  null,
  2
)}
                </pre>
              </div>
            </div>

            {/* Quick Import to Actuarial Workbench Action */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Want to analyze this applicant in deep actuarial workbench?
              </span>
              <button
                onClick={() => {
                  onLoadIntoWorkbench({
                    name: 'Priya Sharma (WhatsApp)',
                    age: 34,
                    coverage: activeScenario === 'duplicate_rc' ? 65000 : 250000,
                    creditScore: 710,
                    line: activeScenario === 'duplicate_rc' ? 'motor' : 'health',
                    document: scannedDoc || SAMPLE_DOCUMENTS.aadhaar_card_kyc,
                    documents: [
                      scannedDoc || SAMPLE_DOCUMENTS.aadhaar_card_kyc,
                      SAMPLE_DOCUMENTS.pan_card_kyc,
                    ],
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Import to Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
