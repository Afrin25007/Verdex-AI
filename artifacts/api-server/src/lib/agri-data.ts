// Reference agronomy data used by the deterministic AI compute engines below.
// Values are representative averages drawn from common Indian agronomy/ICAR
// guidance ranges — they drive real rule-based computation, not fake randoms.

export type ClimateZone =
  | "arid"
  | "semi-arid"
  | "humid-subtropical"
  | "coastal-tropical"
  | "temperate-hill";

export interface DistrictProfile {
  name: string;
  state: string;
  climateZone: ClimateZone;
  primaryCrops: string[];
  avgAnnualRainfallMm: number;
}

export const DISTRICTS: DistrictProfile[] = [
  { name: "Jaisalmer", state: "Rajasthan", climateZone: "arid", primaryCrops: ["Bajra", "Moth Bean", "Guar"], avgAnnualRainfallMm: 210 },
  { name: "Bikaner", state: "Rajasthan", climateZone: "arid", primaryCrops: ["Bajra", "Mustard", "Guar"], avgAnnualRainfallMm: 260 },
  { name: "Solapur", state: "Maharashtra", climateZone: "semi-arid", primaryCrops: ["Jowar", "Cotton", "Sugarcane"], avgAnnualRainfallMm: 570 },
  { name: "Anantapur", state: "Andhra Pradesh", climateZone: "semi-arid", primaryCrops: ["Groundnut", "Cotton", "Bajra"], avgAnnualRainfallMm: 550 },
  { name: "Vidisha", state: "Madhya Pradesh", climateZone: "semi-arid", primaryCrops: ["Soybean", "Wheat", "Gram"], avgAnnualRainfallMm: 1050 },
  { name: "Ludhiana", state: "Punjab", climateZone: "humid-subtropical", primaryCrops: ["Wheat", "Rice", "Maize"], avgAnnualRainfallMm: 750 },
  { name: "Meerut", state: "Uttar Pradesh", climateZone: "humid-subtropical", primaryCrops: ["Sugarcane", "Wheat", "Rice"], avgAnnualRainfallMm: 830 },
  { name: "Nalanda", state: "Bihar", climateZone: "humid-subtropical", primaryCrops: ["Rice", "Wheat", "Maize"], avgAnnualRainfallMm: 1150 },
  { name: "Thanjavur", state: "Tamil Nadu", climateZone: "coastal-tropical", primaryCrops: ["Rice", "Sugarcane", "Banana"], avgAnnualRainfallMm: 1020 },
  { name: "Alappuzha", state: "Kerala", climateZone: "coastal-tropical", primaryCrops: ["Rice", "Coconut", "Banana"], avgAnnualRainfallMm: 2900 },
  { name: "East Godavari", state: "Andhra Pradesh", climateZone: "coastal-tropical", primaryCrops: ["Rice", "Sugarcane", "Banana"], avgAnnualRainfallMm: 1100 },
  { name: "Kendrapara", state: "Odisha", climateZone: "coastal-tropical", primaryCrops: ["Rice", "Groundnut", "Vegetables"], avgAnnualRainfallMm: 1500 },
  { name: "Nashik", state: "Maharashtra", climateZone: "semi-arid", primaryCrops: ["Grapes", "Onion", "Tomato"], avgAnnualRainfallMm: 700 },
  { name: "Coimbatore", state: "Tamil Nadu", climateZone: "semi-arid", primaryCrops: ["Cotton", "Maize", "Turmeric"], avgAnnualRainfallMm: 640 },
  { name: "Almora", state: "Uttarakhand", climateZone: "temperate-hill", primaryCrops: ["Wheat", "Potato", "Millets"], avgAnnualRainfallMm: 1100 },
  { name: "Shimla", state: "Himachal Pradesh", climateZone: "temperate-hill", primaryCrops: ["Apple", "Potato", "Pea"], avgAnnualRainfallMm: 1450 },
];

interface ClimateZoneRiskProfile {
  heatwave: "low" | "moderate" | "high" | "severe";
  flood: "low" | "moderate" | "high" | "severe";
  cyclone: "low" | "moderate" | "high" | "severe";
  drought: "low" | "moderate" | "high" | "severe";
  baseResilience: number;
}

