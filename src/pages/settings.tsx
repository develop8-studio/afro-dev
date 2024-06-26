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
import { z } from "zod"
import { useForm } from "react-hook-form"

import Header from "@/components/header"
import SettingsMenu from "@/components/settings"

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

    const [isModified, setIsModified] = React.useState(false);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setTheme(data.dark_mode ? 'dark' : 'light')
        setIsModified(false);
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>Settings -Afro.dev</title>
        </Head>
        <Header current="settings" />
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Settings</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <SettingsMenu current="general" />
            <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
                <CardHeader>
                    <h3 className="text-xl font-semibold">Mode</h3>
                </CardHeader>
                    <div className="flex items-center">
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
                            onCheckedChange={(checked) => {
                                form.setValue('dark_mode', checked);
                                setIsModified(true);
                            }}
                        />
                    </Card>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" className="h-[20]" disabled={!isModified}>Save</Button>
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
