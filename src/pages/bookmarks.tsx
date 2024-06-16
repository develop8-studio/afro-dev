import Head from "next/head";
import Header from "@/components/header";
import useAuthRedirect from "@/components/useAuthRedirect";
import Layout from "@/components/Layout";
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc, onSnapshot, getDoc, setDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Card } from '@/components/ui/card';
import CodeBlock from '@/components/Code/CodeBlock';
import { Button } from '@/components/ui/button';
import { FaHeart, FaReply, FaBookmark } from 'react-icons/fa';
import { FiCopy, FiTrash } from 'react-icons/fi';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosSend } from 'react-icons/io';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import Link from "next/link";

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

export default function CodesBookmark() {
    useAuthRedirect();

    const [user, setUser] = useState<User | null>(null);
    const [bookmarkedSnippets, setBookmarkedSnippets] = useState<CodeSnippet[]>([]);
    const [userIcons, setUserIcons] = useState<{ [userId: string]: string }>({});
    const [userLikes, setUserLikes] = useState<{ [snippetId: string]: boolean }>({});
    const [comments, setComments] = useState<{ [snippetId: string]: Comment[] }>({});
    const [newComment, setNewComment] = useState<{ [snippetId: string]: string }>({});
    const [error, setError] = useState<string | null>(null);
    const [showComments, setShowComments] = useState<{ [snippetId: string]: boolean }>({});
    const [userBookmarks, setUserBookmarks] = useState<{ [snippetId: string]: boolean }>({});
    const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
    const [userFollowing, setUserFollowing] = useState<{ [userId: string]: boolean }>({});

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchUserBookmarks(currentUser.uid);
                fetchUserFollowing(currentUser.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchUserFollowing = async (userId: string) => {
        const followingSnapshot = await getDocs(collection(db, 'users', userId, 'following'));
        const followingData: { [key: string]: boolean } = {};
        followingSnapshot.docs.forEach((doc) => {
            followingData[doc.id] = true;
        });
        setUserFollowing(followingData);
    };

    const followUser = async (userIdToFollow: string) => {
        if (!user) return;
        const followRef = doc(db, 'users', user.uid, 'following', userIdToFollow);
        const followerRef = doc(db, 'users', userIdToFollow, 'followers', user.uid);

        await setDoc(followRef, {});
        await setDoc(followerRef, {});
        setUserFollowing((prevState) => ({
            ...prevState,
            [userIdToFollow]: true,
        }));
    };

    const unfollowUser = async (userIdToUnfollow: string) => {
        if (!user) return;
        const followRef = doc(db, 'users', user.uid, 'following', userIdToUnfollow);
        const followerRef = doc(db, 'users', userIdToUnfollow, 'followers', user.uid);

        await deleteDoc(followRef);
        await deleteDoc(followerRef);
        setUserFollowing((prevState) => ({
            ...prevState,
            [userIdToUnfollow]: false,
        }));
    };

    useEffect(() => {
        if (user) {
            fetchBookmarkedSnippets(user.uid);
        }
    }, [user]);

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

    const fetchUserBookmarks = async (userId: string): Promise<void> => {
        const bookmarksSnapshot = await getDocs(collection(db, 'users', userId, 'bookmarks'));
        const bookmarksData: { [key: string]: boolean } = {};
        bookmarksSnapshot.docs.forEach((doc) => {
            bookmarksData[doc.id] = true;
        });
        setUserBookmarks(bookmarksData);
    };

    const fetchBookmarkedSnippets = async (userId: string): Promise<void> => {
        const bookmarksSnapshot = await getDocs(collection(db, 'users', userId, 'bookmarks'));
        const bookmarkedSnippetIds = bookmarksSnapshot.docs.map(doc => doc.id);
        if (bookmarkedSnippetIds.length > 0) {
            const snippetsQuery = query(collection(db, 'codes'), where('__name__', 'in', bookmarkedSnippetIds));
            const snippetsSnapshot = await getDocs(snippetsQuery);
            const snippetsData = snippetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CodeSnippet));
            setBookmarkedSnippets(snippetsData);
        } else {
            setBookmarkedSnippets([]);
        }
    };

    const toggleComments = (snippetId: string) => {
        setShowComments(prevState => ({
            ...prevState,
            [snippetId]: !prevState[snippetId]
        }));
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

    const bookmarkSnippet = async (snippetId: string) => {
        if (!user) return;
        const bookmarkRef = doc(db, 'users', user.uid, 'bookmarks', snippetId);
        if (userBookmarks[snippetId]) {
            await deleteDoc(bookmarkRef);
            setUserBookmarks((prevState) => ({
                ...prevState,
                [snippetId]: false,
            }));
        } else {
            await setDoc(bookmarkRef, {});
            setUserBookmarks((prevState) => ({
                ...prevState,
                [snippetId]: true,
            }));
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Head>
                <title>Bookmarks - Afro.dev</title>
            </Head>
            <Header current="codes" />
            <Layout>
                {bookmarkedSnippets.length > 0 ? (
                    bookmarkedSnippets.map((snippet: CodeSnippet) => (
                        <Card key={snippet.id} className="px-5 py-[17.5px] shadow-none">
                            <div className="flex items-center mb-2.5">
                            <img src={userIcons[snippet.userId]} alt="" className="w-10 h-10 rounded-full border" />
                                <span className="font-bold ml-2.5">
                                    <Link href={`/profile?user=${snippet.userId}`}>
                                        {snippet.userName}
                                    </Link>
                                </span>                                <span className="ml-2.5 text-xs text-slate-400">
                                    {snippet.timestamp ? new Date(snippet.timestamp.toDate()).toLocaleString() : 'No timestamp'}
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="ml-auto">
                                        <BsThreeDotsVertical className="text-lg" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {user && snippet.userId === user.uid && (
                                            <>
                                                <DropdownMenuItem onClick={() => deleteSnippet(snippet.id)}>
                                                    <FiTrash className="mr-1.5" />Delete
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                            </>
                                        )}
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
                                    <FaHeart className={`text-lg mr-[10px] transition-all ${userLikes[snippet.id] ? 'text-red-500 dark:text-red-400' : 'text-slate-300'}`} />
                                </Button>
                                <span className="text-sm text-slate-500 dark:text-slate-400">{snippet.likes}</span>
                                <Button onClick={() => toggleComments(snippet.id)} className="bg-transparent hover:bg-transparent h-0 p-0 ml-3">
                                    <FaReply className={`text-lg ${comments[snippet.id]?.some(comment => comment.userId === user?.uid) ? 'text-blue-500 dark:text-blue-400' : 'text-slate-300'}`} />
                                </Button>
                                <Button onClick={() => bookmarkSnippet(snippet.id)} className="bg-transparent hover:bg-transparent h-0 p-0 ml-3">
                                    <FaBookmark className={`text-lg ${userBookmarks[snippet.id] ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-300'}`} />
                                </Button>
                            </div>
                            {showComments[snippet.id] && (
                                <div className="mt-5">
                                    <div className="flex items-center">
                                        <Input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={newComment[snippet.id] || ''}
                                            onChange={(e) => setNewComment({
                                                ...newComment,
                                                [snippet.id]: e.target.value,
                                            })}
                                        />
                                        <Button className="ml-3 bg-blue-500 hover:bg-blue-600 dark:text-white" onClick={() => addComment(snippet.id)}>Post<IoIosSend className="ml-[5px] text-lg hidden md:block" /></Button>
                                    </div>
                                    <div className="my-2.5">
                                        {showComments[snippet.id] && comments[snippet.id]?.map(comment => (
                                        <div key={comment.id} className='pt-[10px] pb-[15px] border-b'>
                                            <div className="flex items-center">
                                                {userIcons[comment.userId] && (
                                                    <img
                                                        src={userIcons[comment.userId]}
                                                        alt="User Icon"
                                                        className="w-[30px] h-[30px] rounded-full mr-2.5 border"
                                                    />
                                                )}
                                                <span className="font-semibold text-sm">
                                                    <Link href={`/profile?user=${comment.userId}`}>
                                                        {comment.userName}
                                                    </Link>
                                                </span>
                                                <span className="text-xs text-slate-400 ml-2.5">{comment.timestamp ? (comment.timestamp.toDate ? new Date(comment.timestamp.toDate()).toLocaleString() : new Date(comment.timestamp).toLocaleString()) : 'No timestamp'}</span>
                                            </div>
                                            <div className="text-sm text-slate-700 dark:text-slate-400 ml-10">
                                                {comment.text}
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))
                ) : (
                    <div className="text-center text-gray-500">Bookmark not found.</div>
                )}
            </Layout>
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