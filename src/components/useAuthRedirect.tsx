import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/firebaseConfig';

const useAuthRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        // console.log("Rendered");
        const unsubscribe = auth.onAuthStateChanged(user => {
            // console.log("User:", user);
            if (!user && router.pathname !== '/login') {
                // console.log("Redirecting...");
                router.push("/login");
            }
        });

        return () => unsubscribe();
    }, [router]);
};

export default useAuthRedirect;