export const ZONE_RISK_PROFILE: Record<ClimateZone, ClimateZoneRiskProfile> = {
  arid: { heatwave: "severe", flood: "low", cyclone: "low", drought: "severe", baseResilience: 42 },
  "semi-arid": { heatwave: "high", flood: "moderate", cyclone: "low", drought: "high", baseResilience: 55 },
  "humid-subtropical": { heatwave: "moderate", flood: "high", cyclone: "moderate", drought: "moderate", baseResilience: 62 },
  "coastal-tropical": { heatwave: "moderate", flood: "high", cyclone: "severe", drought: "low", baseResilience: 58 },
  "temperate-hill": { heatwave: "low", flood: "moderate", cyclone: "low", drought: "low", baseResilience: 74 },
};

const SEASON_RAIN_MULTIPLIER: Record<"kharif" | "rabi" | "zaid", number> = {
  kharif: 1.6,
  rabi: 0.5,
  zaid: 0.3,
};

export interface CropProfile {
  name: string;
  suitableZones: ClimateZone[];
  suitableSoils: string[];
  suitableSeasons: Array<"kharif" | "rabi" | "zaid">;
  waterNeedLitersPerAcrePerSeason: number;
  investmentInrPerAcre: number;
  yieldQuintalsPerAcre: number;
  priceInrPerQuintal: number;
  benchmarkFertilizerKgPerAcre: number;
  benchmarkElectricityUnitsPerMonth: number;
  marketDemand: "low" | "moderate" | "high" | "very_high";
  minPh: number;
  maxPh: number;
}

