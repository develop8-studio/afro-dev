import Head from "next/head";
import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, signOut, updateProfile, updatePassword, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";

import HeaderList from "@/components/header";
import UserMenu from "@/components/user";
import SettingsMenu from "@/components/settings";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Dashboard() {
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (auth.currentUser) {
            setUsername(auth.currentUser.displayName || "");
        }
    }, []);

    useEffect(() => {
        if (!auth.currentUser) {
            router.push("/login");
        }
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/login");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const handleUsernameChange = async (event: FormEvent) => {
        event.preventDefault();
        try {
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: username,
                });
                setSuccess(true);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    const handlePasswordChange = async (event: FormEvent) => {
        event.preventDefault();
        try {
            if (!auth.currentUser) {
                throw new Error("User not authenticated.");
            }
            const userEmail = auth.currentUser?.email || "";;
            if (!auth.currentUser.providerData.some((provider) => provider.providerId === "password")) {
                await createUserWithEmailAndPassword(auth, userEmail, newPassword);
            } else {
                await updatePassword(auth.currentUser, newPassword);
            }
            setNewPassword("");
            setConfirmPassword("");
            setSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>Security -Nook.to</title>
        </Head>
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <HeaderList />
            <Sheet>
            <SheetTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Dashboard
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Orders
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Products
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Customers
                </Link>
                <Link href="#" className="hover:text-foreground">
                    Settings
                </Link>
                </nav>
            </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
                </div>
            </form>
            <UserMenu />
            </div>
        </header>
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Settings</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <SettingsMenu current="security" />
            <div className="grid gap-6">
                {/* <Card x-chunk="dashboard-04-chunk-2">
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                        Change your password.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordChange}>
        <CardContent>
            <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-4"
            />
            <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Save</Button>
        </CardFooter>
    </form>
                </Card> */}
            </div>
            </div>
        </main>
        {error && (
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error</AlertDialogTitle>
                        <AlertDialogDescription>
                            {error}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setError(null)}>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        {success && (
            <AlertDialog open>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Success</AlertDialogTitle>
                        <AlertDialogDescription>
                            Username updated successfully!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSuccess(false)}>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
        </div>
    )
}
