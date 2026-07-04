export interface MarketPriceEntry {
  crop: string;
  pricePerQuintalInr: number;
  trend: "rising" | "stable" | "falling";
  demandForecast: "low" | "moderate" | "high" | "very_high";
  nearestMandi: string;
}

export const MARKET_PRICES: MarketPriceEntry[] = [
  { crop: "Wheat", pricePerQuintalInr: 2310, trend: "rising", demandForecast: "very_high", nearestMandi: "Ludhiana Grain Market" },
  { crop: "Rice (Paddy)", pricePerQuintalInr: 2205, trend: "stable", demandForecast: "very_high", nearestMandi: "Thanjavur APMC" },
  { crop: "Cotton", pricePerQuintalInr: 7340, trend: "rising", demandForecast: "high", nearestMandi: "Coimbatore Cotton Market" },
  { crop: "Soybean", pricePerQuintalInr: 4260, trend: "falling", demandForecast: "high", nearestMandi: "Vidisha Krishi Upaj Mandi" },
  { crop: "Groundnut", pricePerQuintalInr: 6180, trend: "rising", demandForecast: "high", nearestMandi: "Anantapur APMC" },
  { crop: "Maize", pricePerQuintalInr: 2110, trend: "stable", demandForecast: "high", nearestMandi: "Meerut Grain Market" },
  { crop: "Sugarcane", pricePerQuintalInr: 345, trend: "stable", demandForecast: "high", nearestMandi: "Meerut Sugar Mill Yard" },
  { crop: "Mustard", pricePerQuintalInr: 5510, trend: "rising", demandForecast: "high", nearestMandi: "Bikaner Oilseed Mandi" },
  { crop: "Onion", pricePerQuintalInr: 1620, trend: "rising", demandForecast: "very_high", nearestMandi: "Nashik Onion Market" },
  { crop: "Potato", pricePerQuintalInr: 1090, trend: "falling", demandForecast: "moderate", nearestMandi: "Almora Vegetable Mandi" },
  { crop: "Banana", pricePerQuintalInr: 980, trend: "stable", demandForecast: "high", nearestMandi: "East Godavari Fruit Market" },
  { crop: "Bajra (Pearl Millet)", pricePerQuintalInr: 2410, trend: "stable", demandForecast: "moderate", nearestMandi: "Jaisalmer Grain Market" },
];
