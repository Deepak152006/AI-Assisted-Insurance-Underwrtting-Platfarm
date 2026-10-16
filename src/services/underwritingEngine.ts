import {
  ApplicantData,
  DecisionType,
  EvaluationResult,
  ShapAttribution,
  ComplianceAudit,
} from '../types/underwriting';
import { INITIAL_COMPLIANCE_AUDIT } from './sampleData';

export function evaluateApplicant(applicant: ApplicantData): EvaluationResult {
  let score = 20; // Actuarial baseline
  const shapAttributions: ShapAttribution[] = [];

  // 1. Credit Bureau Scoring Impact
  if (applicant.creditScore >= 750) {
    score -= 12;
    shapAttributions.push({
      factor: `Prime Credit Bureau Score (${applicant.creditScore})`,
      impactScore: -12,
      direction: 'negative',
      rationale: 'Excellent financial stewardship correlates with 34% lower non-disclosure and claim frequency.',
      category: 'financial',
    });
  } else if (applicant.creditScore >= 670) {
    score -= 4;
    shapAttributions.push({
      factor: `Good Credit Bureau Tier (${applicant.creditScore})`,
      impactScore: -4,
      direction: 'negative',
      rationale: 'Standard favorable financial stability tier with predictable payment reliability.',
      category: 'financial',
    });
  } else if (applicant.creditScore < 620) {
    score += 22;
    shapAttributions.push({
      factor: `Subprime Credit Bureau Profile (${applicant.creditScore})`,
      impactScore: 22,
      direction: 'positive',
      rationale: 'Elevated credit risk elevates lapse probabilities and historical claims loss correlation.',
      category: 'financial',
    });
  }

  // 2. Age Exposure
  if (applicant.age > 55) {
    const ageImpact = Math.round((applicant.age - 55) * 1.5) + 12;
    score += ageImpact;
    shapAttributions.push({
      factor: `Senior Age Demographics (${applicant.age} yrs)`,
      impactScore: ageImpact,
      direction: 'positive',
      rationale: 'Mortality and morbidity actuarial curves steepen significantly past age 55.',
      category: 'actuarial',
    });
  } else if (applicant.age <= 30 && applicant.line === 'motor') {
    score += 16;
    shapAttributions.push({
      factor: 'Young Driver Experience Bracket (<=30 yrs)',
      impactScore: 16,
      direction: 'positive',
      rationale: 'Statistically elevated incidence rate of collision frequency in early driving cohorts.',
      category: 'actuarial',
    });
  } else if (applicant.age >= 30 && applicant.age <= 45) {
    score -= 6;
    shapAttributions.push({
      factor: `Prime Demographic Bracket (${applicant.age} yrs)`,
      impactScore: -6,
      direction: 'negative',
      rationale: 'Lowest risk-to-premium coefficient cohort across life and disability tables.',
      category: 'actuarial',
    });
  }

  // 3. Line-Specific Risk & Actuarial Parameters
  if (applicant.line === 'health') {
    const bmi = applicant.bmi ?? 24.0;
    if (bmi >= 30) {
      const bmiImpact = Math.round((bmi - 28) * 4) + 10;
      score += bmiImpact;
      shapAttributions.push({
        factor: `Obesity BMI Metric (${bmi})`,
        impactScore: bmiImpact,
        direction: 'positive',
        rationale: 'High BMI increases comorbid hypertension, cardiovascular, and endocrine risk 3.1x.',
        category: 'clinical',
      });
    } else if (bmi >= 19 && bmi <= 25) {
      score -= 8;
      shapAttributions.push({
        factor: `Optimal BMI Range (${bmi})`,
        impactScore: -8,
        direction: 'negative',
        rationale: 'Healthy metabolic index correlates with baseline clinical longevity.',
        category: 'clinical',
      });
    }

    if (applicant.smoker === 'yes') {
      score += 26;
      shapAttributions.push({
        factor: 'Nicotine / Tobacco Consumption Declared',
        impactScore: 26,
        direction: 'positive',
        rationale: 'Tobacco use activates standard non-smoker rider surcharge and oncology hazard factor.',
        category: 'behavioral',
      });
    } else {
      score -= 6;
      shapAttributions.push({
        factor: 'Non-Smoker Disclosed Status',
        impactScore: -6,
        direction: 'negative',
        rationale: 'Non-smoker status grants standard preferred clinical tier credits.',
        category: 'behavioral',
      });
    }

    if (applicant.healthCondition === 'cardiac') {
      score += 36;
      shapAttributions.push({
        factor: 'Documented Cardiac Disease History',
        impactScore: 36,
        direction: 'positive',
        rationale: 'Major clinical flag: Prior coronary disease or arrhythmia triggers mandatory cardiologist review.',
        category: 'clinical',
      });
    } else if (applicant.healthCondition === 'diabetes') {
      score += 22;
      shapAttributions.push({
        factor: 'Type-2 Diabetes Diagnosis',
        impactScore: 22,
        direction: 'positive',
        rationale: 'Endocrine disorder requires underwriting check of HbA1c history and medication compliance.',
        category: 'clinical',
      });
    } else if (applicant.healthCondition === 'hypertension') {
      score += 12;
      shapAttributions.push({
        factor: 'Mild Essential Hypertension',
        impactScore: 12,
        direction: 'positive',
        rationale: 'Elevated blood pressure managed by pharmacotherapy; mild rating multiplier.',
        category: 'clinical',
      });
    } else {
      score -= 7;
      shapAttributions.push({
        factor: 'Zero Pre-existing Morbidity Disclosed',
        impactScore: -7,
        direction: 'negative',
        rationale: 'Clean clinical profile with unremarkable medical panel screening.',
        category: 'clinical',
      });
    }

    if (applicant.exerciseFrequency === 'active') {
      score -= 6;
      shapAttributions.push({
        factor: 'Active Physical Activity Habit',
        impactScore: -6,
        direction: 'negative',
        rationale: 'Aerobic fitness frequency mitigates long-term chronic illness probability.',
        category: 'behavioral',
      });
    }
  } else if (applicant.line === 'life') {
    const term = applicant.termYears ?? 20;
    if (term > 25) {
      score += 10;
      shapAttributions.push({
        factor: `Extended Term Duration (${term} Years)`,
        impactScore: 10,
        direction: 'positive',
        rationale: '30-year exposure period spans into senior age mortality curve acceleration.',
        category: 'actuarial',
      });
    }

    if (applicant.hobbies === 'aviation') {
      score += 34;
      shapAttributions.push({
        factor: 'Hazardous Avocation: Private Aviation',
        impactScore: 34,
        direction: 'positive',
        rationale: 'FAA general aviation operations carry 4.5x fatal accident risk compared to commercial aviation.',
        category: 'behavioral',
      });
    } else if (applicant.hobbies === 'racing' || applicant.hobbies === 'climbing') {
      score += 24;
      shapAttributions.push({
        factor: `Extreme Sports Avocation (${applicant.hobbies})`,
        impactScore: 24,
        direction: 'positive',
        rationale: 'High velocity or alpine risk sports require exclusion rider or flat-extra premium loading.',
        category: 'behavioral',
      });
    }

    if (applicant.coverage >= 1000000) {
      score += 14;
      shapAttributions.push({
        factor: `Jumbo Coverage Liability ($${(applicant.coverage / 1000000).toFixed(1)}M)`,
        impactScore: 14,
        direction: 'positive',
        rationale: 'Exceeds standard automated retention limits; requires reinsurance treaties check.',
        category: 'financial',
      });
    }

    if (applicant.annualIncome && applicant.annualIncome >= 150000) {
      score -= 8;
      shapAttributions.push({
        factor: `Strong Insurable Earnings Capacity ($${applicant.annualIncome.toLocaleString()}/yr)`,
        impactScore: -8,
        direction: 'negative',
        rationale: 'Low policy surrender rate and proven financial justification for coverage scale.',
        category: 'financial',
      });
    }
  } else if (applicant.line === 'motor') {
    const telematics = applicant.telematicsScore ?? 75;
    if (telematics >= 85) {
      score -= 18;
      shapAttributions.push({
        factor: `Superior Telematics Driving Score (${telematics}/100)`,
        impactScore: -18,
        direction: 'negative',
        rationale: 'Minimal hard braking (<1 event/1000mi), zero nighttime speeding recorded on IoT dongle.',
        category: 'behavioral',
      });
    } else if (telematics < 65) {
      score += 25;
      shapAttributions.push({
        factor: `Degraded Telematics Driving Score (${telematics}/100)`,
        impactScore: 25,
        direction: 'positive',
        rationale: 'Frequent harsh braking, tailgating patterns, and high cornering g-forces detected.',
        category: 'behavioral',
      });
    }

    const claims = applicant.previousClaims ?? 0;
    if (claims > 0) {
      const claimImpact = claims * 16;
      score += claimImpact;
      shapAttributions.push({
        factor: `${claims} At-Fault Claims in Last 36 Months`,
        impactScore: claimImpact,
        direction: 'positive',
        rationale: 'Prior claims history is the single strongest statistical predictor of subsequent collision recurrence.',
        category: 'actuarial',
      });
    } else {
      score -= 9;
      shapAttributions.push({
        factor: 'Zero Prior Claims (Clean Loss Run)',
        impactScore: -9,
        direction: 'negative',
        rationale: 'Unblemished driving record merits maximum safe driver discount bonus.',
        category: 'actuarial',
      });
    }

    if (applicant.vehicleType === 'sports') {
      score += 15;
      shapAttributions.push({
        factor: 'High-Performance Sports Vehicle Classification',
        impactScore: 15,
        direction: 'positive',
        rationale: 'High power-to-weight ratio correlates with elevated property damage claim severity.',
        category: 'actuarial',
      });
    }
  } else if (applicant.line === 'home') {
    if (applicant.floodRisk === 'high') {
      score += 42;
      shapAttributions.push({
        factor: 'FEMA High-Risk 100-Year Flood Hazard (Zone AE)',
        impactScore: 42,
        direction: 'positive',
        rationale: 'Catastrophic flood zone exposure; requires NFIP verification and civil engineer flood wall audit.',
        category: 'geographic',
      });
    } else if (applicant.floodRisk === 'moderate') {
      score += 16;
      shapAttributions.push({
        factor: 'Moderate 500-Year Flood Zone (Zone X Shaded)',
        impactScore: 16,
        direction: 'positive',
        rationale: 'Secondary surge and drainage overflow vulnerability during tropical storms.',
        category: 'geographic',
      });
    } else {
      score -= 10;
      shapAttributions.push({
        factor: 'Low Flood Hazard Location (Zone X Unshaded)',
        impactScore: -10,
        direction: 'negative',
        rationale: 'Elevated topography well above 500-year base flood elevation.',
        category: 'geographic',
      });
    }

    if (applicant.securitySystem === 'advanced') {
      score -= 14;
      shapAttributions.push({
        factor: 'Central Monitored Alarm & Automatic Water Shutoff',
        impactScore: -14,
        direction: 'negative',
        rationale: 'Smart IoT water shutoff reduces burst pipe loss severity by 82%; 24/7 burglary monitoring active.',
        category: 'actuarial',
      });
    } else if (applicant.securitySystem === 'none') {
      score += 15;
      shapAttributions.push({
        factor: 'Absence of Monitored Protection Sensors',
        impactScore: 15,
        direction: 'positive',
        rationale: 'Unmonitored properties suffer prolonged unchecked water leaks and higher burglary claims.',
        category: 'actuarial',
      });
    }
  }

  // 4. Multi-Document Batch & Forensics Evaluation (Original vs Fake / Duplicate Certificate)
  const docBatch = applicant.documents && applicant.documents.length > 0
    ? applicant.documents
    : applicant.document ? [applicant.document] : [];

  const tamperedDoc = docBatch.find(
    (d) =>
      d.tamperRisk === 'tampered' ||
      d.tamperProofVerification === 'FAILED' ||
      d.authenticity?.verdict === 'FORGED_TAMPERED'
  );

  const duplicateDoc = docBatch.find(
    (d) =>
      !tamperedDoc &&
      (d.authenticity?.verdict === 'DUPLICATE_PHOTOCOPY' ||
        (d.tamperRisk === 'suspicious' && d.tamperProofVerification === 'SUSPICIOUS'))
  );

  const hasFakeOrTamperedDoc = !!tamperedDoc;
  const hasDuplicateDoc = !!duplicateDoc;

  const avgOcrConfidence = docBatch.length > 0
    ? docBatch.reduce((sum, d) => sum + d.ocrConfidence, 0) / docBatch.length
    : 95.0;

  if (hasFakeOrTamperedDoc && tamperedDoc) {
    score += 52;
    shapAttributions.push({
      factor: `FRAUD FORENSICS: Forged / Fake Certificate in Batch (${tamperedDoc.categoryLabel})`,
      impactScore: 52,
      direction: 'positive',
      rationale: `AI Micro-Forensic engine detected altered certificate data (${tamperedDoc.forensics?.softwareTag || 'Image Manipulation Software'}) and ${tamperedDoc.forensics?.elaScore || 88}% compression splice anomaly. Straight-Through Processing (STP) blocked; routed to Human Underwriter.`,
      category: 'clinical',
    });
  } else if (hasDuplicateDoc && duplicateDoc) {
    score += 38;
    shapAttributions.push({
      factor: `AI SCAN ALERT: Duplicate / Photocopy Xerox Certificate (${duplicateDoc.categoryLabel})`,
      impactScore: 38,
      direction: 'positive',
      rationale: 'AI Scanner identified flat toner print, absence of 3D embossed stamp relief, and Xerox moiré pattern. Physical original document verification required by Human Underwriter.',
      category: 'actuarial',
    });
  } else if (docBatch.length >= 3) {
    score -= 6;
    shapAttributions.push({
      factor: `Comprehensive Multi-Document Batch (${docBatch.length} Verified Records)`,
      impactScore: -6,
      direction: 'negative',
      rationale: 'Cross-document triangulation between National ID, Bank Statement, and Technical Records confirms veracity.',
      category: 'actuarial',
    });
  }

  // Clamp composite score between 5 and 99
  const compositeRiskScore = Math.max(5, Math.min(99, score));

  // Determine Decision Tier
  let decision: DecisionType;
  let decisionLabel: string;
  let riskTier: EvaluationResult['riskTier'];

  if (hasFakeOrTamperedDoc) {
    decision = 'human_review';
    decisionLabel = 'FRAUD ALERT: FAKE / TAMPERED CERTIFICATE (ROUTED TO HUMAN UNDERWRITER)';
    riskTier = 'Tier 4 (Decline / Referral)';
  } else if (hasDuplicateDoc) {
    decision = 'human_review';
    decisionLabel = 'ALERT: DUPLICATE XEROX CERTIFICATE (ROUTED TO HUMAN UNDERWRITER)';
    riskTier = 'Tier 3 (Substandard)';
  } else if (compositeRiskScore < 35) {
    decision = 'straight_through';
    decisionLabel = 'AUTO-APPROVED (Straight-Through STP)';
    riskTier = 'Tier 1 (Preferred)';
  } else if (compositeRiskScore <= 68) {
    decision = 'conditional_loading';
    decisionLabel = 'CONDITIONAL APPROVAL (Premium Rate Loaded)';
    riskTier = 'Tier 2 (Standard)';
  } else {
    decision = 'human_review';
    decisionLabel = 'ROUTED TO HUMAN UNDERWRITER';
    riskTier = compositeRiskScore > 85 ? 'Tier 4 (Decline / Referral)' : 'Tier 3 (Substandard)';
  }

  // Premium Calculation
  let rateMultiplier = 0.0022;
  if (applicant.line === 'motor') rateMultiplier = 0.024;
  if (applicant.line === 'home') rateMultiplier = 0.0035;
  if (applicant.line === 'life') rateMultiplier = 0.0018;

  const basePremium = Math.round(applicant.coverage * rateMultiplier);
  const loadingFactor = Math.max(0.65, 0.75 + compositeRiskScore / 42);
  const recommendedPremium = Math.round(basePremium * loadingFactor);
  const monthlyPremium = Math.round(recommendedPremium / 12);
  const loadingPercentage = Math.round(((recommendedPremium - basePremium) / basePremium) * 100);

  // Suggested deductible
  let deductible = 1000;
  if (applicant.line === 'home') deductible = compositeRiskScore > 60 ? 5000 : 2500;
  if (applicant.line === 'motor') deductible = compositeRiskScore > 50 ? 1000 : 500;
  if (applicant.line === 'health') deductible = compositeRiskScore > 50 ? 3000 : 1500;

  const underwritingConfidence = hasFakeOrTamperedDoc
    ? 68.4
    : hasDuplicateDoc
    ? 74.2
    : parseFloat(avgOcrConfidence.toFixed(1));

  return {
    id: `eval-${Date.now()}`,
    applicant,
    compositeRiskScore,
    riskTier,
    decision,
    decisionLabel,
    basePremium,
    recommendedPremium,
    monthlyPremium,
    loadingPercentage,
    deductible,
    shapAttributions,
    evaluatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    underwritingConfidence,
    complianceAudit: INITIAL_COMPLIANCE_AUDIT,
  };
}
