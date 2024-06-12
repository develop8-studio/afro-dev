import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import SearchMenu from "@/components/search";
import UserMenu from "@/components/user";
import MobileSheet from "@/components/mobile-sheet";
import { Button } from "@/components/ui/button";

import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

type HeaderProps = {
    current: string;
};

export default function Header({ current }: HeaderProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user || null);
        });
        return () => unsubscribe();
    }, []);

    return (
        <header className="sticky top-0 flex h-16 items-center gap-5 bg-background px-5 z-10">
            <nav className="hidden flex-col gap-5 md:flex md:flex-row md:items-center mr-[5px] lg:mr-[10px]">
                <Link href="/" className="">
                    <div className="relative w-[60px] h-[60px]">
                        <Image
                            src="/afro-black-text.png"
                            alt=""
                            layout="fill"
                            objectFit="contain"
                            className="dark:hidden"
                        />
                        <Image
                            src="/afro-white-text.png"
                            alt=""
                            layout="fill"
                            objectFit="contain"
                            className="hidden dark:block"
                        />
                    </div>
                </Link>
            </nav>
            <nav className="hidden flex-col gap-5 md:flex md:flex-row md:items-center md:text-sm">
                {/* <Link href="/tools" className={`${current === "tools" ? 'text-foreground bg-slate-100 dark:bg-slate-800' : 'text-muted-foreground'} p-2.5 rounded-md transition-colors hover:text-foreground`}>
                    Tools
                </Link> */}
                <Link href="/codes" className={`${current === "codes" ? 'text-foreground bg-slate-100 dark:bg-slate-800' : 'text-muted-foreground'} p-2.5 rounded-md transition-colors hover:text-foreground`}>
                    Codes
                </Link>
                <Link href="/threads" className={`${current === "threads" ? 'text-foreground bg-slate-100 dark:bg-slate-800' : 'text-muted-foreground'} p-2.5 rounded-md transition-colors hover:text-foreground`}>
                    Threads
                </Link>
                <Link href="/settings" className={`${current === "settings" ? 'text-foreground bg-slate-100 dark:bg-slate-800' : 'text-muted-foreground'} p-2.5 rounded-md transition-colors hover:text-foreground`}>
                    Settings
                </Link>
            </nav>
            <div className="w-full">
                <MobileSheet current={current} />
            </div>
            {user ? (
                <>
                    <SearchMenu />
                    <UserMenu />
                    <Button className="hidden md:flex bg-blue-500 hover:bg-blue-600 dark:text-white h-[37.5px]" asChild>
                        <Link href="/codes">Share Code</Link>
                    </Button>
                </>
            ) : (
                <Button className="h-[35px] bg-blue-500 hover:bg-blue-600 dark:text-white" asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )}
        </header>
    );
}