export const CROPS: CropProfile[] = [
  {
    name: "Bajra (Pearl Millet)",
    suitableZones: ["arid", "semi-arid"],
    suitableSoils: ["sandy", "red"],
    suitableSeasons: ["kharif"],
    waterNeedLitersPerAcrePerSeason: 1_200_000,
    investmentInrPerAcre: 9000,
    yieldQuintalsPerAcre: 12,
    priceInrPerQuintal: 2350,
    benchmarkFertilizerKgPerAcre: 40,
    benchmarkElectricityUnitsPerMonth: 35,
    marketDemand: "moderate",
    minPh: 6.2,
    maxPh: 8.0,
  },
  {
    name: "Groundnut",
    suitableZones: ["semi-arid", "coastal-tropical"],
    suitableSoils: ["sandy", "red", "loamy"],
    suitableSeasons: ["kharif", "zaid"],
    waterNeedLitersPerAcrePerSeason: 1_800_000,
    investmentInrPerAcre: 22000,
    yieldQuintalsPerAcre: 10,
    priceInrPerQuintal: 6100,
    benchmarkFertilizerKgPerAcre: 55,
    benchmarkElectricityUnitsPerMonth: 55,
    marketDemand: "high",
    minPh: 6.0,
    maxPh: 7.5,
  },
  {
    name: "Cotton",
    suitableZones: ["semi-arid"],
    suitableSoils: ["black", "loamy"],
    suitableSeasons: ["kharif"],
    waterNeedLitersPerAcrePerSeason: 2_400_000,
    investmentInrPerAcre: 32000,
    yieldQuintalsPerAcre: 7,
    priceInrPerQuintal: 7200,
    benchmarkFertilizerKgPerAcre: 70,
    benchmarkElectricityUnitsPerMonth: 70,
    marketDemand: "high",
    minPh: 6.0,
    maxPh: 8.2,
  },
  {
    name: "Soybean",
    suitableZones: ["semi-arid", "humid-subtropical"],
    suitableSoils: ["black", "loamy"],
    suitableSeasons: ["kharif"],
    waterNeedLitersPerAcrePerSeason: 1_600_000,
    investmentInrPerAcre: 15000,
    yieldQuintalsPerAcre: 9,
    priceInrPerQuintal: 4300,
    benchmarkFertilizerKgPerAcre: 45,
    benchmarkElectricityUnitsPerMonth: 40,
    marketDemand: "high",
    minPh: 6.0,
    maxPh: 7.5,
  },
  {
    name: "Wheat",
    suitableZones: ["humid-subtropical", "temperate-hill", "semi-arid"],
    suitableSoils: ["loamy", "alluvial", "clay"],
    suitableSeasons: ["rabi"],
    waterNeedLitersPerAcrePerSeason: 1_900_000,
    investmentInrPerAcre: 18000,
    yieldQuintalsPerAcre: 20,
    priceInrPerQuintal: 2275,
    benchmarkFertilizerKgPerAcre: 60,
    benchmarkElectricityUnitsPerMonth: 60,
    marketDemand: "very_high",
    minPh: 6.0,
    maxPh: 7.8,
  },
  {
    name: "Rice (Paddy)",
    suitableZones: ["humid-subtropical", "coastal-tropical"],
    suitableSoils: ["clay", "alluvial"],
    suitableSeasons: ["kharif"],
    waterNeedLitersPerAcrePerSeason: 4_500_000,
    investmentInrPerAcre: 26000,
    yieldQuintalsPerAcre: 24,
    priceInrPerQuintal: 2183,
    benchmarkFertilizerKgPerAcre: 90,
    benchmarkElectricityUnitsPerMonth: 110,
    marketDemand: "very_high",
    minPh: 5.5,
    maxPh: 7.0,
  },
  {
    name: "Maize",
    suitableZones: ["humid-subtropical", "semi-arid"],
    suitableSoils: ["loamy", "alluvial", "red"],
    suitableSeasons: ["kharif", "rabi"],
    waterNeedLitersPerAcrePerSeason: 1_700_000,
    investmentInrPerAcre: 16000,
    yieldQuintalsPerAcre: 22,
    priceInrPerQuintal: 2090,
    benchmarkFertilizerKgPerAcre: 65,
    benchmarkElectricityUnitsPerMonth: 45,
    marketDemand: "high",
    minPh: 5.8,
    maxPh: 7.5,
  },
  {
    name: "Sugarcane",
    suitableZones: ["humid-subtropical", "coastal-tropical"],
    suitableSoils: ["loamy", "alluvial", "clay"],
    suitableSeasons: ["zaid", "kharif"],
    waterNeedLitersPerAcrePerSeason: 8_500_000,
    investmentInrPerAcre: 48000,
    yieldQuintalsPerAcre: 320,
    priceInrPerQuintal: 340,
    benchmarkFertilizerKgPerAcre: 120,
    benchmarkElectricityUnitsPerMonth: 160,
    marketDemand: "high",
    minPh: 6.0,
    maxPh: 7.8,
  },
  {
    name: "Mustard",
    suitableZones: ["arid", "semi-arid"],
    suitableSoils: ["sandy", "loamy", "alluvial"],
    suitableSeasons: ["rabi"],
    waterNeedLitersPerAcrePerSeason: 700_000,
    investmentInrPerAcre: 10500,
    yieldQuintalsPerAcre: 8,
    priceInrPerQuintal: 5450,
    benchmarkFertilizerKgPerAcre: 40,
    benchmarkElectricityUnitsPerMonth: 25,
    marketDemand: "high",
    minPh: 6.0,
    maxPh: 8.3,
  },
  {
    name: "Onion",
    suitableZones: ["semi-arid"],
    suitableSoils: ["loamy", "black"],
    suitableSeasons: ["rabi", "zaid"],
    waterNeedLitersPerAcrePerSeason: 1_500_000,
    investmentInrPerAcre: 38000,
    yieldQuintalsPerAcre: 90,
    priceInrPerQuintal: 1450,
    benchmarkFertilizerKgPerAcre: 75,
    benchmarkElectricityUnitsPerMonth: 60,
    marketDemand: "very_high",
    minPh: 6.0,
    maxPh: 7.5,
  },
  {
    name: "Potato",
    suitableZones: ["temperate-hill", "humid-subtropical"],
    suitableSoils: ["loamy", "sandy"],
    suitableSeasons: ["rabi"],
    waterNeedLitersPerAcrePerSeason: 1_300_000,
    investmentInrPerAcre: 42000,
    yieldQuintalsPerAcre: 100,
    priceInrPerQuintal: 1150,
    benchmarkFertilizerKgPerAcre: 85,
    benchmarkElectricityUnitsPerMonth: 55,
    marketDemand: "high",
    minPh: 5.0,
    maxPh: 6.5,
  },
  {
    name: "Banana",
    suitableZones: ["coastal-tropical"],
    suitableSoils: ["alluvial", "loamy"],
    suitableSeasons: ["kharif", "zaid"],
    waterNeedLitersPerAcrePerSeason: 5_200_000,
    investmentInrPerAcre: 65000,
    yieldQuintalsPerAcre: 350,
    priceInrPerQuintal: 950,
    benchmarkFertilizerKgPerAcre: 130,
    benchmarkElectricityUnitsPerMonth: 130,
    marketDemand: "high",
    minPh: 6.0,
    maxPh: 7.5,
  },
];

