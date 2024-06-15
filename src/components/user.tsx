import Image from "next/image";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"
import {
    Cloud,
    CreditCard,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    UserPlus,
    Users,
    User,
    Bookmark
} from "lucide-react"
import { FaRegUser } from "react-icons/fa6"

import { useState } from "react"
import { useRouter } from "next/router"
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth"
import { collection, getFirestore, doc, updateDoc, getDoc, setDoc } from "firebase/firestore"

import { useEffect } from "react"
import { auth, db } from "@/firebase/firebaseConfig"

export default function UserMenu() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [iconUrl, setIconUrl] = useState(null);

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
        <div className="h-auto">
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
                <DropdownMenuContent align="end">
                {/* <DropdownMenuLabel>{user?.displayName ? `${user.displayName}` : 'My Account'}</DropdownMenuLabel> */}
                {/* <DropdownMenuSeparator /> */}
                <Link href="/settings"><DropdownMenuItem><Settings className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300" />General</DropdownMenuItem></Link>
                <Link href="/settings/account"><DropdownMenuItem><User className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300" />Account</DropdownMenuItem></Link>
                <DropdownMenuSeparator />
                <Link href="/codes/bookmarks"><DropdownMenuItem><Bookmark className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300" />Bookmarks</DropdownMenuItem></Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4 text-slate-500 dark:text-slate-300" />Logout</DropdownMenuItem>
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
    )
}