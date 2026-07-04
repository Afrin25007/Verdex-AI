export interface Scheme {
  id: string;
  name: string;
  category: string;
  description: string;
  benefitSummary: string;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationGuide: string;
}

export const SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "Income Support",
    description: "Direct income support scheme providing financial assistance to all landholding farmer families across India.",
    benefitSummary: "INR 6,000 per year paid in three equal installments directly to bank accounts.",
    eligibilityCriteria: ["Farmer family owns cultivable land", "Land records registered in farmer's name", "Not a government employee or income tax payee"],
    requiredDocuments: ["Aadhaar card", "Land ownership records", "Bank account passbook"],
    applicationGuide: "Register at the nearest Common Service Centre or via the PM-KISAN portal with Aadhaar-linked bank details.",
  },
  {
    id: "pmfby",
    name: "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
    category: "Crop Insurance",
    description: "Crop insurance scheme protecting farmers against yield losses from natural calamities, pests and diseases.",
    benefitSummary: "Low premium (1.5-5% of sum insured) with full claim payout on crop loss due to drought, flood, pest or disease.",
    eligibilityCriteria: ["Farmer growing a notified crop in a notified area", "Sharecroppers and tenant farmers also eligible", "Enrollment within the season cut-off date"],
    requiredDocuments: ["Aadhaar card", "Land records or tenancy agreement", "Bank account details", "Sowing certificate"],
    applicationGuide: "Apply through your bank, Common Service Centre, or the National Crop Insurance Portal before the seasonal cut-off.",
  },
  {
    id: "kcc",
    name: "KCC (Kisan Credit Card)",
    category: "Credit & Finance",
    description: "Provides farmers with timely access to affordable credit for cultivation, post-harvest expenses and farm assets.",
    benefitSummary: "Credit up to INR 3 lakh at 4% effective interest rate (with prompt repayment incentive) for crop and allied activities.",
    eligibilityCriteria: ["Owner cultivator, tenant farmer, or sharecropper", "Engaged in crop production, animal husbandry or fisheries", "Valid land or lease documentation"],
    requiredDocuments: ["Aadhaar card", "Land records", "Passport-size photograph", "Bank account details"],
    applicationGuide: "Apply at any nationalized bank, cooperative bank or Regional Rural Bank branch with land and identity documents.",
  },
  {
    id: "pm-kusum",
    name: "PM-KUSUM (Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
    category: "Solar & Energy",
    description: "Promotes solar irrigation pumps and grid-connected solar power plants on farm land to reduce diesel dependency.",
    benefitSummary: "Up to 60% subsidy on solar pump installation plus additional income from selling surplus solar power to the grid.",
    eligibilityCriteria: ["Individual farmer, cooperative, or farmer producer organization", "Own or leased agricultural land suitable for solar installation", "Existing diesel pump for replacement (for pump component)"],
    requiredDocuments: ["Aadhaar card", "Land ownership documents", "Electricity connection details (if applicable)"],
    applicationGuide: "Apply through the state renewable energy development agency portal or nearest KUSUM implementation office.",
  },
  {
    id: "soil-health-card",
    name: "Soil Health Card Scheme",
    category: "Soil & Advisory",
    description: "Provides farmers with crop-wise nutrient and fertilizer recommendations based on soil test results every two years.",
    benefitSummary: "Free soil testing with a personalized health card indicating nutrient status and fertilizer dosage guidance.",
    eligibilityCriteria: ["Any farmer with cultivable land", "Land accessible for soil sampling by agriculture department"],
    requiredDocuments: ["Aadhaar card", "Land records"],
    applicationGuide: "Contact the local Krishi Vigyan Kendra or agriculture department office to schedule free soil sample collection.",
  },
  {
    id: "e-nam",
    name: "e-NAM (National Agriculture Market)",
    category: "Marketplace",
    description: "A pan-India electronic trading platform connecting existing mandis to give farmers better price discovery and market access.",
    benefitSummary: "Access to transparent online bidding across integrated mandis, reducing dependence on local middlemen.",
    eligibilityCriteria: ["Registered farmer or Farmer Producer Organization", "Produce meets mandi quality assaying standards"],
    requiredDocuments: ["Aadhaar card", "Bank account details", "Mandi registration (via local APMC)"],
    applicationGuide: "Register free of cost through your nearest e-NAM integrated mandi or the e-NAM mobile application.",
  },
];

export interface SchemeMatchProfile {
  landSizeAcres: number;
  hasIrrigation: boolean;
  cropType: string;
  annualIncomeInr: number;
}

export function evaluateSchemeEligibility(
  scheme: Scheme,
  profile: SchemeMatchProfile,
): { eligible: boolean; reason: string } {
  switch (scheme.id) {
    case "pm-kisan":
      return profile.annualIncomeInr < 1_000_000
        ? { eligible: true, reason: "All landholding farmer families qualify for direct annual income support." }
        : { eligible: false, reason: "Income tax paying households above the reported threshold are excluded from PM-KISAN." };
    case "pmfby":
      return { eligible: true, reason: `Crop insurance is open to all farmers growing notified crops such as ${profile.cropType}, including tenant farmers.` };
    case "kcc":
      return profile.landSizeAcres > 0
        ? { eligible: true, reason: "Owning or leasing cultivable land qualifies you for a Kisan Credit Card limit." }
        : { eligible: false, reason: "A minimum operational landholding is needed to size a credit limit." };
    case "pm-kusum":
      return profile.landSizeAcres >= 1
        ? { eligible: true, reason: "Land holding is sufficient to host a solar pump or small solar power installation." }
        : { eligible: false, reason: "Land size is below the practical minimum for solar pump installation." };
    case "soil-health-card":
      return { eligible: true, reason: "Free soil testing is available to every farmer regardless of land size." };
    case "e-nam":
      return profile.hasIrrigation || profile.landSizeAcres >= 0.5
        ? { eligible: true, reason: "Your production scale is sufficient to benefit from e-NAM's wider buyer network." }
        : { eligible: false, reason: "Very small marketable surplus reduces the practical benefit of e-NAM listing." };
    default:
      return { eligible: false, reason: "Eligibility rules not defined for this scheme." };
  }
}
