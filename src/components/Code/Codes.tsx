import React, { useEffect, useState } from 'react'
import {
    collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, setDoc, deleteDoc, getDocs
} from 'firebase/firestore'
import { db, auth } from '@/firebase/firebaseConfig'
import { Button } from '@/components/ui/button'
import { onAuthStateChanged, User } from 'firebase/auth'
import { Card } from '@/components/ui/card'
import { FaHeart, FaReply } from 'react-icons/fa'
import { FiCopy, FiTrash } from 'react-icons/fi'
import 'highlight.js/styles/default.css'
import CodeBlock from './CodeBlock'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { IoIosSend } from 'react-icons/io'
import {
    AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '../ui/input'

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

interface Comment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: any;
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
    const [comments, setComments] = useState<{ [snippetId: string]: Comment[] }>({});
    const [newComment, setNewComment] = useState<{ [snippetId: string]: string }>({});
    const [error, setError] = useState<string | null>(null);
    const [showComments, setShowComments] = useState<{ [snippetId: string]: boolean }>({});

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
                fetchComments(snippet.id);
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
        if (!user) return; // Ensure user is not null
        const likeDoc = await getDoc(doc(db, 'likes', `${user.uid}_${snippetId}`));
        if (likeDoc.exists()) {
            setUserLikes((prevState) => ({
                ...prevState,
                [snippetId]: true,
            }));
        }
    };

    const fetchComments = async (snippetId: string) => {
        const commentsQuery = query(collection(db, 'codes', snippetId, 'comments'), orderBy('timestamp', 'asc'));
        const commentsSnapshot = await getDocs(commentsQuery);
        const commentsData = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment));
        setComments(prevState => ({
            ...prevState,
            [snippetId]: commentsData,
        }));
        commentsData.forEach(comment => {
            if (!userIcons[comment.userId]) {
                fetchUserIcon(comment.userId);
            }
        });
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

    const addComment = async (snippetId: string) => {
        if (!user) return;
        const commentText = newComment[snippetId];
        if (!commentText.trim()) return;

        const commentsRef = collection(db, 'codes', snippetId, 'comments');
        const commentDoc = await addDoc(commentsRef, {
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            text: commentText,
            timestamp: serverTimestamp(),
        });

        const commentData: Comment = {
            id: commentDoc.id,
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            text: commentText,
            timestamp: new Date(), // Use local date until Firestore timestamp is available
        };

        setComments(prevState => ({
            ...prevState,
            [snippetId]: [...(prevState[snippetId] || []), commentData],
        }));

        setNewComment(prevState => ({
            ...prevState,
            [snippetId]: '',
        }));

        // Fetch and update user icon for the new comment
        if (!userIcons[user.uid]) {
            fetchUserIcon(user.uid);
        }
    };

    const toggleComments = (snippetId: string) => {
        setShowComments(prevState => ({
            ...prevState,
            [snippetId]: !prevState[snippetId]
        }));
    };

    return (
        <div className="flex-1 space-y-[15px]">
            {codeSnippets.map((snippet) => (
                <Card key={snippet.id} className="px-5 py-[17.5px] shadow-none">
                    <div className="flex items-center mb-2.5">
                        {userIcons[snippet.userId] && (
                            <img src={userIcons[snippet.userId]} alt="User Icon" className="w-10 h-10 rounded-full mr-2.5 border" />
                        )}
                        <span className="font-bold">{snippet.userName}</span>
                        <span className="ml-2.5 text-xs text-slate-400">
                            {snippet.timestamp ? (snippet.timestamp.toDate ? new Date(snippet.timestamp.toDate()).toLocaleString() : new Date(snippet.timestamp).toLocaleString()) : 'No timestamp'}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="ml-auto">
                                <BsThreeDotsVertical className="text-lg" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => deleteSnippet(snippet.id)}>
                                    <FiTrash className="mr-1.5" />Delete
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => copyToClipboard(snippet.code)}>
                                    <FiCopy className="mr-1.5" />Copy Code
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="mb-2.5 text-sm flex">
                        {snippet.description}
                    </div>
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
                    <div className="flex items-center mt-2.5 pt-2.5">
                        <Button onClick={() => likeSnippet(snippet.id)} className="bg-transparent hover:bg-transparent h-0 p-0">
                            <FaHeart className={`text-lg mr-[10px] transition-all ${userLikes[snippet.id] ? 'text-red-500' : 'text-slate-300'}`} />
                        </Button>
                        <span className="text-sm text-slate-500">{snippet.likes}</span>
                        <Button onClick={() => toggleComments(snippet.id)} className="bg-transparent hover:bg-transparent h-0 p-0 ml-3">
                            <FaReply className="text-lg text-blue-500" />
                        </Button>
                    </div>
                    {showComments[snippet.id] && (
                        <div className="mt-5">
                            <div className="flex items-center mt-3">
                                <Input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment[snippet.id] || ''}
                                    onChange={(e) => setNewComment({
                                        ...newComment,
                                        [snippet.id]: e.target.value,
                                    })}
                                />
                                <Button className="ml-3 bg-blue-500 hover:bg-blue-600" onClick={() => addComment(snippet.id)}>Post<IoIosSend className="ml-[5px] text-lg hidden md:block" /></Button>
                            </div>
                            <div className="my-2.5">
                                {showComments[snippet.id] && comments[snippet.id]?.map(comment => (
                                    <div key={comment.id} className='border-b py-3.5'>
                                        <div className="flex items-center mb-1.5">
                                            {userIcons[comment.userId] && (
                                                <img src={userIcons[comment.userId]} alt="User Icon" className="w-[35px] h-[35px] rounded-full mr-2 border" />
                                            )}
                                            <span className="font-semibold">{comment.userName}</span>
                                            <span className="ml-2.5 text-xs text-slate-400">{comment.timestamp ? (comment.timestamp.toDate ? new Date(comment.timestamp.toDate()).toLocaleString() : new Date(comment.timestamp).toLocaleString()) : 'No timestamp'}</span>
                                        </div>
                                        <div className="text-sm text-slate-700">{comment.text}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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