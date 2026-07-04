import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useListSchemes, useMatchSchemes, GovernmentScheme } from "@workspace/api-client-react";

export default function Schemes() {
  const { data: schemes } = useListSchemes();
  const matchSchemes = useMatchSchemes();

  const [land, setLand] = useState("5");
  const [irrigated, setIrrigated] = useState("yes");
  const [crop, setCrop] = useState("Wheat");
  const [income, setIncome] = useState("100000");

  const [showMatches, setShowMatches] = useState(false);
  const [viewScheme, setViewScheme] = useState<GovernmentScheme | null>(null);
  const [applyScheme, setApplyScheme] = useState<GovernmentScheme | null>(null);

  const handleMatch = () => {
    matchSchemes.mutate({
      data: {
        landSizeAcres: Number(land),
        hasIrrigation: irrigated === "yes",
        cropType: crop,
        annualIncomeInr: Number(income)
      }
    }, {
      onSuccess: () => setShowMatches(true)
    });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center max-w-2xl mx-auto mb-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Government Scheme AI</h1>
        <p className="text-lg text-muted-foreground">Find and match with agricultural schemes you are eligible for, instantly.</p>
      </div>

      <div className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 rounded-3xl p-6 md:p-10 shadow-lg shadow-primary/5">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 w-full space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Scheme Matcher</h2>
              <p className="text-muted-foreground">Enter your farm details to let our AI find the best matching grants.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Land Size (Acres)</Label>
                <Input type="number" value={land} onChange={e => setLand(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Irrigation Access</Label>
                <Select value={irrigated} onValueChange={setIrrigated}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Primary Crop</Label>
                <Input value={crop} onChange={e => setCrop(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Annual Income (₹)</Label>
                <Input type="number" value={income} onChange={e => setIncome(e.target.value)} />
              </div>
            </div>

            <Button size="lg" onClick={handleMatch} disabled={matchSchemes.isPending} className="rounded-full px-8 shadow-md w-full md:w-auto">
              {matchSchemes.isPending ? "Analyzing..." : "Run AI Matcher"}
            </Button>
          </div>
          
          <div className="w-full md:w-1/3 aspect-square bg-white rounded-3xl border border-primary/10 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent"></div>
            <div className="text-primary font-bold text-6xl md:text-8xl drop-shadow-sm z-10">AI</div>
            <div className="mt-4 font-medium text-muted-foreground z-10 tracking-widest uppercase text-sm">Matching Engine</div>
          </div>
        </div>
      </div>

      {showMatches && matchSchemes.data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Your Eligible Matches</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {matchSchemes.data.filter(m => m.eligible).map((m) => (
              <Card key={m.scheme.id} className="shadow-md border-primary/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader>
                  <CardTitle className="text-lg leading-tight">{m.scheme.name}</CardTitle>
                  <CardDescription className="mt-1">{m.scheme.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/5 p-3 rounded-lg text-sm text-foreground/80 mb-4 border border-primary/10">
                    <span className="font-semibold">Match Reason:</span> {m.matchReason}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{m.scheme.benefitSummary}</p>
                  <Button variant="outline" size="sm" className="rounded-full w-full" onClick={() => setApplyScheme(m.scheme)}>Start Application</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">All Government Schemes</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes?.map((s) => (
            <Card key={s.id} className="shadow-sm border-border hover:shadow-md transition-all flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg leading-tight">{s.name}</CardTitle>
                <CardDescription className="mt-1">{s.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-foreground/80 mb-6 line-clamp-3">{s.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full flex-1" onClick={() => setViewScheme(s)}>Details</Button>
                  <Button size="sm" className="rounded-full flex-1" onClick={() => setApplyScheme(s)}>Apply</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!schemes && (
            <div className="col-span-full py-20 text-center text-muted-foreground animate-pulse">Loading directory...</div>
          )}
        </div>
      </div>

      <Dialog open={!!viewScheme} onOpenChange={(open) => !open && setViewScheme(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {viewScheme && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{viewScheme.name}</DialogTitle>
                <DialogDescription>{viewScheme.category}</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-6 mt-2">
                <div>
                  <h4 className="font-semibold text-base mb-2">Overview</h4>
                  <p className="text-sm text-foreground/80">{viewScheme.description}</p>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <h4 className="font-semibold text-base mb-1">Benefit</h4>
                  <p className="text-sm text-foreground/80">{viewScheme.benefitSummary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-2">Eligibility Criteria</h4>
                  <ul className="space-y-2">
                    {viewScheme.eligibilityCriteria.map((c) => (
                      <li key={c} className="flex items-start gap-3 text-sm text-foreground/80">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs mt-0.5 shrink-0 border">✓</div>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-2">Required Documents</h4>
                  <ul className="space-y-2">
                    {viewScheme.requiredDocuments.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-sm text-foreground/80">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs mt-0.5 shrink-0 border">📄</div>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  className="rounded-full w-full"
                  onClick={() => {
                    setApplyScheme(viewScheme);
                    setViewScheme(null);
                  }}
                >
                  Start Application
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!applyScheme} onOpenChange={(open) => !open && setApplyScheme(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {applyScheme && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Apply — {applyScheme.name}</DialogTitle>
                <DialogDescription>Follow these steps to complete your application.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-6 mt-2">
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <h4 className="font-semibold text-base mb-1">How to Apply</h4>
                  <p className="text-sm text-foreground/80">{applyScheme.applicationGuide}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-2">Documents You'll Need</h4>
                  <ul className="space-y-2">
                    {applyScheme.requiredDocuments.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-sm text-foreground/80">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs mt-0.5 shrink-0 border">📄</div>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-base mb-2">Confirm You're Eligible</h4>
                  <ul className="space-y-2">
                    {applyScheme.eligibilityCriteria.map((c) => (
                      <li key={c} className="flex items-start gap-3 text-sm text-foreground/80">
                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs mt-0.5 shrink-0 border">✓</div>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm text-muted-foreground">
                  Applications for this scheme are processed by the concerned government department or bank branch, not directly through Verdex AI. Use the guidance above to complete your application at the official channel.
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
