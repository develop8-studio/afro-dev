import React, { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { collection, query, where, onSnapshot, getDoc, doc } from "firebase/firestore";
import { db, auth } from "@/firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

interface Notification {
    id: string;
    type: string;
    likedBy: string;
    likedByName: string;
    snippetId: string;
    snippetDescription: string;
    timestamp: any;
    likedByIconUrl?: string;
}

const Notices: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [user, setUser] = useState<any>(null);
    const [userIcons, setUserIcons] = useState<{ [userId: string]: string }>({});

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchNotifications(currentUser.uid);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    const fetchNotifications = (userId: string) => {
        const q = query(collection(db, "notifications"), where("userId", "==", userId));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notificationsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Notification[];
            notificationsData.forEach((notification) => {
                if (!userIcons[notification.likedBy]) {
                    fetchUserIcon(notification.likedBy);
                }
            });
            setNotifications(notificationsData);
        });

        return () => unsubscribe();
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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="pb-1">
                <FiBell size="22.5" className="text-slate-500 dark:text-slate-300 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <DropdownMenuItem key={notification.id} className="flex items-center space-x-2.5">
                            {userIcons[notification.likedBy] && (
                                <img
                                    src={userIcons[notification.likedBy]}
                                    alt={`${notification.likedByName}'s profile`}
                                    className="w-8 h-8 rounded-full border"
                                />
                            )}
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>{notification.likedByName}</strong> liked your post: {notification.snippetDescription}
                            </span>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem>No notifications</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notices;