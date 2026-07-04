import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useGetPlatformStats } from "@workspace/api-client-react";

export default function Home() {
  const { data: stats } = useGetPlatformStats();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden w-full pt-24 pb-32 lg:pt-36 lg:pb-40 px-4 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-[-1]" />
        <div className="container mx-auto max-w-6xl flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground mb-8 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
            Empowering Every <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Farmer with AI</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 fill-mode-both leading-relaxed">
            Predict climate risk, optimize resources, and build resilient agriculture with a powerful intelligence platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto rounded-full h-14 px-8 text-base shadow-lg shadow-primary/25">
                Start Free
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full h-14 px-8 text-base border-border bg-background/50 backdrop-blur-sm hover:bg-muted">
                View Dashboard
              </Button>
            </Link>
            <Link href="/assistant" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto rounded-full h-14 px-8 text-base hover:text-primary">
                Explore AI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {[
              { label: "Farmers Empowered", value: stats?.farmersEmpowered ?? "..." },
              { label: "Districts Covered", value: stats?.districtsCovered ?? "..." },
              { label: "AI Predictions", value: stats?.aiPredictionsGenerated ?? "..." },
              { label: "Water Saved (L)", value: stats?.waterSavedLiters ?? "..." },
              { label: "Carbon Reduced (Kg)", value: stats?.carbonReducedKg ?? "..." },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{stat.value}</span>
                <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Features */}
      <section className="py-32 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Special Innovations</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Flagship tools engineered to transform agriculture decision-making.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Farm Digital Twin</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Simulate future weather, yield, disease, water, and profit before making real-world decisions.</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">AI Resilience Score</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Comprehensive 0-100 scoring based on climate readiness, water, soil health, and financial risk.</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">National Ag Intel Map</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Interactive India-wide view of crop health, water stress, disease, and climate risk.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Architecture */}
      <section className="py-32 bg-slate-950 text-slate-50 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Enterprise Cloud Architecture</h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto mb-16">Built on the industry's most robust AI and data foundation.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Vertex AI", "Gemini API", "Cloud Run", "Firestore", "Cloud Storage", "Google Maps API", "BigQuery", "Earth Engine", "Cloud Vision", "Firebase"].map(tech => (
              <span key={tech} className="px-6 py-3 rounded-full border border-slate-800 bg-slate-900 text-slate-300 font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
