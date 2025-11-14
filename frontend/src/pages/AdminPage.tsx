import { useState, useEffect } from 'react';
import {
    adminGetAllChallenges,
    adminCreateChallenge,
    adminUpdateChallenge,
    adminDeleteChallenge
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // 👈 This was missing!
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Simple Textarea component for the form
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
    />
);

// --- Sub-component: Form for Create/Edit ---
interface ChallengeFormProps {
    challenge: any;
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
}

const ChallengeForm = ({ challenge, onSave, onCancel }: ChallengeFormProps) => {
    const [title, setTitle] = useState(challenge?.title || '');
    const [description, setDescription] = useState(challenge?.description || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await onSave({ title, description });
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogHeader>
                <DialogTitle className="font-serif text-xl">
                    {challenge ? 'Edit Challenge' : 'Create New Challenge'}
                </DialogTitle>
                <DialogDescription>
                    Set the core details for this data modeling task.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={isSaving}
                        placeholder="e.g. Customer Churn Prediction"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={5}
                        disabled={isSaving}
                        placeholder="Detailed problem statement..."
                    />
                </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Challenge'}
                </Button>
            </DialogFooter>
        </form>
    );
};

// --- Main Page Component ---
function AdminPage() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<any>(null);

    const fetchChallenges = async () => {
        try {
            const data = await adminGetAllChallenges();
            setChallenges(data);
        } catch (error) {
            console.error("Failed to fetch challenges", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleSaveChallenge = async (challengeData: any) => {
        try {
            if (editingChallenge) {
                await adminUpdateChallenge(editingChallenge.id, challengeData);
            } else {
                await adminCreateChallenge(challengeData);
            }
            await fetchChallenges();
            setIsDialogOpen(false); // Close dialog on success
            setEditingChallenge(null);
        } catch (error) {
            console.error("Failed to save challenge", error);
            alert("Failed to save challenge. Check console for details.");
        }
    };

    const handleDeleteChallenge = async (id: string) => {
        if (window.confirm('Are you sure you want to permanently delete this challenge?')) {
            try {
                await adminDeleteChallenge(id);
                await fetchChallenges();
            } catch (error) {
                console.error("Failed to delete challenge", error);
            }
        }
    };

    // Handle opening the dialog for creating (reset state)
    const openCreateDialog = () => {
        setEditingChallenge(null);
        setIsDialogOpen(true);
    };

    // Handle opening the dialog for editing
    const openEditDialog = (challenge: any) => {
        setEditingChallenge(challenge);
        setIsDialogOpen(true);
    };

    return (
        <div className="mx-auto max-w-6xl px-8 py-16">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-medium font-serif tracking-tight">Manage Challenges</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openCreateDialog}>
                            <PlusCircle className="mr-2 h-4 w-4" /> New Challenge
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <ChallengeForm
                            challenge={editingChallenge}
                            onSave={handleSaveChallenge}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg border bg-card">
                {isLoading ? (
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : challenges.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <p>No challenges found. Create one to get started.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[300px]">Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {challenges.map((challenge) => (
                                <TableRow key={challenge.id}>
                                    <TableCell className="font-medium font-serif text-lg">
                                        {challenge.title}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={challenge.status === 'OPEN' ? 'default' : 'secondary'}>
                                            {challenge.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEditDialog(challenge)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDeleteChallenge(challenge.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}

export default AdminPage;
