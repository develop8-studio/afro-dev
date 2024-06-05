import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { CircleUser, Menu, Package2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import { getAuth, updateProfile, GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup, deleteUser } from "firebase/auth";
import { collection, getFirestore, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import Header from "@/components/header";
import SearchMenu from "@/components/search";
import UserMenu from "@/components/user";
import SettingsMenu from "@/components/settings";
import MobileSheet from "@/components/mobile-sheet";

import useAuthRedirect from '@/components/useAuthRedirect';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export default function AccountSettingsPage() {
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [changingUsername, setChangingUsername] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [googleLinked, setGoogleLinked] = useState(false);
    const [iconUrl, setIconUrl] = useState<string | null>(null);
    const [uploadingIcon, setUploadingIcon] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const router = useRouter();

    useAuthRedirect();

    useEffect(() => {
        if (auth.currentUser) {
            setUsername(auth.currentUser.displayName || "");
            setDisplayName(auth.currentUser.displayName || "");
            const linked = auth.currentUser.providerData.some(provider => provider.providerId === GoogleAuthProvider.PROVIDER_ID);
            setGoogleLinked(linked);
        }
        fetchUserIcon();
    }, []);

    const handleUsernameChange = async (event: FormEvent) => {
        event.preventDefault();
        setChangingUsername(true);
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
        } finally {
            setChangingUsername(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            const user = auth.currentUser;
            if (user) {
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
                await deleteUser(user);
                router.push("/signup");
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setDeleting(false);
        }
    };

    const confirmDeleteAccount = async (event: FormEvent) => {
        event.preventDefault();
        if (deleteConfirmation.toLowerCase() === "delete my account") {
            setShowDeleteDialog(false);
            handleDeleteAccount();
        } else {
            setError("You must type 'delete my account' to confirm.");
        }
    };

    const fetchUserIcon = async () => {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.iconUrl) {
                    setIconUrl(userData.iconUrl);
                }
            } else {
                await setDoc(userDocRef, { iconUrl: null });
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            setUploadedFile(event.target.files[0]);
        }
    };

    const handleIconUpload = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (uploadedFile) {
            setUploadingIcon(true);

            try {
                const storageRef = ref(storage, `icons/${auth.currentUser?.uid}`);
                await uploadBytes(storageRef, uploadedFile);
                const downloadURL = await getDownloadURL(storageRef);

                if (auth.currentUser) {
                    await updateDoc(doc(db, "users", auth.currentUser.uid), {
                        iconUrl: downloadURL,
                    });
                    setIconUrl(downloadURL);
                    setSuccess(true);
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setUploadingIcon(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Head>
                <title>Account -Afro.dev</title>
            </Head>
            <Header current="settings" />
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">Settings</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <SettingsMenu current="account" />
                    <div className="grid gap-6">
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>Profile Icon</CardTitle>
                                <CardDescription>
                                    Upload a new profile icon.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleIconUpload}>
                                <CardContent>
                                    <div className="flex flex-col items-center">
                                        {iconUrl && <Image src={iconUrl} alt="" width={100} height={100} className="w-24 h-24 rounded-full mb-4" />}
                                        <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploadingIcon} />
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button type="submit" disabled={uploadingIcon || !uploadedFile}>
                                        {uploadingIcon ? "Updating..." : "Update Icon"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                        <Card x-chunk="dashboard-04-chunk-2">
                            <CardHeader>
                                <CardTitle>Username</CardTitle>
                                <CardDescription>
                                    Update your display name.
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleUsernameChange}>
                                <CardContent>
                                    <Input
                                        placeholder="New Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <CardDescription className="mt-1">Current: {displayName}</CardDescription>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button type="submit" disabled={changingUsername || username === displayName}>
                                        {changingUsername ? "Changing..." : "Change Username"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                        {/* <Card x-chunk="dashboard-04-chunk-3">
                            <CardHeader>
                                <CardTitle>Google Integration</CardTitle>
                                <CardDescription>
                                    Link your account with Google.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <GoogleSignInButton />
                            </CardContent>
                        </Card> */}
                        <Card x-chunk="dashboard-04-chunk-3">
                            <CardHeader>
                                <CardTitle>Delete Account</CardTitle>
                                <CardDescription>
                                    Delete your account permanently.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={deleting}>
                                    {deleting ? 'Deleting...' : 'Delete your account'}
                                </Button>
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
            {showDeleteDialog && (
                <AlertDialog open>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                                To confirm account deletion, please type &quot;delete my account&quot; below.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <form onSubmit={confirmDeleteAccount}>
                                <Input
                                    placeholder="delete my account"
                                    value={deleteConfirmation}
                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                    className="mb-5"
                                />
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction type="submit" disabled={deleting}>
                                    {deleting ? 'Deleting...' : 'Delete Account'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}