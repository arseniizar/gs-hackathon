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

// --- Компонент AdminChallengesList (без змін) ---
function AdminChallengesList() {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to permanently delete this challenge?')) {
            try {
                await adminDeleteChallenge(id);
                fetchChallenges();
            } catch (error) {
                console.error("Failed to delete challenge:", error);
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
                                        <Link
                                            to={ROUTES.CHALLENGE_DETAILS(c.id)}
                                            state={{ fromAdmin: true }} // 👈 Ось ця частина
                                            className="hover:underline"
                                        >
                                            {c.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell><Badge variant={c.status === 'OPEN' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
                                    <TableCell className="text-right space-x-1">
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link to={ROUTES.ADMIN_CHALLENGE_EDIT(c.id)} title="Edit Challenge"><Edit className="h-4 w-4" /></Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(c.id)} title="Delete Challenge">
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

// --- Компонент AdminUsersList (без змін) ---
function AdminUsersList() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

    useEffect(() => { fetchUsers(); }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
            try {
                await adminDeleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user:", error);
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
                                <TableHead>Display Name</TableHead><TableHead>Email</TableHead><TableHead>Roles</TableHead><TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((u) => (
                                <TableRow key={u.id}>
                                    <TableCell className="font-medium">{u.displayName}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {u.roles.map((r: string) => (<Badge key={r} variant={r === 'ROLE_ADMIN' ? 'default' : 'outline'}>{r.replace('ROLE_', '')}</Badge>))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(u.id)} title="Delete User">
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


// --- Головна сторінка-контейнер (ЗІ ЗМІНАМИ В ТАБАХ) ---
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
                {/* 👇 ЗМІНЕНО: Стилі для TabsList та TabsTrigger */}
                <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0 mb-8">
                    <TabsTrigger
                        value="challenges"
                        className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-sans text-sm font-semibold text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary -mb-px mr-8"
                    >
                        Manage Challenges
                    </TabsTrigger>
                    <TabsTrigger
                        value="users"
                        className="relative h-auto rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-2 font-sans text-sm font-semibold text-muted-foreground shadow-none transition-none hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary -mb-px"
                    >
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