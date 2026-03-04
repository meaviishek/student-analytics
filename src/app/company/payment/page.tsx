"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import {
    Check, Lock, ArrowRight, ShieldCheck, Building2,
    Users, Download, BarChart3, FileSpreadsheet, Star
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FEATURES = [
    { icon: Users, label: "Full Candidate Pool Access", desc: "Browse all registered student profiles with scores" },
    { icon: BarChart3, label: "Analytics & Insights Dashboard", desc: "Domain-wise breakdowns and performance distributions" },
    { icon: Download, label: "Bulk Data Export (CSV/PDF)", desc: "Download the complete student dataset instantly" },
    { icon: FileSpreadsheet, label: "Role-Alignment Scores", desc: "See which candidates match your open positions" },
    { icon: Star, label: "Priority Candidate Shortlisting", desc: "Filter by domain, score range, and skills" },
];

export default function CompanyPaymentPage() {
    const router = useRouter();
    const [companyName, setCompanyName] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

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
            // Navigate to company dashboard with the company's record id
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
        <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-4 py-16 transition-colors">

            {/* Header badge */}
            <div className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold">
                <Building2 className="h-4 w-4" />
                Corporate Hiring Plan
            </div>

            <div className="w-full max-w-5xl grid md:grid-cols-5 gap-10">

                {/* Left – Order Summary */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-foreground">Enterprise Access</h2>
                        <p className="text-muted-foreground mt-1 text-sm">One-time unlock to the full talent pool</p>
                    </div>

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

                            {/* Company Details */}
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

                            {/* Divider */}
                            <div className="border-t border-border" />

                            {/* UPI Section */}
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
    );
}
