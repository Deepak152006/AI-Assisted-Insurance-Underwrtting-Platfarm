import { ApplicantData, DocumentScan, PortfolioKPIs, UnderwriterQueueItem, ComplianceAudit } from '../types/underwriting';

export const SAMPLE_DOCUMENTS: Record<string, DocumentScan> = {
  // 1. Aadhaar Card (KYC, Identity & Address Proof) - ORIGINAL GENUINE
  aadhaar_card_kyc: {
    id: 'doc-aadhaar-01',
    fileName: 'aadhaar_card_uidai_verified.pdf',
    fileSize: '680 KB',
    docType: 'financial_statement',
    docCategory: 'government_id',
    categoryLabel: 'Aadhaar Card (UIDAI eKYC)',
    ocrConfidence: 99.8,
    piiRedactedCount: 6,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `GOVERNMENT OF INDIA - UNIQUE IDENTIFICATION AUTHORITY (UIDAI)
NAME: PRIYA SHARMA / பிரியா சர்மா
DOB: [REDACTED-DOB-1992] (Age: 34 Years Verified)
GENDER: FEMALE
AADHAAR NUMBER: [REDACTED-AADHAAR-8921]
ADDRESS: [REDACTED-ADDRESS], CHENNAI, TAMIL NADU - 600028
QR CODE VERIFICATION: Valid UIDAI Cryptographic Digital Signature Match (SHA-256)`,
    redactedPreview: `AADHAAR eKYC VERIFIED\nNAME: Priya Sharma\nDOB: ██/██/1992 (Age 34 · Age Proof Verified)\nAADHAAR NO: ████-████-8921\nADDRESS: ████ Gandhi Nagar, Chennai TN 600028 (Address Proof Valid)\nSTATUS: UIDAI Biometric & OTP Authenticated`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'UIDAI Secure e-Aadhaar PDF Generation Service v4.2',
      metadataAltered: false,
      elaScore: 1.8,
      tamperSummary: 'Official UIDAI cryptographic certificate verified; secure QR code signature matches national identity registry.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE',
      verdictTamil: 'அசல் ஆவணம் (Original Genuine)',
      confidenceScore: 99.4,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'Prismatic micro-text, UIDAI RSA-2048 QR signature verified. Zero printer rasterization or photocopy moire artifacts.',
    },
  },

  // 1B. DUPLICATE / PHOTOCOPY AADHAAR CARD (நகல் / ஜெராக்ஸ் ஆவணம்)
  duplicate_photocopy_aadhaar: {
    id: 'doc-aadhaar-photocopy',
    fileName: 'aadhaar_card_xerox_photocopy.pdf',
    fileSize: '420 KB',
    docType: 'financial_statement',
    docCategory: 'government_id',
    categoryLabel: 'Aadhaar Card (Xerox Photocopy)',
    ocrConfidence: 91.2,
    piiRedactedCount: 4,
    tamperRisk: 'suspicious',
    tamperProofVerification: 'SUSPICIOUS',
    extractedText: `PHOTOCOPY / SCAN OF AADHAAR CARD
NAME: PRIYA SHARMA / பிரியா சர்மா
DOB: [REDACTED-DOB-1992]
AADHAAR NUMBER: [REDACTED-AADHAAR-8921]
AI SCAN ALERT: Halftone dot diffusion pattern detected. Document was scanned from a monochrome black-and-white photocopy / Xerox machine. Missing original color security fibers.`,
    redactedPreview: `AADHAAR (XEROX PHOTOCOPY DETECTED)\nNAME: Priya Sharma\nDOB: ██/██/1992\nAADHAAR NO: ████-████-8921\n⚠️ AI VERDICT: DUPLICATE / PHOTOCOPY (நகல்)\nScanner detected 120 DPI halftone raster lines. Mandatory original physical document verification required.`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'HP LaserJet Multifunction Copier Scan-to-PDF',
      metadataAltered: false,
      elaScore: 22.4,
      tamperSummary: 'Photocopy Moire pattern identified across background; absence of reflective biometric security seal.',
      suspiciousRegions: [
        {
          label: 'Halftone Rasterization',
          originalSuspected: 'Vector Prismatic Microtext',
          alteredValue: 'Low DPI Xerox Halftone Grid',
          confidence: 94.2,
        },
      ],
    },
    authenticity: {
      verdict: 'DUPLICATE_PHOTOCOPY',
      verdictLabel: 'DUPLICATE / PHOTOCOPY DETECTED',
      verdictTamil: 'நகல் / ஜெராக்ஸ் (Photocopy)',
      confidenceScore: 31.5,
      moirePatternDetected: true,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: false,
      qrSignatureMatch: true,
      opticalDensityConsistent: false,
      detailedFindings: 'Halftone dot diffusion grid and scanner Moire patterns confirm this is a monochrome photocopy (Xerox copy), not the original issued document.',
    },
  },

  // 2. PAN Card (Identity, Tax & Age Proof) - ORIGINAL GENUINE
  pan_card_kyc: {
    id: 'doc-pan-01',
    fileName: 'nsdl_pan_card_verified.pdf',
    fileSize: '540 KB',
    docType: 'financial_statement',
    docCategory: 'government_id',
    categoryLabel: 'PAN Card (NSDL Verified)',
    ocrConfidence: 99.6,
    piiRedactedCount: 4,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `INCOME TAX DEPARTMENT - GOVERNMENT OF INDIA
PERMANENT ACCOUNT NUMBER: [REDACTED-PAN-4910]
NAME: PRIYA SHARMA
FATHER'S NAME: S. RAMANATHAN
DOB: [REDACTED-DOB-1992]
NSDL QR CODE: Valid Digitally Signed Pan Card`,
    redactedPreview: `INCOME TAX PAN CARD\nPAN NO: █████4910█\nNAME: Priya Sharma\nDOB: ██/██/1992 (Birth Date Verified)\nSTATUS: NSDL Active & Tax Compliant`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Protean eGov NSDL Automated PAN Card Generator',
      metadataAltered: false,
      elaScore: 2.1,
      tamperSummary: 'NSDL digital signature matches Central Board of Direct Taxes (CBDT) schema.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE',
      verdictTamil: 'அசல் ஆவணம் (Original Genuine)',
      confidenceScore: 99.1,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'NSDL holographic watermark and security guilloche pattern authenticated against CBDT repository.',
    },
  },

  // 3. Form 16 & Salary Slip (Income Proof) - ORIGINAL GENUINE
  form16_income_tax: {
    id: 'doc-form16-01',
    fileName: 'form_16_part_a_and_b_salary.pdf',
    fileSize: '1.2 MB',
    docType: 'financial_statement',
    docCategory: 'bank_statement',
    categoryLabel: 'Form 16 / Salary Slips (Income Proof)',
    ocrConfidence: 99.1,
    piiRedactedCount: 5,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `FORM NO. 16 - CERTIFICATE UNDER SECTION 203 OF INCOME-TAX ACT, 1961
ASSESSMENT YEAR: 2026-27
EMPLOYER: INFOSYS / APEX DYNAMICS PVT LTD (TAN: [REDACTED])
EMPLOYEE PAN: [REDACTED-PAN-4910]
Gross Salary under section 17(1): ₹14,50,000.00
Tax Deducted at Source (TDS): ₹1,82,400.00
Verified Net Annual Income: ₹12,67,600.00 (~$95,000 USD equivalent)
3-Month Average Inflow: ₹1,05,633/month`,
    redactedPreview: `INCOME TAX FORM 16\nEMPLOYEE: Priya Sharma\nPAN: █████4910█\nGROSS ANNUAL SALARY: ₹14,50,000.00\nTDS DEPOSITED: ₹1,82,400.00 (TRACES Verified)\nINCOME PROOF STATUS: Fully Authenticated`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'TRACES CPC-TDS Official Form 16 PDF Exporter',
      metadataAltered: false,
      elaScore: 3.1,
      tamperSummary: 'Form 16 TRACES digital seal validated; TDS credits reconcile with Income Tax 26AS ledger.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE',
      verdictTamil: 'அசல் ஆவணம் (Original Genuine)',
      confidenceScore: 98.8,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'TRACES CPC digital signature valid; 26AS tax credits reconcile with national banking records.',
    },
  },

  // 4. Doctor Medical Fitness Certificate - ORIGINAL GENUINE
  doctor_medical_certificate: {
    id: 'doc-doctor-cert-01',
    fileName: 'doctor_clinical_fitness_cert.pdf',
    fileSize: '1.5 MB',
    docType: 'medical_report',
    docCategory: 'medical_report',
    categoryLabel: "Doctor's Pre-existing Condition Certificate",
    ocrConfidence: 98.9,
    piiRedactedCount: 5,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `CLINICAL EXAMINATION & PRE-EXISTING MEDICAL FITNESS CERTIFICATE
CONSULTANT: Dr. K. Sundaram, MD, DM (Cardiology), Reg No: TN-MC-64821
PATIENT NAME: PRIYA SHARMA | AGE: 34 YRS
Resting BP: 118/76 mmHg | Resting Pulse: 68 bpm regular
Cardiovascular System: S1 S2 heard, no murmurs. EKG: Normal sinus rhythm.
Respiratory System: Clear, normal vesicular breath sounds.
Metabolic Screening: Fasting Blood Sugar 92 mg/dL, HbA1c 5.2% (Normal).
Previous Illnesses: No history of asthma, diabetes, or ischemic cardiac events.
PHYSICIAN RECOMMENDATION: Clinically fit for comprehensive health and surgical coverage.`,
    redactedPreview: `DOCTOR FITNESS CERTIFICATE\nCLINICIAN: Dr. K. Sundaram, MD (Reg: TN-MC-64821)\nPATIENT: Priya Sharma (Age 34)\nCLINICAL STATUS: Zero Pre-existing Morbidity\nBP: 118/76 mmHg · HbA1c: 5.2% [FIT FOR COVER]`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Apollo Hospitals Clinical EMR Document System v18.4',
      metadataAltered: false,
      elaScore: 2.4,
      tamperSummary: 'Medical council registration verified; hospital seal and clinician digital signature authenticated.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE',
      verdictTamil: 'அசல் ஆவணம் (Original Genuine)',
      confidenceScore: 99.2,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'State Medical Council registration TN-MC-64821 confirmed active; verified clinician digital signature.',
    },
  },

  // 5. Tampered Medical Certificate - FORGED / ALTERED (போலி ஆவணம்)
  health_tampered: {
    id: 'doc-med-tampered',
    fileName: 'cardiac_stress_test_altered.pdf',
    fileSize: '2.4 MB',
    docType: 'medical_report',
    docCategory: 'medical_report',
    categoryLabel: "Doctor's Certificate (Tampered Lab)",
    ocrConfidence: 89.2,
    piiRedactedCount: 4,
    tamperRisk: 'tampered',
    tamperProofVerification: 'FAILED',
    extractedText: `CARDIOLOGY CONSULT & EXERCISE ECG
PATIENT ID: [REDACTED-SSN-9021]
Stress Test Protocol: Modified Bruce Protocol
Observed ST depression: 2.1mm downsloping in Leads II, III, aVF [SUSPECT MODIFIED TEXT]
Peak Heart Rate: 168 bpm
Warning: Inconsistent baseline fonts detected around Troponin-T value line. PDF metadata indicates editing with Adobe Illustrator 28.1 on Mac OS 4 hours prior to submission.`,
    redactedPreview: `CARDIOLOGY CONSULT & EXERCISE ECG\nPATIENT ID: ████-██-9021\n⚠️ FORENSIC ALERT: PDF Ghostscript metadata shows digital text layer modified.\nOriginal Troponin: 0.08 ng/mL was digitally replaced with '0.01 ng/mL'.`,
    checks: {
      fontConsistency: false,
      metadataTimestampMatch: false,
      compressionArtifactSplice: false,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Adobe Illustrator 28.1.0 (Macintosh) [NON-CLINICAL EDITOR]',
      metadataAltered: true,
      elaScore: 84.6,
      tamperSummary: 'Tampering Detected: Micro-spacing incongruity on numerical characters. PDF Creator metadata tag reveals Adobe Illustrator editing.',
      suspiciousRegions: [
        {
          label: 'Troponin-T Biomarker Line',
          originalSuspected: '0.08 ng/mL (High Cardiac Risk)',
          alteredValue: '0.01 ng/mL (Falsified Normal)',
          confidence: 96.8,
        },
      ],
    },
    authenticity: {
      verdict: 'FORGED_TAMPERED',
      verdictLabel: 'FORGED / DIGITALLY TAMPERED',
      verdictTamil: 'போலி / மாற்றப்பட்ட ஆவணம் (Forged)',
      confidenceScore: 6.4,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: false,
      qrSignatureMatch: false,
      opticalDensityConsistent: false,
      detailedFindings: 'Critical forgery alert: Digital text layer spliced via Adobe Illustrator. Micro-kerning anomalies detect manual insertion of falsified Troponin values.',
    },
  },

  // 6. RC Book (Motor Insurance) - ORIGINAL GENUINE
  rc_book_vehicle: {
    id: 'doc-rc-01',
    fileName: 'vahan_rc_book_registration.pdf',
    fileSize: '920 KB',
    docType: 'driving_record',
    docCategory: 'driving_record',
    categoryLabel: 'RC Book (Vehicle Registration)',
    ocrConfidence: 99.4,
    piiRedactedCount: 4,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `MINISTRY OF ROAD TRANSPORT & HIGHWAYS (PARIVAHAN SEWA)
REGISTRATION CERTIFICATE (RC BOOK)
VEHICLE REG NO: TN-07-BW-4820 | CHASSIS NO: [REDACTED-CHASSIS-9921]
REGISTERED OWNER: PRIYA SHARMA | RTO: CHENNAI SOUTH (TN-07)
MAKE & MODEL: HYUNDAI CRETA SX (O) 1.5 DIESEL
YEAR OF MFG: 2023 | REG DATE: 15/06/2023 | FITNESS VALID TILL: 14/06/2038
FUEL: DIESEL | SEATING: 5 | INSURANCE UPTO: 14/06/2026
PARIVAHAN QR CODE: VAHAN 4.0 Database Hash Verified`,
    redactedPreview: `PARIVAHAN VAHAN RC BOOK\nVEHICLE NO: TN-07-BW-4820\nOWNER: Priya Sharma\nMODEL: Hyundai Creta SX 1.5\nFITNESS: Valid till 2038\nVAHAN PORTAL: Active & Authenticated`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'National Informatics Centre (NIC) VAHAN 4.0 Portal',
      metadataAltered: false,
      elaScore: 2.2,
      tamperSummary: 'RC Book digital barcode matches Ministry of Road Transport Parivahan central database.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE',
      verdictTamil: 'அசல் ஆவணம் (Original Genuine)',
      confidenceScore: 99.6,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'Parivahan VAHAN 4.0 digital watermark and chassis checksum matched with central vehicle registry.',
    },
  },

  // 7. PUC Certificate (Motor Insurance) - ORIGINAL GENUINE
  puc_certificate_motor: {
    id: 'doc-puc-01',
    fileName: 'puc_pollution_under_control_cert.pdf',
    fileSize: '410 KB',
    docType: 'driving_record',
    docCategory: 'driving_record',
    categoryLabel: 'PUC Certificate (Pollution Valid)',
    ocrConfidence: 99.1,
    piiRedactedCount: 3,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `TRANSPORT DEPARTMENT - GOVERNMENT OF TAMIL NADU
POLLUTION UNDER CONTROL CERTIFICATE (PUCC)
CERTIFICATE NO: TN00700260049182 | VEHICLE NO: TN-07-BW-4820
DATE OF ISSUE: 10/01/2026 | VALID UPTO: 09/01/2027
EMISSION TEST RESULTS (BS-VI DIESEL):
Light Absorption Coefficient (K): 0.42 /m (Prescribed Limit: 1.62 /m) - PASS
Status: Compliant with Central Motor Vehicles Rules 115(2)`,
    redactedPreview: `PUC CERTIFICATE (BS-VI)\nVEHICLE: TN-07-BW-4820\nCERTIFICATE NO: TN00700260049182\nVALID TILL: 09/01/2027 [ACTIVE & COMPLIANT]\nEMISSION: 0.42 /m (Well below ceiling limit)`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'MoRTH Online PUC Testing Center Software v3.2',
      metadataAltered: false,
      elaScore: 2.7,
      tamperSummary: 'Live online smoke-meter test log matched against state pollution testing server.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE',
      verdictTamil: 'அசல் ஆவணம் (Original Genuine)',
      confidenceScore: 99.3,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'MoRTH online test center timestamp and real-time gas analyzer calibration certificate verified.',
    },
  },

  // 8. NCB Certificate (Motor Insurance) - ORIGINAL GENUINE
  ncb_certificate_motor: {
    id: 'doc-ncb-01',
    fileName: 'ncb_no_claim_bonus_certificate.pdf',
    fileSize: '520 KB',
    docType: 'driving_record',
    docCategory: 'driving_record',
    categoryLabel: 'NCB Certificate (50% Bonus Discount)',
    ocrConfidence: 98.8,
    piiRedactedCount: 3,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `GENERAL INSURANCE COUNCIL (GIC) NO CLAIM BONUS (NCB) CONFIRMATION
POLICYHOLDER: PRIYA SHARMA | VEHICLE REG: TN-07-BW-4820
EXPIRING POLICY NO: HDFC-ERGO-MOT-2025-9921
CLAIM RECORD IN PREVIOUS 3 YEARS: ZERO (0 CLAIMS LODGED)
ELIGIBLE NCB PERCENTAGE: 50% (MAXIMUM BONUS DISCOUNT)
Underwriting Discount Rating: 50% reduction applicable on Own Damage (OD) premium.`,
    redactedPreview: `NO CLAIM BONUS (NCB) PROOF\nPOLICYHOLDER: Priya Sharma\nPREVIOUS CLAIMS: 0 Claims in 36 Months\nNCB DISCOUNT EARNED: 50% BONUS DISCOUNT\nSTATUS: GIC Reconciled Clean Loss Run`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Insurance Information Bureau (IIB) Central Portal',
      metadataAltered: false,
      elaScore: 3.4,
      tamperSummary: 'Zero prior claims history validated against Insurance Information Bureau (IIB) central repository.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE',
      verdictTamil: 'அசல் ஆவணம் (Original Genuine)',
      confidenceScore: 98.9,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'IIB central claims repository confirms zero claims filed in the preceding 36-month policy period.',
    },
  },

  // 9. Property Tax Receipt & Title Deed (Home Insurance) - ORIGINAL GENUINE
  property_tax_receipt: {
    id: 'doc-prop-tax-01',
    fileName: 'property_tax_receipt_and_title_deed.pdf',
    fileSize: '1.4 MB',
    docType: 'property_survey',
    docCategory: 'property_tax',
    categoryLabel: 'Property Tax Receipt (வீட்டு வரி ரசீது) & Deed',
    ocrConfidence: 99.5,
    piiRedactedCount: 5,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `GREATER CHENNAI CORPORATION (பெருநகர சென்னை மாநகராட்சி)
PROPERTY TAX RECEIPT & ASSESSMENT SUMMARY - 2025-2026
ASSESSMENT NO: 09-114-04820-000 | WARD: 114 | ZONE: 09
OWNER NAME: PRIYA SHARMA / பிரியா சர்மா
PROPERTY ADDRESS: [REDACTED-STREET], BOULDIN GARDENS, CHENNAI 600028
ANNUAL VALUE: ₹4,80,000 | PROPERTY TAX PAID: ₹24,820 (NO ARREARS)
SUB-REGISTRAR OFFICE SALE DEED DOC NO: 1482/2018 (REGISTERED IN FULL)
FLOOD ZONE: Low Risk (Elevated Terrain, 4.2m above river datum)`,
    redactedPreview: `CHENNAI CORPORATION TAX RECEIPT (வீட்டு வரி ரசீது)\nASSESSMENT NO: 09-114-04820-000\nOWNER: Priya Sharma (பிரியா சர்மா)\nSALE DEED REGISTRATION: Doc 1482/2018 (Title Deed Verified)\nTAX STATUS: Paid in Full · No Liens / Clean Title`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Greater Chennai Corporation e-Governance Portal v6.1',
      metadataAltered: false,
      elaScore: 2.9,
      tamperSummary: 'Municipal property tax assessment and SRO land registration records validated via TN e-District portal.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE',
      verdictTamil: 'அசல் ஆவணம் (Original Genuine)',
      confidenceScore: 99.5,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'Chennai Municipal Corporation payment receipt barcode verified; SRO digital stamp authenticated.',
    },
  },

  // 10. Building Structural Valuation Certificate - ORIGINAL GENUINE
  building_valuation_cert: {
    id: 'doc-bldg-val-01',
    fileName: 'building_structural_valuation_cert.pdf',
    fileSize: '2.1 MB',
    docType: 'property_survey',
    docCategory: 'property_tax',
    categoryLabel: 'Building Valuation & Structural Certificate',
    ocrConfidence: 98.7,
    piiRedactedCount: 4,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `CHARTERED VALUER & STRUCTURAL ENGINEER ASSESSMENT
GOVERNMENT APPROVED VALUER: Er. M. Rajasekaran, B.E., F.I.V. (Cat-I Valuer)
PROPERTY INSPECTED: Residential RCC Framed Structure, 2 Floors, Built 2018
TOTAL BUILT-UP AREA: 2,450 sq.ft | QUALITY OF CONSTRUCTION: Class-I First Class
REPLACEMENT COST ESTIMATE: ₹65,00,000 (~$78,000 USD Rebuild Value)
FIRE PROTECTION: Automatic Sprinklers & Smoke Sensors installed
SEISMIC TIER: Zone III compliant | STRUCTURAL STABILITY: Excellent (Sound RCC Slabs)`,
    redactedPreview: `BUILDING VALUATION CERTIFICATE (கட்டட மதிப்பீடு சான்றிதழ்)\nVALUER: Er. M. Rajasekaran, F.I.V. (Govt Approved)\nSTRUCTURE: RCC Framed 2,450 sq.ft (Built 2018)\nREPLACEMENT VALUE: ₹65,00,000 (Full Rebuild Limit)\nSTABILITY: Grade A+ Structural Integrity Certified`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Institution of Valuers Certified Valuation Template v5.0',
      metadataAltered: false,
      elaScore: 3.3,
      tamperSummary: 'Approved valuer registration credentials authenticated; architectural load-bearing drawings matched.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE',
      verdictTamil: 'அசல் ஆவணம் (Original Genuine)',
      confidenceScore: 98.9,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'Government approved valuer seal and load-bearing inspection documentation verified with state engineering council.',
    },
  },

  // 11. Anna University B.Tech Degree Certificate - ORIGINAL GENUINE (அசல் கல்விச் சான்றிதழ்)
  education_degree_certificate_original: {
    id: 'doc-edu-degree-01',
    fileName: 'anna_university_btech_degree_cert_original.pdf',
    fileSize: '1.8 MB',
    docType: 'financial_statement',
    docCategory: 'certificate_proof',
    categoryLabel: 'Degree Certificate (அசல் கல்விச் சான்றிதழ் - Original)',
    ocrConfidence: 99.8,
    piiRedactedCount: 4,
    tamperRisk: 'clean',
    tamperProofVerification: 'PASSED',
    extractedText: `ANNA UNIVERSITY CHENNAI - FACULTY OF ENGINEERING & TECHNOLOGY
THIS IS TO CERTIFY THAT PRIYA SHARMA HAS BEEN ADMITTED TO THE DEGREE OF
BACHELOR OF TECHNOLOGY (COMPUTER SCIENCE & ENGINEERING)
FIRST CLASS WITH DISTINCTION (CGPA: 8.92 / 10.00)
GIVEN UNDER THE SEAL OF THE UNIVERSITY ON 14TH AUGUST 2014
REGISTRAR & VICE-CHANCELLOR SIGNATURES: Valid Hand-signed with fountain pen ink bleed
SECURITY FEATURES: 24K Pure Gold Hologram Foil, Intaglio Embossed University Crest, Anti-Copy Guilloche Rim`,
    redactedPreview: `ANNA UNIVERSITY DEGREE CERTIFICATE\nCANDIDATE: Priya Sharma\nDEGREE: B.Tech (Computer Science & Engg) · First Class Distinction\nAUTHENTICITY: ORIGINAL PHYSICAL DOCUMENT CONFIRMED\n✅ 24K Gold Security Hologram Verified\n✅ Embossed Registrar Crest (0.24mm 3D Relief)\n✅ Wet Ink Pen Signature Confirmed`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Anna University Examination Automation System v9.4 & High-Security Print Ledger',
      metadataAltered: false,
      elaScore: 1.4,
      tamperSummary: 'University Convocation Gazette Register match; high-resolution fiber optics confirm 100gsm parchment security bond paper.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'ORIGINAL_GENUINE',
      verdictLabel: 'ORIGINAL & GENUINE CERTIFICATE',
      verdictTamil: 'அசல் கல்விச் சான்றிதழ் (Original Genuine)',
      confidenceScore: 99.8,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: true,
      qrSignatureMatch: true,
      opticalDensityConsistent: true,
      detailedFindings: 'Prismatic 24K Gold Foil Hologram authenticated with angular diffraction shifts. 3D embossed Vice-Chancellor seal relief measured at 0.24mm depth. Wet fountain pen signature shows natural feathering into cotton rag paper fibers.',
      hologramRefraction: {
        status: 'AUTHENTIC_IRIDESCENT',
        colorShiftDetected: true,
        angularReflectanceScore: 99.4,
        notes: 'Multi-angle chromatic shift detected across University crest. Optical Variable Device (OVD) diffraction verified.',
      },
      paperFiberGrain: {
        textureType: 'NATURAL_COTTON_CELLULOSE',
        fiberDepthMm: 0.14,
        passed: true,
        notes: 'Genuine 100gsm cotton rag watermarked bond paper. Natural cellulose fiber grain detected at 100x magnification.',
      },
      embossedSealRelief: {
        reliefDepthMm: 0.24,
        obliqueShadowDetected: true,
        passed: true,
        notes: 'Physical 3D indent stamp creates clear shadow gradient under oblique lighting. 0.24mm emboss depth confirmed.',
      },
      signaturePenGrooves: {
        inkType: 'BALLPOINT_WET_INK_FEATHERING',
        indentGroovesDetected: true,
        passed: true,
        notes: 'True fountain/ballpoint pen groove pressure with micro-capillary ink bleed into paper fibers. No toner dot matrix.',
      },
      microTextPpi: {
        measuredPpi: 600,
        latentCopyWatermarkTriggered: false,
        passed: true,
        notes: 'Guilloche boundary reads "ANNA-UNIV-CHENNAI-INDIA" sharply at 600 DPI. No "COPY" or "VOID" latent watermark present.',
      },
    },
  },

  // 12. Degree Certificate - DUPLICATE COLOR XEROX (நகல் / கலர் ஜெராக்ஸ் சான்றிதழ்)
  education_degree_certificate_duplicate: {
    id: 'doc-edu-degree-duplicate',
    fileName: 'anna_university_btech_degree_duplicate_xerox.pdf',
    fileSize: '1.1 MB',
    docType: 'financial_statement',
    docCategory: 'certificate_proof',
    categoryLabel: 'Degree Certificate (Color Xerox / நகல் சான்றிதழ்)',
    ocrConfidence: 92.4,
    piiRedactedCount: 4,
    tamperRisk: 'suspicious',
    tamperProofVerification: 'FAILED',
    extractedText: `SCAN OF DEGREE CERTIFICATE - COLOR PHOTOCOPY DETECTED
ANNA UNIVERSITY CHENNAI - FACULTY OF ENGINEERING & TECHNOLOGY
PRIYA SHARMA - BACHELOR OF TECHNOLOGY
AI FORENSIC SCAN ALERT:
- Hologram reflects flat metallic grey toner without iridescent diffraction shifts.
- University embossed seal is 2D printed flat toner without physical paper depression (Depth: 0.00mm).
- Halftone rosette dots (CMYK 150 DPI) present across background.
- Hidden latent anti-copy warning "COPY / DUPLICATE" revealed on reproduction.`,
    redactedPreview: `DEGREE CERTIFICATE (COLOR XEROX / PHOTOCOPY)\nCANDIDATE: Priya Sharma\nDEGREE: B.Tech Computer Science\n⚠️ AI SCAN VERDICT: DUPLICATE / PHOTOCOPY (நகல் சான்றிதழ்)\n❌ Hologram is flat printed foil (No color diffraction)\n❌ Zero 3D paper embossing on seal (Flat toner)\n❌ Latent "COPY / DUPLICATE" pattern visible\nACTION: Underwriter requires physical original submission.`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: false,
      compressionArtifactSplice: false,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Canon imageRUNNER ADVANCE Color Laser Copier C5535i',
      metadataAltered: false,
      elaScore: 34.8,
      tamperSummary: 'Document is a color laser photocopy (Xerox) reproduced on standard 75gsm office paper. Lacks physical security embossing.',
      suspiciousRegions: [
        {
          label: 'Hologram Sticker Region',
          originalSuspected: '24K Iridescent Optically Variable Device',
          alteredValue: 'Flat Static Metallic Silver Print (0.00mm Depth)',
          confidence: 97.4,
        },
        {
          label: 'University Embossed Crest',
          originalSuspected: '0.24mm Blind Embossed Die Stamp',
          alteredValue: 'Flat Halftone Laser Toner Print',
          confidence: 98.2,
        },
      ],
    },
    authenticity: {
      verdict: 'DUPLICATE_PHOTOCOPY',
      verdictLabel: 'DUPLICATE / COLOR PHOTOCOPY (நகல் சான்றிதழ்)',
      verdictTamil: 'நகல் / கலர் ஜெராக்ஸ் சான்றிதழ் (Duplicate / Xerox)',
      confidenceScore: 28.6,
      moirePatternDetected: true,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: false,
      qrSignatureMatch: true,
      opticalDensityConsistent: false,
      detailedFindings: 'CRITICAL DUPLICATE DETECTED: Flat metallic printed sticker with zero holographic light refraction. Seal is a 2D inkjet print without embossed paper depression (0.00mm depth). 150 DPI laser toner rosette pattern detected. Latent "COPY" security watermark triggered in background.',
      hologramRefraction: {
        status: 'DULL_STATIC_FOIL',
        colorShiftDetected: false,
        angularReflectanceScore: 18.2,
        notes: 'Flat specular reflection only; complete absence of holographic spectral separation or kinematic movement.',
      },
      paperFiberGrain: {
        textureType: 'FLATBED_GLASS_GLARE',
        fiberDepthMm: 0.01,
        passed: false,
        notes: 'Standard 75gsm smooth copier paper scanned on glass flatbed. Shows high-frequency scanner light streaks.',
      },
      embossedSealRelief: {
        reliefDepthMm: 0.00,
        obliqueShadowDetected: false,
        passed: false,
        notes: 'Zero physical paper indentation (0.00mm). The seal was reproduced purely via color laser toner.',
      },
      signaturePenGrooves: {
        inkType: 'LASER_TONER_DOT_MATRIX',
        indentGroovesDetected: false,
        passed: false,
        notes: 'Signature consists of fused CMYK toner micro-dots with no paper groove indentation or capillary absorption.',
      },
      microTextPpi: {
        measuredPpi: 150,
        latentCopyWatermarkTriggered: true,
        passed: false,
        notes: 'Latent "COPY / DUPLICATE" anti-copy pattern has been triggered. Microtext lines are smeared into jagged pixels.',
      },
    },
  },

  // 13. 12th Marksheet - TAMPERED / FORGED MARKS (போலி மதிப்பெண் சான்றிதழ்)
  education_marksheet_tampered: {
    id: 'doc-edu-marksheet-tampered',
    fileName: 'higher_secondary_12th_marksheet_falsified_cgpa.pdf',
    fileSize: '2.2 MB',
    docType: 'financial_statement',
    docCategory: 'certificate_proof',
    categoryLabel: '12th Mark Sheet (போலி / திருத்தப்பட்ட மதிப்பெண்)',
    ocrConfidence: 87.5,
    piiRedactedCount: 4,
    tamperRisk: 'tampered',
    tamperProofVerification: 'FAILED',
    extractedText: `TAMIL NADU STATE BOARD OF HIGHER SECONDARY EXAMINATION
HIGHER SECONDARY COURSE CERTIFICATE (MARK SHEET)
CANDIDATE: PRIYA SHARMA | ROLL NO: 8492019
SUBJECT MARKS:
- TAMIL: 92/100
- ENGLISH: 88/100
- MATHEMATICS: 96/100 [SUSPICIOUS SPLICING DETECTED]
- PHYSICS: 94/100 [SUSPICIOUS SPLICING DETECTED]
- CHEMISTRY: 91/100
TOTAL: 461/500 (GRADE: A+)
AI FORENSIC SCAN ALERT: Mathematics and Physics marks were digitally edited. Original marks were 54 and 58. ELA score 88.5% confirms pixel quantization delta.`,
    redactedPreview: `12TH HIGHER SECONDARY MARK SHEET\nCANDIDATE: Priya Sharma\nROLL NO: 8492019\n🚨 FORENSIC FORGERY ALERT: MARK TAMPERING DETECTED\nOrig Math: 54/100 -> Tampered to: 96/100\nOrig Physics: 58/100 -> Tampered to: 94/100\nSoftware: Adobe Photoshop 2024 / Pixel Quantization Mismatch`,
    checks: {
      fontConsistency: false,
      metadataTimestampMatch: false,
      compressionArtifactSplice: false,
      identityChecksumMatch: false,
    },
    forensics: {
      softwareTag: 'Adobe Photoshop 25.4 (Windows 11) [IMAGE MANIPULATION SOFTWARE]',
      metadataAltered: true,
      elaScore: 88.5,
      tamperSummary: 'Definite Forgery: Digitally edited mark columns. Incompatible font glyph kerning and high-frequency JPEG compression noise surrounding marks.',
      suspiciousRegions: [
        {
          label: 'Mathematics Mark Cell',
          originalSuspected: '54 / 100 (Pass)',
          alteredValue: '96 / 100 (Forged Distinction)',
          confidence: 98.9,
        },
        {
          label: 'Physics Mark Cell',
          originalSuspected: '58 / 100 (Pass)',
          alteredValue: '94 / 100 (Forged Distinction)',
          confidence: 97.8,
        },
      ],
    },
    authenticity: {
      verdict: 'FORGED_TAMPERED',
      verdictLabel: 'FORGED / DIGITALLY TAMPERED CERTIFICATE',
      verdictTamil: 'போலி / திருத்தப்பட்ட சான்றிதழ் (Forged / Altered)',
      confidenceScore: 4.8,
      moirePatternDetected: false,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: false,
      qrSignatureMatch: false,
      opticalDensityConsistent: false,
      detailedFindings: 'CRITICAL TAMPERING DETECTED: Digital text layer manipulation detected on Mark Column 4 & 5. Original marks 54 & 58 digitally altered to 96 & 94 using Adobe Photoshop. Extreme pixel compression variance (ELA score: 88.5%) and micro-kerning mismatch.',
      hologramRefraction: {
        status: 'ABSENT',
        colorShiftDetected: false,
        angularReflectanceScore: 4.0,
        notes: 'Security hologram region modified during digital cut-and-paste manipulation.',
      },
      paperFiberGrain: {
        textureType: 'OLED_PIXEL_MATRIX',
        fiberDepthMm: 0.00,
        passed: false,
        notes: 'Cloned digital pixel regions show synthetic antialiasing smoothing with no natural organic fibers.',
      },
      embossedSealRelief: {
        reliefDepthMm: 0.00,
        obliqueShadowDetected: false,
        passed: false,
        notes: 'Seal layer shows digital cut-out border feathering from secondary PDF source.',
      },
      signaturePenGrooves: {
        inkType: 'DIGITAL_BIT_IMAGE',
        indentGroovesDetected: false,
        passed: false,
        notes: 'Headmaster signature is an extracted PNG bitmap pasted over background with visible boundary halos.',
      },
      microTextPpi: {
        measuredPpi: 96,
        latentCopyWatermarkTriggered: false,
        passed: false,
        notes: 'Microtext pattern completely severed and corrupted around mark cells due to pixel resampling.',
      },
    },
  },

  // 14. Doctor Medical Fitness Certificate - DUPLICATE XEROX (நகல் மருத்துவ சான்றிதழ்)
  doctor_medical_certificate_duplicate: {
    id: 'doc-doctor-cert-duplicate',
    fileName: 'doctor_clinical_fitness_cert_duplicate_xerox.pdf',
    fileSize: '890 KB',
    docType: 'medical_report',
    docCategory: 'medical_report',
    categoryLabel: "Doctor's Certificate (Xerox Photocopy / நகல்)",
    ocrConfidence: 91.8,
    piiRedactedCount: 4,
    tamperRisk: 'suspicious',
    tamperProofVerification: 'SUSPICIOUS',
    extractedText: `PHOTOCOPY OF CLINICAL EXAMINATION & FITNESS CERTIFICATE
CONSULTANT: Dr. K. Sundaram, MD, DM
PATIENT: PRIYA SHARMA | AGE: 34 YRS
AI FORENSIC SCAN ALERT:
- Scanned from monochrome photocopy.
- Hospital seal lacks wet ink impression; toner scatter dots visible under 50x zoom.
- Doctor signature lacks ballpoint groove indentation.
- Document requires original physical verification at branch.`,
    redactedPreview: `DOCTOR FITNESS CERTIFICATE (XEROX PHOTOCOPY)\nCLINICIAN: Dr. K. Sundaram, MD\nPATIENT: Priya Sharma\n⚠️ AI VERDICT: DUPLICATE / PHOTOCOPY (நகல்)\nScanner detected photocopy toner scatter. Mandatory physical original check.`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Ricoh Aficio MP 301 Copier Scanner',
      metadataAltered: false,
      elaScore: 24.1,
      tamperSummary: 'Monochrome photocopy scan. Halftone screening evident across doctor stamp and signature.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'DUPLICATE_PHOTOCOPY',
      verdictLabel: 'DUPLICATE / PHOTOCOPY DETECTED',
      verdictTamil: 'நகல் மருத்துவ சான்றிதழ் (Duplicate / Xerox)',
      confidenceScore: 33.2,
      moirePatternDetected: true,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: false,
      qrSignatureMatch: true,
      opticalDensityConsistent: false,
      detailedFindings: 'Photocopy toner dispersal observed. Clinic rubber stamp lacks organic wet ink bleed. Original physical certificate submission required.',
      hologramRefraction: {
        status: 'ABSENT',
        colorShiftDetected: false,
        angularReflectanceScore: 0,
        notes: 'Clinic document lacks holographic seal (Standard prescription format).',
      },
      paperFiberGrain: {
        textureType: 'FLATBED_GLASS_GLARE',
        fiberDepthMm: 0.02,
        passed: false,
        notes: 'Copier flatbed reproduction with characteristic optical toner scatter.',
      },
      embossedSealRelief: {
        reliefDepthMm: 0.00,
        obliqueShadowDetected: false,
        passed: false,
        notes: 'Flat toner stamp without wet ink embossing.',
      },
      signaturePenGrooves: {
        inkType: 'LASER_TONER_DOT_MATRIX',
        indentGroovesDetected: false,
        passed: false,
        notes: 'Doctor signature copied via electrostatic toner without ballpoint depression.',
      },
      microTextPpi: {
        measuredPpi: 200,
        latentCopyWatermarkTriggered: false,
        passed: true,
        notes: 'Header text legible, but clinic stamp borders show halftone rasterization.',
      },
    },
  },

  // 15. RC Book - DUPLICATE PHOTOCOPY (நகல் RC புக்)
  rc_book_duplicate_xerox: {
    id: 'doc-rc-duplicate',
    fileName: 'vahan_rc_book_duplicate_photocopy.pdf',
    fileSize: '750 KB',
    docType: 'driving_record',
    docCategory: 'driving_record',
    categoryLabel: 'RC Book (Vehicle Photocopy / நகல்)',
    ocrConfidence: 90.6,
    piiRedactedCount: 3,
    tamperRisk: 'suspicious',
    tamperProofVerification: 'SUSPICIOUS',
    extractedText: `PARIVAHAN REGISTRATION CERTIFICATE (PHOTOCOPY)
VEHICLE REG NO: TN-07-BW-4820 | CRETA 1.5 DIESEL
AI SCAN ALERT:
- Smart card optical chip is a flat photocopied graphic with no optical reflection.
- Background Parivahan guilloche security pattern degraded into moire lines.
- Duplicate certificate detected.`,
    redactedPreview: `VAHAN RC BOOK (PHOTOCOPY DETECTED)\nVEHICLE: TN-07-BW-4820\nOWNER: Priya Sharma\n⚠️ AI VERDICT: DUPLICATE / PHOTOCOPY (நகல் RC புக்)\nSmart card optical chip is unreadable 2D photocopy. Original smart card required.`,
    checks: {
      fontConsistency: true,
      metadataTimestampMatch: true,
      compressionArtifactSplice: true,
      identityChecksumMatch: true,
    },
    forensics: {
      softwareTag: 'Canon LaserBase Copier Scan Utility v2.1',
      metadataAltered: false,
      elaScore: 26.5,
      tamperSummary: 'Photocopied smart card replica. Moiré interference across Parivahan background.',
      suspiciousRegions: [],
    },
    authenticity: {
      verdict: 'DUPLICATE_PHOTOCOPY',
      verdictLabel: 'DUPLICATE / PHOTOCOPY DETECTED',
      verdictTamil: 'நகல் RC புக் (Duplicate Photocopy)',
      confidenceScore: 30.5,
      moirePatternDetected: true,
      screenRecaptureDetected: false,
      guillocheSecurityPatternValid: false,
      qrSignatureMatch: true,
      opticalDensityConsistent: false,
      detailedFindings: 'Vehicle smart card optical chip is flat toner. Parivahan guilloche lines exhibit moiré frequency distortion.',
      hologramRefraction: {
        status: 'DULL_STATIC_FOIL',
        colorShiftDetected: false,
        angularReflectanceScore: 12.0,
        notes: 'Smart card optical microchip reflects static grey toner without cryptographic diffraction.',
      },
      paperFiberGrain: {
        textureType: 'FLATBED_GLASS_GLARE',
        fiberDepthMm: 0.01,
        passed: false,
        notes: 'PVC smart card was photocopied onto plain paper.',
      },
      embossedSealRelief: {
        reliefDepthMm: 0.00,
        obliqueShadowDetected: false,
        passed: false,
        notes: 'Zero relief on Parivahan emblem.',
      },
      signaturePenGrooves: {
        inkType: 'LASER_TONER_DOT_MATRIX',
        indentGroovesDetected: false,
        passed: false,
        notes: 'RTO Registering Authority signature is photocopied toner.',
      },
      microTextPpi: {
        measuredPpi: 180,
        latentCopyWatermarkTriggered: true,
        passed: false,
        notes: 'Chassis micro-line boundary blurred under scan resolution.',
      },
    },
  },
};

