import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";
import { getChallenges } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from "@/router/paths.ts";

interface Challenge {
    id: string;
    title: string;
    description: string;
    status: 'OPEN' | 'CLOSED';
}

function ChallengeCardSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-6 w-2/5" />
        </div>
    );
}

function ChallengesListPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChallenges = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getChallenges();
                setChallenges(data);
            } catch (error) {
                console.error("Failed to fetch challenges:", error);
                setError("Could not load challenges. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    return (
        <div className="mx-auto max-w-6xl px-8 py-16 md:py-24">
            <section className="text-center mb-24">
                <h2 className="text-5xl md:text-7xl font-medium tracking-tighter font-serif">
                    Continuous Engagement.
                </h2>
                <h2 className="text-5xl md:text-7xl font-medium tracking-tighter text-foreground/70 font-serif">
                    Exceptional Results.
                </h2>
            </section>

            {error && <p className="text-center text-destructive">{error}</p>}

            <section className="grid grid-cols-1 gap-16 md:grid-cols-3">
                {isLoading ? (
                    <>
                        <ChallengeCardSkeleton />
                        <ChallengeCardSkeleton />
                        <ChallengeCardSkeleton />
                    </>
                ) : (
                    // --- 3. No more errors here! ---
                    // TypeScript now correctly infers that 'challenge' is of type 'Challenge'.
                    challenges.map((challenge) => (
                        <div key={challenge.id} className="text-center md:text-left">
                            <p className="mb-2 text-sm font-semibold tracking-wider text-primary uppercase">
                                {challenge.status === 'OPEN' ? "Active Challenge" : "Challenge Closed"}
                            </p>
                            <h3 className="mb-3 text-3xl font-medium tracking-tight font-serif">
                                {challenge.title}
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                {challenge.description && challenge.description.length > 150
                                    ? `${challenge.description.substring(0, 150)}...`
                                    : challenge.description}
                            </p>
                            <Link to={ROUTES.CHALLENGE_DETAILS(challenge.id)} className="inline-flex items-center font-semibold text-primary transition-all hover:translate-x-1">
                                View Challenge
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

export default ChallengesListPage;
