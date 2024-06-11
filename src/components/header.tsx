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

import { auth, db, storage } from "@/firebase/firebaseConfig"

export default function Header({ current }: HeaderProps) {
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
                <Link href="/tools" className={`${current === "tools" ? 'text-foreground dark:text-black bg-emerald-100 dark:bg-slate-200' : 'text-muted-foreground'} p-2.5 rounded-md transition-colors hover:text-foreground`}>
                    Tools
                </Link>
                <Link href="/threads" className={`${current === "threads" ? 'text-foreground dark:text-black bg-emerald-100 dark:bg-slate-200' : 'text-muted-foreground'} p-2.5 rounded-md transition-colors hover:text-foreground`}>
                    Threads
                </Link>
                <Link href="/settings" className={`${current === "settings" ? 'text-foreground dark:text-black bg-emerald-100 dark:bg-slate-200' : 'text-muted-foreground'} p-2.5 rounded-md transition-colors hover:text-foreground`}>
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
            <Button className="hidden md:flex bg-blue-500 hover:bg-blue-600 dark:text-white" asChild>
                <Link href="/threads">Threads</Link>
            </Button>
        </header>
    )
}
