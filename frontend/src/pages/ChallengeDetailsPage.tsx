import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, ArrowLeft } from 'lucide-react';
import { SubmissionDialog } from '@/components/SubmissionDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from "@/components/ui/toaster";
import { getChallengeDetails, getLeaderboardForChallenge, getMySubmissions } from '@/lib/api';
import { ROUTES } from '@/router/paths';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Інтерфейси для даних з бекенду
interface DataAsset {
    name: string;
    size: string;
}

interface ChallengeDetails {
    id: string;
    title: string;
    metric: string;
    description: string;
    deadline: string | null;
    rules: string;
    dataAssets: DataAsset[];
    status: 'OPEN' | 'CLOSED';
}

interface LeaderboardEntry {
    rank: number;
    userDisplayName: string;
    score: number;
    submissionId: string;
    submittedAt: string;
}

interface UserSubmission {
    id: string;
    submittedAt: string;
    createdAt: string;
    status: string;
    score: number | null;
    filename: string;
}

// Компонент-скелетон для анімації завантаження
function ChallengeDetailsSkeleton() {
    return (
        <div className="mx-auto max-w-6xl px-8 py-12 md:py-16">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
                <div className="w-full md:w-3/4">
                    <Skeleton className="h-16 w-full mb-4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
                <Skeleton className="h-12 w-full md:w-48 rounded-md" />
            </div>
            <div className="border-b">
                <div className="flex space-x-8">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
            <div className="mt-10 space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
            </div>
        </div>
    );
}

