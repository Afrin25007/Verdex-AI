export interface KnowledgeEntry {
  topic: string;
  keywords: string[];
  answer: string;
  relatedTopics: string[];
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    topic: "Irrigation Timing",
    keywords: ["irrigation", "water", "when to water", "watering schedule"],
    answer: "Irrigate early morning (5-8 AM) or late evening (5-7 PM) to minimize evaporation loss. Use the Smart Irrigation module to get a crop and soil-specific watering plan with exact liters per acre.",
    relatedTopics: ["Water Conservation", "Soil Moisture"],
  },
  {
    topic: "Water Conservation",
    keywords: ["save water", "conserve water", "drought", "water scarcity"],
    answer: "Drip irrigation can cut water use by 30-50% versus flood irrigation. Mulching also reduces surface evaporation by up to 25%. Consider a farm pond or rainwater harvesting structure for monsoon runoff storage.",
    relatedTopics: ["Irrigation Timing", "Drought Risk"],
  },
  {
    topic: "Fertilizer Application",
    keywords: ["fertilizer", "npk", "nutrient", "urea", "dap"],
    answer: "Apply fertilizer based on a soil test rather than a fixed schedule. Split nitrogen into 2-3 doses across the crop cycle to reduce leaching loss and improve uptake efficiency. Use the Soil Intelligence module for a report-based recommendation.",
    relatedTopics: ["Soil Health", "Organic Farming"],
  },
  {
    topic: "Soil Health",
    keywords: ["soil health", "soil test", "ph", "organic carbon"],
    answer: "Healthy soil typically has pH 6.0-7.5, organic carbon above 0.75%, and balanced NPK. Get a free Soil Health Card every two years and rotate crops to naturally rebuild fertility.",
    relatedTopics: ["Fertilizer Application", "Organic Farming"],
  },
  {
    topic: "Organic Farming",
    keywords: ["organic", "natural farming", "compost", "biofertilizer"],
    answer: "Compost, vermicompost and biofertilizers like Rhizobium and Azotobacter build long-term soil fertility while cutting chemical input costs. Transition gradually over 2-3 seasons rather than all at once.",
    relatedTopics: ["Soil Health", "Fertilizer Application"],
  },
  {
    topic: "Pest Management",
    keywords: ["pest", "insect", "bug", "infestation"],
    answer: "Use pheromone traps for early pest detection and integrated pest management (IPM) before resorting to chemical sprays. Diagnose specific symptoms in the Crop Doctor module for a targeted treatment plan.",
    relatedTopics: ["Disease Management", "Crop Doctor"],
  },
  {
    topic: "Disease Management",
    keywords: ["disease", "fungus", "blight", "rot", "infection"],
    answer: "Most fungal diseases spread faster in humid, waterlogged conditions — improving field drainage is often as important as spraying. Use the Crop Doctor module with your observed symptoms for a specific diagnosis and treatment plan.",
    relatedTopics: ["Pest Management", "Crop Doctor"],
  },
  {
    topic: "Government Schemes",
    keywords: ["scheme", "subsidy", "government", "pm-kisan", "loan", "kcc"],
    answer: "Key schemes include PM-KISAN for direct income support, PMFBY for crop insurance, and Kisan Credit Card for affordable credit. Check the Government Scheme AI module to see which schemes you are eligible for.",
    relatedTopics: ["Crop Insurance", "Farm Credit"],
  },
  {
    topic: "Crop Insurance",
    keywords: ["insurance", "pmfby", "crop loss", "compensation"],
    answer: "PMFBY covers yield loss from drought, flood, pest and disease at a premium of just 1.5-5% of the sum insured. Enroll before the seasonal cut-off date through your bank or Common Service Centre.",
    relatedTopics: ["Government Schemes", "Climate Risk"],
  },
  {
    topic: "Climate Risk",
    keywords: ["climate", "weather", "rain", "flood", "cyclone", "heatwave"],
    answer: "Check the Climate Shield module for a district-specific 7 and 30-day rainfall outlook plus heatwave, flood, cyclone and drought risk ratings before making sowing or harvesting decisions.",
    relatedTopics: ["Crop Insurance", "Drought Risk"],
  },
  {
    topic: "Drought Risk",
    keywords: ["drought", "dry spell", "low rainfall"],
    answer: "In drought-prone zones, prefer short-duration, low-water crops like millets and pulses, and prioritize drip irrigation with mulching to preserve soil moisture.",
    relatedTopics: ["Water Conservation", "Climate Risk"],
  },
  {
    topic: "Market Prices",
    keywords: ["price", "market", "mandi", "sell", "demand"],
    answer: "Track live mandi prices and demand trends in the Marketplace module before deciding when and where to sell. e-NAM registration also widens your buyer access beyond the local mandi.",
    relatedTopics: ["Government Schemes", "Crop Planning"],
  },
  {
    topic: "Crop Planning",
    keywords: ["which crop", "crop plan", "what to grow", "crop selection"],
    answer: "Use the AI Crop Planner with your land size, budget, water availability and soil type to get ranked crop recommendations with expected income, investment and risk score for your specific season.",
    relatedTopics: ["Market Prices", "Soil Health"],
  },
  {
    topic: "Resource Optimization",
    keywords: ["reduce cost", "save electricity", "optimize", "efficiency"],
    answer: "The Resource Optimizer module compares your current fertilizer, water and electricity usage against best-practice benchmarks for your crop, showing exact reduction potential and cost savings.",
    relatedTopics: ["Water Conservation", "Fertilizer Application"],
  },
];

const FALLBACK_ANSWER =
  "I do not have a specific answer for that yet, but you can explore Crop Doctor, Climate Shield, Smart Irrigation, Soil Intelligence, Crop Planner or Government Scheme AI for detailed guidance on related topics.";

export function answerQuestion(question: string): { answer: string; topic: string; relatedTopics: string[] } {
  const normalized = question.toLowerCase();
  let best: KnowledgeEntry | undefined;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    const score = entry.keywords.reduce((acc, kw) => (normalized.includes(kw) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  if (!best) {
    return { answer: FALLBACK_ANSWER, topic: "General Guidance", relatedTopics: ["Crop Planning", "Government Schemes"] };
  }

  return { answer: best.answer, topic: best.topic, relatedTopics: best.relatedTopics };
}
