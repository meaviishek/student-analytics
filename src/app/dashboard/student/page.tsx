"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, Share2, Target, TrendingUp, Sparkles, BookOpen, Layers } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

const ROLE_MAPPING = {
    Finance: ["Financial Analyst", "Relationship Manager", "Credit Officer"],
    HR: ["Recruiter", "HR Operations Executive", "Talent Coordinator"],
    Marketing: ["Growth Executive", "Brand Executive", "Sales Operations Associate"],
};

function Meter({ score }: { score: number }) {
    const getScoreColor = (s: number) => {
        if (s >= 80) return "text-emerald-500 dark:text-emerald-400";
        if (s >= 60) return "text-blue-500 dark:text-blue-400";
        return "text-amber-500 dark:text-amber-400";
    };

    const getGradient = (s: number) => {
        if (s >= 80) return "from-emerald-400 to-emerald-600";
        if (s >= 60) return "from-blue-400 to-blue-600";
        return "from-amber-400 to-amber-600";
    };

    return (
        <div className="flex flex-col items-center justify-center relative py-8">
            <svg className="w-48 h-24 transform rotate-180" viewBox="0 0 100 50">
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    strokeLinecap="round"
                />
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className={getScoreColor(score)}
                    strokeDasharray="125"
                    strokeDashoffset={125 - (125 * score) / 100}
                    style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center mt-2">
                <div className={`text-4xl font-bold tracking-tighter ${getScoreColor(score)}`}>{score}</div>
                <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">Total Score</div>
            </div>
        </div>
    );
}

function BarTrait({ label, value, desc }: { label: string, value: number, desc: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-foreground">{label}</span>
                <span className="text-xs font-medium text-muted-foreground">{value}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all duration-1000"
                    style={{ width: `${value}%` }}
                />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
        </div>
    );
}

