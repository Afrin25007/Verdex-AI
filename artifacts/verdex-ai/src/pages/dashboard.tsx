import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  useGetMarketPrices, 
  useCalculateResilienceScore, 
  useListDistricts, 
  useGetClimateForecast,
  useListDiagnosableCrops,
  useDiagnoseCrop,
  useRecommendIrrigation,
  useAnalyzeSoil,
  useGenerateCropPlan,
  useOptimizeResources,
  ClimateForecastInputSeason,
  IrrigationInputSeason,
  IrrigationInputSoilType,
  CropPlanInputSeason,
  CropPlanInputSoilType,
  CropPlanInputWaterAvailability
} from "@workspace/api-client-react";

export default function Dashboard() {
  const [district, setDistrict] = useState("Pune");
  
  const { data: prices } = useGetMarketPrices();
  const { data: districts } = useListDistricts();
  const { data: diagnosableCrops } = useListDiagnosableCrops();

  // Climate Shield State
  const [climateSeason, setClimateSeason] = useState<ClimateForecastInputSeason>("kharif");
  const getForecast = useGetClimateForecast();

  // Resilience Score State
  const [factors, setFactors] = useState({
    climateReadiness: [50],
    waterAvailability: [50],
    cropDiversity: [50],
    soilHealth: [50],
    financialRisk: [50],
    biodiversity: [50]
  });
  const calculateScore = useCalculateResilienceScore();

  // Crop Doctor State
  const [docCrop, setDocCrop] = useState("");
  const [docSymptoms, setDocSymptoms] = useState<string[]>([]);
  const diagnoseCrop = useDiagnoseCrop();

  // Smart Irrigation State
  const [irrigCrop, setIrrigCrop] = useState("Wheat");
  const [irrigSoil, setIrrigSoil] = useState<IrrigationInputSoilType>("loamy");
  const [irrigAcres, setIrrigAcres] = useState("5");
  const [irrigSeason, setIrrigSeason] = useState<IrrigationInputSeason>("rabi");
  const recommendIrrigation = useRecommendIrrigation();

  // Soil Intelligence State
  const [soilN, setSoilN] = useState("100");
  const [soilP, setSoilP] = useState("50");
  const [soilK, setSoilK] = useState("50");
  const [soilPh, setSoilPh] = useState("6.5");
  const [soilOc, setSoilOc] = useState("0.8");
  const analyzeSoil = useAnalyzeSoil();

  // AI Crop Planner
  const [planDistrict, setPlanDistrict] = useState("Pune");
  const [planAcres, setPlanAcres] = useState("5");
  const [planBudget, setPlanBudget] = useState("50000");
  const [planWater, setPlanWater] = useState<CropPlanInputWaterAvailability>("medium");
  const [planSoil, setPlanSoil] = useState<CropPlanInputSoilType>("loamy");
  const [planSeason, setPlanSeason] = useState<CropPlanInputSeason>("kharif");
  const generatePlan = useGenerateCropPlan();

  // Resource Optimizer
  const [optCrop, setOptCrop] = useState("Rice");
  const [optAcres, setOptAcres] = useState("5");
  const [optFert, setOptFert] = useState("200");
  const [optWater, setOptWater] = useState("1000000");
  const [optElec, setOptElec] = useState("500");
  const optimizeResources = useOptimizeResources();

  const handleDiagnose = () => {
    if (!docCrop || docSymptoms.length === 0) return;
    diagnoseCrop.mutate({
      data: {
        crop: docCrop,
        symptoms: docSymptoms,
        imageProvided: true
      }
    });
  };

  const handleIrrigation = () => {
    recommendIrrigation.mutate({
      data: {
        crop: irrigCrop,
        soilType: irrigSoil,
        landSizeAcres: Number(irrigAcres),
        season: irrigSeason
      }
    });
  };

  const handleSoil = () => {
    analyzeSoil.mutate({
      data: {
        nitrogenKgHa: Number(soilN),
        phosphorusKgHa: Number(soilP),
        potassiumKgHa: Number(soilK),
        ph: Number(soilPh),
        organicCarbonPercent: Number(soilOc)
      }
    });
  };

  const handleCropPlan = () => {
    generatePlan.mutate({
      data: {
        district: planDistrict,
        landSizeAcres: Number(planAcres),
        budgetInr: Number(planBudget),
        waterAvailability: planWater,
        soilType: planSoil,
        season: planSeason
      }
    });
  };

  const handleOptimize = () => {
    optimizeResources.mutate({
      data: {
        crop: optCrop,
        landSizeAcres: Number(optAcres),
        currentFertilizerKgPerAcre: Number(optFert),
        currentWaterLitersPerAcre: Number(optWater),
        currentElectricityUnitsPerMonth: Number(optElec)
      }
    });
  };

  const availableSymptoms = useMemo(() => {
    return diagnosableCrops?.find(c => c.crop === docCrop)?.availableSymptoms || [];
  }, [docCrop, diagnosableCrops]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
          <p className="text-muted-foreground mt-1">AI Decision Support & Intelligence</p>
        </div>
        <div className="flex items-center gap-3 bg-card border rounded-full px-4 py-2 shadow-sm hover-elevate">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold">F</div>
          <div>
            <div className="text-sm font-semibold">Demo Farmer</div>
            <div className="text-xs text-muted-foreground">{district}, India</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Market & Score */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card className="shadow-sm border-border overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4 border-b">
              <CardTitle className="text-lg">Live Market Prices</CardTitle>
              <CardDescription>Local Mandi Rates</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {prices?.map((p, i) => (
                  <div key={i} className="flex justify-between items-center p-4 hover:bg-muted/10 transition-colors">
                    <div>
                      <div className="font-semibold">{p.crop}</div>
                      <div className="text-xs text-muted-foreground">{p.nearestMandi}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">₹{p.pricePerQuintalInr}</div>
                      <div className="text-xs text-muted-foreground capitalize flex items-center justify-end gap-1">
                        {p.trend === 'rising' && <span className="text-destructive">↑</span>}
                        {p.trend === 'falling' && <span className="text-primary">↓</span>}
                        {p.trend === 'stable' && <span className="text-muted-foreground">-</span>}
                        {p.trend}
                      </div>
                    </div>
                  </div>
                ))}
                {!prices && <div className="p-8 text-center text-sm text-muted-foreground">Loading prices...</div>}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border bg-gradient-to-br from-card to-muted/20">
            <CardHeader>
              <CardTitle>AI Resilience Score</CardTitle>
              <CardDescription>Simulate your farm's readiness</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="space-y-4">
                {Object.entries(factors).map(([key, val]) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                      <span className="text-muted-foreground">{val[0]}%</span>
                    </div>
                    <Slider 
                      value={val} 
                      max={100} 
                      step={1} 
                      onValueChange={(v) => setFactors(prev => ({...prev, [key]: v}))} 
                    />
                  </div>
                ))}
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col items-center justify-center mt-2">
                {calculateScore.data ? (
                  <div className="text-center animate-in zoom-in-95">
                    <div className="text-sm text-primary font-medium mb-1">Projected Score</div>
                    <div className="text-5xl font-extrabold text-foreground">{calculateScore.data.overallScore}<span className="text-xl text-muted-foreground font-normal">/100</span></div>
                    <Badge variant={calculateScore.data.overallScore > 70 ? "default" : "secondary"} className="mt-3">
                      {calculateScore.data.rating}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-sm text-primary font-medium mb-1">Projected Score</div>
                    <div className="text-4xl font-extrabold text-foreground">--<span className="text-lg text-muted-foreground font-normal">/100</span></div>
                  </div>
                )}
                <Button 
                  onClick={() => calculateScore.mutate({ data: {
                    climateReadiness: factors.climateReadiness[0], 
                    waterAvailability: factors.waterAvailability[0], 
                    cropDiversity: factors.cropDiversity[0], 
                    soilHealth: factors.soilHealth[0], 
                    financialRisk: factors.financialRisk[0], 
                    biodiversity: factors.biodiversity[0]
                  }})} 
                  disabled={calculateScore.isPending}
                  className="rounded-full shadow-md mt-6 w-full"
                >
                  {calculateScore.isPending ? "Calculating..." : "Calculate Full Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Main Content - Modules */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="climate" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1 mb-6 bg-muted/50 rounded-2xl overflow-hidden">
              <TabsTrigger value="climate" className="rounded-xl py-2.5 text-xs md:text-sm">Climate</TabsTrigger>
              <TabsTrigger value="doctor" className="rounded-xl py-2.5 text-xs md:text-sm">Doctor</TabsTrigger>
              <TabsTrigger value="irrigation" className="rounded-xl py-2.5 text-xs md:text-sm">Water</TabsTrigger>
              <TabsTrigger value="soil" className="rounded-xl py-2.5 text-xs md:text-sm">Soil</TabsTrigger>
              <TabsTrigger value="planner" className="rounded-xl py-2.5 text-xs md:text-sm">Planner</TabsTrigger>
              <TabsTrigger value="optimizer" className="rounded-xl py-2.5 text-xs md:text-sm">Optimize</TabsTrigger>
            </TabsList>

            <TabsContent value="climate" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Climate Shield Forecast</CardTitle>
                  <CardDescription>Predict climate risk for your district</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>District</Label>
                      <Select value={district} onValueChange={setDistrict}>
                        <SelectTrigger><SelectValue placeholder="Select District" /></SelectTrigger>
                        <SelectContent>
                          {districts?.map(d => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Season</Label>
                      <Select value={climateSeason} onValueChange={(v) => setClimateSeason(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kharif">Kharif</SelectItem>
                          <SelectItem value="rabi">Rabi</SelectItem>
                          <SelectItem value="zaid">Zaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={() => getForecast.mutate({ data: { district, season: climateSeason } })} disabled={getForecast.isPending}>
                    Get AI Forecast
                  </Button>

                  {getForecast.data && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t animate-in slide-in-from-bottom-4">
                      <div className="bg-muted p-4 rounded-xl text-center">
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">7-Day Rain</div>
                        <div className="text-xl font-bold">{getForecast.data.rainfall7DayMm} mm</div>
                      </div>
                      <div className="bg-muted p-4 rounded-xl text-center">
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">30-Day Rain</div>
                        <div className="text-xl font-bold">{getForecast.data.rainfall30DayMm} mm</div>
                      </div>
                      <div className="bg-muted p-4 rounded-xl text-center">
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Heatwave</div>
                        <div className={`text-xl font-bold capitalize ${getForecast.data.heatwaveRisk === 'severe' ? 'text-destructive' : ''}`}>{getForecast.data.heatwaveRisk}</div>
                      </div>
                      <div className="bg-muted p-4 rounded-xl text-center">
                        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Drought</div>
                        <div className={`text-xl font-bold capitalize ${getForecast.data.droughtRisk === 'severe' ? 'text-destructive' : ''}`}>{getForecast.data.droughtRisk}</div>
                      </div>
                      <div className="col-span-full bg-primary/5 p-4 rounded-xl text-sm text-foreground/80 mt-2">
                        <strong>Outlook:</strong> {getForecast.data.seasonOutlook}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doctor" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Crop Doctor</CardTitle>
                  <CardDescription>Instant disease diagnosis and treatment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Crop</Label>
                      <Select value={docCrop} onValueChange={(v) => { setDocCrop(v); setDocSymptoms([]); }}>
                        <SelectTrigger><SelectValue placeholder="Choose a crop" /></SelectTrigger>
                        <SelectContent>
                          {diagnosableCrops?.map(c => <SelectItem key={c.crop} value={c.crop}>{c.crop}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {docCrop && (
                      <div className="space-y-3">
                        <Label>Select Symptoms</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {availableSymptoms.map(sym => (
                            <label key={sym} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                              <input 
                                type="checkbox" 
                                className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                                checked={docSymptoms.includes(sym)}
                                onChange={(e) => {
                                  if (e.target.checked) setDocSymptoms(prev => [...prev, sym]);
                                  else setDocSymptoms(prev => prev.filter(s => s !== sym));
                                }}
                              />
                              <span className="text-sm font-medium">{sym}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch id="photo" defaultChecked />
                      <Label htmlFor="photo">Include AI photo analysis (simulated)</Label>
                    </div>
                  </div>

                  <Button onClick={handleDiagnose} disabled={diagnoseCrop.isPending || !docCrop || docSymptoms.length === 0} className="w-full">
                    {diagnoseCrop.isPending ? "Analyzing..." : "Diagnose Issue"}
                  </Button>

                  {diagnoseCrop.data && (
                    <div className="mt-6 p-6 rounded-2xl bg-destructive/5 border border-destructive/20 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-destructive">{diagnoseCrop.data.diseaseName}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{diagnoseCrop.data.description}</p>
                        </div>
                        <Badge variant="destructive" className="text-lg px-3 py-1">{diagnoseCrop.data.confidence}% Match</Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-foreground/80 uppercase tracking-wider">Organic Treatment</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground ml-4">
                            {diagnoseCrop.data.organicTreatment.map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 text-foreground/80 uppercase tracking-wider">Chemical Treatment</h4>
                          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground ml-4">
                            {diagnoseCrop.data.chemicalTreatment.map((t, i) => <li key={i}>{t}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="bg-background rounded-xl p-4 text-sm mt-4">
                        <span className="font-semibold text-primary">Guidance: </span>
                        {diagnoseCrop.data.nearestOfficeGuidance}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="irrigation" className="mt-0">
               <Card>
                <CardHeader>
                  <CardTitle>Smart Irrigation</CardTitle>
                  <CardDescription>Optimize water usage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <Label>Crop</Label>
                      <Input value={irrigCrop} onChange={e => setIrrigCrop(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Soil Type</Label>
                      <Select value={irrigSoil} onValueChange={(v) => setIrrigSoil(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.values(IrrigationInputSoilType) as string[]).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Land Size (Acres)</Label>
                      <Input type="number" value={irrigAcres} onChange={e => setIrrigAcres(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Season</Label>
                      <Select value={irrigSeason} onValueChange={(v) => setIrrigSeason(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.values(IrrigationInputSeason) as string[]).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleIrrigation} disabled={recommendIrrigation.isPending}>Get Irrigation Plan</Button>
                  
                  {recommendIrrigation.data && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t animate-in fade-in">
                       <div className="bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                          <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">Water Needed</div>
                          <div className="text-2xl font-bold text-foreground">{recommendIrrigation.data.totalWaterLiters.toLocaleString()} L</div>
                       </div>
                       <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Water Saved</div>
                          <div className="text-2xl font-bold text-foreground">{recommendIrrigation.data.estimatedWaterSavingsPercent}%</div>
                       </div>
                       <div className="bg-muted p-4 rounded-xl border col-span-1 sm:col-span-3">
                          <div className="text-sm font-semibold mb-1">Best Timing: {recommendIrrigation.data.bestIrrigationTiming}</div>
                          <div className="text-sm text-muted-foreground">{recommendIrrigation.data.groundwaterConservationTip}</div>
                       </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="soil" className="mt-0">
               <Card>
                <CardHeader>
                  <CardTitle>Soil Intelligence</CardTitle>
                  <CardDescription>Analyze soil health and get crop recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                     <div className="space-y-2">
                      <Label>Nitrogen (kg/ha)</Label>
                      <Input type="number" value={soilN} onChange={e => setSoilN(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Phosphorus (kg/ha)</Label>
                      <Input type="number" value={soilP} onChange={e => setSoilP(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Potassium (kg/ha)</Label>
                      <Input type="number" value={soilK} onChange={e => setSoilK(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>pH Level</Label>
                      <Input type="number" step="0.1" value={soilPh} onChange={e => setSoilPh(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Organic Carbon (%)</Label>
                      <Input type="number" step="0.1" value={soilOc} onChange={e => setSoilOc(e.target.value)} />
                    </div>
                  </div>
                  <Button onClick={handleSoil} disabled={analyzeSoil.isPending}>Analyze Soil</Button>

                  {analyzeSoil.data && (
                    <div className="space-y-4 pt-6 border-t animate-in fade-in">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="outline" className="text-lg py-1 px-4 bg-card shadow-sm">Fertility: {analyzeSoil.data.fertilityRating}</Badge>
                        <span className="text-sm font-medium text-primary">Expected Yield Uplift: +{analyzeSoil.data.expectedYieldUpliftPercent}%</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm text-center">
                        <div className="bg-muted p-2 rounded-lg"><span className="font-semibold text-muted-foreground block mb-1">N</span> {analyzeSoil.data.nitrogenLevel}</div>
                        <div className="bg-muted p-2 rounded-lg"><span className="font-semibold text-muted-foreground block mb-1">P</span> {analyzeSoil.data.phosphorusLevel}</div>
                        <div className="bg-muted p-2 rounded-lg"><span className="font-semibold text-muted-foreground block mb-1">K</span> {analyzeSoil.data.potassiumLevel}</div>
                      </div>
                      <div className="bg-primary/5 p-4 rounded-xl text-sm border border-primary/10">
                        <span className="font-semibold block mb-2">Suitable Crops:</span>
                        <div className="flex gap-2 flex-wrap">
                          {analyzeSoil.data.suitableCrops.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planner" className="mt-0">
               <Card>
                <CardHeader>
                  <CardTitle>AI Crop Planner</CardTitle>
                  <CardDescription>Get highly profitable, climate-resilient crop recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>District</Label>
                      <Input value={planDistrict} onChange={e => setPlanDistrict(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Land Size (Acres)</Label>
                      <Input type="number" value={planAcres} onChange={e => setPlanAcres(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Budget (₹)</Label>
                      <Input type="number" value={planBudget} onChange={e => setPlanBudget(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Water Avail.</Label>
                      <Select value={planWater} onValueChange={(v) => setPlanWater(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.values(CropPlanInputWaterAvailability) as string[]).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Soil Type</Label>
                      <Select value={planSoil} onValueChange={(v) => setPlanSoil(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.values(CropPlanInputSoilType) as string[]).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="space-y-2">
                      <Label>Season</Label>
                      <Select value={planSeason} onValueChange={(v) => setPlanSeason(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {(Object.values(CropPlanInputSeason) as string[]).map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleCropPlan} disabled={generatePlan.isPending} className="w-full">Generate Plan</Button>

                  {generatePlan.data && (
                    <div className="space-y-4 pt-6 border-t animate-in fade-in">
                      <h4 className="font-semibold text-lg">Recommendations for {generatePlan.data.district}</h4>
                      <div className="space-y-3">
                        {generatePlan.data.recommendations.map(rec => (
                          <div key={rec.crop} className="bg-card border rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-lg">{rec.crop}</span>
                                <Badge variant={rec.matchScore > 80 ? "default" : "secondary"}>{rec.matchScore}% Match</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground flex gap-4">
                                <span>Invest: ₹{rec.investmentInr.toLocaleString()}</span>
                                <span>Risk: {rec.riskScore}/100</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-primary">₹{rec.profitInr.toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">Expected Profit</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimizer" className="mt-0">
               <Card>
                <CardHeader>
                  <CardTitle>Resource Optimizer</CardTitle>
                  <CardDescription>Cut costs and reduce your carbon footprint</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Crop</Label>
                      <Input value={optCrop} onChange={e => setOptCrop(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Land Size (Acres)</Label>
                      <Input type="number" value={optAcres} onChange={e => setOptAcres(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Fertilizer (kg/acre)</Label>
                      <Input type="number" value={optFert} onChange={e => setOptFert(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Water (L/acre)</Label>
                      <Input type="number" value={optWater} onChange={e => setOptWater(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label>Current Electricity (units/mo)</Label>
                      <Input type="number" value={optElec} onChange={e => setOptElec(e.target.value)} />
                    </div>
                  </div>
                  <Button onClick={handleOptimize} disabled={optimizeResources.isPending}>Optimize Usage</Button>

                  {optimizeResources.data && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t animate-in fade-in">
                       <div className="bg-muted p-4 rounded-xl text-center">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fertilizer Red.</div>
                          <div className="text-xl font-bold text-primary">{optimizeResources.data.fertilizerReductionPercent}%</div>
                       </div>
                       <div className="bg-muted p-4 rounded-xl text-center">
                          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Water Red.</div>
                          <div className="text-xl font-bold text-secondary">{optimizeResources.data.waterReductionPercent}%</div>
                       </div>
                       <div className="bg-primary/10 border-primary/20 border p-4 rounded-xl text-center col-span-2">
                          <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">Estimated Savings</div>
                          <div className="text-2xl font-extrabold">₹{optimizeResources.data.estimatedCostSavingsInr.toLocaleString()}</div>
                       </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}
