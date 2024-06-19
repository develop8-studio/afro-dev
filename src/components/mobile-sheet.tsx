import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Package2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Si9Gag } from "react-icons/si"
import { RiMenu2Fill } from "react-icons/ri"
import CodeShareButton from "./Code/CodeShareButton"

type MobileSheetProps = {
    current: string;
};

export default function MobileSheet({ current }: MobileSheetProps) {
    return (
        <Sheet>
            <SheetTrigger>
                {/* <RiMenu2Fill className="cursor-pointer md:hidden text-2xl" /> */}
                <Image src="/afro-black-text.png" alt="" width={100} height={100} className="mt-1.5 w-[60px] block dark:hidden md:hidden" />
                <Image src="/afro-white-text.png" alt="" width={100} height={100} className="mt-1.5 w-[60px] hidden dark:block dark:md:hidden" />
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-5 text-base">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-2.5">
                        <Image src="/afro-black-text.png" alt="" width={100} height={100} className="w-[60px] block dark:hidden" />
                        <Image src="/afro-white-text.png" alt="" width={100} height={100} className="w-[60px] hidden dark:block" />
                    </Link>
                    <Link href="/">
                        Codes
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
