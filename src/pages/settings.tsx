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

import { useTheme } from "next-themes";
import * as React from "react"
import { Switch } from "@/components/ui/switch"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import Header from "@/components/header";
import SearchMenu from "@/components/search";
import UserMenu from "@/components/user";
import SettingsMenu from "@/components/settings";
import MobileSheet from "@/components/mobile-sheet";

const FormSchema = z.object({
    dark_mode: z.boolean(),
})

export default function Dashboard() {
    const { setTheme } = useTheme()

    const defaultDarkMode = useTheme().theme === "dark";

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            dark_mode: defaultDarkMode,
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setTheme(data.dark_mode ? 'dark' : 'light')
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>Settings -Afro.dev</title>
        </Head>
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Header current="settings" />
            <MobileSheet current="settings" />
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
                <SearchMenu />
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
                        <CardTitle className="text-md font-medium">Dark Mode</CardTitle>
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
