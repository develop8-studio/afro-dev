import React, { useEffect, useState } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import 'highlight.js/styles/default.css';
import Codes from './Code/Codes';
import CodeShareButton from './Code/CodeShareButton';

const CodeShare: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="w-full flex flex-col items-center justify-center md:hidden">
                <CodeShareButton />
            </div>
            <Codes />
        </>
    );
};

export default CodeShare;