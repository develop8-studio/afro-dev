import Link from "next/link"
import { Package2 } from "lucide-react"
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        if (!auth.currentUser) {
            router.push("/login");
        }
    }, []);

    return (
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
                href="/dashboard"
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                Dashboard
            </Link>
            <Link
                href="/orders"
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                Orders
            </Link>
            <Link
                href="/products"
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                Products
            </Link>
            <Link
                href="/customers"
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                Customers
            </Link>
            <Link
                href="/settings"
                className="text-foreground transition-colors hover:text-foreground"
            >
                Settings
            </Link>
            </nav>
    )
}
