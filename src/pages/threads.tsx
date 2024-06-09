import Head from "next/head"
import Header from "@/components/header"
import useAuthRedirect from "@/components/useAuthRedirect"
import Chat from "@/components/Chat"
import RoomSelector from '@/components/RoomSelector'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Room {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
  description: string;
}

const roomsData: Room[] = [
  { id: 1, name: "Next.js", imageUrl: '/threads/nextjs.png', link: '/threads/nextjs', description: "Next.js simplifies building React applications with features like server-side rendering and automatic code splitting." },
  { id: 2, name: 'TypeScript', imageUrl: '/threads/typescript.png', link: '/threads/typescript', description: "TypeScript enhances JavaScript with static typing, helping catch errors early and improving code maintainability." },
];

roomsData.sort((a, b) => a.name.localeCompare(b.name));

export default function DashboardPage() {
  useAuthRedirect();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const filteredRooms = roomsData.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Head>
        <title>Threads -Afro.dev</title>
      </Head>
      <Header current="threads" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50 dark:bg-muted/40">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a room..."
          className="w-full"
        />
        <div className="flex flex-col">
          {filteredRooms.map(room => (
            <Card key={room.id} className="flex justify-center items-center overflow-hidden mb-3 p-4">
              <div className="flex-grow mr-3">
                <h3 className="text-lg font-semibold mb-1">{room.name}</h3>
                <CardDescription className="text-slate-400">{room.description}</CardDescription>
              </div>
              <Button className="rounded-full" asChild>
                <Link href={room.link}>View</Link>
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
