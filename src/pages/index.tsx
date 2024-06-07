import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MdSpaceDashboard } from "react-icons/md"
import { IoIosHappy } from "react-icons/io"
import { ScrollArea } from "@/components/ui/scroll-area"
import Header from "@/components/header"

import { initializeApp } from "firebase/app"

import { getAuth, updateProfile, GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup, deleteUser, onAuthStateChanged, User } from "firebase/auth"

import { useState, useEffect } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export default function Welcome() {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header current="none" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50 dark:bg-muted/40">
        <div className="flex justify-center items-center mt-10 mb-3">
          <Image src="/afro-dark-logo.png" alt="" width={100} height={100} className="block dark:hidden transition duration-150 ease-out hover:rotate-45 w-20" />
          <Image src="/afro-white-logo.png" alt="" width={100} height={100} className="hidden dark:block transition duration-150 ease-out hover:rotate-45 w-20" />
        </div>
        <div className="flex justify-center items-center h-auto w-full">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">Mega-sized Ideas!</h1>
                <div className="hidden sm:block">
                  <p className="text-lg text-slate-500 dark:text-slate-200">Discover convenient tools for developers, ideal for team collaboration.</p>
                  <p className="text-lg text-slate-500 dark:text-slate-200">And the best part? It&apos;s all open source!</p>
                </div>
                <div className="block sm:hidden">
                  <p className="text-lg text-slate-500 dark:text-white">Discover convenient tools for developers, ideal for team collaboration. And the best part? It&apos;s all open source!</p>
                </div>
            </div>
        </div>
        <div className="flex justify-center items-center mb-5">
          {user ? (
            <Button className="mr-5" variant="outline" asChild>
              <Link href="/dashboard"><MdSpaceDashboard className="mr-1" size="17.5" />Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button className="mr-5" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
        <div className="contents md:flex justify-center items-center">
        <Card className="text-center md:w-80 h-60 md:mr-5">
          <CardHeader className="h-28">
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Quickly access all pages, enabling seamless support for developers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-center items-center">
              <Image src="/undraw/rocket.svg" alt="" width={100} height={100} className="block dark:hidden w-16" />
              <Image src="/undraw/rocket-white.svg" alt="" width={100} height={100} className="hidden dark:block w-16" />
            </div>
          </CardContent>
        </Card>
        <Card className="text-center md:w-80 h-60 md:mr-5">
          <CardHeader className="h-28">
            <CardTitle>Team Features</CardTitle>
            <CardDescription>Quickly access all pages, enabling seamless support for developers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-center items-center">
              <Image src="/undraw/smiley.svg" alt="" width={100} height={100} className="block dark:hidden w-20" />
              <Image src="/undraw/smiley-white.svg" alt="" width={100} height={100} className="hidden dark:block w-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="text-center md:w-80 h-60">
          <CardHeader className="h-28">
            <CardTitle>Rich Customization</CardTitle>
            <CardDescription>Customize your screen to meet your preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col justify-center items-center">
              <Image src="/undraw/flower.svg" alt="" width={100} height={100} className="block dark:hidden w-20" />
              <Image src="/undraw/flower-white.svg" alt="" width={100} height={100} className="hidden dark:block w-20" />
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  )
}