export function findDistrict(name: string): DistrictProfile | undefined {
  const normalized = name.trim().toLowerCase();
  return DISTRICTS.find((d) => d.name.toLowerCase() === normalized);
}

export function getSeasonRainMultiplier(season: "kharif" | "rabi" | "zaid"): number {
  return SEASON_RAIN_MULTIPLIER[season];
}

export interface DiseaseProfile {
  crop: string;
  name: string;
  symptoms: string[];
  baseSeverity: number;
  description: string;
  organicTreatment: string[];
  chemicalTreatment: string[];
  scheme: string;
}

export const DISEASES: DiseaseProfile[] = [
  {
    crop: "Rice (Paddy)",
    name: "Bacterial Leaf Blight",
    symptoms: ["yellowing leaves", "water-soaked lesions", "wilting"],
    baseSeverity: 62,
    description: "A bacterial infection causing yellow-to-white lesions along leaf veins, spreading fast in humid, waterlogged conditions.",
    organicTreatment: ["Apply neem-based bio-pesticide spray", "Improve field drainage to reduce standing water", "Use resistant seed varieties in next sowing"],
    chemicalTreatment: ["Apply Streptocycline + Copper Oxychloride spray as per local agriculture office dosage", "Avoid excess nitrogen fertilizer during outbreak"],
    scheme: "PM Kisan Samman Nidhi + State Crop Health Advisory",
  },
  {
    crop: "Rice (Paddy)",
    name: "Rice Blast",
    symptoms: ["brown spots", "leaf curling", "stunted growth"],
    baseSeverity: 70,
    description: "A fungal disease producing diamond-shaped brown lesions on leaves, capable of destroying entire panicles if untreated.",
    organicTreatment: ["Spray Trichoderma-based bio-fungicide", "Maintain balanced potassium application", "Remove and destroy infected plant debris"],
    chemicalTreatment: ["Apply Tricyclazole 75% WP as per recommended dose", "Repeat spray after 10-12 days if symptoms persist"],
    scheme: "PMFBY Crop Insurance Claim Support",
  },
  {
    crop: "Cotton",
    name: "Pink Bollworm Infestation",
    symptoms: ["holes in bolls", "wilting", "stunted growth"],
    baseSeverity: 68,
    description: "Larvae bore into cotton bolls, damaging lint and seed quality, especially severe in late-season crop.",
    organicTreatment: ["Install pheromone traps at 5 per acre", "Release Trichogramma parasitoids", "Practice timely crop residue destruction after harvest"],
    chemicalTreatment: ["Spray recommended Bt-compatible insecticide as per district advisory", "Avoid indiscriminate broad-spectrum sprays"],
    scheme: "Cotton Technology Mission Support",
  },
  {
    crop: "Wheat",
    name: "Yellow Rust",
    symptoms: ["yellow stripes", "leaf curling", "brown spots"],
    baseSeverity: 58,
    description: "A fungal rust producing yellow-orange pustules in stripes along leaves, thriving in cool, humid weather.",
    organicTreatment: ["Spray Trichoderma viride solution early morning", "Choose rust-resistant wheat varieties next season"],
    chemicalTreatment: ["Apply Propiconazole 25% EC at first sign of infection", "Second spray after 15 days if humidity remains high"],
    scheme: "Soil Health Card + State Wheat Advisory",
  },
  {
    crop: "Soybean",
    name: "Yellow Mosaic Virus",
    symptoms: ["yellowing leaves", "mottled leaves", "stunted growth"],
    baseSeverity: 64,
    description: "A whitefly-transmitted virus causing yellow mosaic patterns and severely reduced pod formation.",
    organicTreatment: ["Use yellow sticky traps to control whitefly vector", "Apply neem oil spray at 5ml/litre weekly"],
    chemicalTreatment: ["Apply recommended systemic insecticide to control whitefly population", "Remove and destroy infected plants promptly"],
    scheme: "PMFBY Crop Insurance Claim Support",
  },
  {
    crop: "Groundnut",
    name: "Tikka Leaf Spot",
    symptoms: ["brown spots", "yellowing leaves", "leaf curling"],
    baseSeverity: 55,
    description: "A fungal leaf spot disease that reduces photosynthetic area and pod filling if left unmanaged.",
    organicTreatment: ["Spray neem oil or Trichoderma-based formulation", "Practice crop rotation with cereals"],
    chemicalTreatment: ["Apply Chlorothalonil or Mancozeb spray at 15-day intervals", "Ensure adequate potassium nutrition"],
    scheme: "State Oilseed Mission Support",
  },
  {
    crop: "Sugarcane",
    name: "Red Rot",
    symptoms: ["wilting", "reddening of stem", "stunted growth"],
    baseSeverity: 75,
    description: "A destructive fungal disease that rots the internal stem tissue, drastically cutting sugar recovery.",
    organicTreatment: ["Use disease-free certified setts for planting", "Practice 2-year crop rotation with non-host crops"],
    chemicalTreatment: ["Treat setts with Carbendazim solution before planting", "Remove and burn infected clumps immediately"],
    scheme: "Sugarcane Development Fund",
  },
  {
    crop: "Onion",
    name: "Purple Blotch",
    symptoms: ["purple lesions", "leaf curling", "wilting"],
    baseSeverity: 57,
    description: "A fungal disease producing purplish-brown lesions on leaves, spreading rapidly in humid weather.",
    organicTreatment: ["Spray Trichoderma-based bio-fungicide at first symptoms", "Avoid overhead irrigation to reduce leaf wetness"],
    chemicalTreatment: ["Apply Mancozeb 75% WP spray at 10-day intervals", "Ensure balanced potash application"],
    scheme: "National Horticulture Mission Support",
  },
  {
    crop: "Maize",
    name: "Fall Armyworm",
    symptoms: ["holes in leaves", "stunted growth", "wilting"],
    baseSeverity: 66,
    description: "An invasive pest whose larvae feed heavily on leaf whorls, causing ragged holes and yield loss.",
    organicTreatment: ["Apply neem seed kernel extract spray", "Hand-pick and destroy egg masses early in infestation"],
    chemicalTreatment: ["Apply recommended larvicide directly into leaf whorl", "Rotate insecticide groups to prevent resistance"],
    scheme: "National Food Security Mission Support",
  },
  {
    crop: "Potato",
    name: "Late Blight",
    symptoms: ["brown spots", "wilting", "water-soaked lesions"],
    baseSeverity: 72,
    description: "A fast-spreading fungal-like disease causing dark water-soaked lesions on leaves and tuber rot in humid weather.",
    organicTreatment: ["Spray Bordeaux mixture (copper-based) preventively", "Improve field drainage and spacing for airflow"],
    chemicalTreatment: ["Apply Metalaxyl + Mancozeb combination spray", "Repeat every 7-10 days during humid spells"],
    scheme: "National Horticulture Mission Support",
  },
];

export function listSymptomsForCrop(crop: string): string[] {
  const symptomSet = new Set<string>();
  for (const disease of DISEASES) {
    if (disease.crop === crop) {
      for (const symptom of disease.symptoms) symptomSet.add(symptom);
    }
  }
  if (symptomSet.size === 0) {
    ["yellowing leaves", "brown spots", "wilting", "stunted growth", "leaf curling"].forEach((s) =>
      symptomSet.add(s),
    );
  }
  return Array.from(symptomSet);
}
