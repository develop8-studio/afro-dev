import React, { useEffect, useState, useRef } from 'react';
import { collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { Button } from '@/components/ui/button';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Card } from '@/components/ui/card';
import { FaHeart } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import 'highlight.js/styles/default.css';
import CodeBlock from './CodeBlock';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Golang' },
];
highlightLanguages.sort((a, b) => a.label.localeCompare(b.label));

const Codes: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
    const [userIcons, setUserIcons] = useState<{ [userId: string]: string }>({});
    const [userLikes, setUserLikes] = useState<{ [snippetId: string]: boolean }>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'codes'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const snippets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CodeSnippet));
            setCodeSnippets(snippets);
            snippets.forEach((snippet) => {
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
            setUserIcons((prevState) => ({
                ...prevState,
                [userId]: userData.iconUrl || '',
            }));
        }
    };

    const fetchUserLikes = async (snippetId: string) => {
        const likeDoc = await getDoc(doc(db, 'likes', `${user?.uid}_${snippetId}`));
        if (likeDoc.exists()) {
            setUserLikes((prevState) => ({
                ...prevState,
                [snippetId]: true,
            }));
        }
    };

    const likeSnippet = async (snippetId: string) => {
        if (!user) return;

        const likeDocRef = doc(db, 'likes', `${user.uid}_${snippetId}`);
        const snippetRef = doc(db, 'codes', snippetId);
        const likeDoc = await getDoc(likeDocRef);

        if (likeDoc.exists()) {
            // Unlike the snippet
            await deleteDoc(likeDocRef);
            await updateDoc(snippetRef, {
                likes: (await (await getDoc(snippetRef)).data())?.likes - 1,
            });
            setUserLikes((prevState) => ({
                ...prevState,
                [snippetId]: false,
            }));
        } else {
            // Like the snippet
            await setDoc(likeDocRef, {
                count: 1,
            });
            await updateDoc(snippetRef, {
                likes: (await (await getDoc(snippetRef)).data())?.likes + 1,
            });
            setUserLikes((prevState) => ({
                ...prevState,
                [snippetId]: true,
            }));
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).catch((err) => {
            setError("Failed to copy text.");
        });
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex-1 space-y-[15px]">
            {codeSnippets.map((snippet) => (
                <Card key={snippet.id} className="px-5 py-[17.5px] shadow-none">
                    <div className="flex items-center mb-2.5">
                        {userIcons[snippet.userId] && (
                            <img src={userIcons[snippet.userId]} alt="User Icon" className="w-10 h-10 rounded-full mr-2.5 border" />
                        )}
                        <span className="font-bold">{snippet.userName}</span>
                        <span className="ml-2.5 text-xs text-slate-500 font-light">
                            {snippet.timestamp ? new Date(snippet.timestamp.toDate()).toLocaleString() : 'No timestamp'}
                        </span>
                        <Button onClick={() => copyToClipboard(snippet.code)} className="bg-transparent hover:bg-transparent h-0 p-0 ml-2.5 hidden md:flex">
                            <FiCopy className="text-lg transition-all text-slate-500 hover:text-slate-700" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="ml-auto">
                                <BsThreeDotsVertical className="text-lg" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {snippet.userId === user.uid && (
                                    <DropdownMenuItem onClick={() => deleteSnippet(snippet.id)}>Delete</DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => copyToClipboard(snippet.code)} className="block md:hidden">Copy Code</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
};

export default Codes;