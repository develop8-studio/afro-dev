import React, { useEffect, useState, useRef } from 'react'
import { collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, setDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { db, auth, storage } from '@/firebase/firebaseConfig'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { onAuthStateChanged, User } from 'firebase/auth'
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
import { FaPlus } from "react-icons/fa"

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

const CodeShare: React.FC = () => {
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

    useEffect(() => {
        const q = query(collection(db, 'codes'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const snippets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CodeSnippet));
            setCodeSnippets(snippets);
            snippets.forEach(snippet => {
                const userId = snippet.userId;
                if (!userIcons[userId]) {
                    fetchUserIcon(userId);
                }
                if (user) {
                    fetchUserLikes(snippet.id);
                }
            });
        });

        return () => unsubscribe();
    }, [user]);

    const fetchUserIcon = async (userId: string) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserIcons(prevState => ({
                ...prevState,
                [userId]: userData.iconUrl || ''
            }));
        }
    };

    const fetchUserLikes = async (snippetId: string) => {
        const likeDoc = await getDoc(doc(db, 'likes', `${user?.uid}_${snippetId}`));
        if (likeDoc.exists()) {
            setUserLikes(prevState => ({
                ...prevState,
                [snippetId]: true
            }));
        }
    };

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

    const likeSnippet = async (snippetId: string) => {
        if (!user) return;

        const likeDocRef = doc(db, 'likes', `${user.uid}_${snippetId}`);
        const likeDoc = await getDoc(likeDocRef);

        const snippetRef = doc(db, 'codes', snippetId);
        const snippetDoc = await getDoc(snippetRef);

        if (snippetDoc.exists()) {
            const currentLikes = snippetDoc.data().likes || 0;

            if (likeDoc.exists()) {
                // Unlike the snippet
                await deleteDoc(likeDocRef);
                await updateDoc(snippetRef, {
                    likes: currentLikes - 1
                });
                setUserLikes(prevState => ({
                    ...prevState,
                    [snippetId]: false
                }));
            } else {
                // Like the snippet
                await setDoc(likeDocRef, {
                    count: 1
                });
                await updateDoc(snippetRef, {
                    likes: currentLikes + 1
                });
                setUserLikes(prevState => ({
                    ...prevState,
                    [snippetId]: true
                }));
            }
        }
    };

    const deleteSnippet = async (snippetId: string) => {
        if (!user) return;

        const snippetRef = doc(db, 'codes', snippetId);
        const snippetDoc = await getDoc(snippetRef);

        if (snippetDoc.exists() && snippetDoc.data().userId === user.uid) {
            await deleteDoc(snippetRef);

            // Optionally, delete related likes (not necessary but good for cleanup)
            const likeQuery = query(collection(db, 'likes'), orderBy('timestamp', 'desc'));
            const likesSnapshot = await getDocs(likeQuery);
            likesSnapshot.forEach(async (likeDoc) => {
                if (likeDoc.id.includes(snippetId)) {
                    await deleteDoc(likeDoc.ref);
                }
            });
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

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div className="w-full flex flex-col items-center justify-center sm:hidden">
            <AlertDialog>
                <AlertDialogTrigger>
                    <Button className="flex bg-blue-500 hover:bg-blue-600 dark:text-white h-[37.5px]">
                        <FaPlus className='text-md mr-[7.5px]' />Share Code
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Share Code</AlertDialogTitle>
                        <AlertDialogDescription>
                            Let&apos;s share the awesome code you&apos;ve created with everyone!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Select value={language} onValueChange={(value) => setLanguage(value)}>
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
        </div>
            {/* <div className="flex flex-col h-full">
                <div className="contents sm:flex flex-col sm:flex-row">
                    <div className="sm:flex-grow">
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
                    </div>
                    <div className="flex flex-col sm:flex-row w-full">
                        <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." className="mb-3"/>
                        <Button onClick={() => fileInputRef.current?.click()} className={`ml-0 sm:ml-3`} variant={uploadButtonVariant}>
                            Upload
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </Button>
                        {/* <Input type="file" onChange={handleImageChange} className="mb-3 sm:hidden"/>
                        <Button onClick={shareCode} className="ml-0 sm:ml-3 mb-3 sm:mb-0">Share<IoIosSend className="ml-[5px] text-lg" /></Button>
                    </div>
                </div>
            <Textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter your code..." />
            </div> */}
            <div className="flex-1 space-y-[15px]">
                {codeSnippets.map(snippet => (
                    <Card key={snippet.id} className="px-5 py-[17.5px] shadow-none">
                        <div className="flex items-center mb-2.5">
                            {userIcons[snippet.userId] && (
                                <img src={userIcons[snippet.userId]} alt="User Icon" className="w-10 h-10 rounded-full mr-2.5 border" />
                            )}
                            <span className="font-bold">{snippet.userName}</span>
                            <span className="ml-2.5 text-xs text-slate-500 font-light">
                                {snippet.timestamp ? new Date(snippet.timestamp.toDate()).toLocaleString() : 'No timestamp'}
                            </span>
                            <DropdownMenu>
                            <DropdownMenuTrigger className='ml-auto'><BsThreeDotsVertical className="text-lg" /></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {snippet.userId === user.uid && (
                                    <DropdownMenuItem onClick={() => deleteSnippet(snippet.id)}>
                                        {/* <Button onClick={() => deleteSnippet(snippet.id)} className="ml-auto bg-transparent hover:bg-transparent h-0 p-0">
                                            {/* <FaTrash className="text-lg text-red-500 hover:text-red-700" />
                                            Delete
                                        </Button> */}
                                        Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                            </DropdownMenu>
                            {/* {snippet.userId === user.uid && (
                                <Button onClick={() => deleteSnippet(snippet.id)} className="ml-auto bg-transparent hover:bg-transparent h-0 p-0">
                                    <FaTrash className="text-lg text-red-500 hover:text-red-700" />
                                </Button>
                            )} */}
                        </div>
                        <div className="mb-2.5 text-sm">{snippet.description}</div>

                        {snippet.language && (
                            <>
                                <CodeBlock language={snippet.language}>
                                    <pre className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-md text-sm whitespace-pre-wrap">{snippet.code}</pre>
                                </CodeBlock>
                                <pre className="hidden dark:block bg-slate-100 dark:bg-slate-900 p-2.5 text-sm whitespace-pre-wrap">{snippet.code}</pre>
                            </>
                        )}
                        {!snippet.language && (
                            <pre className="bg-[#F3F3F3] dark:bg-slate-900 p-2.5 text-sm whitespace-pre-wrap">{snippet.code}</pre>
                        )}
                        {snippet.imageUrl && (
                            <img src={snippet.imageUrl} alt="Snippet Image" className="mt-[15px] max-w-full md:max-w-[250px] h-auto rounded-md" />
                        )}
                        <div className="flex items-center mt-2.5 pt-2.5 pb-[7.5px]">
                            <Button onClick={() => likeSnippet(snippet.id)} className="bg-transparent hover:bg-transparent h-0 p-0">
                                <FaHeart className={`text-lg mr-[10px] transition-all ${userLikes[snippet.id] ? 'text-red-500' : 'text-slate-300'}`} />
                            </Button>
                            <span className="text-sm text-slate-500">{snippet.likes}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default CodeShare;