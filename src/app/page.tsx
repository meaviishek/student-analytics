import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowRight, CheckCircle2, TrendingUp, Users, Target, Building2, Download, BarChart3, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative w-full pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-background via-card to-background z-0"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-48 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Registrations Open
          </div>

          <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground tracking-tight max-w-4xl leading-[1.1]">
            Unlock Your <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent-foreground">Career Potential</span>
          </h1>

          <p className="mt-6 text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Take the Talentify assessment to discover your strengths, identify your ideal role, and accelerate your career readiness in Finance, HR, or Marketing.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <Button size="lg" variant="premium" className="group">
                Register Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-white hover:bg-slate-50 border-slate-200">
              View Assessment Details
            </Button>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="about" className="py-24 bg-card border-y border-border transition-colors">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-foreground">Who Is This For?</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Designed specifically for final and pre-final year students ready to transition into the corporate world.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg shadow-primary/5 hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">Finance Students</h3>
                <p className="text-muted-foreground leading-relaxed">Assess your analytical skills and find if you're best suited for roles like Financial Analyst, Risk Management, or Credit Officer.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-primary/5 hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">HR Students</h3>
                <p className="text-muted-foreground leading-relaxed">Evaluate your people-management capabilities to align with roles like Talent Acquisition, HR Ops, or Employee Relations.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg shadow-primary/5 hover:-translate-y-1 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">Marketing Students</h3>
                <p className="text-muted-foreground leading-relaxed">Gauge your creative and strategic thinking to match with roles such as Brand Executive, Growth Marketer, or Sales Ops.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Students Will Get */}
      <section id="benefits" className="py-24 bg-background transition-colors">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading text-foreground mb-6">What You Will Gain</h2>
              <div className="space-y-6">
                {[
                  "Domain-specific cognitive assessment",
                  "Comprehensive Career Readiness Score",
                  "Personalized interactive dashboard",
                  "Role alignment analytics and insights",
                  "Visibility to top hiring companies via HR dashboard"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 shrink-0 text-primary">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <p className="text-lg text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-tr from-blue-100 to-indigo-50 rounded-3xl transform rotate-3"></div>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                alt="Dashboard Preview"
                className="relative z-10 rounded-2xl shadow-2xl border border-white/50 object-cover h-[400px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* For Companies */}
      <section id="companies" className="py-24 bg-background transition-colors border-t border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-indigo-100 rounded-3xl transform -rotate-2" />
              <div className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl p-8 space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">Company Access</p>
                    <p className="text-xs text-muted-foreground">One-time unlock</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-bold text-primary">₹5,999</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">one-time</p>
                  </div>
                </div>
                {[
                  { icon: Users, text: "Full access to all assessed student profiles" },
                  { icon: BarChart3, text: "Domain-wise analytics & score breakdowns" },
                  { icon: Download, text: "Download complete dataset as CSV/Excel" },
                  { icon: FileSpreadsheet, text: "Role-alignment scores for smart shortlisting" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
                <Link href="/company/payment" className="block">
                  <Button variant="premium" size="lg" className="w-full mt-2 group">
                    Unlock Candidate Data
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold mb-5">
                <Building2 className="h-3.5 w-3.5" />
                For Hiring Companies
              </div>
              <h2 className="text-3xl font-bold font-heading text-foreground mb-5">Find Pre-Assessed Talent, Instantly</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every student on Talentify has completed a rigorous domain assessment. Skip the initial screening — get access to validated candidates with detailed performance data, role-fit scores, and behavioral insights.
              </p>
              <div className="space-y-3">
                {[
                  "No more blind screening — every candidate is pre-assessed",
                  "Filter by Finance, HR, or Marketing specialisation",
                  "Download the full dataset for your ATS or spreadsheets",
                  "One flat price — unlimited access to the entire pool",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-muted-foreground text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conducted By */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-primary-foreground/80 font-medium mb-4 uppercase tracking-wider text-sm">Conducted By</p>
          <h2 className="text-4xl font-bold font-heading mb-6">Talentify</h2>
          <p className="text-xl text-primary-foreground/90 mb-10 leading-relaxed">
            Bridging the gap between academic capability and corporate reality. Helping students discover their true professional calling.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-background text-primary hover:bg-muted font-bold px-8 shadow-xl shadow-primary/20">
              Start Your Journey Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
