import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { Card } from '@/components/ui/card';
import CodeBlock from '@/components/Code/CodeBlock';
import Layout from "@/components/Layout";
import { Button } from '@/components/ui/button';
import { FaHeart, FaReply, FaBookmark } from 'react-icons/fa';
import { FiCopy, FiTrash } from 'react-icons/fi';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosSend } from 'react-icons/io';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

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

const UserProfile: React.FC = () => {
    const router = useRouter();
    const { user: userId } = router.query;
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<CodeSnippet[]>([]);
    const [userDisplayName, setUserDisplayName] = useState<string>('');

    useEffect(() => {
        if (userId) {
            fetchUserProfile(userId as string);
            fetchUserPosts(userId as string);
        }
    }, [userId]);

    const fetchUserProfile = async (userId: string) => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                setUserProfile(userDoc.data());
                setUserDisplayName(userDoc.data().displayName);
            } else {
                console.log('User document not found');
                setUserProfile(null);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const fetchUserPosts = async (userId: string) => {
        try {
            const q = query(collection(db, 'codes'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const posts: CodeSnippet[] = [];
            querySnapshot.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() } as CodeSnippet);
            });
            setUserPosts(posts);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    if (!userId || !userProfile) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Head>
                <title>{userProfile.displayName} - Afro.dev</title>
            </Head>
            <Layout>
                <div className="flex-1 space-y-10">
                    <Card className="px-5 py-5 shadow-none">
                        <div className="flex items-center mb-4">
                            <img src={userProfile.iconUrl} alt="User Icon" className="w-10 h-10 rounded-full border mr-3" />
                            <div>
                                <h2 className="text-xl font-bold">{userProfile.displayName}</h2>
                                <p className="text-sm text-gray-500">{userProfile.email}</p>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{userDisplayName}'s Posts</h3>
                        {userPosts.length > 0 ? (
                            userPosts.map((post) => (
                                <Card key={post.id} className="px-5 py-5 shadow-none">
                                    <div className="flex items-center mb-4">
                                        <h3 className="text-lg font-semibold">{post.description}</h3>
                                    </div>
                                    <div className="mb-4">
                                        <CodeBlock language={post.language}>
                                            <pre className="bg-gray-200 p-3 rounded-md text-sm whitespace-pre-wrap">{post.code}</pre>
                                        </CodeBlock>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-500">{post.likes}</span>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <p>No posts found.</p>
                        )}
                    </Card>
                </div>
            </Layout>
        </div>
    );
};

export default UserProfile;