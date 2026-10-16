import { ArchitecturePillar, MicroserviceEndpoint } from '../types/underwriting';

export const ARCHITECTURE_PILLARS: ArchitecturePillar[] = [
  {
    id: 'hitl_safeguards',
    title: '1. 🔍 OCR & Document Extraction Accuracy Limits → Automated Confidence Thresholding & HITL Fallback',
    advantage: 'Zero-Error Human-in-the-Loop Safeguard',
    tamilAdvantage: 'பூஜ்ஜியப் பிழை மனித அண்டர்ரைட்டர் பாதுகாப்பு (Zero-Error HITL Safeguard)',
    explanation:
      'Low-quality photo uploads or handwritten notes process panradhukkaga, automated confidence scoring system irukku. Extraction accuracy 85%-kkum keele ponaal, system silent errors-ai thadukka Human-in-the-Loop (HITL) Queue-ukku auto-route pannum.',
    tamilExplanation:
      'குறைந்த தரம் கொண்ட புகைப்படங்கள் அல்லது கையெழுத்துக் குறிப்புகளைப் பிழையின்றிச் செயலாக்க, தானியங்கி நம்பிக்கைக் குறியீடு (Confidence Score) செயல்படுகிறது. துல்லியம் 85%-க்குக் குறைவாக இருந்தால், சிஸ்டம் பிழைகளைத் தடுக்க Human-in-the-Loop (HITL) வரிசைக்குத் தானாக அனுப்பிவிடும்.',
    statusBadge: '85% Threshold + Zero-Error HITL Active',
    kpis: [
      { label: 'Confidence Threshold', value: '85.0', unit: '%' },
      { label: 'Silent Error Prevention', value: '100', unit: '%' },
      { label: 'HITL Escalation Speed', value: '< 0.8', unit: 's' },
      { label: 'Dual Pipeline Routing', value: 'STP vs HITL' },
    ],
  },
  {
    id: 'horizontal_scale',
    title: '2. ⚡ Heavy Processing Latency → Asynchronous Parallel Processing Engine',
    advantage: 'Low-Latency & Responsive User Experience',
    tamilAdvantage: 'அதிவேக இணையான பின்னணிச் செயலாக்கம் (FastAPI Async Chunking)',
    explanation:
      'Heavy multi-page medical PDFs or high-res images-ai process panna, FastAPI background workers moolam asynchronous chunking technology use pannugirom. End-user UI-i freeze pannaamal parallel processing nadakkum.',
    tamilExplanation:
      'அதிக பக்கங்களைக் கொண்ட மருத்துவக் கோப்புகள் மற்றும் உயர் தெளிவுத்திறன் கொண்ட படங்களைச் செயலாக்க, FastAPI background workers மூலம் asynchronous chunking தொழில்நுட்பத்தைப் பயன்படுத்துகிறோம். இதனால் பயனரின் UI முடங்காமல் பின்னணியில் அதிவேக இணையான செயலாக்கம் நடக்கும்.',
    statusBadge: 'FastAPI Workers + Zero UI Freeze',
    kpis: [
      { label: 'UI Thread Latency', value: '0', unit: 'ms (Non-blocking)' },
      { label: 'Async Chunking Speed', value: '1.4s', unit: 'per 20 pages' },
      { label: 'Peak Ingestion Capacity', value: '4,200', unit: 'req/sec' },
      { label: 'Parallel Worker Range', value: '8 to 48 Workers' },
    ],
  },
  {
    id: 'zero_trust_pii',
    title: '3. 🛡️ Data Privacy & Compliance Risks → Zero-Trust Enterprise PII Redaction',
    advantage: 'Automated Regulatory Compliance (GDPR, HIPAA, IRDAI)',
    tamilAdvantage: 'தானியங்கி ஒழுங்குமுறை இணக்கம் (GDPR, HIPAA, IRDAI Compliance)',
    explanation:
      'Sensitive personal data (Aadhaar, health/bank records) system-ukku ullara vandhadhum, in-line PII redaction and AES-256 encryption nadakkum. Core underwriting models-ukku Data poivadharukku munbe confidential information automatically scrub panna padum.',
    tamilExplanation:
      'ஆதார், மருத்துவ மற்றும் வங்கி ஆவணங்கள் சிஸ்டத்திற்குள் வந்தவுடனே, இன்-லைன் PII மறைப்பு மற்றும் AES-256 குறியாக்கம் நடக்கும். முக்கிய அண்டர்ரைட்டிங் மாடல்களுக்குத் தரவு போவதற்கு முன்பே ரகசியத் தகவல்கள் தானாகவே நீக்கப்படும் (Zero-Retention Compliance).',
    statusBadge: 'Zero-Trust AES-256 PII Vault',
    kpis: [
      { label: 'In-line Masking Latency', value: '< 14', unit: 'ms' },
      { label: 'Raw PII Storage', value: '0 bytes (Zero-Retention)' },
      { label: 'Cryptographic Tokenization', value: 'AES-256 / SHA-256' },
      { label: 'Regulatory Adherence', value: 'GDPR · IRDAI · HIPAA' },
    ],
  },
  {
    id: 'microservices',
    title: '4. 🤖 Multi-Line Edge Case Risks → Modular Domain-Specific Actuarial Microservices',
    advantage: 'Unified Dashboard with Vertical-Specific Accuracy',
    tamilAdvantage: 'ஒரே முகப்பில் 4 தனித்துவமான ஆக்சுவரியல் விதி இயந்திரங்கள்',
    explanation:
      'Health, Life, Motor, and Home ஆகிய 4 verticals-ukum single unified UI irundhalum, backend-il specialized actuarial rule-engines irukkum. Adhanaal individual domain-specific risk scoring 100% accurate-aaga compute pannapadu-giradhu.',
    tamilExplanation:
      'Health, Life, Motor, மற்றும் Home ஆகிய 4 காப்பீட்டுப் பிரிவுகளுக்கும் ஒரே பொதுவான முகப்பு இருந்தாலும், பின்புலத்தில் பிரத்யேக ஆக்சுவரியல் விதி இயந்திரங்கள் (Rule-Engines) இயங்குகின்றன. இதனால் ஒவ்வொரு பிரிவுக்கான இடர் மதிப்பீடும் 100% துல்லியமாகக் கணக்கிடப்படுகிறது.',
    statusBadge: '4 Dedicated Actuarial Engines',
    kpis: [
      { label: 'Vertical Rule Engines', value: '4 Services (Health/Motor/Home/Life)' },
      { label: 'Domain Risk Precision', value: '100', unit: '%' },
      { label: 'Mean Endpoint Latency', value: '128', unit: 'ms' },
      { label: 'Core Rule Isolation', value: 'Decoupled REST' },
    ],
  },
];

