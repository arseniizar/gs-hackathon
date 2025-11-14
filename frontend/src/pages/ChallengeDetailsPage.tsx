import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {Download, Upload} from 'lucide-react';
import {SubmissionDialog} from '@/components/SubmissionDialog';
import {Skeleton} from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const MOCK_CHALLENGE_DETAILS = {
    id: '1',
    title: "Predictive Maintenance Analysis",
    metric: "ROC-AUC",
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "The goal of this challenge is to predict equipment failure based on sensor data. Participants will build a binary classification model. The dataset contains anonymized sensor readings and maintenance history for a fleet of industrial machines. Your task is to predict the probability of failure within the next operational cycle.",
    rules: "Submissions must be a CSV file with two columns: 'id' and 'probability'. The file must contain predictions for all IDs present in test.csv. Maximum 5 submissions per day.",
    dataAssets: [
        {name: 'train.csv', size: '24.5 MB'},
        {name: 'test.csv', size: '8.2 MB'},
        {name: 'sample_submission.csv', size: '1.1 MB'},
    ],
    userSubmissions: [
        {
            id: 'sub-001',
            submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'Scored',
            score: 0.8923
        },
        {
            id: 'sub-002',
            submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            status: 'Processing',
            score: null
        },
        {
            id: 'sub-003',
            submittedAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
            status: 'Error',
            score: null
        },
    ],
};
type ChallengeDetails = typeof MOCK_CHALLENGE_DETAILS;

function ChallengeDetailsSkeleton() {
    return (
        <div className="mx-auto max-w-6xl px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-4">
                <div className="w-full md:w-3/4">
                    <Skeleton className="h-16 w-full mb-4"/>
                    <Skeleton className="h-6 w-1/2"/>
                </div>
                <Skeleton className="h-12 w-full md:w-48 rounded-md"/>
            </div>
            <div className="border-b">
                <div className="flex space-x-8">
                    <Skeleton className="h-10 w-24"/>
                    <Skeleton className="h-10 w-24"/>
                    <Skeleton className="h-10 w-32"/>
                </div>
            </div>
            <div className="mt-10 space-y-6">
                <Skeleton className="h-8 w-48"/>
                <Skeleton className="h-5 w-full"/>
                <Skeleton className="h-5 w-4/5"/>
            </div>
        </div>
    );
}

function ChallengeDetailsPage() {
    const {challengeId} = useParams<{ challengeId: string }>();
    const [challenge, setChallenge] = useState<ChallengeDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchChallenge = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setChallenge(MOCK_CHALLENGE_DETAILS);
            setIsLoading(false);
        };
        fetchChallenge();
    }, [challengeId]);

    if (isLoading) {
        return <ChallengeDetailsSkeleton/>;
    }

    if (!challenge) {
        return <div className="text-center py-24 text-destructive">Failed to load challenge.</div>;
    }

    const timeRemaining = new Date(challenge.deadline).toLocaleDateString("en-US", {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <>
            <div className="mx-auto max-w-6xl px-8 py-12 md:py-16">
                <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-6">
                    <div className="w-full md:w-3/4">
                        <h1 className="text-5xl md:text-6xl font-medium tracking-tighter font-serif">{challenge.title}</h1>
                        <p className="mt-4 text-base text-muted-foreground">
                            Metric: <span className="font-semibold text-foreground">{challenge.metric}</span> •
                            Deadline: <span className="font-semibold text-foreground">{timeRemaining}</span>
                        </p>
                    </div>
                    <Button size="lg" className="w-full md:w-auto flex-shrink-0" onClick={() => setIsDialogOpen(true)}>
                        <Upload className="mr-2 h-4 w-4"/>
                        Make Submission
                    </Button>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
                        <TabsTrigger
                            value="overview"
                            className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 text-base font-medium text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground -mb-px mr-8"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="data"
                            className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 text-base font-medium text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground -mb-px mr-8"
                        >
                            Data
                        </TabsTrigger>
                        <TabsTrigger
                            value="submissions"
                            className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 text-base font-medium text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground -mb-px"
                        >
                            My Submissions
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-10 space-y-10">
                        <div>
                            <h3 className="text-3xl font-medium mb-4 font-serif">Description</h3>
                            <p className="max-w-4xl text-lg leading-relaxed text-foreground/80">{challenge.description}</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-medium mb-4 font-serif">Rules</h3>
                            <p className="max-w-4xl text-lg leading-relaxed text-foreground/80">{challenge.rules}</p>
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
                                {challenge.dataAssets.map(asset => (
                                    <TableRow key={asset.name}>
                                        <TableCell>
                                            <div className="font-medium">{asset.name}</div>
                                            <div className="text-sm text-muted-foreground">{asset.size}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" asChild>
                                                <a href={`/path/to/${asset.name}`} download className="flex items-center text-sm font-semibold text-primary hover:underline">
                                                    Download <Download className="ml-2 h-4 w-4"/>
                                                </a>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
                                {challenge.userSubmissions.map(sub => (
                                    <TableRow key={sub.id}>
                                        <TableCell>
                                            <div className="font-mono text-sm font-medium">{sub.id}</div>
                                            <div className="text-sm text-muted-foreground">{new Date(sub.submittedAt).toLocaleString()}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={sub.status === 'Scored' ? 'default' : sub.status === 'Error' ? 'destructive' : 'secondary'}>
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-sm font-semibold">
                                            {sub.score ? sub.score.toFixed(4) : 'N/A'}
                                        </TableCell>
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
