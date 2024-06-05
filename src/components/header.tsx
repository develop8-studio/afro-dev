import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Package2 } from "lucide-react"

import SearchMenu from "@/components/search"
import UserMenu from "@/components/user"
import MobileSheet from "@/components/mobile-sheet"

type HeaderProps = {
    current: string;
};

export default function Header({ current }: HeaderProps) {
    return (
        <header className="sticky top-0 flex h-16 items-center gap-5 bg-background px-5 md:px-5">
            <Image src="/afro.png" alt="afro" width={100} height={100} className="w-[60px] hidden md:inline dark:hidden" />
            <Image src="/dark-mode-afro.png" alt="afro" width={100} height={100} className="w-[60px] hidden dark:md:inline" />
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/dashboard" className={`${current === "dashboard" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground font-bold`}>
                    Dashboard
                </Link>
                <Link href="/analytics" className={`${current === "analytics" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground font-bold`}>
                    Analytics
                </Link>
                <Link href="/settings" className={`${current === "settings" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground font-bold`}>
                    Settings
                </Link>
            </nav>
            <MobileSheet current={current} />
            <SearchMenu />
            <UserMenu />
        </header>
    )
}
