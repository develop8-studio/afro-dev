import Head from "next/head";
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

import SearchMenu from "@/components/search"
import UserMenu from "@/components/user"
import MobileSheet from "@/components/mobile-sheet"
import Header from "@/components/header"

import useAuthRedirect from '@/components/useAuthRedirect'

export default function PrivacyPolicy() {
    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>Terms of Service and Privacy Policy -Afro.dev</title>
        </Head>
        <Header current="none" />
        <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50">
        <div className="container mx-auto p-6">
          <Card className="p-10 mb-10">
              <CardTitle>Terms of Service</CardTitle>
              <h3 className="text-xl font-semibold mt-6 mb-2">English</h3>
              <p className="mb-4"><strong>Welcome to our Afro.dev. By using our site, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully.</strong></p>
              <ol className="list-decimal list-inside space-y-4">
                  <li>
                      <strong>User Registration</strong>
                      <p>To access certain features of our site, you may be required to register and create an account. You are responsible for maintaining the confidentiality of your account and password. You agree to provide accurate, current, and complete information during the registration process.</p>
                  </li>
                  <li>
                      <strong>Use of Content</strong>
                      <p>Some of the content on this site is provided by Freepik&apos;s Flaticon (https://www.flaticon.com/). You must comply with their terms and conditions when using such content. All other content on this site is for your personal and non-commercial use.</p>
                  </li>
                  <li>
                      <strong>Prohibited Activities</strong>
                      <p>You agree not to use the site for any unlawful purpose or to engage in any activity that could damage, disable, or impair the site.</p>
                  </li>
                  <li>
                      <strong>Termination</strong>
                      <p>We reserve the right to terminate or suspend your account and access to the site, without prior notice, for conduct that we believe violates these terms or is harmful to other users of the site, us, or third parties, or for any other reason.</p>
                  </li>
                  <li>
                      <strong>Modification of Terms</strong>
                      <p>We reserve the right to modify these terms at any time. Your continued use of the site after any such changes constitutes your acceptance of the new terms.</p>
                  </li>
                  <li>
                      <strong>Governing Law</strong>
                      <p>These terms shall be governed by and construed in accordance with the laws of Your Country/Region.</p>
                  </li>
              </ol>
              <h3 className="text-xl font-semibold mt-6 mb-2">日本語</h3>
              <p className="mb-4"><strong>Afro.devへようこそ。当サイトを利用することで、以下の利用規約に同意したものとみなされます。ご利用前にこれらの規約をよくお読みください。</strong></p>
              <ol className="list-decimal list-inside space-y-4">
                  <li>
                      <strong>ユーザー登録</strong>
                      <p>当サイトの一部の機能にアクセスするためには、ユーザー登録とアカウントの作成が必要です。アカウントとパスワードの機密性を保持する責任はユーザーにあります。登録プロセス中に提供する情報は、正確、最新、かつ完全であることに同意します。</p>
                  </li>
                  <li>
                      <strong>コンテンツの使用</strong>
                      <p>当サイトの一部のコンテンツはFreepikのFlaticon（https://www.flaticon.com/）によって提供されています。このようなコンテンツを使用する際には、彼らの利用規約に従う必要があります。その他のコンテンツは、個人的かつ非営利目的でのみ使用してください。</p>
                  </li>
                  <li>
                      <strong>禁止行為</strong>
                      <p>当サイトを違法な目的で使用したり、サイトを損傷、無効化、または損害を与える可能性のある活動に従事しないことに同意します。</p>
                  </li>
                  <li>
                      <strong>アカウントの終了</strong>
                      <p>当社は、これらの規約に違反する行為や、他のユーザー、当社、または第三者に害を及ぼすと判断した場合、通知なしにアカウントを終了または一時停止する権利を有します。</p>
                  </li>
                  <li>
                      <strong>規約の変更</strong>
                      <p>当社は、これらの規約をいつでも変更する権利を有します。変更後も当サイトを継続して利用することで、新しい規約に同意したものとみなされます。</p>
                  </li>
                  <li>
                      <strong>準拠法</strong>
                      <p>これらの規約は、あなたの国/地域の法律に準拠し、解釈されます。</p>
                  </li>
              </ol>
          </Card>

          <Card className="p-10">
              <CardTitle>Privacy Policy</CardTitle>
              <h3 className="text-xl font-semibold mt-6 mb-2">English</h3>
              <p className="mb-4"><strong>This Privacy Policy explains how we collect, use, and disclose information about you when you use our Afro.dev.</strong></p>
              <ol className="list-decimal list-inside space-y-4">
                  <li>
                      <strong>Information Collection</strong>
                      <p>We collect information you provide directly to us when you create an account, use the site, or communicate with us. This may include your name, email address, and any other information you choose to provide. We also collect information automatically when you use the site, such as IP address, browser type, and access times.</p>
                  </li>
                  <li>
                      <strong>Use of Information</strong>
                      <p>We use the information we collect to provide, maintain, and improve our site, to communicate with you, and to protect the safety and security of our site and users.</p>
                  </li>
                  <li>
                      <strong>Information Sharing</strong>
                      <p>We do not share your personal information with third parties except to comply with legal obligations, to protect and defend our rights and property, or with your consent.</p>
                  </li>
                  <li>
                      <strong>Data Security</strong>
                      <p>We implement reasonable security measures to protect your information from unauthorized access, use, or disclosure.</p>
                  </li>
                  <li>
                      <strong>Your Choices</strong>
                      <p>You may update or correct your account information at any time by logging into your account. You may also delete your account by contacting us.</p>
                  </li>
                  <li>
                      <strong>Changes to this Policy</strong>
                      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our site.</p>
                  </li>
                  <li>
                      <strong>Contact Us</strong>
                      <p>If you have any questions about this Privacy Policy, please contact us at <Link href="https://x.com/develop8_studio" className="underline">@develop8-studio</Link>.</p>
                  </li>
              </ol>
              <h3 className="text-xl font-semibold mt-6 mb-2">日本語</h3>
              <p className="mb-4"><strong>このプライバシーポリシーは、Afro.devを利用する際に収集する情報の種類、使用方法、および開示について説明します。</strong></p>
              <ol className="list-decimal list-inside space-y-4">
                  <li>
                      <strong>情報の収集</strong>
                      <p>アカウントを作成する際、サイトを利用する際、または当社と通信する際に、ユーザーが直接提供する情報を収集します。これには、名前、メールアドレス、その他ユーザーが提供する情報が含まれます。また、IPアドレス、ブラウザの種類、アクセス時間など、サイトの利用時に自動的に収集される情報も含まれます。</p>
                  </li>
                  <li>
                      <strong>情報の使用</strong>
                      <p>収集した情報は、当サイトの提供、維持、改善、ユーザーとのコミュニケーション、およびサイトとユーザーの安全とセキュリティを保護するために使用します。</p>
                  </li>
                  <li>
                      <strong>情報の共有</strong>
                      <p>ユーザーの個人情報を第三者と共有することはありません。ただし、法的義務を遵守するため、当社の権利と財産を保護および防御するため、またはユーザーの同意がある場合を除きます。</p>
                  </li>
                  <li>
                      <strong>データのセキュリティ</strong>
                      <p>ユーザーの情報を不正アクセス、使用、または開示から保護するために合理的なセキュリティ対策を実施しています。</p>
                  </li>
                  <li>
                      <strong>ユーザーの選択肢</strong>
                      <p>アカウント情報は、アカウントにログインすることでいつでも更新または修正できます。アカウントを削除する場合は、当社までご連絡ください。</p>
                  </li>
                  <li>
                      <strong>ポリシーの変更</strong>
                      <p>このプライバシーポリシーを随時更新することがあります。新しいポリシーをサイトに掲載することで、変更を通知します。</p>
                  </li>
                  <li>
                      <strong>お問い合わせ</strong>
                      <p>このプライバシーポリシーについて質問がある場合は、<Link href="https://x.com/develop8_studio" className="underline">@develop8-studio</Link>までご連絡ください。</p>
                  </li>
              </ol>
          </Card>
        </div>
        </main>
        </div>
    )
}
