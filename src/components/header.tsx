import Link from "next/link";
import Image from "next/image";
import SearchMenu from "@/components/search"
import UserMenu from "@/components/user"
import MobileSheet from "@/components/mobile-sheet"
import { Button } from "@/components/ui/button"
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
import CodeBlock from '@/components/CodeBlock'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IoIosArrowDown } from "react-icons/io"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { BsThreeDotsVertical } from "react-icons/bs"

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
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user || null);
        });
        return () => unsubscribe();
    }, []);

    const [user, setUser] = useState<User | null>(null);
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
    const [userIcons, setUserIcons] = useState<{ [userId: string]: string }>({});
    const [userLikes, setUserLikes] = useState<{ [snippetId: string]: boolean }>({});
    const [language, setLanguage] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadButtonVariant, setUploadButtonVariant] = useState<'outline' | 'secondary'>('outline');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    // useEffect(() => {
    //     const q = query(collection(db, 'codes'), orderBy('timestamp', 'desc'));
    //     const unsubscribe = onSnapshot(q, (snapshot) => {
    //         const snippets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CodeSnippet));
    //         setCodeSnippets(snippets);
    //         snippets.forEach(snippet => {
    //             const userId = snippet.userId;
    //             if (!userIcons[userId]) {
    //                 fetchUserIcon(userId);
    //             }
    //             if (user) {
    //                 fetchUserLikes(snippet.id);
    //             }
    //         });
    //     });

    //     return () => unsubscribe();
    // }, [user]);

    const shareCode = async () => {
        if (!code.trim() || !description.trim()) return;

        let imageUrl = '';
        if (imageFile) {
            const storageRef = ref(storage, `images/${user?.uid}_${Date.now()}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        if (user) {
            await addDoc(collection(db, 'codes'), {
                code,
                description,
                userId: user.uid,
                userName: user.displayName,
                timestamp: serverTimestamp(),
                likes: 0,
                language,
                imageUrl
            });

            setCode('');
            setDescription('');
            setLanguage('');
            setImageFile(null);
            setUploadButtonVariant('outline');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setUploadButtonVariant('secondary');
        } else {
            setUploadButtonVariant('outline');
        }
    };

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
                    {/* <Button className="hidden md:flex bg-blue-500 hover:bg-blue-600 dark:text-white h-[37.5px]">
                        Share Code
                    </Button> */}
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button className="hidden sm:flex bg-blue-500 hover:bg-blue-600 dark:text-white h-[37.5px]">
                                Share Code
                            </Button>
                            <Button className="flex sm:hidden bg-blue-500 hover:bg-blue-600 dark:text-white h-[37.5px]">
                                Code
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Share Code</AlertDialogTitle>
                            <AlertDialogDescription>
                            Let&apos;s share the awesome code you&apos;ve created with everyone!
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                                <Select
                                    value={language}
                                    onValueChange={(value) => setLanguage(value)}
                                >
                                    <SelectTrigger className="w-full sm:w-[150px] mb-3 sm:mb-0 sm:mr-3">
                                        <SelectValue placeholder="Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {highlightLanguages.map((highlightLanguage) => (
                                            <SelectItem key={highlightLanguage.value} value={highlightLanguage.value}>
                                                {highlightLanguage.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." />
                                <Textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter your code..." />
                                <Button onClick={() => fileInputRef.current?.click()} variant={uploadButtonVariant}>
                                    Upload
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </Button>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button onClick={shareCode} className="">Share<IoIosSend className="ml-[5px] text-lg hidden md:block" /></Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </>
            ) : (
                <Button className="h-[35px] bg-blue-500 hover:bg-blue-600 dark:text-white" asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )}
        </header>
    );
}