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
import { initializeApp } from "firebase/app";
import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";
import { getAuth, updateProfile, GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup, deleteUser } from "firebase/auth";

import Header from "@/components/header";
import UserMenu from "@/components/user";
import SettingsMenu from "@/components/settings";
import MobileSheet from "@/components/mobile-sheet";

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
    const auth = getAuth();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [googleLinked, setGoogleLinked] = useState(false);

    useEffect(() => {
        if (auth.currentUser) {
            const linked = auth.currentUser.providerData.some(provider => provider.providerId === GoogleAuthProvider.PROVIDER_ID);
            setGoogleLinked(linked);
        }
    }, []);

    const GoogleSignInButton = () => {
        const auth = getAuth();

        const handleGoogleSignIn = async () => {
            const provider = new GoogleAuthProvider();
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log('Logged in with Google:', user);
                setGoogleLinked(true);
            } catch (error) {
                console.error('Google sign in error:', error);
            }
        };
        return googleLinked ? (
            <Button variant="outline" disabled>
                <FcGoogle className="w-[20px] h-[20px] mr-[5px] dark:hidden" />
                <FaGoogle className="w-[17.5px] h-[17.5px] mr-[7.5px] hidden dark:block" />
                Already linked with Google.
            </Button>
        ) : (
            <Button onClick={handleGoogleSignIn} variant="outline">
                <FcGoogle className="w-[20px] h-[20px] mr-[5px] dark:hidden" />
                <FaGoogle className="w-[17.5px] h-[17.5px] mr-[7.5px] hidden dark:block" />
                    Sign in with Google
            </Button>
        );
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>Integrations -Afro.dev</title>
        </Head>
        <Header current="settings" />
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Settings</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <SettingsMenu current="integrations" />
            <div className="grid gap-6">
                <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <h3 className="text-xl font-semibold">Integration</h3>
                        <CardDescription>Link your account with Google.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GoogleSignInButton />
                    </CardContent>
                </Card>
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
                            Updated successfully!
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
