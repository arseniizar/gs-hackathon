import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { adminGetAllChallenges, adminDeleteChallenge, adminGetAllUsers, adminDeleteUser } from '@/lib/api';
import { ROUTES } from '@/router/paths';
import { ConfirmDialog } from '@/components/ConfirmDialog';

// --- Компонент для вкладки "Challenges" ---
function AdminChallengesList() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const fetchChallenges = async () => {
        setIsLoading(true);
        try {
            const data = await adminGetAllChallenges();
            setChallenges(data);
        } catch (error) {
            console.error("Failed to fetch challenges:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                await adminDeleteChallenge(itemToDelete);
                await fetchChallenges();
            } catch (error) {
                console.error("Failed to delete challenge:", error);
            } finally {
                setItemToDelete(null);
                setDialogOpen(false);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold font-serif">Manage Challenges</h2>
                <Button asChild>
                    <Link to={ROUTES.ADMIN_CHALLENGE_NEW}><PlusCircle className="mr-2 h-4 w-4" /> New Challenge</Link>
                </Button>
            </div>
            <div className="rounded-lg border bg-card">
                {isLoading ? (
                    <div className="p-6 space-y-2">
                        <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {challenges.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">
                                        <Link to={ROUTES.CHALLENGE_DETAILS(c.id)} state={{ fromAdmin: true }} className="hover:underline" title="View public page">{c.title}</Link>
                                    </TableCell>
                                    <TableCell><Badge variant={c.status === 'OPEN' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link to={ROUTES.ADMIN_CHALLENGE_EDIT(c.id)} title="Edit Challenge"><Edit className="h-4 w-4" /></Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(c.id)} title="Delete Challenge">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
            <ConfirmDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={confirmDelete}
                title="Are you sure you want to delete this challenge?"
                description="This action cannot be undone and will permanently remove the challenge."
            />
        </div>
    );
}

// --- Компонент для вкладки "Users" ---
function AdminUsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await adminGetAllUsers();
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                await adminDeleteUser(itemToDelete);
                await fetchUsers();
            } catch (error) {
                console.error("Failed to delete user:", error);
            } finally {
                setItemToDelete(null);
                setDialogOpen(false);
            }
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold font-serif mb-4">Manage Users</h2>
            <div className="rounded-lg border bg-card">
                {isLoading ? (
                    <div className="p-6 space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Team Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.teamName || <span className="text-muted-foreground italic">Not set</span>}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {u.roles.map((r: string) => (
                                                <Badge key={r} variant={r === 'ROLE_ADMIN' ? 'default' : 'outline'}>{r.replace('ROLE_', '')}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(u.id)} title="Delete User">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
            <ConfirmDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onConfirm={confirmDelete}
                title="Are you sure you want to delete this user?"
                description="This will permanently delete the user and all their related data. This action is irreversible."
            />
        </div>
    );
}


// --- Головна сторінка-контейнер ---
function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentTab = location.pathname === ROUTES.ADMIN_USERS ? 'users' : 'challenges';

    const onTabChange = (value: string) => {
        navigate(value === 'users' ? ROUTES.ADMIN_USERS : ROUTES.ADMIN);
    };

    return (
        <div className="mx-auto max-w-6xl px-8 py-16">
            <h1 className="text-4xl font-medium font-serif tracking-tight mb-8">Admin Console</h1>
            <Tabs value={currentTab} onValueChange={onTabChange}>
                <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0 mb-8">
                    <TabsTrigger value="challenges" className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-sans text-sm font-semibold text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary -mb-px mr-8">
                        Manage Challenges
                    </TabsTrigger>
                    <TabsTrigger value="users" className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-sans text-sm font-semibold text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary -mb-px">
                        Manage Users
                    </TabsTrigger>
                </TabsList>

                {currentTab === 'challenges' && <AdminChallengesList />}
                {currentTab === 'users' && <AdminUsersList />}
            </Tabs>
        </div>
    );
}

export default AdminPage;