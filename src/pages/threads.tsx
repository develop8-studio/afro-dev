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
  link: string;
  description: string;
}

const roomsData: Room[] = [
  { id: 1, name: "React", link: '/threads/react', description: "A JavaScript library for building user interfaces, maintained by Facebook. Emphasizes reusable components and efficient rendering." },
  { id: 2, name: "Vue.js", link: '/threads/vuejs', description: "A progressive framework for building user interfaces and single-page applications. Known for its simplicity and flexibility." },
  { id: 3, name: "Angular", link: '/threads/angular', description: "A JavaScript library for building user interfaces, maintained by Facebook. Emphasizes reusable components and efficient rendering." },
  { id: 4, name: "Svelte", link: '/threads/svelte', description: "Compiles code to highly efficient JavaScript at build time, resulting in faster applications with smaller bundles." },
  { id: 5, name: "Next.js", link: '/threads/nextjs', description: "A React-based framework for server-rendered or statically-exported React applications, known for its performance and developer experience." },

  { id: 6, name: "Python", link: '/threads/python', description: "An interpreted, high-level language known for its readability and wide usage in web development, data science, and more." },
  { id: 7, name: "JavaScript", link: '/threads/javascript', description: "A core technology of the web, enabling interactive web pages. Essential for front-end development alongside HTML and CSS." },
  { id: 8, name: "Java", link: '/threads/java', description: "A class-based, object-oriented language that follows the write-once, run-anywhere principle. Popular in enterprise environments." },
  { id: 9, name: "TypeScript", link: '/threads/typescript', description: "A superset of JavaScript that adds static typing, designed for large-scale applications. Developed by Microsoft." },
  { id: 10, name: "C#", link: '/threads/csharp', description: "A modern, object-oriented language developed by Microsoft, used in a wide range of applications including web, desktop, and games." },
];

roomsData.sort((a, b) => a.name.localeCompare(b.name));

export default function DashboardPage() {
  useAuthRedirect();

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRooms = roomsData.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Head>
        <title>Threads -Afro.dev</title>
      </Head>
      <Header current="threads" />
      <main className="flex flex-1 flex-col p-5 gap-5 md:p-8 bg-slate-50 dark:bg-muted/40">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a room..."
          className="w-full rounded-full"
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
