import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Package2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Si9Gag } from "react-icons/si"

type MobileSheetProps = {
    current: string;
};

export default function MobileSheet({ current }: MobileSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Menu className="cursor-pointer md:hidden" />
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-5 text-base">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                        {/* <Si9Gag className="h-6 w-6" />
                        <span className="sr-only">Afro</span> */}
                        <Image src="/afro-dark-logo.png" alt="" width={20} height={20} className="block dark:hidden" />
                        <Image src="/afro-white-logo.png" alt="" width={20} height={20} className="hidden dark:block" />
                        <div className="flex text-xl">
                            <h1 className="font-serif">A</h1>
                            <h1 className="font-mono">f</h1>
                            <h1 className="font-serif">r</h1>
                            <h1 className="font-sans">o</h1>
                        </div>
                    </Link>
                    <Link href="/dashboard">
                        Dashboard
                    </Link>
                    <Link href="/orders">
                        Orders
                    </Link>
                    <Link href="/products">
                        Products
                    </Link>
                    <Link href="/tools">
                        Tools
                    </Link>
                    <Link href="/threads">
                        Threads
                    </Link>
                    <Link href="/settings">
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