export const INITIAL_COMPLIANCE_AUDIT: ComplianceAudit = {
  overallScore: 98.6,
  standards: [
    {
      name: 'IRDAI Algorithmic Fairness & Non-Discrimination Directive',
      jurisdiction: 'Insurance Regulatory and Development Authority of India (IRDAI)',
      score: 99.2,
      status: 'compliant',
      description: 'Zero non-disclosed demographic loadings. Underwriting equations based strictly on verified actuarial tables.',
    },
    {
      name: 'EU AI Act (High-Risk AI System Conformance - Annex III)',
      jurisdiction: 'European Union',
      score: 98.4,
      status: 'compliant',
      description: 'Continuous human oversight, complete SHAP model transparency, and audit logs recorded for every inference.',
    },
    {
      name: 'GDPR Article 22 (Automated Decision-Making Protections)',
      jurisdiction: 'European Union',
      score: 97.9,
      status: 'compliant',
      description: 'Guarantees unconditional right to contest decisions and request human underwriter re-evaluation.',
    },
    {
      name: 'NAIC Model Bulletin on Artificial Intelligence (US Insurance)',
      jurisdiction: 'National Association of Insurance Commissioners (US)',
      score: 99.0,
      status: 'compliant',
      description: 'Disparate Impact ratio of 0.96 satisfies the four-fifths (80%) rule across all applicant cohorts.',
    },
  ],
  metrics: {
    disparateImpactRatio: 0.96, // Ideal: 0.80 - 1.25
    demographicParityDiff: 0.018,
    equalOpportunityDiff: 0.012,
    transparencyScore: 99.4,
  },
  protectedAttributesExcluded: [
    'Biological Gender / Sex',
    'Race & Ethnic Origin',
    'Religious Affiliations',
    'Marital / Family Status',
    'Genetic Marker Disclosures',
    'Socioeconomic Redlining by ZIP',
  ],
};

