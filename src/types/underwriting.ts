export type InsuranceLine = 'health' | 'life' | 'motor' | 'home';

export type DecisionType = 'straight_through' | 'conditional_loading' | 'human_review' | 'rejected';

export type DocumentCategory =
  | 'government_id'
  | 'bank_statement'
  | 'medical_report'
  | 'property_tax'
  | 'driving_record'
  | 'certificate_proof';

export interface ForensicDetails {
  softwareTag: string;
  metadataAltered: boolean;
  elaScore: number; // 0-100 (higher means suspicious splice)
  tamperSummary: string;
  suspiciousRegions: Array<{
    label: string;
    originalSuspected: string;
    alteredValue: string;
    confidence: number;
  }>;
}

export interface AuthenticityInspection {
  verdict: 'ORIGINAL_GENUINE' | 'DUPLICATE_PHOTOCOPY' | 'FORGED_TAMPERED';
  verdictLabel: string;
  verdictTamil: string;
  confidenceScore: number; // 0 - 100%
  moirePatternDetected: boolean;
  screenRecaptureDetected: boolean;
  guillocheSecurityPatternValid: boolean;
  qrSignatureMatch: boolean;
  opticalDensityConsistent: boolean;
  detailedFindings: string;
  // Deep 6-Vector Forensic Checks
  hologramRefraction?: {
    status: 'AUTHENTIC_IRIDESCENT' | 'DULL_STATIC_FOIL' | 'ABSENT';
    colorShiftDetected: boolean;
    angularReflectanceScore: number;
    notes: string;
  };
  paperFiberGrain?: {
    textureType: 'NATURAL_COTTON_CELLULOSE' | 'FLATBED_GLASS_GLARE' | 'OLED_PIXEL_MATRIX';
    fiberDepthMm: number;
    passed: boolean;
    notes: string;
  };
  embossedSealRelief?: {
    reliefDepthMm: number; // e.g. 0.22mm for original, 0.00mm for Xerox
    obliqueShadowDetected: boolean;
    passed: boolean;
    notes: string;
  };
  signaturePenGrooves?: {
    inkType: 'BALLPOINT_WET_INK_FEATHERING' | 'LASER_TONER_DOT_MATRIX' | 'DIGITAL_BIT_IMAGE';
    indentGroovesDetected: boolean;
    passed: boolean;
    notes: string;
  };
  microTextPpi?: {
    measuredPpi: number;
    latentCopyWatermarkTriggered: boolean;
    passed: boolean;
    notes: string;
  };
}

export interface DocumentScan {
  id: string;
  fileName: string;
  fileSize: string;
  docType: 'medical_report' | 'driving_record' | 'property_survey' | 'financial_statement';
  docCategory: DocumentCategory;
  categoryLabel: string;
  ocrConfidence: number;
  piiRedactedCount: number;
  tamperRisk: 'clean' | 'suspicious' | 'tampered';
  tamperProofVerification: 'PASSED' | 'FAILED' | 'SUSPICIOUS';
  extractedText: string;
  redactedPreview: string;
  checks: {
    fontConsistency: boolean;
    metadataTimestampMatch: boolean;
    compressionArtifactSplice: boolean;
    identityChecksumMatch: boolean;
  };
  forensics: ForensicDetails;
  authenticity: AuthenticityInspection;
}

export interface ApplicantData {
  id: string;
  name: string;
  age: number;
  coverage: number;
  creditScore: number;
  line: InsuranceLine;
  document: DocumentScan; // primary document
  documents: DocumentScan[]; // batch of documents (ID, Bank Statement, Medical/Inspection, Property Tax)
  // Health specific
  bmi?: number;
  smoker?: 'yes' | 'no';
  healthCondition?: 'none' | 'hypertension' | 'diabetes' | 'cardiac';
  exerciseFrequency?: 'sedentary' | 'moderate' | 'active';
  // Life specific
  termYears?: number;
  hobbies?: 'none' | 'aviation' | 'racing' | 'climbing';
  annualIncome?: number;
  // Motor specific
  vehicleAge?: number;
  telematicsScore?: number;
  previousClaims?: number;
  vehicleType?: 'sedan' | 'suv' | 'sports' | 'electric';
  // Home specific
  propertyValue?: number;
  floodRisk?: 'low' | 'moderate' | 'high';
  securitySystem?: 'advanced' | 'basic' | 'none';
  constructionYear?: number;
}

