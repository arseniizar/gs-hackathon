import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Upload } from 'lucide-react';
import { SubmissionDialog } from '@/components/SubmissionDialog';

// Мокові дані, щоб сторінка працювала без бекенду
const MOCK_CHALLENGE_DETAILS = {
    id: '1',
    title: "Predictive Maintenance Analysis",
    metric: "ROC-AUC",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "The goal of this challenge is to predict equipment failure based on sensor data. Participants will build a binary classification model. The dataset contains anonymized sensor readings and maintenance history for a fleet of industrial machines. Your task is to predict the probability of failure within the next operational cycle.",
    rules: "Submissions must be a CSV file with two columns: 'id' and 'probability'. The file must contain predictions for all IDs present in test.csv. Maximum 5 submissions per day.",
    dataAssets: [
        { name: 'train.csv', size: '24.5 MB' },
        { name: 'test.csv', size: '8.2 MB' },
        { name: 'sample_submission.csv', size: '1.1 MB' },
    ],
    userSubmissions: [
        { id: 'sub-001', submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: 'Scored', score: 0.8923 },
        { id: 'sub-002', submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), status: 'Processing', score: null },
        { id: 'sub-003', submittedAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(), status: 'Error', score: null },
    ],
};

type ChallengeDetails = typeof MOCK_CHALLENGE_DETAILS;

function ChallengeDetailsPage() {
    const { challengeId } = useParams<{ challengeId: string }>();
    const [challenge, setChallenge] = useState<ChallengeDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchChallenge = async () => {
            setIsLoading(true);
            // Імітуємо завантаження даних
            await new Promise(resolve => setTimeout(resolve, 500));
            setChallenge(MOCK_CHALLENGE_DETAILS);
            setIsLoading(false);
        };

        fetchChallenge();
    }, [challengeId]);

    if (isLoading) {
        return <div className="text-center py-24 text-muted-foreground">Loading challenge details...</div>;
    }

    if (!challenge) {
        return <div className="text-center py-24 text-destructive">Failed to load challenge.</div>;
    }

    const timeRemaining = new Date(challenge.deadline).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <>
            <div className="mx-auto max-w-6xl px-8 py-12 md:py-16">
                <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">{challenge.title}</h1>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Metric: <span className="font-semibold text-primary">{challenge.metric}</span> • Deadline: {timeRemaining}
                        </p>
                    </div>
                    <Button size="lg" onClick={() => setIsDialogOpen(true)}>
                        <Upload className="mr-2 h-5 w-5" />
                        Make Submission
                    </Button>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="data">Data</TabsTrigger>
                        <TabsTrigger value="submissions">My Submissions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="prose prose-sm md:prose-base dark:prose-invert max-w-none mt-6">
                        <p>{challenge.description}</p>
                        <h3 className="font-serif">Rules</h3>
                        <p>{challenge.rules}</p>
                    </TabsContent>
                    <TabsContent value="data" className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>File Name</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {challenge.dataAssets.map(asset => (
                                    <TableRow key={asset.name}>
                                        <TableCell className="font-medium">{asset.name}</TableCell>
                                        <TableCell>{asset.size}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={`/path/to/${asset.name}`} download><Download className="mr-2 h-4 w-4" /> Download</a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="submissions" className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Submission ID</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {challenge.userSubmissions.map(sub => (
                                    <TableRow key={sub.id}>
                                        <TableCell className="font-mono text-xs">{sub.id}</TableCell>
                                        <TableCell>{new Date(sub.submittedAt).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={sub.status === 'Scored' ? 'default' : sub.status === 'Error' ? 'destructive' : 'secondary'}>
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{sub.score ? sub.score.toFixed(4) : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>

            <SubmissionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                challengeTitle={challenge.title}
            />
        </>
    );
}

export default ChallengeDetailsPage;