export const SAMPLE_PRESETS: Array<{
  id: string;
  name: string;
  subtitle: string;
  data: ApplicantData;
}> = [
  {
    id: 'priya_health_clean',
    name: 'Priya Sharma (Health - உடல்நலம்)',
    subtitle: '34yo, Aadhaar, PAN, Form 16, Doctor Medical Cert -> Original Verified (அசல்)',
    data: {
      id: 'app-001',
      name: 'Priya Sharma',
      age: 34,
      coverage: 250000,
      creditScore: 740,
      line: 'health',
      bmi: 23.4,
      smoker: 'no',
      healthCondition: 'none',
      exerciseFrequency: 'active',
      document: SAMPLE_DOCUMENTS.doctor_medical_certificate,
      documents: [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.form16_income_tax,
        SAMPLE_DOCUMENTS.doctor_medical_certificate,
      ],
    },
  },
  {
    id: 'duplicate_photocopy_demo',
    name: 'Ramesh Kumar (Photocopy Xerox - நகல்)',
    subtitle: 'Aadhaar Duplicate Photocopy -> AI Scanner Flags Xerox Moire (நகல் ஆவணம்)',
    data: {
      id: 'app-006',
      name: 'Ramesh Kumar',
      age: 39,
      coverage: 300000,
      creditScore: 710,
      line: 'health',
      bmi: 25.1,
      smoker: 'no',
      healthCondition: 'none',
      exerciseFrequency: 'moderate',
      document: SAMPLE_DOCUMENTS.duplicate_photocopy_aadhaar,
      documents: [
        SAMPLE_DOCUMENTS.duplicate_photocopy_aadhaar, // Photocopy
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.form16_income_tax,
        SAMPLE_DOCUMENTS.doctor_medical_certificate,
      ],
    },
  },
  {
    id: 'marcus_life_aviator',
    name: 'Marcus Vance (Life - ஆயுள்)',
    subtitle: '52yo, $1.5M coverage, Form 16, ITR, Private Aviation -> Escalated to HITL',
    data: {
      id: 'app-002',
      name: 'Marcus Vance',
      age: 52,
      coverage: 1500000,
      creditScore: 690,
      line: 'life',
      termYears: 20,
      hobbies: 'aviation',
      annualIncome: 240000,
      document: SAMPLE_DOCUMENTS.doctor_medical_certificate,
      documents: [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.form16_income_tax,
        SAMPLE_DOCUMENTS.doctor_medical_certificate,
      ],
    },
  },
  {
    id: 'elena_motor_mixed',
    name: 'Elena Rostova (Motor - வாகனம்)',
    subtitle: 'RC Book, PUC Valid, 50% NCB Bonus Certificate, 2 prior claims -> Conditional',
    data: {
      id: 'app-003',
      name: 'Elena Rostova',
      age: 28,
      coverage: 65000,
      creditScore: 675,
      line: 'motor',
      vehicleAge: 3,
      telematicsScore: 62,
      previousClaims: 2,
      vehicleType: 'suv',
      document: SAMPLE_DOCUMENTS.rc_book_vehicle,
      documents: [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.rc_book_vehicle,
        SAMPLE_DOCUMENTS.puc_certificate_motor,
        SAMPLE_DOCUMENTS.ncb_certificate_motor,
      ],
    },
  },
  {
    id: 'david_home_flood',
    name: 'David Chen (Home - வீடு)',
    subtitle: 'Property Tax (வீட்டு வரி), Title Deed, Building Valuation, Coastal Zone -> HITL',
    data: {
      id: 'app-004',
      name: 'David Chen',
      age: 45,
      coverage: 750000,
      creditScore: 710,
      line: 'home',
      propertyValue: 750000,
      floodRisk: 'high',
      securitySystem: 'none',
      constructionYear: 1998,
      document: SAMPLE_DOCUMENTS.property_tax_receipt,
      documents: [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.property_tax_receipt,
        SAMPLE_DOCUMENTS.building_valuation_cert,
      ],
    },
  },
  {
    id: 'forged_lab_fraud',
    name: 'Arthur Sterling (Fraud Forged - போலி ஆவணம்)',
    subtitle: '41yo, Modified Troponin Cardiac PDF -> AI Scanner: FORGED (போலி)',
    data: {
      id: 'app-005',
      name: 'Arthur Sterling',
      age: 41,
      coverage: 500000,
      creditScore: 590,
      line: 'health',
      bmi: 31.8,
      smoker: 'yes',
      healthCondition: 'cardiac',
      exerciseFrequency: 'sedentary',
      document: SAMPLE_DOCUMENTS.health_tampered,
      documents: [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.health_tampered,
      ],
    },
  },
];

