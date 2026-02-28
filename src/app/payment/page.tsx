"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Check, CreditCard, Lock, ArrowRight, Zap, ShieldCheck } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const domain = searchParams?.get("domain") || "Finance";
    const userId = searchParams?.get("userId") || "";

    const [transactionId, setTransactionId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (transactionId.trim() === "") {
            alert("Please enter the transaction ID.");
            return;
        }

        setIsProcessing(true);
        try {
            // Save transaction to backend
            const res = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId, domain, userId })
            });

            if (!res.ok) {
                console.error("Payment error");
                alert("Failed to process transaction. Please ensure you are connected to the Supabase database.");
                setIsProcessing(false);
                return;
            }

            // Success, navigate to assessment
            setTimeout(() => {
                router.push(`/assessment?domain=${domain}&userId=${userId}`);
            }, 1000);
        } catch (error) {
            console.error("Payment error:", error);
            alert("An error occurred connecting to the backend.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-4 py-12 transition-colors">
            <div className="w-full max-w-4xl grid md:grid-cols-5 gap-8">

                {/* Order Summary */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold font-heading text-foreground">Order Summary</h2>
                        <p className="text-muted-foreground mt-1 text-sm">Review your assessment package</p>
                    </div>

                    <Card className="border-border bg-card">
                        <CardHeader className="bg-muted/30 border-b border-border">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-foreground">Assessment Fee</span>
                                <span className="font-bold text-foreground">₹199</span>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{domain} Domain</span> Assessment Entry</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <p className="text-sm text-muted-foreground">Personalized <span className="font-medium text-foreground">Student Dashboard</span></p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <p className="text-sm text-muted-foreground">Company Visibility for <span className="font-medium text-foreground">Hiring</span></p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                    <p className="text-sm text-muted-foreground">Detailed <span className="font-medium text-foreground">Role Alignment Report</span></p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-border">
                                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
                                    <div>
                                        <p className="font-semibold text-primary flex items-center gap-2">
                                            Interview Enablement
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-widest">Optional</span>
                                        </p>
                                        <p className="text-xs text-primary/70 mt-1">Get 1-on-1 mock interviews.</p>
                                    </div>
                                    <input type="checkbox" className="h-5 w-5 rounded border-primary/30 text-primary focus:ring-primary" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/30 border-t border-border p-6 flex justify-between items-center">
                            <span className="text-lg font-semibold text-muted-foreground">Total Amount</span>
                            <span className="text-3xl font-bold text-foreground tracking-tight">₹199</span>
                        </CardFooter>
                    </Card>
                </div>

                {/* Payment Form */}
                <div className="md:col-span-3">
                    <Card className="border-border bg-card h-full relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-primary to-accent-foreground"></div>
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <Lock className="h-5 w-5 text-muted-foreground" />
                                Secure Checkout
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">

                            <div className="shadow-sm border border-primary/20 bg-primary/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                                <Zap className="h-6 w-6 text-primary" />
                                <span className="font-medium text-primary text-sm">UPI Payment Required</span>
                            </div>

                            <div className="space-y-6 flex flex-col items-center">
                                <p className="text-sm text-muted-foreground text-center">Scan the QR code to pay using any UPI app.</p>
                                <div className="border border-border p-4 rounded-xl bg-white shadow-sm inline-block">
                                    <img src="/images/qr-code.jpg" alt="Payment QR Code" className="w-48 h-48 object-cover rounded-md" />
                                </div>

                                <div className="w-full space-y-2 mt-4">
                                    <label className="text-sm font-medium text-foreground">Transaction ID / UTR Number</label>
                                    <input
                                        type="text"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="w-full h-11 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                        placeholder="e.g. 123456789012"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Please enter the 12-digit transaction number after completing your ₹199 payment.</p>
                                </div>
                            </div>

                            <Button onClick={handlePayment} disabled={isProcessing} size="lg" className="w-full text-lg h-14 mt-4" variant="premium">
                                {isProcessing ? "Processing..." : "Submit & Proceed"}
                                {!isProcessing && <Lock className="ml-2 h-4 w-4" />}
                            </Button>

                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-6">
                                <ShieldCheck className="h-4 w-4" />
                                Payments are securely processed directly on our servers.
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PaymentContent />
        </Suspense>
    )
}
