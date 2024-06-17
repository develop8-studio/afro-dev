import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import {
    collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, setDoc, deleteDoc, getDocs
} from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import SnippetCard from '@/components/SnippetCard';
import { useRouter } from 'next/router';
import Layout from "@/components/Layout";
import Header from "@/components/header";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

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

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
    const [userIcons, setUserIcons] = useState<{ [userId: string]: string }>({});
    const [userLikes, setUserLikes] = useState<{ [snippetId: string]: boolean }>({});
    const [comments, setComments] = useState<{ [snippetId: string]: Comment[] }>({});
    const [newComment, setNewComment] = useState<{ [snippetId: string]: string }>({});
    const [error, setError] = useState<string | null>(null);
    const [showComments, setShowComments] = useState<{ [snippetId: string]: boolean }>({});
    const [userBookmarks, setUserBookmarks] = useState<{ [snippetId: string]: boolean }>({});
    const [profileUserName, setProfileUserName] = useState<string | null>(null);
    const [userFollowing, setUserFollowing] = useState<{ [userId: string]: boolean }>({});

    const router = useRouter();
    const { user: userQuery } = router.query;

    useEffect(() => {
        const fetchProfileUser = async () => {
            if (userQuery) {
                const userName = await fetchUserProfile(userQuery as string);
                setProfileUserName(userName);
            }
        };

        fetchProfileUser();
    }, [userQuery]);

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

    const fetchUserProfile = async (userId: string) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserIcons((prevState) => ({
                ...prevState,
                [userId]: userData.iconUrl || '',
            }));
            return userData.displayName || '';
        }
        return null;
    };

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
        const q = query(collection(db, 'codes'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const snippets = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CodeSnippet));
            const filteredSnippets = userQuery ? snippets.filter(snippet => snippet.userId === userQuery) : snippets;
            setCodeSnippets(filteredSnippets);
            filteredSnippets.forEach((snippet) => {
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
    }, [user, userQuery]);

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
        const snippetDoc = await getDoc(snippetRef);

        if (snippetDoc.exists()) {
            const snippetData = snippetDoc.data();

            if (likeDoc.exists()) {
                // Unlike the snippet
                await deleteDoc(likeDocRef);
                await updateDoc(snippetRef, {
                    likes: (snippetData.likes || 0) - 1,
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
                    likes: (snippetData.likes || 0) + 1,
                });
                setUserLikes((prevState) => ({
                    ...prevState,
                    [snippetId]: true,
                }));

                // Add a notification for the snippet owner
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
            // Delete the comments first
            const commentsQuery = query(collection(db, 'codes', snippetId, 'comments'));
            const commentsSnapshot = await getDocs(commentsQuery);
            commentsSnapshot.forEach(async (commentDoc) => {
                await deleteDoc(commentDoc.ref);
            });

            // Then delete the snippet itself
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

    return (
        <div className="flex flex-col w-full min-h-screen">
            <Head>
                <title>{profileUserName || codeSnippets.find(snippet => snippet.userId === userQuery)?.userName} -Afro.dev</title>
            </Head>
            <Header current="none" />
            <Layout>
                <Card className="px-5 py-[17.5px] shadow-none">
                    {userQuery && (
                        <div className="flex items-center">
                            {userIcons[userQuery as string] && (
                                <img src={userIcons[userQuery as string]} alt="User Icon" className="w-10 h-10 rounded-full border" />
                            )}
                            <h3 className="font-bold ml-2.5">{profileUserName || codeSnippets.find(snippet => snippet.userId === userQuery)?.userName}</h3>
                            {user && userQuery !== user.uid && (
                                userFollowing[userQuery as string] ? (
                                    <Button onClick={() => unfollowUser(userQuery as string)} className="w-[80px] h-[35px] ml-auto" variant="secondary">
                                        Unfollow
                                    </Button>
                                ) : (
                                    <Button onClick={() => followUser(userQuery as string)} className="w-[80px] h-[35px] ml-auto" variant="outline">
                                        Follow
                                    </Button>
                                )
                            )}
                            {user && userQuery === user.uid && (
                                <Button variant="outline" className="w-[100px] h-[35px] ml-auto" asChild>
                                    <Link href="/settings/account">
                                        Edit profile
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </Card>
                <div className="flex-1 space-y-[15px]">
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
            </Layout>
        </div>
    );
};

export default UserProfile;