import React from "react"
import Link from "next/link"
import { Package2 } from "lucide-react"

type HeaderProps = {
    current: string;
};

export default function Header({ current }: HeaderProps) {
    return (
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Nook.to</span>
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
            <Link href="/settings" className={`${current === "settings" ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}>
                Settings
            </Link>
        </nav>
    )
}
