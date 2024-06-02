import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/firebaseConfig';

const useAuthRedirect = (redirectTo = '/login') => {
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user && router.pathname !== redirectTo) {
                router.push(redirectTo);
            }
        });

        return () => unsubscribe();
    }, [router, redirectTo]);
};

export default useAuthRedirect;