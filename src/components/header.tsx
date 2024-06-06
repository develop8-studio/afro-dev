import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Si9Gag } from "react-icons/si"

import SearchMenu from "@/components/search"
import UserMenu from "@/components/user"
import MobileSheet from "@/components/mobile-sheet"

type HeaderProps = {
    current: string;
};

export default function Header({ current }: HeaderProps) {
    return (
        <header className="sticky top-0 flex h-16 items-center gap-5 bg-background px-5 md:px-5 dark:border-b">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                    {/* <Si9Gag className="h-6 w-6" />
                    <span className="sr-only">Afro</span> */}
                    <Image src="/afro-dark-logo.png" alt="" width={30} height={30} className="block dark:hidden" />
                    <Image src="/afro-white-logo.png" alt="" width={30} height={30} className="hidden dark:block" />
                </Link>
                <Link href="/dashboard" className={`${current === "dashboard" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                    Dashboard
                </Link>
                <Link href="/orders" className={`${current === "orders" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                    Orders
                </Link>
                <Link href="/products" className={`${current === "products" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                    Products
                </Link>
                <Link href="/customers" className={`${current === "customers" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                    Customers
                </Link>
                <Link href="/analytics" className={`${current === "analytics" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                    Analytics
                </Link>
                {/* <Link href="/settings" className={`${current === "settings" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                    Settings
                </Link> */}
            </nav>
            <MobileSheet current={current} />
            <SearchMenu />
            <UserMenu />
        </header>
    )
}
