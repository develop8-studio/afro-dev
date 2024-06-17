import { useEffect, useState, useRef } from 'react'
import { collection, doc, getDoc, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, auth } from '@/firebase/firebaseConfig'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { onAuthStateChanged, User } from 'firebase/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FaHeart } from "react-icons/fa"
import { IoIosSend } from 'react-icons/io'
import Link from 'next/link'

interface Message {
    id: string;
    text: string;
    imageUrl: string | null;
    userId: string;
    userName: string;
    timestamp: Timestamp | null;
}

interface ChatProps {
    currentRoom: string | null;
    topic: string;
}

const Chat: React.FC<ChatProps> = ({ currentRoom, topic }) => {
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [roomName, setRoomName] = useState<string>('');
    const [userIcons, setUserIcons] = useState<{ [userId: string]: string }>({}); // ユーザーのアイコンURLを保持するstate
    const [uploadButtonVariant, setUploadButtonVariant] = useState<'outline' | 'secondary'>('outline');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 一文字目を大文字に変える関数
    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentRoom) return;

        const fetchRoomName = async () => {
            const roomDoc = await getDoc(doc(db, 'rooms', topic, 'rooms', currentRoom));
            if (roomDoc.exists()) {
                const roomData = roomDoc.data();
                setRoomName(roomData.name);
            }
        };

        fetchRoomName();

        const q = query(collection(db, 'rooms', topic, 'rooms', currentRoom, 'messages'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
            setMessages(msgs);
            // 新しいメッセージが追加された時に、各ユーザーのアイコンURLを取得する
            msgs.forEach(msg => {
                const userId = msg.userId;
                // 既に取得済みのユーザーのアイコンURLは再度取得しないようにする
                if (!userIcons[userId]) {
                    fetchUserIcon(userId);
                }
            });
        });

        return () => unsubscribe();
    }, [currentRoom, topic]);

    // ユーザーのアイコンURLを取得する関数
    const fetchUserIcon = async (userId: string) => {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            // ユーザーのアイコンURLを取得してstateに設定する
            setUserIcons(prevState => ({
                ...prevState,
                [userId]: userData.iconUrl || '' // iconUrlが存在しない場合は空文字を設定する
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
        setUploadButtonVariant(file ? 'secondary' : 'outline');
    };

    const sendMessage = async () => {
        if (!message.trim() && !image) return;

        let imageUrl: string | null = null;
        if (image) {
            const imageRef = ref(storage, `images/${image.name}`);
            await uploadBytes(imageRef, image);
            imageUrl = await getDownloadURL(imageRef);
        }

        if (user && currentRoom) {
            await addDoc(collection(db, 'rooms', topic, 'rooms', currentRoom, 'messages'), {
                text: message,
                imageUrl,
                userId: user.uid,
                userName: user.displayName,
                timestamp: serverTimestamp(),
            });

            setMessage('');
            setImage(null);
            setUploadButtonVariant('outline');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="flex flex-col h-full pt-5">
            <div className="flex flex-col items-center">
                <h1 className="font-semibold text-lg md:text-xl mb-5 px-5">{capitalizeFirstLetter(roomName)}</h1>
            </div>
            <CardContent className="flex flex-col items-center w-full">
                <div className="w-full flex items-center mb-3">
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message..." />
                    <Button onClick={() => fileInputRef.current?.click()} className="ml-3 hidden sm:block" variant={uploadButtonVariant}>
                        Upload
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                    </Button>
                    <Button onClick={sendMessage} className="ml-3">Send<IoIosSend className="ml-[5px] text-lg hidden md:block" /></Button>
                </div>
                <Input ref={fileInputRef} type="file" onChange={handleImageChange} className="mb-3 block sm:hidden" />
                <div className="mt-3 flex-1 w-full space-y-3">
                    {messages.map(msg => (
                        <div key={msg.id} className="p-3">
                            <div className="flex items-center mb-2.5">
                                {/* ユーザーのアイコンを表示 */}
                                {userIcons[msg.userId] && (
                                    <img src={userIcons[msg.userId]} alt="User Icon" className="w-10 h-10 rounded-full mr-2.5 border" />
                                )}
                                <span className="font-bold">
                                    <Link href={`/profile?user=${msg.userId}`}>
                                        {msg.userName}
                                    </Link>
                                </span>
                                <span className="ml-2.5 text-xs text-slate-400 font-light">
                                    {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleString() : 'No timestamp'}
                                </span>
                            </div>
                            {msg.text && <div>{msg.text}</div>}
                            {msg.imageUrl && <img src={msg.imageUrl} alt="image" className="w-full sm:w-60 lg:w-80 rounded-sm mt-3" />}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default Chat;