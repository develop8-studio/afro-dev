import Link from "next/link";
import Image from "next/image";
import SearchMenu from "@/components/search"
import UserMenu from "@/components/user"
import MobileSheet from "@/components/mobile-sheet"
import { Button } from "@/components/ui/button"
import { FiSearch } from "react-icons/fi"
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
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import React, { useEffect, useState, useRef } from 'react'
import { collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, setDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { db, auth, storage } from '@/firebase/firebaseConfig'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { FaHeart, FaTrash } from "react-icons/fa"
import Layout from "@/components/Layout"
import { Textarea } from '@/components/ui/textarea'
import { IoIosSend } from "react-icons/io"
import 'highlight.js/styles/default.css'
import CodeBlock from "./Code/CodeBlock";
import CodeShareButton from "./Code/CodeShareButton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import CodeShare from "./CodeShare";
import Notices from "./Notices";

type HeaderProps = {
    current: string;
};

interface CodeSnippet {
    id: string;
    code: string;
    description: string;
    userId: string;
    userName: string;
    timestamp: any;
    likes: number;
    language: string;
    imageUrl?: string;
}

const highlightLanguages = [
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "ruby", label: "Ruby" },
    { value: "swift", label: "Swift" },
    { value: "rust", label: "Rust" },
    { value: "go", label: "Golang" },
];
highlightLanguages.sort((a, b) => a.label.localeCompare(b.label));

export default function Header({ current }: HeaderProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <header className="sticky top-0 flex h-[60px] items-center gap-5 bg-background px-5 z-10">
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
                <Link href="/" className={`${current === "codes" ? 'text-foreground bg-slate-100 dark:bg-slate-800' : 'text-muted-foreground'} p-2.5 rounded-md transition-colors hover:text-foreground`}>
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
                    <Link href="/search">
                        <FiSearch size="22.5" className="text-slate-500 dark:text-slate-300 cursor-pointer mb-1" />
                    </Link>
                    <Notices />
                    <UserMenu />
                    <div className="hidden md:block">
                        <CodeShareButton />
                    </div>
                </>
            ) : (
                <Button className="h-[35px] bg-blue-500 hover:bg-blue-600 dark:text-white" asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )}
        </header>
    );
}