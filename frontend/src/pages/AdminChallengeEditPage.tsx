import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { adminCreateChallenge, adminUpdateChallenge, getChallengeDetails } from '@/lib/api';
import { ROUTES } from '@/router/paths';
import { ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
    />
);

function AdminChallengeEditPage() {
    const { challengeId } = useParams<{ challengeId: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(challengeId);

    const [formState, setFormState] = useState({
        title: '',
        description: '',
        metric: '',
        status: 'OPEN',
        rules: '',
        deadline: '',
    });
    const [isLoading, setIsLoading] = useState(isEditing);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing && challengeId) {
            const fetchChallenge = async () => {
                setIsLoading(true);
                try {
                    const data = await getChallengeDetails(challengeId);
                    setFormState({
                        ...data,
                        deadline: data.deadline ? new Date(data.deadline).toISOString().substring(0, 16) : '',
                    });
                } catch (error) {
                    console.error("Failed to fetch challenge for editing", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchChallenge();
        }
    }, [challengeId, isEditing]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.id]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            const dataToSave = {
                ...formState,
                deadline: formState.deadline ? new Date(formState.deadline).toISOString() : null,
            };

            if (isEditing && challengeId) {
                await adminUpdateChallenge(challengeId, dataToSave);
            } else {
                await adminCreateChallenge(dataToSave);
            }
            navigate(ROUTES.ADMIN);
        } catch (err: any) {
            console.error("Failed to save challenge", err);
            setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-4xl px-8 py-16 space-y-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto max-w-4xl px-8 py-16">
                <Link to={ROUTES.ADMIN} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground mb-8">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Admin Console
                </Link>

                <h1 className="text-4xl font-medium font-serif tracking-tight mb-8">
                    {isEditing ? 'Edit Challenge' : 'Create New Challenge'}
                </h1>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" value={formState.title} onChange={handleChange} required placeholder="e.g., Customer Churn Prediction" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (Markdown supported)</Label>
                        <Textarea id="description" value={formState.description} onChange={handleChange} required rows={6} placeholder="Detailed problem statement..." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="rules">Rules</Label>
                        <Textarea id="rules" value={formState.rules} onChange={handleChange} rows={4} placeholder="e.g., 1. No external data..." />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="metric">Metric</Label>
                            <Input id="metric" value={formState.metric} onChange={handleChange} required placeholder="e.g., ROC-AUC" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select id="status" value={formState.status} onChange={handleChange} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm">
                                <option value="OPEN">OPEN</option>
                                <option value="CLOSED">CLOSED</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="deadline">Deadline (UTC)</Label>
                            <Input id="deadline" type="datetime-local" value={formState.deadline} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => navigate(ROUTES.ADMIN)}>Cancel</Button>
                        <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Challenge'}</Button>
                    </div>
                </form>
            </div>

            <Dialog open={!!error} onOpenChange={() => setError(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Save Failed</DialogTitle>
                        <DialogDescription>
                            {error}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end pt-2">
                        <Button variant="outline" onClick={() => setError(null)}>Close</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AdminChallengeEditPage;