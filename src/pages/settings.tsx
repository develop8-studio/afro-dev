import Head from "next/head";
import Link from "next/link"
import { Menu, Package2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth  } from "firebase/auth";
import { initializeApp } from "firebase/app";

import { useTheme } from "next-themes";
import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import HeaderList from "@/components/header";
import UserMenu from "@/components/user";
import SettingsMenu from "@/components/settings";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const FormSchema = z.object({
    dark_mode: z.boolean(),
})

export default function Dashboard() {
    const router = useRouter();
    const { setTheme } = useTheme()

    const defaultDarkMode = useTheme().theme === "dark";

    useEffect(() => {
        if (!auth.currentUser) {
            router.push("/login");
        }
    }, []);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            // dark_mode: true,
            dark_mode: defaultDarkMode,
        },
    })

    // function onSubmit(data: z.infer<typeof FormSchema>) {
    //     setTheme(data.dark_mode ? 'dark' : 'light')
    // }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setTheme(data.dark_mode ? 'dark' : 'light')
      }

    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>Settings -Nook.to</title>
        </Head>
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <HeaderList />
            <Sheet>
            <SheetTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold"
                >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Dashboard
                </Link>
                <Link
                    href="/orders"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Orders
                </Link>
                <Link
                    href="/products"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Products
                </Link>
                <Link
                    href="/customers"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Customers
                </Link>
                <Link href="/settings" className="hover:text-foreground">
                    Settings
                </Link>
                </nav>
            </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
                </div>
            </form>
            <UserMenu />
            </div>
        </header>
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Settings</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <SettingsMenu current="general" />
            <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
                <CardHeader>
                    <CardTitle>Mode</CardTitle>
                </CardHeader>
                    <div className="flex items-center space-x-2">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <CardContent>
                    <Card className="flex flex-row items-center justify-between p-3">
                        <div className="space-y-0.5">
                        <CardTitle className="text-lg font-semibold">Dark Mode</CardTitle>
                        <CardDescription>
                            Toggle dark mode on or off.
                        </CardDescription>
                        </div>
                        <Switch
                        checked={form.watch('dark_mode')}
                        onCheckedChange={(checked) => form.setValue('dark_mode', checked)}
                        />
                    </Card>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit">Save</Button>
                    </CardFooter>
                    </form>
                    </div>
            </Card>
            </div>
            </div>
        </main>
        </div>
    )
}
