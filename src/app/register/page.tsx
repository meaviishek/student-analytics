"use client";

import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { UploadCloud, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        college: "",
        email: "",
        phone: "",
        domain: "",
        resume: null as File | null,
        consent: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.domain || !formData.consent) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    college: formData.college,
                    email: formData.email,
                    phone: formData.phone,
                    domain: formData.domain
                })
            });

            if (!res.ok) {
                console.error("Registration failed");
                alert("Failed to register. Please check your connection or database.");
                setIsSubmitting(false);
                return;
            }

            const data = await res.json();

            // Navigate to payment with the new userId
            router.push(`/payment?domain=${formData.domain}&userId=${data.userId}`);
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred connecting to the backend.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center p-4 py-12 transition-colors">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 text-primary mb-6 shadow-inner border border-primary/20">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Student Registration</h1>
                    <p className="text-muted-foreground mt-2">Complete your profile to unlock the next steps of your career journey.</p>
                </div>

                <Card className="border-border">
                    <CardHeader className="border-b border-border bg-muted/30 pb-8">
                        <CardTitle>Personal Details</CardTitle>
                        <CardDescription>All fields are mandatory unless marked otherwise.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Full Name</label>
                                    <Input
                                        required
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">College Name</label>
                                    <Input
                                        required
                                        placeholder="University of Excellence"
                                        value={formData.college}
                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Email Address</label>
                                    <Input
                                        required
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                                    <Input
                                        required
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        placeholder="10-digit mobile number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Specialization Domain</label>
                                <select
                                    required
                                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                >
                                    <option value="" disabled>Select your domain</option>
                                    <option value="Finance">Finance</option>
                                    <option value="HR">Human Resources (HR)</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                                <p className="text-xs text-muted-foreground mt-1">Your assessment questions will be tailored to this selection.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Upload Resume (PDF)</label>
                                <div className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer group">
                                    <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto group-hover:text-primary transition-colors" />
                                    <p className="mt-4 text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground mt-1">PDF max 2MB</p>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        id="resume"
                                        onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
                                    />
                                    {formData.resume && (
                                        <div className="mt-4 p-2 bg-primary/5 border border-primary/20 rounded-md text-sm text-primary font-medium">
                                            {formData.resume.name}
                                        </div>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={() => document.getElementById('resume')?.click()}
                                    >
                                        Select File
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    required
                                    checked={formData.consent}
                                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-ring"
                                />
                                <label htmlFor="consent" className="text-sm justify-center text-muted-foreground leading-relaxed cursor-pointer">
                                    I consent to share my assessment results and resume with participating companies for career opportunities.
                                </label>
                            </div>

                            <Button type="submit" disabled={isSubmitting} size="lg" className="w-full group" variant="premium">
                                {isSubmitting ? "Processing..." : "Proceed to Payment"}
                                {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
