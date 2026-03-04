"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    Lock, ArrowRight, ShieldCheck, Building2,
    Users, Download, BarChart3, FileSpreadsheet, Star,
    TrendingUp, Sparkles, Eye, EyeOff
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const FEATURES = [
    { icon: Users, label: "Full Candidate Pool Access", desc: "Browse all registered student profiles with scores" },
    { icon: BarChart3, label: "Analytics & Insights Dashboard", desc: "Domain-wise breakdowns and performance distributions" },
    { icon: Download, label: "Bulk Data Export (CSV/PDF)", desc: "Download the complete student dataset instantly" },
    { icon: FileSpreadsheet, label: "Role-Alignment Scores", desc: "See which candidates match your open positions" },
    { icon: Star, label: "Priority Candidate Shortlisting", desc: "Filter by domain, score range, and skills" },
];

type Student = {
    id: string;
    name: string;
    college: string;
    domain: string;
    career_readiness_score: number | null;
};

function ScoreBadge({ score }: { score: number | null }) {
    if (score === null) return <span className="text-xs text-muted-foreground italic">—</span>;
    const color =
        score >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
            score >= 60 ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                "bg-amber-500/10 text-amber-600 border-amber-500/20";
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${color}`}>
            {score}%
        </span>
    );
}

function DomainDot({ domain }: { domain: string }) {
    const color =
        domain === "Finance" ? "bg-primary" :
            domain === "HR" ? "bg-purple-500" :
                "bg-emerald-500";
    return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;
}

export default function CompanyPaymentPage() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Live candidate preview state
    const [students, setStudents] = useState<Student[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/company/students")
            .then((r) => r.json())
            .then((result) => {
                if (result.students) setStudents(result.students);
            })
            .catch(console.error)
            .finally(() => setStatsLoading(false));
    }, []);

    const totalCandidates = students.length;
    const scored = students.filter((s) => s.career_readiness_score !== null);
    const avgScore = scored.length > 0
        ? Math.round(scored.reduce((a, s) => a + (s.career_readiness_score ?? 0), 0) / scored.length)
        : 0;
    const topTalent = students.filter((s) => (s.career_readiness_score ?? 0) >= 80).length;
    const domainCounts = students.reduce((acc: Record<string, number>, s) => {
        acc[s.domain] = (acc[s.domain] || 0) + 1;
        return acc;
    }, {});

    // Show only first 5 rows in preview; blur the rest
    const previewRows = students.slice(0, 6);

    const handlePayment = async () => {
        if (!companyName.trim() || !contactEmail.trim() || !transactionId.trim()) {
            alert("Please fill in all fields before submitting.");
            return;
        }
        setIsProcessing(true);
        try {
            const res = await fetch("/api/company-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ companyName, contactEmail, transactionId }),
            });
            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Failed to process payment. Please try again.");
                setIsProcessing(false);
                return;
            }
            const data = await res.json();
            setTimeout(() => {
                router.push(`/dashboard/company?companyId=${data.companyId}`);
            }, 800);
        } catch (error) {
            console.error("Company payment error:", error);
            alert("An error occurred. Please check your connection.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-background transition-colors">

            {/* ─── HERO: Live Candidate Data Preview ─── */}
            <section className="relative w-full pt-20 pb-16 overflow-hidden border-b border-border">
                {/* Background blobs */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-32 -left-24 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">

                    {/* Eyebrow */}
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold">
                            <Building2 className="h-4 w-4" />
                            Corporate Hiring Plan — Live Data Preview
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold font-heading text-foreground text-center max-w-3xl mx-auto leading-tight mb-3">
                        Your Next Great Hire is <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Already Assessed</span>
                    </h1>
                    <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
                        Every candidate below has completed a domain-specific aptitude assessment. Unlock the full dataset with one payment.
                    </p>

                    {/* Live Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10">
                        {[
                            { icon: Users, label: "Total Candidates", value: statsLoading ? "…" : totalCandidates, color: "text-primary" },
                            { icon: BarChart3, label: "Avg. Readiness Score", value: statsLoading ? "…" : `${avgScore}%`, color: "text-blue-500" },
                            { icon: Sparkles, label: "Top Talent (≥ 80%)", value: statsLoading ? "…" : topTalent, color: "text-emerald-500" },
                            { icon: TrendingUp, label: "Completed Assessments", value: statsLoading ? "…" : scored.length, color: "text-purple-500" },
                        ].map(({ icon: Icon, label, value, color }) => (
                            <Card key={label} className="border-border shadow-sm text-center">
                                <CardContent className="p-5">
                                    <div className="flex justify-center mb-3">
                                        <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                                            <Icon className={`h-5 w-5 ${color}`} />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{value}</p>
                                    <p className="text-xs text-muted-foreground mt-1 leading-snug">{label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Domain breakdown pills */}
                    {Object.keys(domainCounts).length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {Object.entries(domainCounts).map(([domain, count]) => (
                                <div key={domain} className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-sm font-medium shadow-sm">
                                    <DomainDot domain={domain} />
                                    <span className="text-foreground font-semibold">{domain}</span>
                                    <span className="text-muted-foreground">{count} candidate{count > 1 ? "s" : ""}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Blurred Preview Table */}
                    <div className="relative max-w-5xl mx-auto rounded-2xl border border-border shadow-2xl overflow-hidden">
                        {/* Lock overlay */}
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[3px]">
                            <div className="bg-card border border-border rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-3 text-center max-w-xs">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <EyeOff className="h-6 w-6 text-primary" />
                                </div>
                                <p className="font-bold text-foreground text-base">Full access locked</p>
                                <p className="text-sm text-muted-foreground">
                                    Pay ₹5,999 once to instantly unlock names, emails, scores, and download the full dataset.
                                </p>
                                <Button
                                    variant="premium"
                                    className="w-full mt-1 gap-2"
                                    onClick={() => document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth" })}
                                >
                                    <Eye className="h-4 w-4" />
                                    Unlock Now
                                </Button>
                            </div>
                        </div>

                        {/* Table (blurred behind overlay) */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        {["Candidate", "College", "Domain", "Score", "Status"].map((h) => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewRows.length > 0 ? previewRows.map((s, i) => (
                                        <tr key={s.id} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/10"}`}>
                                            {/* Blur name & email */}
                                            <td className="px-5 py-3">
                                                <div className="font-semibold text-foreground select-none blur-sm">{s.name}</div>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground select-none blur-sm">{s.college}</td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <DomainDot domain={s.domain} />
                                                    <span className="text-foreground text-xs font-medium">{s.domain}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <ScoreBadge score={s.career_readiness_score} />
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${s.career_readiness_score !== null
                                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                    : "bg-muted text-muted-foreground border-border"}`}>
                                                    {s.career_readiness_score !== null ? "Assessed" : "Registered"}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        // Skeleton rows when no data yet
                                        Array.from({ length: 5 }).map((_, i) => (
                                            <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/10"}`}>
                                                {Array.from({ length: 5 }).map((_, j) => (
                                                    <td key={j} className="px-5 py-4">
                                                        <div className="h-4 bg-muted rounded animate-pulse w-24" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Bottom gradient fade */}
                        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
                    </div>

                    <p className="text-center text-xs text-muted-foreground mt-4">
                        Showing a preview of {previewRows.length} out of {totalCandidates} candidates. Scores and domain are visible; names and contacts are locked.
                    </p>
                </div>
            </section>

            {/* ─── CHECKOUT SECTION ─── */}
            <section id="checkout-section" className="py-16 px-4">
                <div className="container mx-auto max-w-5xl">

                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold font-heading text-foreground">Complete Your Purchase</h2>
                        <p className="text-muted-foreground mt-1 text-sm">One-time ₹5,999 payment — instant, unlimited access</p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-10">

                        {/* Left – Plan Summary */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-border bg-card overflow-hidden">
                                <CardHeader className="bg-primary text-primary-foreground p-6">
                                    <div className="flex justify-between items-baseline">
                                        <CardTitle className="text-lg font-semibold">All-Access Plan</CardTitle>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold tracking-tight">₹5,999</p>
                                            <p className="text-primary-foreground/70 text-xs">one-time payment</p>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-4">
                                    {FEATURES.map(({ icon: Icon, label, desc }) => (
                                        <div key={label} className="flex items-start gap-3">
                                            <div className="mt-0.5 h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{label}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>

                                <CardFooter className="bg-muted/40 border-t border-border p-5 flex justify-between items-center">
                                    <span className="text-sm font-medium text-muted-foreground">Total Due</span>
                                    <span className="text-2xl font-bold text-foreground">₹5,999</span>
                                </CardFooter>
                            </Card>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                Your data is protected and never sold to third parties.
                            </div>
                        </div>

                        {/* Right – Checkout Form */}
                        <div className="md:col-span-3">
                            <Card className="border-border bg-card h-full relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-indigo-500" />

                                <CardHeader className="p-8 pb-4">
                                    <CardTitle className="flex items-center gap-3 text-2xl">
                                        <Lock className="h-5 w-5 text-muted-foreground" />
                                        Secure Company Checkout
                                    </CardTitle>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Fill in your company details and complete UPI payment to get instant access.
                                    </p>
                                </CardHeader>

                                <CardContent className="p-8 space-y-6">

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Company / Organisation Name</label>
                                            <input
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                placeholder="e.g. Acme Corp Pvt. Ltd."
                                                className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">HR / Contact Email</label>
                                            <input
                                                type="email"
                                                value={contactEmail}
                                                onChange={(e) => setContactEmail(e.target.value)}
                                                placeholder="hr@yourcompany.com"
                                                className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t border-border" />

                                    <div className="space-y-4 flex flex-col items-center">
                                        <p className="text-sm text-muted-foreground text-center">
                                            Scan the QR code below to pay <strong className="text-foreground">₹5,999</strong> via any UPI app.
                                        </p>
                                        <div className="border border-border p-4 rounded-xl bg-white shadow-sm inline-block">
                                            <img
                                                src="/images/qr-code.jpg"
                                                alt="Company Payment QR Code"
                                                className="w-48 h-48 object-cover rounded-md"
                                            />
                                        </div>

                                        <div className="w-full space-y-2">
                                            <label className="text-sm font-medium text-foreground">Transaction ID / UTR Number</label>
                                            <input
                                                type="text"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                placeholder="e.g. 123456789012"
                                                className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Enter the 12-digit UTR / transaction number after completing your ₹5,999 UPI payment.
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        size="lg"
                                        className="w-full text-lg h-14 mt-2"
                                        variant="premium"
                                    >
                                        {isProcessing ? "Processing..." : "Unlock Candidate Data"}
                                        {!isProcessing && <ArrowRight className="ml-2 h-5 w-5" />}
                                    </Button>

                                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4" />
                                        Payments processed securely. Access is granted upon verification.
                                    </div>

                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
}
