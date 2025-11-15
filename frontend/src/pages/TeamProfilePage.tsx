import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateTeamProfile, getTeamProfile } from '@/lib/api';
import { ROUTES } from '@/router/paths';
import { Skeleton } from '@/components/ui/skeleton';
import { Pencil } from 'lucide-react';

function TeamProfilePage() {
    const { refreshAuthInfo } = useAuth();
    const navigate = useNavigate();

    // 👇 Стани для даних профілю
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState(''); // Учасники як один рядок

    // 👇 Нові стани для керування інтерфейсом
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Завантаження початкових даних
    const [isSaving, setIsSaving] = useState(false); // Збереження змін
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const data = await getTeamProfile();
                if (data.teamName) {
                    setTeamName(data.teamName);
                    setMembers(data.teamMembers ? data.teamMembers.join(', ') : '');
                    // Якщо назви команди немає, автоматично вмикаємо режим редагування
                    if (!data.teamName) {
                        setIsEditing(true);
                    }
                } else {
                    // Якщо профіль зовсім порожній
                    setIsEditing(true);
                }
            } catch (err) {
                console.error("Could not fetch profile:", err);
                setError('Failed to load profile data.');
                setIsEditing(true); // Дозволяємо спробувати заповнити
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);
        try {
            const teamMembers = members.split(',').map(m => m.trim()).filter(Boolean);
            await updateTeamProfile({ teamName, teamMembers });
            await refreshAuthInfo(); // Оновлюємо глобальний стан
            setIsEditing(false); // Вимикаємо режим редагування після збереження
            // Перевіряємо, чи ми тут вперше. Якщо так, перенаправляємо.
            if (!localStorage.getItem('profileSetupComplete')) {
                localStorage.setItem('profileSetupComplete', 'true');
                navigate(ROUTES.HOME);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save profile.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Якщо скасовуємо редагування, повертаємо початкові дані (можна буде додати)
        setIsEditing(false);
        // Якщо назва команди ще не встановлена, не дозволяємо вийти з режиму редагування
        if (!teamName) return;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24 px-4">
                <Card className="mx-auto max-w-lg w-full">
                    <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full mt-4" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-24 px-4">
            <Card className="mx-auto max-w-lg w-full">
                {isEditing ? (
                    // --- РЕЖИМ РЕДАГУВАННЯ ---
                    <>
                        <CardHeader>
                            <CardTitle className="text-2xl font-serif">
                                {teamName ? 'Edit Your Team Profile' : 'Set Up Your Team Profile'}
                            </CardTitle>
                            <CardDescription>
                                This information will be displayed on the leaderboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="teamName">Official Team Name</Label>
                                    <Input id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} required disabled={isSaving} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="members">Team Members (comma-separated)</Label>
                                    <Input id="members" value={members} onChange={(e) => setMembers(e.target.value)} disabled={isSaving} placeholder="e.g., John Doe, Jane Smith" />
                                </div>
                                {error && <p className="text-sm text-destructive">{error}</p>}
                                <div className="flex justify-end gap-2 mt-4">
                                    {teamName && <Button type="button" variant="ghost" onClick={handleCancel} disabled={isSaving}>Cancel</Button>}
                                    <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </>
                ) : (
                    // --- РЕЖИМ ПЕРЕГЛЯДУ ---
                    <>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-2xl font-serif">Team Profile</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardDescription>
                                This is how your team appears on the platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-muted-foreground">Team Name</Label>
                                <p className="text-lg font-semibold">{teamName}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Team Members</Label>
                                <p className="text-base text-foreground/90">{members || <span className="italic">No members listed</span>}</p>
                            </div>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}

export default TeamProfilePage;