export const INITIAL_QUEUE: UnderwriterQueueItem[] = [
  {
    id: 'rev-101',
    applicant: {
      id: 'app-101',
      name: 'Capt. Marcus Vance',
      age: 52,
      coverage: 1500000,
      creditScore: 690,
      line: 'life',
      termYears: 20,
      hobbies: 'aviation',
      annualIncome: 240000,
      document: SAMPLE_DOCUMENTS.form16_income_tax,
      documents: [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.form16_income_tax,
        SAMPLE_DOCUMENTS.doctor_medical_certificate,
      ],
    },
    evaluation: {
      id: 'eval-101',
      applicant: {} as any,
      compositeRiskScore: 74,
      riskTier: 'Tier 3 (Substandard)',
      decision: 'human_review',
      decisionLabel: 'ROUTED TO HUMAN UNDERWRITER',
      basePremium: 3750,
      recommendedPremium: 6800,
      monthlyPremium: 585,
      loadingPercentage: 81,
      deductible: 2500,
      evaluatedAt: '2026-10-15 14:15:20',
      underwritingConfidence: 94.2,
      complianceAudit: INITIAL_COMPLIANCE_AUDIT,
      shapAttributions: [
        {
          factor: 'Hazardous Avocation: Private Aviation',
          impactScore: 32,
          direction: 'positive',
          rationale: 'Active FAA single-engine flight hours increase aviation mortality factor 4.2x.',
          category: 'behavioral',
        },
        {
          factor: 'High Coverage Exposure ($1,500,000)',
          impactScore: 18,
          direction: 'positive',
          rationale: 'Exceeds standard non-medical threshold ($1.0M), requires secondary reinsurance approval.',
          category: 'financial',
        },
        {
          factor: 'Prime Income Capacity ($240,000/yr)',
          impactScore: -8,
          direction: 'negative',
          rationale: 'Income-to-coverage ratio 6.25x is within safe financial insurable interest limits.',
          category: 'financial',
        },
      ],
    },
    flagReason: 'Aviation Avocation & Jumbo Coverage (> $1M)',
    timestamp: '14 mins ago',
    status: 'pending',
  },
  {
    id: 'rev-102',
    applicant: {
      id: 'app-102',
      name: 'Arthur Sterling',
      age: 41,
      coverage: 500000,
      creditScore: 590,
      line: 'health',
      bmi: 31.8,
      smoker: 'yes',
      healthCondition: 'cardiac',
      document: SAMPLE_DOCUMENTS.health_tampered,
      documents: [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.health_tampered,
      ],
    },
    evaluation: {
      id: 'eval-102',
      applicant: {} as any,
      compositeRiskScore: 92,
      riskTier: 'Tier 4 (Decline / Referral)',
      decision: 'human_review',
      decisionLabel: 'CRITICAL FORENSIC SUSPICION',
      basePremium: 1850,
      recommendedPremium: 4950,
      monthlyPremium: 425,
      loadingPercentage: 167,
      deductible: 5000,
      evaluatedAt: '2026-10-15 13:42:10',
      underwritingConfidence: 68.5,
      complianceAudit: INITIAL_COMPLIANCE_AUDIT,
      shapAttributions: [
        {
          factor: 'Digital Tamper Alert in Medical PDF (போலி ஆவணம்)',
          impactScore: 45,
          direction: 'positive',
          rationale: 'OCR & metadata forensics detected altered Troponin lab values and PDF splice layer.',
          category: 'clinical',
        },
        {
          factor: 'Undisclosed Cardiac Pre-existing Flag',
          impactScore: 28,
          direction: 'positive',
          rationale: 'Morbidity table correlates symptomatic ischemia with 5.8x hospitalization frequency.',
          category: 'clinical',
        },
        {
          factor: 'Tobacco Smoker + Elevated BMI (31.8)',
          impactScore: 19,
          direction: 'positive',
          rationale: 'Combined metabolic syndrome multiplier applied to actuarial baseline.',
          category: 'behavioral',
        },
      ],
    },
    flagReason: 'AI Authenticity Alert: FORGED / TAMPERED (போலி ஆவணம் - Troponin Alteration)',
    timestamp: '47 mins ago',
    status: 'pending',
  },
  {
    id: 'rev-103',
    applicant: {
      id: 'app-103',
      name: 'David Chen',
      age: 45,
      coverage: 750000,
      creditScore: 710,
      line: 'home',
      propertyValue: 750000,
      floodRisk: 'high',
      securitySystem: 'none',
      constructionYear: 1998,
      document: SAMPLE_DOCUMENTS.property_tax_receipt,
      documents: [
        SAMPLE_DOCUMENTS.aadhaar_card_kyc,
        SAMPLE_DOCUMENTS.pan_card_kyc,
        SAMPLE_DOCUMENTS.property_tax_receipt,
        SAMPLE_DOCUMENTS.building_valuation_cert,
      ],
    },
    evaluation: {
      id: 'eval-103',
      applicant: {} as any,
      compositeRiskScore: 71,
      riskTier: 'Tier 3 (Substandard)',
      decision: 'human_review',
      decisionLabel: 'ROUTED TO HUMAN UNDERWRITER',
      basePremium: 2200,
      recommendedPremium: 4350,
      monthlyPremium: 375,
      loadingPercentage: 97,
      deductible: 5000,
      evaluatedAt: '2026-10-15 11:20:00',
      underwritingConfidence: 91.0,
      complianceAudit: INITIAL_COMPLIANCE_AUDIT,
      shapAttributions: [
        {
          factor: 'FEMA High-Risk 100-Year Floodplain',
          impactScore: 38,
          direction: 'positive',
          rationale: 'Property coordinates overlap Special Flood Hazard Area (SFHA Zone AE).',
          category: 'geographic',
        },
        {
          factor: 'Absence of Central Monitored Fire & Water Sensors',
          impactScore: 16,
          direction: 'positive',
          rationale: 'Lack of automated shutoff valves escalates catastrophic loss severity.',
          category: 'actuarial',
        },
      ],
    },
    flagReason: 'High Floodplain Exposure (Zone AE) & Zero Water Mitigation',
    timestamp: '3 hours ago',
    status: 'pending',
  },
];

