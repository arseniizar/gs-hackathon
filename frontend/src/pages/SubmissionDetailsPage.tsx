import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSubmissionDetails } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/router/paths';

// Використовуємо той самий інтерфейс, що і в ChallengeDetailsPage
interface UserSubmission {
    id: string;
    createdAt: string;
    status: string;
    score: number | null;
    filename: string;
    errorMessage?: string; // Поле для помилки
    workerHash?: string;
    challengeId: string;
}

function SubmissionDetailsPage() {
    const { submissionId } = useParams<{ submissionId: string }>();
    const [submission, setSubmission] = useState<UserSubmission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!submissionId) return;

        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const data = await getSubmissionDetails(submissionId);
                setSubmission(data);
            } catch (err) {
                setError("Could not load submission details.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [submissionId]);

    if (isLoading) {
        return <div className="mx-auto max-w-2xl px-8 py-16 space-y-4"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-40 w-full" /></div>;
    }

    if (error || !submission) {
        return <div className="text-center py-24 text-destructive">{error || "Submission not found."}</div>;
    }

    return (
        <div className="mx-auto max-w-2xl px-8 py-16">
            <Link to={ROUTES.CHALLENGE_DETAILS(submission.challengeId)} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground mb-8">
                <ArrowLeft className="h-4 w-4" />
                Back to Challenge
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif text-2xl">Submission Details</CardTitle>
                    <CardDescription className="font-mono text-xs pt-1">{submission.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={submission.status === 'FAILED' ? 'destructive' : (submission.status === 'DONE' ? 'default' : 'secondary')}>
                            {submission.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Submitted At</span>
                        <span>{new Date(submission.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Filename</span>
                        <span className="font-mono text-sm">{submission.filename}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Score</span>
                        <span className="font-semibold text-lg">{submission.score !== null ? submission.score.toFixed(4) : 'N/A'}</span>
                    </div>

                    {submission.status === 'FAILED' && submission.errorMessage && (
                        <div className="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-destructive">Evaluation Failed</p>
                                    <p className="mt-1 text-sm text-destructive/80 font-mono">{submission.errorMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {submission.status === 'DONE' && (
                        <div className="mt-4 rounded-md border border-green-500/50 bg-green-500/10 p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-green-600">Evaluation Successful</p>
                                    <p className="mt-1 text-sm text-muted-foreground">Your submission was processed and scored.</p>
                                    {submission.workerHash && <p className="mt-2 text-xs text-muted-foreground font-mono">Hash: {submission.workerHash.substring(0, 16)}...</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default SubmissionDetailsPage;