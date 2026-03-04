"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
    Download, Building2, Users, BarChart3, Search,
    Sparkles, FileSpreadsheet, TrendingUp, Filter
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Student = {
    id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    domain: string;
    registered_at: string;
    career_readiness_score: number | null;
    common_score: number | null;
    domain_score: number | null;
    common_interpretation: string | null;
    domain_interpretation: string | null;
};

function ScoreBadge({ score }: { score: number | null }) {
    if (score === null) return <span className="text-xs text-muted-foreground italic">Pending</span>;
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

function DomainBadge({ domain }: { domain: string }) {
    const color =
        domain === "Finance" ? "bg-primary/10 text-primary border-primary/20" :
            domain === "HR" ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${color}`}>
            {domain}
        </span>
    );
}

function CompanyDashboardContent() {
    useSearchParams(); // keep companyId accessible if needed later

    const [students, setStudents] = useState<Student[]>([]);
    const [filtered, setFiltered] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [domainFilter, setDomainFilter] = useState("All");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("/api/company/students");
                const result = await res.json();
                if (result.students) {
                    setStudents(result.students);
                    setFiltered(result.students);
                }
            } catch (err) {
                console.error("Failed to fetch students", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        let data = students;
        if (domainFilter !== "All") data = data.filter((s) => s.domain === domainFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            data = data.filter(
                (s) =>
                    s.name?.toLowerCase().includes(q) ||
                    s.email?.toLowerCase().includes(q) ||
                    s.college?.toLowerCase().includes(q)
            );
        }
        setFiltered(data);
    }, [search, domainFilter, students]);

    const downloadCSV = () => {
        const headers = [
            "Name", "Email", "Phone", "College", "Domain",
            "Career Readiness Score (%)", "Common Score", "Domain Score",
            "Common Interpretation", "Domain Interpretation", "Registered At"
        ];
        const rows = filtered.map((s) => [
            s.name, s.email, s.phone, s.college, s.domain,
            s.career_readiness_score ?? "",
            s.common_score ?? "", s.domain_score ?? "",
            s.common_interpretation ?? "", s.domain_interpretation ?? "",
            s.registered_at ? new Date(s.registered_at).toLocaleDateString("en-IN") : ""
        ]);
        const csvContent = [headers, ...rows]
            .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Talentify_Students_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const scored = students.filter((s) => s.career_readiness_score !== null);
    const avgScore = scored.length > 0
        ? Math.round(scored.reduce((a, s) => a + (s.career_readiness_score ?? 0), 0) / scored.length)
        : 0;
    const topTalent = students.filter((s) => (s.career_readiness_score ?? 0) >= 80).length;
    const domainCounts = students.reduce((acc: Record<string, number>, s) => {
        acc[s.domain] = (acc[s.domain] || 0) + 1;
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="animate-spin h-10 w-10 rounded-full border-4 border-primary border-t-transparent mx-auto" />
                    <p className="text-muted-foreground text-sm">Loading candidate data…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-20 transition-colors">

            {/* Header */}
            <div className="bg-card border-b border-border pt-20 pb-8 px-4 transition-colors">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                            <Building2 className="h-4 w-4" />
                            Company Dashboard
                        </div>
                        <h1 className="text-3xl font-bold font-heading text-foreground">Talentify Candidate Hub</h1>
                        <p className="text-muted-foreground mt-1">Access and download the full pool of assessed candidates.</p>
                    </div>
                    <Button variant="premium" onClick={downloadCSV} className="gap-2 h-12 px-6">
                        <FileSpreadsheet className="h-5 w-5" />
                        Download All Data (CSV)
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 space-y-8">

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Users, label: "Total Candidates", value: students.length, color: "text-primary" },
                        { icon: BarChart3, label: "Avg. Readiness Score", value: `${avgScore}%`, color: "text-blue-500" },
                        { icon: Sparkles, label: "Top Talent (≥80%)", value: topTalent, color: "text-emerald-500" },
                        { icon: TrendingUp, label: "Completed Assessments", value: scored.length, color: "text-purple-500" },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <Card key={label} className="border-border shadow-sm">
                            <CardContent className="p-5">
                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-4">
                                    <Icon className={`h-5 w-5 ${color}`} />
                                </div>
                                <p className="text-2xl font-bold text-foreground">{value}</p>
                                <p className="text-xs text-muted-foreground mt-1">{label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Domain Breakdown */}
                {Object.keys(domainCounts).length > 0 && (
                    <Card className="border-border shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Filter className="h-4 w-4 text-primary" />
                                Domain Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3 pt-0">
                            {Object.entries(domainCounts).map(([domain, count]) => (
                                <div key={domain} className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/30 text-sm font-medium">
                                    <DomainBadge domain={domain} />
                                    <span className="text-muted-foreground">{count} candidate{count > 1 ? "s" : ""}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Table */}
                <Card className="border-border shadow-sm">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">All Candidates</CardTitle>
                                <CardDescription>{filtered.length} of {students.length} candidates shown</CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search name, email, college…"
                                        className="pl-9 h-10 w-full sm:w-64 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>
                                <select
                                    value={domainFilter}
                                    onChange={(e) => setDomainFilter(e.target.value)}
                                    className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                >
                                    <option value="All">All Domains</option>
                                    <option value="Finance">Finance</option>
                                    <option value="HR">HR</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 overflow-x-auto">
                        {filtered.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground text-sm">
                                {students.length === 0
                                    ? "No students have registered yet. Check back soon!"
                                    : "No candidates match your current filters."}
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        {["Name", "Email", "Phone", "College", "Domain", "Score", "Status"].map((h) => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((student, i) => (
                                        <tr key={student.id} className={`border-b border-border transition-colors hover:bg-muted/20 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                                            <td className="px-4 py-3 font-semibold text-foreground whitespace-nowrap">{student.name || "—"}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{student.email || "—"}</td>
                                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{student.phone || "—"}</td>
                                            <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">{student.college || "—"}</td>
                                            <td className="px-4 py-3 whitespace-nowrap"><DomainBadge domain={student.domain || "—"} /></td>
                                            <td className="px-4 py-3 whitespace-nowrap"><ScoreBadge score={student.career_readiness_score} /></td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${student.career_readiness_score !== null
                                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                    : "bg-muted text-muted-foreground border-border"}`}>
                                                    {student.career_readiness_score !== null ? "Assessed" : "Registered"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

export default function CompanyDashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>}>
            <CompanyDashboardContent />
        </Suspense>
    );
}
