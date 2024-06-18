import React, { useEffect, useState } from 'react';
import {
    collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, setDoc, deleteDoc, getDocs
} from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import SnippetCard from '@/components/SnippetCard';
import { Button } from '@/components/ui/button';
import { FiRefreshCcw } from 'react-icons/fi';

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

const FollowingCards: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
    const [userIcons, setUserIcons] = useState<{ [userId: string]: string }>({});
    const [userLikes, setUserLikes] = useState<{ [snippetId: string]: boolean }>({});
    const [comments, setComments] = useState<{ [snippetId: string]: Comment[] }>({});
    const [newComment, setNewComment] = useState<{ [snippetId: string]: string }>({});
    const [error, setError] = useState<string | null>(null);
    const [showComments, setShowComments] = useState<{ [snippetId: string]: boolean }>({});
    const [userBookmarks, setUserBookmarks] = useState<{ [snippetId: string]: boolean }>({});
    const [userFollowing, setUserFollowing] = useState<{ [userId: string]: boolean }>({});
    const [newSnippetsCount, setNewSnippetsCount] = useState<number>(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchUserBookmarks(currentUser.uid);
                fetchUserFollowing(currentUser.uid).then(() => {
                    const q = query(collection(db, 'codes'), orderBy('timestamp', 'desc'));
                    const unsubscribeSnippets = onSnapshot(q, (snapshot) => {
                        const snippets = snapshot.docs
                            .map((doc) => ({ id: doc.id, ...doc.data() } as CodeSnippet))
                            .filter((snippet) => userFollowing[snippet.userId]);
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
                    return () => unsubscribeSnippets();
                });
            }
        });

        return () => unsubscribe();
    }, [user, userFollowing]);

    const fetchUserFollowing = async (userId: string) => {
        const followingSnapshot = await getDocs(collection(db, 'users', userId, 'following'));
        const followingData: { [key: string]: boolean } = {};
        followingSnapshot.docs.forEach((doc) => {
            followingData[doc.id] = true;
        });
        setUserFollowing(followingData);
        return followingData;
    };

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
        if (!user) return;
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
        const snippetDoc = await getDoc(snippetRef);

        if (snippetDoc.exists()) {
            const snippetData = snippetDoc.data();

            if (likeDoc.exists()) {
                await deleteDoc(likeDocRef);
                await updateDoc(snippetRef, {
                    likes: (snippetData.likes || 0) - 1,
                });
                setUserLikes((prevState) => ({
                    ...prevState,
                    [snippetId]: false,
                }));
            } else {
                await setDoc(likeDocRef, {
                    count: 1,
                });
                await updateDoc(snippetRef, {
                    likes: (snippetData.likes || 0) + 1,
                });
                setUserLikes((prevState) => ({
                    ...prevState,
                    [snippetId]: true,
                }));

                if (user.uid !== snippetData.userId) {
                    await addDoc(collection(db, 'notifications'), {
                        type: 'like',
                        userId: snippetData.userId,
                        likedBy: user.uid,
                        likedByName: user.displayName || 'Anonymous',
                        snippetId: snippetId,
                        snippetDescription: snippetData.description,
                        timestamp: serverTimestamp(),
                    });
                }
            }
        }
    };

    const deleteSnippet = async (snippetId: string) => {
        if (!user) return;

        const snippetRef = doc(db, 'codes', snippetId);
        const snippetDoc = await getDoc(snippetRef);

        if (snippetDoc.exists() && snippetDoc.data().userId === user.uid) {
            await deleteDoc(snippetRef);

            const likeQuery = query(collection(db, 'likes'), orderBy('timestamp', 'desc'));
            const likesSnapshot = await getDocs(likeQuery);
            likesSnapshot.forEach(async (likeDoc) => {
                if (likeDoc.id.includes(snippetId)) {
                    await deleteDoc(likeDoc.ref);
                }
            });

            fetchCodeSnippets(); // Fetch the snippets again to update the list
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
            timestamp: new Date(),
        };

        setComments(prevState => ({
            ...prevState,
            [snippetId]: [...(prevState[snippetId] || []), commentData],
        }));

        setNewComment(prevState => ({
            ...prevState,
            [snippetId]: '',
        }));

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

    const fetchUserBookmarks = async (userId: string) => {
        const bookmarksSnapshot = await getDocs(collection(db, 'users', userId, 'bookmarks'));
        const bookmarksData: { [key: string]: boolean } = {};
        bookmarksSnapshot.docs.forEach((doc) => {
            bookmarksData[doc.id] = true;
        });
        setUserBookmarks(bookmarksData);
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

    const fetchCodeSnippets = async () => {
        const q = query(collection(db, 'codes'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const snippets = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CodeSnippet))
            .filter((snippet) => userFollowing[snippet.userId]);
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
        setNewSnippetsCount(0); // Reset new snippets count after reloading
    };

    const checkForNewSnippets = async () => {
        const q = query(collection(db, 'codes'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const snippets = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CodeSnippet))
            .filter((snippet) => userFollowing[snippet.userId]);
        if (snippets.length > codeSnippets.length) {
            setNewSnippetsCount(snippets.length - codeSnippets.length);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            checkForNewSnippets();
        }, 60000); // 1 minute interval to check for new snippets
        return () => clearInterval(interval);
    }, [codeSnippets]);

    return (
        <div className="flex-1 space-y-[15px]">
            {newSnippetsCount > 0 && (
                <Button onClick={fetchCodeSnippets} className="bg-yellow-200 hover:bg-yellow-200 text-yellow-800 text-center mb-3 w-full font-normal">
                    New post available.
                </Button>
            )}
            {codeSnippets.length === 0 && (
                <div className="text-center text-gray-500">I can&apos;t find anyone you&apos;re following.</div>
            )}
            {codeSnippets.map((snippet) => (
                <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    user={user}
                    userIcons={userIcons}
                    userLikes={userLikes}
                    comments={comments}
                    newComment={newComment}
                    showComments={showComments}
                    userBookmarks={userBookmarks}
                    onLikeSnippet={likeSnippet}
                    onDeleteSnippet={deleteSnippet}
                    onCopyToClipboard={copyToClipboard}
                    onAddComment={addComment}
                    onToggleComments={toggleComments}
                    onBookmarkSnippet={bookmarkSnippet}
                    onCommentChange={(snippetId, text) => setNewComment(prevState => ({ ...prevState, [snippetId]: text }))}
                    onFetchUserIcon={fetchUserIcon}
                />
            ))}
        </div>
    );
};

export default FollowingCards;