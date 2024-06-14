"use client"

import Link from "next/link"
import * as React from "react"
import {
    CalendarIcon,
    EnvelopeClosedIcon,
    FaceIcon,
    GearIcon,
    PersonIcon,
    RocketIcon,
} from "@radix-ui/react-icons"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import {
    Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardDescription } from "@/components/ui/card"
import { FaRegBell } from "react-icons/fa6"
import { IoSearch } from "react-icons/io5"
import { FiBell, FiSearch } from "react-icons/fi"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductsEditPage() {
    const [open, setOpen] = React.useState(false)

    const toggleDialog = () => {
        setOpen((open) => !open)
    }

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
            }
    }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <div className="relative ml-auto flex-1 md:grow-0 h-full flex justify-center items-center pb-1">
            <FiSearch onClick={toggleDialog} size="22.5" className="text-slate-500 dark:text-slate-300 cursor-pointer mr-[15px]" />
            <FiBell size="22.5" className="text-slate-500 dark:text-slate-300 cursor-pointer" />
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <Link href="/codes"><CommandItem>
                    <RocketIcon className="mr-2 h-4 w-4" />
                    <span>Codes</span>
                    </CommandItem></Link>
                    <Link href="/threads"><CommandItem>
                    <FaceIcon className="mr-2 h-4 w-4" />
                    <span>Threads</span>
                    </CommandItem></Link>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <Link href="/settings"><CommandItem>
                        <GearIcon className="mr-2 h-4 w-4" />
                        <span>General</span>
                    </CommandItem></Link>
                    <Link href="/settings/account"><CommandItem>
                        <PersonIcon className="mr-2 h-4 w-4" />
                        <span>Account</span>
                    </CommandItem></Link>
                </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    )
}