export interface ShapAttribution {
  factor: string;
  impactScore: number; // e.g. +18 or -10
  direction: 'positive' | 'negative' | 'neutral'; // positive increases risk, negative decreases risk
  rationale: string;
  category: 'clinical' | 'behavioral' | 'financial' | 'geographic' | 'actuarial';
}

export interface ComplianceAudit {
  overallScore: number; // e.g. 98.4
  standards: Array<{
    name: string;
    jurisdiction: string;
    score: number;
    status: 'compliant' | 'warning';
    description: string;
  }>;
  metrics: {
    disparateImpactRatio: number; // 0.80 - 1.25 standard
    demographicParityDiff: number;
    equalOpportunityDiff: number;
    transparencyScore: number;
  };
  protectedAttributesExcluded: string[];
}

export interface MicroserviceEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT';
  path: string;
  service: 'PAS Gateway' | 'Bureau Experian Connector' | 'Google Maps Geospatial' | 'Medical OCR Neural' | 'Actuarial Risk Core' | 'Forensic Tamper Engine';
  status: 'healthy' | 'degraded';
  latencyMs: number;
  description: string;
  sampleRequest: Record<string, any>;
  sampleResponse: Record<string, any>;
}

export interface ArchitecturePillar {
  id: 'hitl_safeguards' | 'horizontal_scale' | 'zero_trust_pii' | 'microservices' | string;
  title: string;
  advantage: string;
  explanation: string;
  tamilAdvantage?: string;
  tamilExplanation?: string;
  teluguAdvantage?: string;
  teluguExplanation?: string;
  statusBadge: string;
  kpis: Array<{ label: string; value: string; unit?: string }>;
}

export interface EvaluationResult {
  id: string;
  applicant: ApplicantData;
  compositeRiskScore: number; // 0-100
  riskTier: 'Tier 1 (Preferred)' | 'Tier 2 (Standard)' | 'Tier 3 (Substandard)' | 'Tier 4 (Decline / Referral)';
  decision: DecisionType;
  decisionLabel: string;
  basePremium: number;
  recommendedPremium: number;
  monthlyPremium: number;
  loadingPercentage: number;
  deductible: number;
  shapAttributions: ShapAttribution[];
  evaluatedAt: string;
  underwritingConfidence: number;
  complianceAudit: ComplianceAudit;
}

export interface UnderwriterQueueItem {
  id: string;
  applicant: ApplicantData;
  evaluation: EvaluationResult;
  flagReason: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_info';
  auditorNotes?: string;
  auditedAt?: string;
  auditedBy?: string;
  overridePremium?: number;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  timestamp: string;
  text: string;
  citations?: string[];
  suggestedPrompts?: string[];
}

export interface PortfolioKPIs {
  totalProcessedYTD: number;
  stpRate: number; // %
  fraudDetectionRate: number; // %
  portfolioLossRatio: number; // %
  totalUnderwrittenPremium: number;
  monthlyVolumes: Array<{
    month: string;
    stp: number;
    manual: number;
    fraud: number;
  }>;
  riskDistribution: {
    low: number; // preferred
    medium: number; // conditional
    high: number; // manual
  };
  linePerformance: Array<{
    line: InsuranceLine;
    label: string;
    activePolicies: number;
    lossRatio: number;
    avgPremium: number;
    trend: string;
  }>;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'bot' | 'user' | 'system';
  text: string;
  time: string;
  hasAttachment?: boolean;
  attachmentType?: 'document' | 'image' | 'voice' | 'card';
  attachmentDoc?: DocumentScan;
  attachmentName?: string;
  quickReplies?: string[];
  status?: 'sent' | 'delivered' | 'read';
}

export interface MultiLineBundleConfig {
  health: boolean;
  motor: boolean;
  home: boolean;
  life: boolean;
  coverageLevels: {
    health: number;
    motor: number;
    home: number;
    life: number;
  };
}

export interface MultiLineBundleQuote {
  selectedLines: InsuranceLine[];
  standaloneSumPremium: number;
  bundledPremium: number;
  discountPercentage: number;
  totalAnnualSavings: number;
  bundleRiskScore: number;
  diversificationBenefitPts: number;
  retentionProbability: number;
  customerLtvProjected: number;
  covarianceSynergies: string[];
}
