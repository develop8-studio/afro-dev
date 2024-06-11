import React from "react"
import Link from "next/link"
import Image from "next/image"

import SearchMenu from "@/components/search"
import UserMenu from "@/components/user"
import MobileSheet from "@/components/mobile-sheet"

import { Button } from "@/components/ui/button"

type HeaderProps = {
    current: string;
};

import { getAuth, updateProfile, GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup, deleteUser, onAuthStateChanged, User } from "firebase/auth"
import { useState, useEffect } from "react"
import { initializeApp } from "firebase/app"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export default function Header({ current }: HeaderProps) {
    const auth = getAuth(app);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
            setUser(user);
            } else {
            setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <header className="sticky top-0 flex h-16 items-center gap-5 bg-background px-5  z-10">
            <nav className="hidden flex-col gap-5 md:flex md:flex-row md:items-center">
                <Link href="/" className="">
                    <Image src="/afro-black-text.png" alt="" width={100} height={100} className="w-40 lg:w-20 block dark:hidden" />
                    <Image src="/afro-white-text.png" alt="" width={100} height={100} className="w-40 lg:w-20 hidden dark:block" />
                </Link>
            </nav>
            <nav className="hidden flex-col gap-5 md:flex md:flex-row md:items-center md:text-sm">
                <Link href="/tools" className={`${current === "tools" ? 'text-foreground bg-emerald-100' : 'text-muted-foreground'} p-2.5 rounded-xl transition-colors hover:text-foreground`}>
                    Tools
                </Link>
                <Link href="/threads" className={`${current === "threads" ? 'text-foreground bg-emerald-100' : 'text-muted-foreground'} p-2.5 rounded-xl transition-colors hover:text-foreground`}>
                    Threads
                </Link>
                <Link href="/settings" className={`${current === "settings" ? 'text-foreground bg-emerald-100' : 'text-muted-foreground'} p-2.5 rounded-xl transition-colors hover:text-foreground`}>
                    Settings
                </Link>
            </nav>
            <div className="w-full">
                <MobileSheet current={current} />
            </div>
            <SearchMenu />
            {user ? (
                <UserMenu />
            ) : (
                <Button className="h-[35px]" asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )}
        </header>
    )
}
