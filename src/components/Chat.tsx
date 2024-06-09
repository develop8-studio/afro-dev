import { useEffect, useState } from 'react'
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, auth } from '@/firebase/firebaseConfig'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { onAuthStateChanged, User } from 'firebase/auth'
import Image from "next/image"

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
}

const Chat: React.FC<ChatProps> = ({ currentRoom }) => {
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!currentRoom) return;

        const q = query(collection(db, 'rooms', currentRoom, 'messages'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        setMessages(msgs);
        });

        return () => unsubscribe();
    }, [currentRoom]);

    const sendMessage = async () => {
        if (!message.trim() && !image) return;

        let imageUrl: string | null = null;
        if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
        }

        if (user && currentRoom) {
        await addDoc(collection(db, 'rooms', currentRoom, 'messages'), {
            text: message,
            imageUrl,
            userId: user.uid,
            userName: user.displayName,
            timestamp: serverTimestamp(),
        });

        setMessage('');
        setImage(null);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="chat-container flex flex-col h-full">
        <div className="message-input flex flex-col items-center mb-5">
            <div className="w-full flex">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message..." className="font-light" />
            <Button onClick={sendMessage} className="ml-3 font-normal">Send</Button>
            </div>
            <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} className="mt-3" />
        </div>
        <div className="messages flex-1">
            {messages.map(msg => (
                <div key={msg.id} className="message mb-3 p-3 bg-slate-100 dark:bg-muted/40 rounded-md">
                    <div className="message-header flex items-center mb-2">
                    <span className="font-bold">{msg.userName}</span>
                    <span className="ml-2 text-xs text-gray-500 font-light">
                        {msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleString() : 'No timestamp'}
                    </span>
                    </div>
                    {msg.text && <div className="message-text">{msg.text}</div>}
                    {msg.imageUrl && <img src={msg.imageUrl} alt="image" className="mt-2 w-full sm:w-60 lg:w-80" />}
                </div>
            ))}
        </div>
        </div>
    );
}

export default Chat;
