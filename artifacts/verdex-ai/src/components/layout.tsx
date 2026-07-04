import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/schemes", label: "Schemes" },
    { href: "/assistant", label: "Assistant" },
    { href: "/emergency", label: "Emergency" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-sm">
              V
            </span>
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">Verdex AI</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:flex rounded-full px-6 border-primary/20 hover:border-primary/50 text-primary">
              Log In
            </Button>
            <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
              Start Free
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border/40 py-8 md:py-12 mt-20">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2 px-8">
            <span className="h-6 w-6 rounded-md bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">V</span>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built for the future of Indian agriculture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
