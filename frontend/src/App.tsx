import { ArrowRight, AlertTriangle } from "lucide-react"
import { ThemeToggle } from "./components/theme-toggle"
import { Button } from "./components/ui/button" // Переконаємось, що Button імпортовано для хедера

// Мокуємо дані для Challenges
const challenges = [
    {
        title: "Predictive Maintenance Analysis",
        description: "Analyze sensor data to predict equipment failure. The primary evaluation metric is ROC-AUC.",
        category: "DATA MODELING"
    },
    {
        title: "Customer Churn Prediction",
        description: "Build a model to identify customers likely to churn. The goal is to maximize the F1 Score.",
        category: "CLASSIFICATION"
    },
    {
        title: "Global Stock Market Forecasting",
        description: "Develop a time-series model to predict stock prices using historical data. Evaluation is based on RMSE.",
        category: "FINANCIAL ANALYSIS"
    },
];

function App() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground font-sans">

            {/* Header з кнопкою Team Alpha та перемикачем теми */}
            <header className="flex h-16 items-center justify-between border-b px-8 md:px-16">
                <div className="flex items-center gap-8">
                    <h1 className="text-lg font-bold tracking-wider font-sans">
                        GS HACKATHON
                    </h1>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-foreground/70">
                        <a href="#" className="transition-colors hover:text-foreground">Challenges</a>
                        <a href="#" className="transition-colors hover:text-foreground">Leaderboard</a>
                        <a href="#" className="transition-colors hover:text-foreground">Docs</a>
                    </nav>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost">Team Alpha</Button>
                    <ThemeToggle />
                </div>
            </header>

            <div className="flex items-center justify-center gap-3 border-b bg-secondary p-2.5 text-sm text-secondary-foreground">
                <AlertTriangle className="h-4 w-4" />
                <p>
                    <span className="font-semibold">NOTICE:</span> Submissions are final. Please review your solution carefully.
                </p>
            </div>

            <main className="mx-auto max-w-6xl px-8 py-16 md:py-24">

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
                        <div key={challenge.title} className="text-center md:text-left">
                            <p className="mb-2 text-sm font-semibold tracking-wider text-primary uppercase">
                                {challenge.category}
                            </p>
                            <h3 className="mb-3 text-3xl font-medium tracking-tight">
                                {challenge.title}
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                {challenge.description}
                            </p>
                            <a href="#" className="inline-flex items-center font-semibold text-primary transition-all hover:translate-x-1">
                                View Challenge
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    )
}

export default App
