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

import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, updateProfile, GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup, deleteUser } from "firebase/auth";
import { collection, getFirestore, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import HeaderList from "@/components/header";
import SearchMenu from "@/components/search";
import UserMenu from "@/components/user";
import SettingsMenu from "@/components/ja/settings";
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export default function Dashboard() {
    const auth = getAuth();
    const db = getFirestore();
    const storage = getStorage();

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
                既にGoogleアカウントと連携しています
            </Button>
        ) : (
            <Button onClick={handleGoogleSignIn} variant="outline">
                <FcGoogle className="w-[20px] h-[20px] mr-[5px] dark:hidden" />
                <FaGoogle className="w-[17.5px] h-[17.5px] mr-[7.5px] hidden dark:block" />
                Googleアカウントと連携
            </Button>
        );
    };

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
                setError("不明なエラーが発生しました。");
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
                setError("不明なエラーが発生しました。");
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
            setError("確認するには正しい文字列を入力する必要があります。");
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
                    setError("不明なエラーが発生しました。");
                }
            } finally {
                setUploadingIcon(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Head>
                <title>アカウント | Nook.to</title>
            </Head>
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-[100]">
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
                                href="/"
                                className="flex items-center gap-2 text-lg font-semibold"
                            >
                                <Package2 className="h-6 w-6" />
                                <span className="sr-only">Acme Inc</span>
                            </Link>
                            <Link
                                href="/dashboard"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/orders"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Orders
                            </Link>
                            <Link
                                href="/products"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Products
                            </Link>
                            <Link
                                href="/customers"
                                className="text-muted-foreground hover:text-foreground"
                            >
                                Customers
                            </Link>
                            <Link href="/settings" className="hover:text-foreground">
                                Settings
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <SearchMenu />
                    </form>
                    <UserMenu />
                </div>
            </header>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">設定</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <SettingsMenu current="account" />
                    <div className="grid gap-6">
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <CardTitle>ユーザー名</CardTitle>
                                <CardDescription>
                                    新しくユーザー名を設定してみましょう。
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleUsernameChange}>
                                <CardContent>
                                    <Input
                                        placeholder="New Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <CardDescription className="mt-1">現在のユーザー名: {displayName}</CardDescription>
                                </CardContent>
                                <CardFooter className="border-t px-6 py-4">
                                    <Button type="submit" disabled={changingUsername || username === displayName}>
                                        {changingUsername ? "更新中..." : "更新する"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                        <Card x-chunk="dashboard-04-chunk-2">
                            <CardHeader>
                                <CardTitle>アイコン</CardTitle>
                                <CardDescription>
                                    新しくアイコンを設定してみましょう。
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
                                        {uploadingIcon ? "更新中..." : "更新する"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                        <Card x-chunk="dashboard-04-chunk-3">
                            <CardHeader>
                                <CardTitle>連携</CardTitle>
                                <CardDescription>
                                    他のサービスのアカウントと連携することができます。
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <GoogleSignInButton />
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-04-chunk-4">
                            <CardHeader>
                                <CardTitle>アカウントを削除</CardTitle>
                                <CardDescription>
                                    削除した後にアカウントの情報を復旧することはできません。
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} disabled={deleting}>
                                    {deleting ? '削除中...' : '削除する'}
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
                            <AlertDialogTitle>エラー</AlertDialogTitle>
                            <AlertDialogDescription>
                                {error}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setError(null)}>閉じる</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {success && (
                <AlertDialog open>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>成功</AlertDialogTitle>
                            <AlertDialogDescription>
                                更新に成功しました！
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setSuccess(false)}>閉じる</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {showDeleteDialog && (
                <AlertDialog open>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>アカウントを削除</AlertDialogTitle>
                            <AlertDialogDescription>
                                アカウントの削除を確認するには、下に&quot;delete my account&quot;と入力してください。
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
                                <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>キャンセル</AlertDialogCancel>
                                <AlertDialogAction type="submit" disabled={deleting}>
                                    {deleting ? "削除中..." : '削除する'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
}