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
import Layout from "@/components/Layout"
import { FiSearch } from "react-icons/fi"

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

    { id: 11, name: "AWS", link: '/threads/aws', description: "Amazon Web Services (AWS) is a comprehensive cloud computing platform provided by Amazon. It offers a variety of services including computing power, storage options, and networking. AWS allows businesses to scale and grow without the need for physical infrastructure." },
    { id: 12, name: "Flutter", link: '/threads/flutter', description: "Flutter is an open-source UI software development kit created by Google. It is used to develop cross-platform applications for Android, iOS, Linux, Mac, Windows, and the web from a single codebase. Flutter uses the Dart programming language and emphasizes a fast, expressive user interface." },
    { id: 13, name: "Docker", link: '/threads/docker', description: "Docker is a platform that uses containerization to allow developers to package applications with all their dependencies. This ensures that applications run consistently in any environment. Docker containers are lightweight, portable, and efficient, making them ideal for DevOps practices." },
    { id: 14, name: "Go", link: '/threads/go', description: "Go, also known as Golang, is an open-source programming language developed by Google. It is designed for simplicity, efficiency, and reliability. Go is often used for building fast, scalable web applications and cloud services, with a strong emphasis on concurrency." },
    { id: 15, name: "Rails", link: '/threads/rails', description: "Rails, or Ruby on Rails, is a server-side web application framework written in Ruby. It follows the MVC (Model-View-Controller) architecture and emphasizes convention over configuration. Rails is known for its ease of use, helping developers build applications quickly." },

    { id: 16, name: "Ruby", link: '/threads/ruby', description: "Ruby is a dynamic, open-source programming language with a focus on simplicity and productivity. It has an elegant syntax that is natural to read and easy to write. Ruby is often used in web development, particularly with the Rails framework." },
    { id: 17, name: "GitHub", link: '/threads/github', description: "GitHub is a web-based platform for version control and collaboration, built on Git. It allows developers to host and review code, manage projects, and work together on software. GitHub is widely used in the software development community for its collaborative features and integration with CI/CD tools." },
    { id: 18, name: "Rust", link: '/threads/rust', description: "Rust is a systems programming language focused on safety, speed, and concurrency. Developed by Mozilla, it is designed to prevent many common bugs, such as memory management errors. Rust is often used for performance-critical applications and web assembly." },
    { id: 19, name: "PHP", link: '/threads/php', description: "PHP is a popular server-side scripting language designed for web development. It is embedded in HTML and is known for its ease of use and flexibility. PHP powers many websites and web applications, including WordPress and Facebook." },
    { id: 20, name: "iOS", link: '/threads/ios', description: "iOS is the mobile operating system created by Apple for its devices, including the iPhone and iPad. It is known for its smooth performance, security features, and a vast ecosystem of apps available on the App Store. iOS development typically uses the Swift or Objective-C programming languages." },
];

roomsData.sort((a, b) => a.name.localeCompare(b.name));

const DescriptionWithReadMore = ({ description }: { description: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => setIsExpanded(!isExpanded);

    if (description.length <= 175) {
        return <CardDescription className="text-slate-400">{description}</CardDescription>;
    }

    return (
        <div>
        <CardDescription className="text-slate-400 mb-2.5">
            {isExpanded ? description : `${description.slice(0, 175)}...`}
        </CardDescription>
        <Button variant="link" onClick={toggleExpand} className="p-0 h-0">
            {isExpanded ? 'Read less' : 'Read more'}
        </Button>
        </div>
    );
};

export default function ThreadsList() {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredRooms = roomsData.filter(room =>
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Layout>
                <div className="lg:fixed lg:top-[60px] lg:left-0 lg:right-0 lg:bg-white dark:lg:bg-slate-950 lg:z-10 lg:px-5 lg:py-2.5">
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for topics..."
                        className="rounded-full w-full"
                    />
                </div>
                <div className="flex flex-col space-y-3 lg:mt-[50px]">
                    {filteredRooms.map(room => (
                        <Card key={room.id} className="flex justify-center items-center overflow-hidden p-[17.5px]">
                            <div className="flex-grow mr-3">
                                <h3 className="text-lg font-semibold mb-1">{room.name}</h3>
                                <DescriptionWithReadMore description={room.description} />
                            </div>
                            <Button className="rounded-full" asChild>
                                <Link href={room.link}>View</Link>
                            </Button>
                        </Card>
                    ))}
                </div>
            </Layout>
        </>
    )
}