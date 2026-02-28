"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, Search, Briefcase, Filter, ChevronDown, Activity, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/Input";

const MOCK_STUDENTS = [
    { id: 1, name: "John Doe", college: "Delhi University", domain: "Finance", score: 88, fit: "High", topStrengths: ["Analytical Thinker", "Detail Oriented"], style: "Best suited for structured, target-driven roles. Strong analytical skills." },
    { id: 2, name: "Priya Sharma", college: "NMIMS", domain: "HR", score: 92, fit: "Exceptional", topStrengths: ["Empathy", "Conflict Resolution", "Communication"], style: "Highly empathetic with strong mediation abilities. Great for people-centric roles." },
    { id: 3, name: "Rahul Verma", college: "Symbiosis", domain: "Marketing", score: 76, fit: "Moderate", topStrengths: ["Creative Ideation", "Trend Spotting"], style: "Best suited for creative ideation. Requires support in data-driven analytics." },
    { id: 4, name: "Ananya Patel", college: "Christ University", domain: "Finance", score: 85, fit: "High", topStrengths: ["Risk Assessment", "Structured Approach"], style: "Excellent process adherence with clear communication style." },
    { id: 5, name: "Vikram Singh", college: "IIM Indore", domain: "Marketing", score: 94, fit: "Exceptional", topStrengths: ["Strategic Narrative", "Campaign Planning"], style: "Highly dynamic and target-driven. Exceptional leadership potential." },
];

export default function CompanyDashboard() {
    return (
        <div className="min-h-screen bg-background pb-20">

            {/* Header */}
            <div className="bg-card border-b border-border pt-20 pb-8 px-4 text-foreground">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3 border border-primary/20">
                            <Briefcase className="h-4 w-4" />
                            Company Portal
                        </div>
                        <h1 className="text-3xl font-bold font-heading">Candidate Insights</h1>
                        <p className="text-muted-foreground mt-1">Review top assessment profiles tailored to your hiring needs.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-background text-foreground hover:bg-muted border-input border">
                            <Download className="mr-2 h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8 space-y-6">

                {/* Metric Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                    <Card className="border-border shadow-sm shadow-primary/5">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Total Candidates</p>
                                <p className="text-2xl font-bold text-foreground">1,248</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm shadow-primary/5">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Star className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">High Fit Profiles</p>
                                <p className="text-2xl font-bold text-foreground">482</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm shadow-primary/5">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Activity className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Avg Readiness</p>
                                <p className="text-2xl font-bold text-foreground">76/100</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border shadow-sm shadow-primary/5 bg-primary text-primary-foreground">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div>
                                <p className="text-sm text-primary-foreground/80 font-medium">Active Hiring Campaign</p>
                                <p className="text-lg font-bold">2026 Campus Drive</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10 bg-background" placeholder="Search by name, college or skills..." />
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none hover:bg-muted">
                            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                            Domain <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="outline" className="flex-1 md:flex-none hover:bg-muted">
                            Readiness Score <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                        </Button>
                    </div>
                </div>

                {/* Data Table */}
                <Card className="border-border shadow-lg shadow-primary/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-muted-foreground">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/80 border-b border-border">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold">Candidate Info</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Domain</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Role Fit Score</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Top Strengths</th>
                                    <th scope="col" className="px-6 py-4 font-semibold">Work Style Summary</th>
                                    <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_STUDENTS.map((student, i) => (
                                    <tr key={student.id} className="bg-card border-b border-border hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-semibold text-foreground">{student.name}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{student.college}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold
                                                ${student.domain === 'Finance' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    student.domain === 'HR' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                }
                                              `}>
                                                {student.domain}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-foreground">{student.score}/100</span>
                                                <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded
                                                  ${student.fit === 'Exceptional' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                        student.fit === 'High' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                            'bg-muted text-foreground'
                                                    }
                                                `}>
                                                    {student.fit}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1">
                                                {student.topStrengths.map((str, idx) => (
                                                    <span key={idx} className="bg-muted text-muted-foreground px-2 py-0.5 rounded text-xs border border-border">
                                                        {str}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 max-w-[250px]">
                                            <p className="text-xs text-muted-foreground leading-relaxed truncate group relative cursor-help">
                                                {student.style}
                                                {/* Simple tooltip simulation */}
                                                <span className="absolute hidden group-hover:block bg-foreground text-background text-xs p-2 rounded -top-8 left-0 z-10 w-[200px] whitespace-normal">
                                                    {student.style}
                                                </span>
                                            </p>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Button variant="outline" size="sm" className="h-8 text-xs bg-background hover:bg-muted border-input text-foreground">
                                                <Download className="mr-1.5 h-3.5 w-3.5" />
                                                Resume
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-border bg-muted/50 text-center">
                        <Button variant="ghost" className="text-sm text-muted-foreground hover:text-foreground">
                            Load More Candidates
                        </Button>
                    </div>
                </Card>

            </div>
        </div>
    );
}
