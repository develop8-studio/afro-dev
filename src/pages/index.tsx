import Link from "next/link"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import UserMenu from "@/components/user"
import SearchMenu from "@/components/search"
import MobileSheet from "@/components/mobile-sheet"
import Header from "@/components/header"

import Image from "next/image"

import useAuthRedirect from "@/components/useAuthRedirect"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header current="none" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50 dark:bg-transparent">
        {/* <div className="flex justify-center items-center h-40 rotate-12 opacity-90">
          <Image src="/afro-dark-logo.png" alt="" width={100} height={100} className="block dark:hidden" />
          <Image src="/afro-white-logo.png" alt="" width={100} height={100} className="hidden dark:block" />
        </div> */}
        <div className="flex justify-center items-center h-60 md:h-40">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">Mega-sized Ideas!</h1>
                <p className="text-lg text-slate-500 dark:text-white">Discover convenient tools for developers, ideal for team collaboration. And the best part? It's all open source!</p>
            </div>
        </div>
        <div className="flex justify-center items-center">
        <Button className="mr-5" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