function StudentDashboardContent() {
    const searchParams = useSearchParams();
    const domain = (searchParams?.get("domain") as "Finance" | "HR" | "Marketing") || "Finance";
    const userId = searchParams?.get("userId") || "";

    const [mounted, setMounted] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [assessmentScore, setAssessmentScore] = useState<number>(0);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchData = async () => {
            try {
                // Fetch transactions conditionally
                // We should eventually filter transactions by user but fetching all for now like before
                const res = await fetch('/api/transactions');
                const result = await res.json();
                if (result.data) {
                    setTransactions(result.data);
                }

                if (userId) {
                    const profRes = await fetch(`/api/profile?userId=${userId}`);
                    const profResult = await profRes.json();
                    if (profResult.user) setProfile(profResult.user);
                    if (profResult.assessment) {
                        let maxPoints = 160;
                        if (profResult.assessment.domain === 'Finance') maxPoints = 165;
                        if (profResult.assessment.domain === 'HR') maxPoints = 190;
                        if (profResult.assessment.domain === 'Marketing') maxPoints = 160;

                        const total = profResult.assessment.common_score + profResult.assessment.domain_score;
                        setAssessmentScore(Math.round((total / maxPoints) * 100));
                    }
                }
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            }
        };
        fetchData();
    }, [userId]);

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        const element = document.getElementById("reportToDownload");
        if (!element) return;

        try {
            // @ts-ignore
            const html2pdf = (await import('html2pdf.js')).default;

            const opt = {
                margin: 0.5,
                filename: `${profile?.name ? profile.name.replace(/\s+/g, '_') : 'Student'}_Assessment_Report.pdf`,
                image: { type: 'jpeg' as const, quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' as const }
            };

            html2pdf().set(opt).from(element).save().then(() => setIsDownloading(false));
        } catch (error) {
            console.error("Failed to generate PDF", error);
            setIsDownloading(false);
        }
    };

    const roles = ROLE_MAPPING[domain] || ROLE_MAPPING.Finance;
    const score = assessmentScore || 82;

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background pb-20 transition-colors" id="reportToDownload">

            {/* Header */}
            <div className="bg-card border-b border-border pt-20 pb-8 px-4 transition-colors">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                            <Sparkles className="h-4 w-4" />
                            Assessment Complete
                        </div>
                        <h1 className="text-3xl font-bold font-heading text-foreground">{profile?.name ? `${profile.name}'s` : 'Your'} Personal Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Welcome back. Here are your alignment results and career guidance.</p>
                    </div>
                    <div className="flex gap-3" data-html2canvas-ignore="true">
                        <Button variant="outline" className="bg-background border-input hover:bg-muted">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Status
                        </Button>
                        <Button variant="premium" onClick={handleDownloadReport} disabled={isDownloading}>
                            <Download className="mr-2 h-4 w-4" />
                            {isDownloading ? "Generating PDF..." : "Download Report"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 grid md:grid-cols-3 gap-8">

                {/* Left Column: Score & Alignment */}
                <div className="md:col-span-1 space-y-8">

                    <Card className="border-border shadow-lg shadow-primary/5">
                        <CardHeader className="pb-0 text-center">
                            <CardTitle className="text-lg">Career Readiness Score</CardTitle>
                            <CardDescription>Based on your {domain} assessment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Meter score={score} />
                            <div className="mt-4 p-4 bg-primary/10 rounded-xl border border-primary/20 text-center">
                                <p className="text-sm text-primary font-medium">You display high aptitude for {domain} roles and corporate adaptability.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-lg shadow-primary/5 bg-linear-to-b from-primary to-accent-foreground text-primary-foreground">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary-foreground">
                                <Target className="h-5 w-5 text-primary-foreground/80" />
                                Role Alignment
                            </CardTitle>
                            <CardDescription className="text-primary-foreground/80">Recommended starting positions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {roles.map((r, i) => (
                                    <div key={i} className="bg-white/10 border border-white/20 rounded-lg p-3 flex justify-between items-center backdrop-blur-sm shadow-inner transition-transform hover:-translate-y-1">
                                        <span className="font-medium text-sm text-blue-50">{r}</span>
                                        <span className="text-xs font-bold text-emerald-300">
                                            {i === 0 ? "92% Match" : i === 1 ? "85% Match" : "78% Match"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Columns: Insights */}
                <div className="md:col-span-2 space-y-8">

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="border-border shadow-lg shadow-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Behavioral Strengths
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-muted/50 border border-border rounded-lg">
                                    <h4 className="font-semibold text-foreground text-sm">Strong Team Orientation</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Naturally considers team impact before making decisions.</p>
                                </div>
                                <div className="p-3 bg-muted/50 border border-border rounded-lg">
                                    <h4 className="font-semibold text-foreground text-sm">Clear Communication Style</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Expresses ideas logically and listens actively to others.</p>
                                </div>
                                <div className="p-3 bg-muted/50 border border-border rounded-lg">
                                    <h4 className="font-semibold text-foreground text-sm">Structured Approach</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Organizes complex tasks into manageable milestones.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border shadow-lg shadow-primary/5">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-accent-foreground" />
                                    Growth Opportunities (Gap Analysis)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-3 bg-accent/20 border border-accent/30 rounded-lg">
                                    <h4 className="font-semibold text-accent-foreground text-sm">Decision-making under pressure</h4>
                                    <p className="text-xs text-accent-foreground/80 mt-1">Tends to hesitate when immediate action is required. Practice time-boxing choices.</p>
                                </div>
                                <div className="p-3 bg-accent/20 border border-accent/30 rounded-lg">
                                    <h4 className="font-semibold text-accent-foreground text-sm">Data-driven storytelling</h4>
                                    <p className="text-xs text-accent-foreground/80 mt-1">Strong with numbers, but can improve on presenting narratives around the data.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-border shadow-lg shadow-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg">Personality Snapshot</CardTitle>
                                <CardDescription>Visual breakdown of core traits</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mt-4">
                                <BarTrait
                                    label="Communication"
                                    value={88}
                                    desc="Expresses ideas clearly in team settings."
                                />
                                <BarTrait
                                    label="Decision-Making"
                                    value={65}
                                    desc="Takes time to evaluate options before action."
                                />
                                <BarTrait
                                    label="Adaptability"
                                    value={75}
                                    desc="Adjusts to new processes with moderate ease."
                                />
                                <BarTrait
                                    label="Stress Tolerance"
                                    value={70}
                                    desc="Maintains composure in routine challenges."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-lg shadow-primary/5 bg-muted">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                                <BookOpen className="h-5 w-5 text-primary" />
                                Career Guidance & Next Steps
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <h4 className="text-primary font-semibold text-sm mb-2 uppercase tracking-wide">Skills to Acquire</h4>
                                    <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                                        <li>Advanced Excel / Sheets</li>
                                        <li>Industry-specific Software</li>
                                        <li>Business Writing</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-primary font-semibold text-sm mb-2 uppercase tracking-wide">Habits to Build</h4>
                                    <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                                        <li>Daily industry news digest</li>
                                        <li>Time-blocking techniques</li>
                                        <li>Proactive follow-ups</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-primary font-semibold text-sm mb-2 uppercase tracking-wide">Practical Exposure</h4>
                                    <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1">
                                        <li>Seek shadowing opportunities</li>
                                        <li>Join a relevant case study group</li>
                                        <li>Participate in mock interviews</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <Button className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-600 text-white border-0 shadow-lg shadow-indigo-500/30">
                                    Opt-in for Interview Enablement (₹499)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>

            {transactions.length > 0 && (
                <div className="container mx-auto px-4 mt-8">
                    <Card className="border-border shadow-lg shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Transactions</CardTitle>
                            <CardDescription>Payment history and status records</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {transactions.map((tx: any, i: number) => (
                                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg bg-muted/10 transition-colors hover:bg-muted/30">
                                        <div>
                                            <p className="font-semibold text-foreground text-sm sm:text-base">{tx.domain} Assessment</p>
                                            <p className="text-xs text-muted-foreground mt-1 font-mono">{tx.transaction_id ? `ID: ${tx.transaction_id}` : ''}</p>
                                        </div>
                                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                                            <p className="font-bold text-foreground">₹{tx.amount}</p>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 uppercase tracking-widest mt-1 border border-emerald-500/20">
                                                {tx.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default function StudentDashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>}>
            <StudentDashboardContent />
        </Suspense>
    )
}