export const INITIAL_PORTFOLIO_KPIS: PortfolioKPIs = {
  totalProcessedYTD: 12480,
  stpRate: 76.4,
  fraudDetectionRate: 3.8,
  portfolioLossRatio: 58.2,
  totalUnderwrittenPremium: 28450000,
  monthlyVolumes: [
    { month: 'May', stp: 1620, manual: 390, fraud: 48 },
    { month: 'Jun', stp: 1740, manual: 410, fraud: 52 },
    { month: 'Jul', stp: 1890, manual: 440, fraud: 59 },
    { month: 'Aug', stp: 2010, manual: 460, fraud: 61 },
    { month: 'Sep', stp: 2180, manual: 480, fraud: 65 },
    { month: 'Oct', stp: 2340, manual: 510, fraud: 72 },
  ],
  riskDistribution: {
    low: 65, // Straight-through approved
    medium: 22, // Conditionally loaded
    high: 13, // Human reviewed or rejected
  },
  linePerformance: [
    {
      line: 'health',
      label: 'Health Insurance (உடல்நலக் காப்பீடு)',
      activePolicies: 4820,
      lossRatio: 56.4,
      avgPremium: 3450,
      trend: '+12% growth',
    },
    {
      line: 'life',
      label: 'Life Insurance (ஆயுள் காப்பீடு)',
      activePolicies: 3190,
      lossRatio: 48.9,
      avgPremium: 2890,
      trend: '+8% growth',
    },
    {
      line: 'motor',
      label: 'Motor Insurance (வாகனக் காப்பீடு)',
      activePolicies: 2640,
      lossRatio: 64.1,
      avgPremium: 1780,
      trend: '+18% growth',
    },
    {
      line: 'home',
      label: 'Home Insurance (வீட்டுக் காப்பீடு)',
      activePolicies: 1830,
      lossRatio: 61.7,
      avgPremium: 2210,
      trend: '+5% growth',
    },
  ],
};
