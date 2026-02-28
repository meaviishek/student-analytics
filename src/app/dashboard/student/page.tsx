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
        <div className="flex flex-col items-center justify-center relative py-6">
            <svg className="w-48 h-auto overflow-visible" viewBox="0 0 100 55">
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="dark:stroke-slate-800"
                />
                <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className={getScoreColor(score)}
                    strokeDasharray="125.66"
                    strokeDashoffset={125.66 - (125.66 * score) / 100}
                    style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                />
            </svg>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <div className={`text-5xl font-bold tracking-tighter ${getScoreColor(score)} leading-none`}>{score}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-2">Total Score</div>
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

        try {
            // @ts-ignore
            const jsPDFModule = await import('jspdf');
            const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default || jsPDFModule;
            const doc = new jsPDF('p', 'pt', 'a4');

            const pageWidth = doc.internal.pageSize.getWidth();

            // Background
            doc.setFillColor(248, 250, 252);
            doc.rect(0, 0, pageWidth, 842, 'F');

            // Header Banner
            doc.setFillColor(255, 255, 255);
            doc.rect(0, 0, pageWidth, 120, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.line(0, 120, pageWidth, 120);

            // Title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(24);
            doc.setTextColor(15, 23, 42);
            doc.text(`${profile?.name ? profile.name + "'s" : 'Your'} Assessment Report`, 40, 60);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(100, 116, 139);
            doc.text(`Domain: ${domain}`, 40, 85);

            // Career Readiness Score Box
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(40, 150, (pageWidth - 100) / 2, 160, 8, 8, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(40, 150, (pageWidth - 100) / 2, 160, 8, 8, 'S');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text('Career Readiness Score', 60, 180);

            doc.setFontSize(48);
            if (score >= 80) doc.setTextColor(16, 185, 129); // emerald
            else if (score >= 60) doc.setTextColor(59, 130, 246); // blue
            else doc.setTextColor(245, 158, 11); // amber

            doc.text(`${score}`, 110, 240);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.text('TOTAL SCORE / 100', 100, 260);

            // Role Alignment Box
            const rightBoxX = 40 + (pageWidth - 100) / 2 + 20;
            doc.setFillColor(37, 99, 235); // primary blue
            doc.roundedRect(rightBoxX, 150, (pageWidth - 100) / 2, 160, 8, 8, 'F');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            doc.text('Role Alignment', rightBoxX + 20, 180);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(226, 232, 240);
            doc.text('Recommended starting positions:', rightBoxX + 20, 195);

            roles.forEach((role: string, i: number) => {
                doc.setFillColor(255, 255, 255);
                doc.roundedRect(rightBoxX + 20, 210 + (i * 30), ((pageWidth - 100) / 2) - 40, 22, 4, 4, 'F');
                doc.setTextColor(15, 23, 42);
                doc.text(role, rightBoxX + 30, 225 + (i * 30));

                doc.setFont('helvetica', 'bold');
                doc.setTextColor(16, 185, 129);
                const matchPct = i === 0 ? '92%' : i === 1 ? '85%' : '78%';
                doc.text(matchPct, rightBoxX + ((pageWidth - 100) / 2) - 50, 225 + (i * 30));
                doc.setFont('helvetica', 'normal');
            });

            // Strengths
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(40, 340, pageWidth - 80, 140, 8, 8, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(40, 340, pageWidth - 80, 140, 8, 8, 'S');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text('Core Strengths', 60, 370);

            const strengths = [
                "Strong Team Orientation: Considers team impact before choices.",
                "Clear Communication: Expresses ideas logically and effectively.",
                "Structured Approach: Organizes complex tasks into milestones."
            ];

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor(71, 85, 105);
            strengths.forEach((str, i) => {
                doc.text(`• ${str}`, 60, 400 + (i * 25));
            });

            // Personality Breakdown
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(40, 510, pageWidth - 80, 160, 8, 8, 'F');
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(40, 510, pageWidth - 80, 160, 8, 8, 'S');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(15, 23, 42);
            doc.text('Personality Breakdown', 60, 540);

            const traits = [
                { name: 'Communication', val: 88, desc: 'Expresses ideas clearly' },
                { name: 'Decision-Making', val: 65, desc: 'Evaluates options carefully' },
                { name: 'Adaptability', val: 75, desc: 'Adjusts to new processes' },
                { name: 'Stress Tolerance', val: 70, desc: 'Maintains composure' }
            ];

            traits.forEach((trait, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const x = 60 + (col * ((pageWidth - 120) / 2));
                const y = 570 + (row * 45);

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(15, 23, 42);
                doc.text(trait.name, x, y);
                doc.text(`${trait.val}%`, x + ((pageWidth - 160) / 2) - 20, y);

                // Bar background
                doc.setFillColor(241, 245, 249);
                doc.rect(x, y + 5, ((pageWidth - 160) / 2), 6, 'F');

                // Bar foreground
                doc.setFillColor(37, 99, 235);
                doc.rect(x, y + 5, (((pageWidth - 160) / 2) * trait.val) / 100, 6, 'F');

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(100, 116, 139);
                doc.text(trait.desc, x, y + 22);
            });

            // Footer
            doc.setFontSize(10);
            doc.setTextColor(148, 163, 184);
            doc.text('Generated by Talentify Assessment Platform', 40, 800);

            doc.save(`${profile?.name ? profile.name.replace(/\s+/g, '_') : 'Student'}_Assessment_Report.pdf`);

        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
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
