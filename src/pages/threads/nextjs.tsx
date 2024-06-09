import Head from "next/head"
import Header from "@/components/header"
import useAuthRedirect from "@/components/useAuthRedirect"
import Chat from "@/components/Chat"
import RoomSelector from '@/components/RoomSelector'
import { useState } from 'react'

export default function DashboardPage() {
    useAuthRedirect();
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);

    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>Next.js -Afro.dev</title>
        </Head>
        <Header current="threads" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50 dark:bg-muted/40">
            <RoomSelector currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} topic="nextjs" />
            {currentRoom && <Chat currentRoom={currentRoom} topic="nextjs" />}
        </main>
        </div>
    )
}
