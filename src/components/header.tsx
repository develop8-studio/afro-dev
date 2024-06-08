import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Si9Gag } from "react-icons/si"

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
        <header className="sticky top-0 flex h-16 items-center gap-5 bg-background px-5 md:px-5 border-b">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                    {/* <Si9Gag className="h-6 w-6" />
                    <span className="sr-only">Afro</span> */}
                    <Image src="/afro-dark-logo.png" alt="" width={25} height={25} className="block dark:hidden transition duration-150 ease-out hover:rotate-45" />
                    <Image src="/afro-white-logo.png" alt="" width={25} height={25} className="hidden dark:block transition duration-150 ease-out hover:rotate-45" />
                </Link>
                <Link href="/dashboard" className={`${current === "dashboard" ? 'text-foreground' : 'text-muted-foreground'} font-light transition-colors hover:text-foreground`}>
                    Dashboard
                </Link>
                <Link href="/orders" className={`${current === "orders" ? 'text-foreground' : 'text-muted-foreground'} font-light transition-colors hover:text-foreground`}>
                    Orders
                </Link>
                <Link href="/products" className={`${current === "products" ? 'text-foreground' : 'text-muted-foreground'} font-light transition-colors hover:text-foreground`}>
                    Products
                </Link>
                <Link href="/chats" className={`${current === "chats" ? 'text-foreground' : 'text-muted-foreground'} font-light transition-colors hover:text-foreground`}>
                    Chats
                </Link>
                {/* <Link href="/customers" className={`${current === "customers" ? 'text-foreground' : 'text-muted-foreground'} font-light transition-colors hover:text-foreground`}>
                    Customers
                </Link>
                <Link href="/analytics" className={`${current === "analytics" ? 'text-foreground' : 'text-muted-foreground'} font-light transition-colors hover:text-foreground`}>
                    Analytics
                </Link> */}
                <Link href="/settings" className={`${current === "settings" ? 'text-foreground' : 'text-muted-foreground'} font-light transition-colors hover:text-foreground`}>
                    Settings
                </Link>
            </nav>
            <MobileSheet current={current} />
            <SearchMenu />
            {user ? (
                <UserMenu />
            ) : (
                <Button className="h-[35px] font-normal" asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )}
        </header>
    )
}
