import React from "react"
import Link from "next/link"
import { Menu, Package2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type MobileSheetProps = {
    current: string;
};

export default function MobileSheet({ current }: MobileSheetProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className="sr-only">Nook.to</span>
                    </Link>
                    <Link href="/dashboard" className={current === "dashboard" ? "hover:text-foreground" : "text-muted-foreground hover:text-foreground"}>
                        Dashboard
                    </Link>
                    <Link href="/orders" className={current === "orders" ? "hover:text-foreground" : "text-muted-foreground hover:text-foreground"}>
                        Orders
                    </Link>
                    <Link href="/products" className={current === "products" ? "hover:text-foreground" : "text-muted-foreground hover:text-foreground"}>
                        Products
                    </Link>
                    <Link href="/customers" className={current === "customers" ? "hover:text-foreground" : "text-muted-foreground hover:text-foreground"}>
                        Customers
                    </Link>
                    <Link href="/analytics" className={current === "analytics" ? "hover:text-foreground" : "text-muted-foreground hover:text-foreground"}>
                        Analytics
                    </Link>
                    <Link href="/settings" className={current === "settings" ? "hover:text-foreground" : "text-muted-foreground hover:text-foreground"}>
                        Settings
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    )
}
