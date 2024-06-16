import React, { useEffect, useState } from "react"
import { FiBell } from "react-icons/fi"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, onAuthStateChanged } from "firebase/auth"
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore'
import { db, auth } from '@/firebase/firebaseConfig'

interface Notification {
    id: string;
    type: string;
    userId: string;
    likedBy: string;
    likedByName: string;
    snippetId: string;
    snippetDescription: string;
    timestamp: any;
}

const Notices: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [userIcons, setUserIcons] = useState<{ [userId: string]: string }>({});

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

    // Fetch user icons for notifications
    useEffect(() => {
        notifications.forEach((notif) => {
            if (!userIcons[notif.likedBy]) {
                fetchUserIcon(notif.likedBy);
            }
        });
    }, [notifications]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchNotifications(currentUser.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchNotifications = (userId: string) => {
        const q = query(collection(db, 'notifications'), where('userId', '==', userId), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Notification));
            setNotifications(notifs);
        });
        return () => unsubscribe();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="pb-1">
                <FiBell size="22.5" className="text-slate-500 dark:text-slate-300 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length === 0 && (
                    <DropdownMenuItem>No new notifications</DropdownMenuItem>
                )}
                {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id}>
                        <img src={userIcons[notification.likedBy]} alt="User Icon" className="w-6 h-6 rounded-full mr-2.5 border" />
                        <span>{notification.likedByName} liked your post: "{notification.snippetDescription}"</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notices;