export const MICROSERVICE_ENDPOINTS: MicroserviceEndpoint[] = [
  {
    id: 'ep-01',
    method: 'POST',
    path: '/api/v1/underwrite/evaluate',
    service: 'Actuarial Risk Core',
    status: 'healthy',
    latencyMs: 128,
    description: 'Calculates actuarial risk score (0-100), SHAP feature attribution, and STP routing tier.',
    sampleRequest: {
      applicantId: 'app-001',
      line: 'health',
      coverage: 250000,
      creditScore: 740,
      bmi: 23.4,
      smoker: 'no',
    },
    sampleResponse: {
      compositeRiskScore: 19,
      decision: 'straight_through',
      recommendedPremium: 2850,
      confidence: 98.7,
      shapAttributions: [
        { factor: 'Optimal BMI Range', impactScore: -8 },
        { factor: 'Prime Credit Bureau Score', impactScore: -12 },
      ],
    },
  },
  {
    id: 'ep-02',
    method: 'POST',
    path: '/api/v1/ocr/batch-split',
    service: 'Medical OCR Neural',
    status: 'healthy',
    latencyMs: 310,
    description: 'Accepts multi-document batch, categorizes files, extracts OCR text, and applies AES-256 PII redaction.',
    sampleRequest: {
      files: ['drivers_license.pdf', 'chase_statement.pdf', 'metabolic_panel.pdf'],
      redactionLevel: 'HIPAA_SAFE_HARBOR',
    },
    sampleResponse: {
      batchProcessed: 3,
      classifiedTypes: ['government_id', 'bank_statement', 'medical_report'],
      piiEntitiesMasked: 18,
      tamperCheckPassed: true,
    },
  },
  {
    id: 'ep-03',
    method: 'GET',
    path: '/api/v1/bureau/experian/{ssn_hash}',
    service: 'Bureau Experian Connector',
    status: 'healthy',
    latencyMs: 95,
    description: 'Queries credit bureau API with encrypted hash to pull delinquency records and bureau grade.',
    sampleRequest: {
      ssnToken: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    sampleResponse: {
      bureauScore: 740,
      tier: 'Prime Tier',
      delinquencies36Mo: 0,
      inquiries12Mo: 1,
    },
  },
  {
    id: 'ep-04',
    method: 'POST',
    path: '/api/v1/geospatial/flood-hazard',
    service: 'Google Maps Geospatial',
    status: 'healthy',
    latencyMs: 145,
    description: 'Queries FEMA NFHL and Google Maps Elevation APIs to compute 100-yr flood surge vulnerability.',
    sampleRequest: {
      coordinates: { lat: 30.2541, lng: -97.7562 },
      address: 'Austin, TX 78704',
    },
    sampleResponse: {
      femaZone: 'Zone X (Minimal Flood Hazard)',
      elevationFt: 512,
      baseFloodElevationFt: 485,
      surgeRiskPoints: -10,
    },
  },
  {
    id: 'ep-05',
    method: 'POST',
    path: '/api/v1/fraud/forensic-check',
    service: 'Forensic Tamper Engine',
    status: 'healthy',
    latencyMs: 180,
    description: 'Performs Error Level Analysis (ELA), font kerning scan, and PDF metadata editor tag analysis.',
    sampleRequest: {
      documentHash: 'SHA256:9a7f2e104b',
      checkExifMetadata: true,
      elaCompressionThreshold: 50,
    },
    sampleResponse: {
      tamperProofVerification: 'PASSED',
      elaScore: 3.2,
      softwareProducer: 'Quest Diagnostics LIMS v22.1',
      suspiciousSplicesDetected: 0,
    },
  },
];

export interface ThirdPartyConnector {
  id: string;
  name: string;
  provider: string;
  category: string;
  endpoint: string;
  status: 'connected' | 'mocked';
  latency: number;
  description: string;
  teluguNote: string;
}

export const THIRD_PARTY_CONNECTORS: ThirdPartyConnector[] = [
  {
    id: 'experian',
    name: 'Experian Bureau Credit Scoring API',
    provider: 'Experian Decision Analytics',
    category: 'Financial Risk & Bureau',
    endpoint: 'https://api.experian.com/v2/credit/score',
    status: 'connected',
    latency: 88,
    description: 'Pulls delinquency records, credit grade, and active debt inquiries without hard credit impact.',
    teluguNote: 'Experian credit bureau API live ga plug-and-play ayi undi. Main code change lekunda scores fetch chestundi.',
  },
  {
    id: 'google_maps',
    name: 'Google Maps Geospatial Hazard & Elevation API',
    provider: 'Google Maps Platform',
    category: 'Geospatial Hazard',
    endpoint: 'https://maps.googleapis.com/maps/api/elevation/json',
    status: 'connected',
    latency: 114,
    description: 'Calculates 100-year flood zone datum, coastal storm surge, and wildfire perimeter proximity.',
    teluguNote: 'Google Maps and FEMA elevation data ni plug-and-play dwara connect chesi flood risk evaluate chestundi.',
  },
  {
    id: 'medical_ocr',
    name: 'Neural Clinical OCR & Lab Analyzer API',
    provider: 'AWS Textract / Cloud Vision Neural',
    category: 'Document Intelligence',
    endpoint: 'https://api.medical-ocr.internal/v1/extract',
    status: 'connected',
    latency: 184,
    description: 'Parses unstructured clinical PDFs, blood lipid biomarkers, and ECG telemetry.',
    teluguNote: 'Medical OCR microservice medical records nunchi biomarker data ni extract chesi risk core ki feed chestundi.',
  },
  {
    id: 'parivahan_vahan',
    name: 'MoRTH Parivahan VAHAN 4.0 Vehicle API',
    provider: 'National Informatics Centre (Govt of India)',
    category: 'Motor Registry',
    endpoint: 'https://parivahan.gov.in/vahan/api/v4/rc-status',
    status: 'connected',
    latency: 92,
    description: 'Instant vehicle RC verification, chassis cryptographic checksum, and PUCC emission validity.',
    teluguNote: 'Parivahan live portal tho direct ga RC book details mariyu validity verify chestundi.',
  },
  {
    id: 'uidai_aadhaar',
    name: 'UIDAI e-KYC & Cryptographic Signature Gateway',
    provider: 'UIDAI National Identity',
    category: 'Identity Proof',
    endpoint: 'https://auth.uidai.gov.in/kyc/2.5',
    status: 'connected',
    latency: 76,
    description: 'Instant demographic KYC verification with SHA-256 digital signature match and zero raw PII retention.',
    teluguNote: 'Aadhaar e-KYC cryptographic verification dwara identity authenticate chestundi.',
  },
  {
    id: 'traces_form16',
    name: 'Income Tax TRACES Form 16 / 26AS Connector',
    provider: 'Income Tax Department (CBDT)',
    category: 'Income Verification',
    endpoint: 'https://traces.incometax.gov.in/api/v2/tds-validate',
    status: 'connected',
    latency: 105,
    description: 'Reconciles salary slips, employer TDS deposits, and gross annual income directly with tax records.',
    teluguNote: 'Form 16 income proof ni central tax database tho cross-verify chesi income authenticity confirm chestundi.',
  },
];
