import Link from "next/link";
import {
    Home,
    LineChart,
    Package,
    Package2,
    Settings,
    ShoppingCart,
    Users2,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip";

type AsideProps = {
    current: string;
};

type GetLinkClassName = (href: string) => string;

export default function Aside({ current }: AsideProps) {

    const getLinkClassName: GetLinkClassName = (href) => {
        let defaultClassName = "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8";

        if (current === href) {
            defaultClassName += " bg-accent text-accent-foreground text-black dark:text-white";
        }

        return defaultClassName;
    };

    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link href="/" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                    <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/dashboard" className={getLinkClassName("/dashboard")}>
                                <Home className="h-5 w-5" />
                                <span className="sr-only">Dashboard</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Dashboard</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/orders" className={getLinkClassName("/orders")}>
                                <ShoppingCart className="h-5 w-5" />
                                <span className="sr-only">Orders</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Orders</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/products" className={getLinkClassName("/products")}>
                                <Package className="h-5 w-5" />
                                <span className="sr-only">Products</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Products</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/customers" className={getLinkClassName("/customers")}>
                                <Users2 className="h-5 w-5" />
                                <span className="sr-only">Customers</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Customers</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/analytics" className={getLinkClassName("/analytics")}>
                                <LineChart className="h-5 w-5" />
                                <span className="sr-only">Analytics</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Analytics</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link href="/settings" className={getLinkClassName("/settings")}>
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">Settings</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">Settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </nav>
        </aside>
    )
}