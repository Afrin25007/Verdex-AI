import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface EmergencyProtocol {
  title: string;
  color: string;
  icon: string;
  actions: string[];
  fullProtocol: { phase: string; steps: string[] }[];
}

const emergencies: EmergencyProtocol[] = [
  {
    title: "Flood",
    color: "bg-blue-500",
    icon: "🌊",
    actions: ["Move livestock to higher ground", "Secure documents in waterproof bags", "Turn off main power"],
    fullProtocol: [
      {
        phase: "Before (Warning Received)",
        steps: [
          "Move livestock and machinery to higher ground immediately",
          "Store seeds, fertilizer, and grain in waterproof, elevated storage",
          "Secure land documents, Kisan Credit Card, and insurance papers in a waterproof bag",
          "Turn off main electricity supply to farm buildings and pump houses",
          "Harvest any crop that is close to maturity if time permits",
        ],
      },
      {
        phase: "During the Flood",
        steps: [
          "Move to higher ground or the nearest designated flood shelter",
          "Avoid walking or driving through flowing water",
          "Do not return to fields until authorities declare it safe",
          "Keep the Kisan Call Centre number handy for guidance",
        ],
      },
      {
        phase: "After the Flood",
        steps: [
          "Inspect fields for silt deposits, waterlogging, and crop damage before re-entry",
          "Test soil and standing water before irrigation resumes",
          "Document crop and property damage with photos for insurance (PMFBY) claims",
          "Apply for PMFBY crop loss compensation within the claim window",
          "Avoid consuming or feeding livestock flood-affected produce",
        ],
      },
    ],
  },
  {
    title: "Cyclone",
    color: "bg-purple-600",
    icon: "🌪️",
    actions: ["Harvest mature crops immediately", "Prune tree branches", "Secure loose farm equipment"],
    fullProtocol: [
      {
        phase: "Before (48-72 Hours Notice)",
        steps: [
          "Harvest any mature or near-mature crop immediately",
          "Prune weak tree branches and stake young plants and saplings",
          "Secure or store loose farm equipment, tarps, and greenhouse sheeting",
          "Reinforce or tie down poly-house and shed structures",
          "Store extra drinking water and fuel for generators",
        ],
      },
      {
        phase: "During the Cyclone",
        steps: [
          "Stay indoors in a strong structure away from windows",
          "Keep livestock in secured, sturdy shelters, not open fields",
          "Do not attempt to inspect fields or repair damage mid-storm",
        ],
      },
      {
        phase: "After the Cyclone",
        steps: [
          "Check for waterlogging, lodging (fallen crops), and broken irrigation lines",
          "Drain standing water quickly to prevent root rot",
          "Stake and prop up lodged plants where recovery is possible",
          "Document damage with photos and file a PMFBY claim promptly",
          "Watch for pest and disease outbreaks in the following 2-3 weeks",
        ],
      },
    ],
  },
  {
    title: "Drought",
    color: "bg-amber-500",
    icon: "☀️",
    actions: ["Deploy mulching to retain moisture", "Activate drip irrigation", "Check insurance eligibility"],
    fullProtocol: [
      {
        phase: "Early Warning Signs",
        steps: [
          "Monitor soil moisture regularly and switch to drip or sprinkler irrigation",
          "Apply organic or plastic mulch to reduce soil moisture evaporation",
          "Prioritize water for critical growth stages (flowering, grain-filling)",
          "Consider short-duration, drought-tolerant crop varieties for the next season",
        ],
      },
      {
        phase: "During Prolonged Dry Spell",
        steps: [
          "Reduce irrigation frequency but increase depth per session to encourage deep roots",
          "Remove weeds promptly as they compete for scarce soil moisture",
          "Apply potassium-based fertilizer to improve drought tolerance",
          "Check eligibility for PMFBY drought/dry-spell compensation and state relief schemes",
        ],
      },
      {
        phase: "Recovery Planning",
        steps: [
          "Get soil tested before the next sowing cycle via the Soil Health Card scheme",
          "Plan crop rotation with legumes to restore soil nitrogen and structure",
          "Explore PM-KUSUM solar pump subsidies to reduce irrigation costs long-term",
        ],
      },
    ],
  },
  {
    title: "Disease Outbreak",
    color: "bg-red-500",
    icon: "🦠",
    actions: ["Isolate affected areas", "Take photos for Crop Doctor", "Contact local KVK"],
    fullProtocol: [
      {
        phase: "Immediate Containment",
        steps: [
          "Isolate and mark the affected plot to prevent spread to healthy areas",
          "Avoid working between infected and healthy plants without cleaning tools",
          "Take clear photos of affected leaves/stems and run them through Crop Doctor",
          "Remove and safely destroy (burn or bury) severely infected plant material",
        ],
      },
      {
        phase: "Diagnosis & Treatment",
        steps: [
          "Cross-check Crop Doctor's diagnosis with your local Krishi Vigyan Kendra (KVK)",
          "Apply the recommended fungicide/pesticide at correct dosage — avoid overuse",
          "Improve field drainage and spacing to reduce humidity around plants",
          "Avoid overhead irrigation on infected plots; switch to drip if possible",
        ],
      },
      {
        phase: "Prevention Going Forward",
        steps: [
          "Rotate crops next season to break the disease/pest cycle",
          "Use certified, disease-resistant seed varieties",
          "Report large-scale outbreaks to the local agriculture department for regional alerts",
        ],
      },
    ],
  },
];

export default function Emergency() {
  const [selected, setSelected] = useState<EmergencyProtocol | null>(null);

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 flex flex-col gap-8">
      <div className="bg-destructive/10 border border-destructive/20 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center">
        <div className="h-16 w-16 bg-destructive text-destructive-foreground rounded-2xl flex items-center justify-center font-bold text-2xl mb-6 shadow-lg shadow-destructive/20 animate-pulse">
          !
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-destructive mb-4">Emergency Mode</h1>
        <p className="text-lg text-foreground/80 max-w-2xl">
          Immediate action checklists and contacts for extreme weather events and agricultural emergencies.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {emergencies.map(em => (
          <Card key={em.title} className="shadow-sm border-border overflow-hidden group">
            <div className={`h-2 w-full ${em.color}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <span className="text-3xl grayscale grayscale-0 group-hover:grayscale-0 transition-all">{em.icon}</span>
                {em.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {em.actions.map(action => (
                  <li key={action} className="flex items-start gap-3 text-foreground/80">
                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs mt-0.5 shrink-0 border">✓</div>
                    {action}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full rounded-full border-border"
                onClick={() => setSelected(em)}
              >
                View Full Protocol
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 bg-card border rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div>
          <h3 className="text-xl font-bold mb-1">National Emergency Helpline</h3>
          <p className="text-muted-foreground">Kisan Call Centre (KCC)</p>
        </div>
        <div className="text-3xl md:text-4xl font-black text-primary tracking-wider">
          1800-180-1551
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  <span className="text-3xl">{selected.icon}</span>
                  {selected.title} — Full Protocol
                </DialogTitle>
                <DialogDescription>
                  Step-by-step guidance covering before, during, and after the emergency.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-6 mt-2">
                {selected.fullProtocol.map(phase => (
                  <div key={phase.phase}>
                    <h4 className="font-semibold text-base mb-3 text-primary">{phase.phase}</h4>
                    <ul className="space-y-2">
                      {phase.steps.map(step => (
                        <li key={step} className="flex items-start gap-3 text-sm text-foreground/80">
                          <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs mt-0.5 shrink-0 border">✓</div>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
