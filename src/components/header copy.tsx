import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Package2 } from "lucide-react"

type HeaderProps = {
    current: string;
};

export default function Header({ current }: HeaderProps) {
    return (
        <div className="flex item-center">
                <Image src="/afro-logo.png" alt="afro" width={100} height={100} className="w-[50px]" />
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
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
                <Link href="/settings" className={`${current === "settings" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                    Settings
                </Link>
            </nav>
        </div>
    )
}
