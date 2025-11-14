import { ArrowRight } from "lucide-react";

const challenges = [
    { id: '1', title: "Predictive Maintenance Analysis", description: "Analyze sensor data to predict equipment failure. The primary evaluation metric is ROC-AUC.", category: "DATA MODELING" },
    { id: '2', title: "Customer Churn Prediction", description: "Build a model to identify customers likely to churn. The goal is to maximize the F1 Score.", category: "CLASSIFICATION" },
    { id: '3', title: "Global Stock Market Forecasting", description: "Develop a time-series model to predict stock prices using historical data. Evaluation is based on RMSE.", category: "FINANCIAL ANALYSIS" },
];

function ChallengesListPage() {
    return (
        <div className="mx-auto max-w-6xl px-8 py-16 md:py-24">
            <section className="text-center mb-24">
                <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground">
                    Continuous engagement.
                </h2>
                <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground/70">
                    Exceptional results.
                </h2>
            </section>

            <section className="grid grid-cols-1 gap-16 md:grid-cols-3">
                {challenges.map((challenge) => (
                    <div key={challenge.id} className="text-center md:text-left">
                        <p className="mb-2 text-sm font-semibold tracking-wider text-primary uppercase">
                            {challenge.category}
                        </p>
                        <h3 className="mb-3 text-3xl font-medium tracking-tight">
                            {challenge.title}
                        </h3>
                        <p className="mb-4 text-muted-foreground">
                            {challenge.description}
                        </p>
                        <a href={`/challenges/${challenge.id}`} className="inline-flex items-center font-semibold text-primary transition-all hover:translate-x-1">
                            View Challenge
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default ChallengesListPage;