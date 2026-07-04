import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Emergency() {
  const emergencies = [
    { title: "Flood", color: "bg-blue-500", icon: "🌊", actions: ["Move livestock to higher ground", "Secure documents in waterproof bags", "Turn off main power"] },
    { title: "Cyclone", color: "bg-purple-600", icon: "🌪️", actions: ["Harvest mature crops immediately", "Prune tree branches", "Secure loose farm equipment"] },
    { title: "Drought", color: "bg-amber-500", icon: "☀️", actions: ["Deploy mulching to retain moisture", "Activate drip irrigation", "Check insurance eligibility"] },
    { title: "Disease Outbreak", color: "bg-red-500", icon: "🦠", actions: ["Isolate affected areas", "Take photos for Crop Doctor", "Contact local KVK"] },
  ];

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
              <Button variant="outline" className="w-full rounded-full border-border">View Full Protocol</Button>
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
    </div>
  );
}
