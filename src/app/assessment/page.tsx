"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { BrainCircuit, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Suspense } from "react";

const marketingOptions = ["Strongly Disagree", "Moderately Disagree", "Somewhat Disagree", "Neutral", "Somewhat Agree", "Moderately Agree", "Strongly Agree"];
const financeOptions = ["Never", "Seldom", "Sometimes", "Often", "Always"];
const hrOptions = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
const personalityOptions = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

// Question banks
const QUESTIONS: Record<string, { text: string; type: string; options: string[] }[]> = {
    common: [
        { text: "I am always prepared for classes and meetings.", type: "personality", options: personalityOptions },
        { text: "I pay close attention to the small details of my assignments.", type: "personality", options: personalityOptions },
        { text: "I follow a strict schedule to ensure all my duties are completed.", type: "personality", options: personalityOptions },
        { text: "I make sure my work is organized and never 'make a mess of things.'", type: "personality", options: personalityOptions },
        { text: "I remain relaxed even when facing tight deadlines.", type: "personality", options: personalityOptions },
        { text: "I seldom 'feel blue' or discouraged when my work is criticized.", type: "personality", options: personalityOptions },
        { text: "I am not easily disturbed by unexpected changes in project requirements.", type: "personality", options: personalityOptions },
        { text: "I keep my emotions steady, even during frequent 'mood swings' in a team environment.", type: "personality", options: personalityOptions },
        { text: "I feel comfortable starting conversations with professionals or new peers.", type: "personality", options: personalityOptions },
        { text: "I don't mind being the center of attention during a presentation.", type: "personality", options: personalityOptions },
        { text: "I am comfortable talking to a lot of different people at networking events.", type: "personality", options: personalityOptions },
        { text: "I take time out to help my teammates when they are struggling.", type: "personality", options: personalityOptions },
        { text: "I am genuinely interested in people and their diverse perspectives.", type: "personality", options: personalityOptions },
        { text: "I sympathize with others' feelings when conflict arises in a group.", type: "personality", options: personalityOptions },
        { text: "I have a vivid imagination when it comes to finding creative solutions.", type: "personality", options: personalityOptions },
        { text: "I am quick to understand abstract ideas and complex theories.", type: "personality", options: personalityOptions },
        { text: "I am always looking for 'excellent ideas' to improve existing processes.", type: "personality", options: personalityOptions },
        { text: "Dependability: You have a chore or task due today, but a social event comes up.", type: "behavioral", options: ["Do the chore right away, then see if I have time.", "Shirk my duties for today and catch up later."] },
        { text: "Communication: You are explaining a concept and notice the listener is struggling.", type: "behavioral", options: ["Use simpler words to ensure they understand.", "Continue using my rich vocabulary to maintain accuracy."] },
        { text: "Conflict Management: A teammate insults your contribution to a project.", type: "behavioral", options: ["Get upset easily and react emotionally.", "Stay relaxed and ask for specific feedback to improve."] },
        { text: "Abstract Reasoning: How do you approach a task you have never done before?", type: "aptitude", options: ["I find it difficult to understand the abstract steps involved.", "I am quick to understand and break it into a schedule."] },
        { text: "Initiative: When you finish your portion of a group project early, you:", type: "aptitude", options: ["Keep in the background until the deadline.", "Start a conversation about how else I can contribute."] }
    ],
    Finance: [
        { text: "Compared your actual expenses to your budget.", type: "domain", options: financeOptions },
        { text: "Paid all your bills on time.", type: "domain", options: financeOptions },
        { text: "Kept a written or electronic record of your monthly expenses.", type: "domain", options: financeOptions },
        { text: "Stayed within your budget or spending plan.", type: "domain", options: financeOptions },
        { text: "Made a list of all income and expenses to get a good idea of how much was spent each month.", type: "domain", options: financeOptions },
        { text: "Paid credit card bills in full and avoided finance charges.", type: "domain", options: financeOptions },
        { text: "Maxed out the limit on one or more credit cards.", type: "domain", options: financeOptions },
        { text: "Made only minimum payments on a loan.", type: "domain", options: financeOptions },
        { text: "Began or maintained an emergency savings fund.", type: "domain", options: financeOptions },
        { text: "Saved money from every paycheck.", type: "domain", options: financeOptions },
        { text: "Contributed money to a retirement account.", type: "domain", options: financeOptions },
        { text: "Bought bonds, stocks, or mutual funds.", type: "domain", options: financeOptions },
        { text: "Saved for a major purchase.", type: "domain", options: financeOptions },
        { text: "Maintained or purchased an adequate health insurance policy.", type: "domain", options: financeOptions },
        { text: "Maintained or purchased adequate property insurance like auto or homeowners insurance.", type: "domain", options: financeOptions }
    ],
    HR: [
        { text: "I try to understand my colleagues' viewpoints before forming an opinion.", type: "domain", options: hrOptions },
        { text: "I consider multiple perspectives before making HR-related decisions.", type: "domain", options: hrOptions },
        { text: "During conflicts, I attempt to see the issue from both sides.", type: "domain", options: hrOptions },
        { text: "I can easily imagine how workplace changes may affect employees.", type: "domain", options: hrOptions },
        { text: "I respect opinions that differ from my own.", type: "domain", options: hrOptions },
        { text: "I feel concerned when a coworker is emotionally distressed.", type: "domain", options: hrOptions },
        { text: "I feel compassion for employees facing personal difficulties.", type: "domain", options: hrOptions },
        { text: "I am sensitive to the emotional needs of others at work.", type: "domain", options: hrOptions },
        { text: "I feel motivated to support team members during challenging times.", type: "domain", options: hrOptions },
        { text: "I feel upset when someone is treated unfairly in the organisation.", type: "domain", options: hrOptions },
        { text: "I feel uneasy when I witness workplace conflicts.", type: "domain", options: hrOptions },
        { text: "I find it stressful to deal with emotionally charged situations.", type: "domain", options: hrOptions },
        { text: "I sometimes feel overwhelmed by others' emotional problems.", type: "domain", options: hrOptions },
        { text: "Tense situations at work make me uncomfortable.", type: "domain", options: hrOptions },
        { text: "I find it difficult to stay emotionally detached during conflicts.", type: "domain", options: hrOptions },
        { text: "I actively listen to employees without interrupting them.", type: "domain", options: hrOptions },
        { text: "I try to understand employees' emotions before responding.", type: "domain", options: hrOptions },
        { text: "Empathy helps me make fair and unbiased HR decisions.", type: "domain", options: hrOptions },
        { text: "I use understanding rather than authority to resolve conflicts.", type: "domain", options: hrOptions },
        { text: "I believe empathy is essential for effective leadership in HR.", type: "domain", options: hrOptions }
    ],
    Marketing: [
        { text: "I tend to see things from different perspectives.", type: "domain", options: marketingOptions },
        { text: "Just for pleasure, I strive to find out how things work.", type: "domain", options: marketingOptions },
        { text: "I have created original and positive things that are recognized by many people.", type: "domain", options: marketingOptions },
        { text: "I have developed ideas that involve violation of certain rules.", type: "domain", options: marketingOptions },
        { text: "I try to help customers achieve their goals.", type: "domain", options: marketingOptions },
        { text: "I try to find out what kind of product would be most helpful to a customer.", type: "domain", options: marketingOptions },
        { text: "I would invest 10% of my annual income in a new business venture.", type: "domain", options: marketingOptions },
        { text: "I would choose a career that I truly enjoy over a more secure one.", type: "domain", options: marketingOptions },
        { text: "I get my ideas to have an impact on others.", type: "domain", options: marketingOptions },
        { text: "I try to influence a customer by information rather than by pressure.", type: "domain", options: marketingOptions }
    ]
};

function AssessmentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const domain = (searchParams?.get("domain") as "Finance" | "HR" | "Marketing") || "Finance";
    const userId = searchParams?.get("userId") || "";

    const [started, setStarted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<{ commonScore: number, domainScore: number, commonInterpretation: string, domainInterpretation: string } | null>(null);

    // Combine common + domain questions
    const allQuestions = [...QUESTIONS.common, ...(QUESTIONS[domain] || QUESTIONS.Finance)];

    const calculateResults = (finalAnswers: Record<number, string>) => {
        let commonScore = 0;
        let domainScore = 0;
        let commonInterpretation = "";
        let domainInterpretation = "";

        // Common Score (17 personality, 5 behavioral/aptitude)
        for (let i = 0; i < 17; i++) {
            const answer = finalAnswers[i];
            if (answer) commonScore += personalityOptions.indexOf(answer) + 1;
        }
        const positiveBehavioralAnswers = [
            "Do the chore right away, then see if I have time.",
            "Use simpler words to ensure they understand.",
            "Stay relaxed and ask for specific feedback to improve.",
            "I am quick to understand and break it into a schedule.",
            "Start a conversation about how else I can contribute."
        ];
        for (let i = 17; i < 22; i++) {
            if (positiveBehavioralAnswers.includes(finalAnswers[i])) commonScore += 1;
        }

        if (commonScore > 70) commonInterpretation = "High suitability for professional/academic roles.";
        else if (commonScore >= 50) commonInterpretation = "Moderate suitability. Consider developing weak areas.";
        else commonInterpretation = "Low suitability. Focus on building initiative and resilience.";

        // Domain Score
        const domainStartIndex = 22;
        if (domain === "Finance") {
            for (let i = 0; i < 15; i++) {
                const answer = finalAnswers[domainStartIndex + i];
                if (answer) {
                    let val = financeOptions.indexOf(answer) + 1;
                    if (i === 6 || i === 7) val = 6 - val; // Reverse score
                    domainScore += val;
                }
            }
            if (domainScore > 55) domainInterpretation = "High suitability for Finance roles.";
            else if (domainScore >= 40) domainInterpretation = "Moderate suitability. Potential with development.";
            else domainInterpretation = "Low suitability. Lower current suitability for Finance roles.";
        } else if (domain === "HR") {
            for (let i = 0; i < 20; i++) {
                const answer = finalAnswers[domainStartIndex + i];
                if (answer) domainScore += hrOptions.indexOf(answer) + 1;
            }
            if (domainScore > 75) domainInterpretation = "High suitability for HR. Strong empathy observed.";
            else if (domainScore >= 50) domainInterpretation = "Moderate suitability. Balanced, may need distress management.";
            else domainInterpretation = "Low suitability for HR. May need to focus on building empathy skills.";
        } else if (domain === "Marketing") {
            for (let i = 0; i < 10; i++) {
                const answer = finalAnswers[domainStartIndex + i];
                if (answer) domainScore += marketingOptions.indexOf(answer) + 1;
            }
            if (domainScore > 50) domainInterpretation = "High suitability for Marketing roles.";
            else if (domainScore >= 35) domainInterpretation = "Moderate suitability for Marketing roles.";
            else domainInterpretation = "Low suitability for Marketing roles.";
        }

        setResults({ commonScore, domainScore, commonInterpretation, domainInterpretation });
        setShowResults(true);

        if (userId) {
            fetch('/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    domain,
                    commonScore,
                    domainScore,
                    commonInterpretation,
                    domainInterpretation
                })
            }).catch(console.error);
        }
    };

    const handleAnswer = (option: string) => {
        const newAnswers = { ...answers, [currentStep]: option };
        setAnswers(newAnswers);

        if (currentStep < allQuestions.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 300);
        } else {
            setTimeout(() => calculateResults(newAnswers), 500);
        }
    };

    const progress = Math.round((Object.keys(answers).length / allQuestions.length) * 100);

    if (!started) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background transition-colors">
                <Card className="max-w-2xl w-full border-border shadow-2xl shadow-primary/10">
                    <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary/20">
                            <BrainCircuit className="h-10 w-10 text-primary" />
                        </div>

                        <h1 className="text-3xl font-bold font-heading text-foreground mb-4">
                            {domain} Domain Assessment
                        </h1>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left space-y-3">
                            <div className="flex gap-3">
                                <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
                                <p className="text-amber-900 font-medium">Please read before starting:</p>
                            </div>
                            <ul className="list-disc list-inside text-amber-800/80 space-y-2 ml-9">
                                <li>You have selected the <strong>{domain}</strong> domain.</li>
                                <li>Please answer honestly based on your first instinct.</li>
                                <li>This assessment is <strong>not pass/fail</strong>.</li>
                                <li>It is meant purely for self-understanding and role alignment.</li>
                            </ul>
                        </div>

                        <Button onClick={() => setStarted(true)} size="lg" className="w-full text-lg h-14" variant="premium">
                            Begin Assessment
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (showResults && results) {
        return (
            <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col pt-12 transition-colors">
                <div className="container mx-auto max-w-3xl px-4 flex-1">
                    <Card className="border-border bg-card shadow-lg shadow-primary/5 min-h-[400px] flex flex-col">
                        <CardContent className="p-8 md:p-12 flex-1 flex flex-col text-center">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-500/20">
                                <CheckCircle2 className="h-10 w-10 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-bold font-heading text-foreground mb-4">
                                Assessment Complete
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6 mt-8">
                                <div className="bg-muted/50 p-6 rounded-xl border border-border text-left">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">General Fit Score</h3>
                                    <div className="text-4xl font-bold text-primary mb-3">
                                        {results.commonScore} <span className="text-lg text-muted-foreground font-normal">/ 90</span>
                                    </div>
                                    <p className="text-foreground/80 leading-relaxed text-sm">
                                        {results.commonInterpretation}
                                    </p>
                                </div>
                                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 text-left">
                                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{domain} Fit Score</h3>
                                    <div className="text-4xl font-bold text-primary mb-3">
                                        {results.domainScore}
                                        <span className="text-lg text-muted-foreground font-normal">
                                            {domain === "Finance" ? " / 75" : domain === "HR" ? " / 100" : " / 70"}
                                        </span>
                                    </div>
                                    <p className="text-foreground/80 leading-relaxed text-sm">
                                        {results.domainInterpretation}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col gap-4 sm:flex-row justify-center">
                                <Button onClick={() => router.push(`/dashboard/student?domain=${domain}&userId=${userId}`)} size="lg" className="w-full sm:w-auto text-lg h-14" variant="premium">
                                    Continue to Dashboard
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const currentQ = allQuestions[currentStep];

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background flex flex-col pt-12 transition-colors">
            <div className="container mx-auto max-w-3xl px-4 flex-1">

                {/* Progress header map */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Question {currentStep + 1} of {allQuestions.length}</span>
                        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{progress}% Completed</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <Card className="border-border bg-card shadow-lg shadow-primary/5 min-h-[400px] flex flex-col">
                    <CardContent className="p-8 md:p-12 flex-1 flex flex-col">
                        <div className="mb-10 flex-1">
                            <div className="inline-flex px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold mb-4 uppercase tracking-widest border border-border">
                                {currentQ.type} Insight
                            </div>
                            <h2 className="text-2xl md:text-3xl font-medium text-foreground leading-snug">
                                {currentQ.text}
                            </h2>
                        </div>

                        <div className="grid gap-4 mt-auto">
                            {currentQ.options.map((opt, i) => {
                                const isSelected = answers[currentStep] === opt;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(opt)}
                                        className={`text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                      ${isSelected
                                                ? 'border-primary bg-primary/5 text-primary shadow-md translate-x-2'
                                                : 'border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground'
                                            }
                    `}
                                    >
                                        <span className="font-medium">{opt}</span>
                                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors
                      ${isSelected ? 'border-primary text-primary' : 'border-input text-transparent group-hover:border-primary/50'}
                    `}>
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

export default function AssessmentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading Assessment...</div>}>
            <AssessmentContent />
        </Suspense>
    )
}