function ChallengeDetailsPage() {
    const { challengeId } = useParams<{ challengeId: string }>();
    const location = useLocation();

    const backLink = location.state?.fromAdmin ? ROUTES.ADMIN : ROUTES.HOME;
    const backLinkText = location.state?.fromAdmin ? "Back to Admin Console" : "Back to all challenges";

    const [challenge, setChallenge] = useState<ChallengeDetails | null>(null);
    const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([]);
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[] | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
    const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!challengeId) {
                setError("Challenge ID is missing.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const apiData = await getChallengeDetails(challengeId);
                setChallenge(apiData);
            } catch (err) {
                console.error("Failed to fetch challenge details:", err);
                setError("Could not load challenge details. It might not exist.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [challengeId]);

    const fetchLeaderboard = async () => {
        if (!challengeId) return;
        setIsLeaderboardLoading(true);
        try {
            const data = await getLeaderboardForChallenge(challengeId);
            setLeaderboardData(data);
        } catch (error) {
            setLeaderboardError("Could not load the leaderboard.");
        } finally {
            setIsLeaderboardLoading(false);
        }
    };

    const fetchMySubmissions = async () => {
        if (!challengeId) return;
        try {
            const data = await getMySubmissions(challengeId);
            setUserSubmissions(data);
        } catch (error) {
            console.error("Failed to load submissions", error);
        }
    };

    const handleTabChange = (value: string) => {
        if (value === 'leaderboard' && !leaderboardData) {
            fetchLeaderboard();
        }
        if (value === 'submissions' && userSubmissions.length === 0) {
            fetchMySubmissions();
        }
    };

    if (isLoading) return <ChallengeDetailsSkeleton />;

    if (error || !challenge) {
        return (
            <div className="text-center py-24">
                <p className="text-destructive mb-4">{error || "Failed to load challenge."}</p>
                <Link to={backLink} className="inline-flex items-center gap-2 text-sm text-primary underline">
                    <ArrowLeft className="h-4 w-4" />
                    {backLinkText}
                </Link>
            </div>
        );
    }

    const timeRemaining = challenge.deadline
        ? new Date(challenge.deadline).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })
        : "Not set";

    return (
        <>
            <div className="mx-auto max-w-6xl px-8 py-12 md:py-16">
                <Link to={backLink} state={{ fromAdmin: location.state?.fromAdmin }} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    {backLinkText}
                </Link>

                <div className="flex flex-col md:flex-row justify-between md:items-center mb-12 gap-8">
                    <div className="w-full md:w-3/4">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-5xl md:text-6xl font-medium tracking-tighter font-serif">{challenge.title}</h1>
                            {challenge.status === 'CLOSED' && (
                                <Badge variant="secondary" className="text-lg px-3 py-1">CLOSED</Badge>
                            )}
                        </div>
                        <p className="mt-4 text-base text-muted-foreground">
                            Metric: <span className="font-semibold text-foreground">{challenge.metric}</span> •
                            Deadline: <span className="font-semibold text-foreground">{timeRemaining}</span>
                        </p>
                    </div>
                    {challenge.status === 'OPEN' ? (
                        <Button size="lg" className="w-full md:w-auto flex-shrink-0" onClick={() => setIsDialogOpen(true)}>
                            <Upload className="mr-2 h-4 w-4" /> Make Submission
                        </Button>
                    ) : (
                        <Button size="lg" variant="secondary" disabled className="w-full md:w-auto flex-shrink-0">
                            Submissions Closed
                        </Button>
                    )}
                </div>

                <Tabs defaultValue="overview" className="w-full" onValueChange={handleTabChange}>
                    <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
                        <TabsTrigger value="overview" className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-sans text-sm font-semibold text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary -mb-px mr-8">Overview</TabsTrigger>
                        <TabsTrigger value="data" className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-sans text-sm font-semibold text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary -mb-px mr-8">Data</TabsTrigger>
                        <TabsTrigger value="leaderboard" className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-sans text-sm font-semibold text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary -mb-px mr-8">Leaderboard</TabsTrigger>
                        <TabsTrigger value="submissions" className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-sans text-sm font-semibold text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary -mb-px">My Submissions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-10 space-y-10">
                        <div>
                            <h3 className="text-3xl font-medium mb-4 font-serif">Description</h3>
                            <p className="max-w-4xl text-lg leading-relaxed text-foreground/80 whitespace-pre-line">
                                {challenge.description}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-medium mb-4 font-serif">Rules</h3>
                            <p className="max-w-4xl text-lg leading-relaxed text-foreground/80 whitespace-pre-line">
                                {challenge.rules || "No specific rules defined for this challenge."}
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="data" className="mt-10">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>File Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {challenge.dataAssets && challenge.dataAssets.length > 0 ? (
                                    challenge.dataAssets.map((asset, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <div className="font-medium">{asset.name}</div>
                                                <div className="text-sm text-muted-foreground">{asset.size}</div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" disabled>
                                                    <Download className="mr-2 h-4 w-4" /> Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                                            No datasets available for download.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>

                    <TabsContent value="leaderboard" className="mt-10">
                        {isLeaderboardLoading && <div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>}
                        {leaderboardError && <p className="text-center text-destructive">{leaderboardError}</p>}
                        {leaderboardData && leaderboardData.length > 0 && (
                            <Table>
                                <TableHeader><TableRow><TableHead className="w-[80px]">Rank</TableHead><TableHead>Team</TableHead><TableHead>Submitted At</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {leaderboardData.map((entry) => (
                                        <TableRow key={entry.submissionId}>
                                            <TableCell className="font-bold text-lg">{entry.rank}</TableCell>
                                            <TableCell className="font-medium">{entry.userDisplayName}</TableCell>
                                            <TableCell className="text-muted-foreground">{new Date(entry.submittedAt).toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-mono text-lg font-semibold">{entry.score.toFixed(4)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {leaderboardData && leaderboardData.length === 0 && !isLeaderboardLoading && (
                            <div className="p-12 text-center text-muted-foreground">
                                <p>No submissions have been scored for this challenge yet.</p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="submissions" className="mt-10">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[300px]">Submission</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userSubmissions.length > 0 ? (
                                    userSubmissions.map(sub => (
                                        <TableRow key={sub.id}>
                                            <TableCell>
                                                <div className="font-mono text-sm font-medium">{sub.filename}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(sub.createdAt || sub.submittedAt).toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    sub.status === 'DONE' ? 'default' :
                                                        sub.status === 'FAILED' ? 'destructive' :
                                                            'secondary'
                                                }>
                                                    {sub.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-sm font-semibold">
                                                {sub.score !== null ? sub.score.toFixed(4) : 'N/A'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                            You haven't made any submissions yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>

            <SubmissionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                challengeId={challenge.id}
                challengeTitle={challenge.title}
                onSubmissionSuccess={() => {
                    fetchMySubmissions();
                }}
            />
            <Toaster />
        </>
    );
}

export default ChallengeDetailsPage;