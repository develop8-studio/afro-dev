import { useEffect, useState, useRef } from 'react'
import { collection, doc, addDoc, updateDoc, query, orderBy, onSnapshot, serverTimestamp, getDoc, where, setDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase/firebaseConfig'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { onAuthStateChanged, User } from 'firebase/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FaHeart } from "react-icons/fa"
import Layout from "@/components/Layout"
import { Textarea } from "@/components/ui/textarea"
import { IoIosSend } from "react-icons/io"

interface CodeSnippet {
    id: string;
    code: string;
    description: string;
    userId: string;
    userName: string;
    timestamp: any;
    likes: number;
}

const CodeShare: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
    const [userIcons, setUserIcons] = useState<{ [userId: string]: string }>({});
    const [userLikes, setUserLikes] = useState<{ [snippetId: string]: number }>({});

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
                [snippetId]: likeDoc.data().count
            }));
        }
    };

    const shareCode = async () => {
        if (!code.trim() || !description.trim()) return;

        if (user) {
            await addDoc(collection(db, 'codes'), {
                code,
                description,
                userId: user.uid,
                userName: user.displayName,
                timestamp: serverTimestamp(),
                likes: 0
            });

            setCode('');
            setDescription('');
        }
    };

    const likeSnippet = async (snippetId: string) => {
        if (!user) return;

        const likeDocRef = doc(db, 'likes', `${user.uid}_${snippetId}`);
        const likeDoc = await getDoc(likeDocRef);

        if (likeDoc.exists() && likeDoc.data().count >= 5) {
            alert('You can only like a feed up to 5 times.');
            return;
        }

        const snippetRef = doc(db, 'codes', snippetId);
        const snippetDoc = await getDoc(snippetRef);

        if (snippetDoc.exists()) {
            const currentLikes = snippetDoc.data().likes || 0;

            await updateDoc(snippetRef, {
                likes: currentLikes + 1
            });

            if (likeDoc.exists()) {
                await updateDoc(likeDocRef, {
                    count: likeDoc.data().count + 1
                });
            } else {
                await setDoc(likeDocRef, {
                    count: 1
                });
            }

            setUserLikes(prevState => ({
                ...prevState,
                [snippetId]: (prevState[snippetId] || 0) + 1
            }));
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Layout>
        <div className="flex flex-col h-full">
            <div className="flex flex-col items-center">
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." className="mb-3"/>
                <Textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter your code..." className="mb-3"/>
                <Button onClick={shareCode}>Share<IoIosSend className="ml-[5px] text-lg" /></Button>
                <div className="mt-10 flex-1 space-y-[15px] w-full">
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
                            </div>
                            <div className="mb-2.5 text-sm">{snippet.description}</div>
                            <pre className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-md text-sm">{snippet.code}</pre>
                            <div className="flex items-center mt-2.5 pt-2.5 pb-[7.5px]">
                                <Button onClick={() => likeSnippet(snippet.id)} className="bg-transparent hover:bg-transparent h-0 p-0">
                                    <FaHeart className="text-lg mr-[10px] transition-all text-slate-300 hover:text-red-500" />
                                </Button>
                                <span className="text-sm text-slate-500">{snippet.likes}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
        </Layout>
    );
}

export default CodeShare;