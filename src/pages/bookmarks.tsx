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
import { Input } from '@/components/ui/input';
import Link from "next/link";
import Bookmarks from "@/components/Bookmarks";

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
                <Bookmarks />
            </Layout>
        </div>
    )
}