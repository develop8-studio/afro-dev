import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Settings,
    User,
    Users,
    LogOut,
    Bookmark
} from "lucide-react"
import { FaRegUser } from "react-icons/fa6"
import { useEffect } from "react";

import { useState } from "react"
import { useRouter } from "next/router"
import { signOut, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/firebase/firebaseConfig"

export default function UserMenu() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [iconUrl, setIconUrl] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            if (user) {
                fetchUserIcon(user.uid);
            }
        });
        return () => unsubscribe();
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

    const fetchUserIcon = async (userId: string) => {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.iconUrl) {
                    setIconUrl(userData.iconUrl);
                }
            }
        } catch (error) {
            console.error("Error fetching user icon:", error);
            setError("Error fetching user icon");
        }
    };

    return (
        <div className="h-auto mt-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                    >
                        {iconUrl ? (
                            <Image
                                src={iconUrl}
                                alt="User Icon"
                                width={100}
                                height={100}
                                className="w-full h-full rounded-full"
                            />
                        ) : (
                            <FaRegUser className="w-[15px] h-[15px]" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <Link href={`/profile?user=${user?.uid}`} className="font-semibold">
                        <DropdownMenuItem>
                            {user?.displayName ? `${user.displayName}` : 'My Account'}
                            {/* {user?.uid && (
                                <div className="text-xs text-gray-500">
                                    {user.uid}
                                </div>
                            )} */}
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Link href="/settings">
                        <DropdownMenuItem>
                            <Settings className="mr-[10px] h-[15px] w-[15px] text-slate-500 dark:text-slate-300" />
                            General
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/settings/account">
                        <DropdownMenuItem>
                            <User className="mr-[10px] h-[15px] w-[15px] text-slate-500 dark:text-slate-300" />
                            Account
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <Link href="/following">
                        <DropdownMenuItem>
                            <Users className="mr-[10px] h-[15px] w-[15px] text-slate-500 dark:text-slate-300" />
                            Following
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/bookmarks">
                        <DropdownMenuItem>
                            <Bookmark className="mr-[10px] h-[15px] w-[15px] text-slate-500 dark:text-slate-300" />
                            Bookmarks
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="ml-0.5 mr-[10px] h-[15px] w-[15px] text-slate-500 dark:text-slate-300" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
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
        </div>
    );
}