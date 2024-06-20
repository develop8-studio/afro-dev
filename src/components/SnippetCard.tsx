import React from 'react';
import { User } from 'firebase/auth';
import {
    collection, doc, deleteDoc, setDoc, updateDoc, getDoc, addDoc, getDocs, serverTimestamp, query, orderBy, onSnapshot
} from 'firebase/firestore';
import { db, auth } from '@/firebase/firebaseConfig';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FaHeart, FaReply, FaBookmark } from 'react-icons/fa';
import { FiCopy, FiTrash } from 'react-icons/fi';
import CodeBlock from './Code/CodeBlock';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosSend } from 'react-icons/io';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from './ui/input';
import Link from 'next/link';

interface CodeSnippet {
    id: string;
    code: string;
    description: string;
    userId: string;
    userName: string;
    timestamp: any;
    likes: number;
    language: string;
    imageUrl?: string;
}

interface Comment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: any;
}

interface SnippetCardProps {
    snippet: CodeSnippet;
    user: User | null;
    userIcons: { [userId: string]: string };
    userLikes: { [snippetId: string]: boolean };
    comments: { [snippetId: string]: Comment[] };
    newComment: { [snippetId: string]: string };
    showComments: { [snippetId: string]: boolean };
    userBookmarks: { [snippetId: string]: boolean };
    onLikeSnippet: (snippetId: string) => void;
    onDeleteSnippet: (snippetId: string) => void;
    onCopyToClipboard: (text: string) => void;
    onAddComment: (snippetId: string) => void;
    onToggleComments: (snippetId: string) => void;
    onBookmarkSnippet: (snippetId: string) => void;
    onCommentChange: (snippetId: string, text: string) => void;
    onFetchUserIcon: (userId: string) => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({
    snippet, user, userIcons, userLikes, comments, newComment, showComments, userBookmarks,
    onLikeSnippet, onDeleteSnippet, onCopyToClipboard, onAddComment, onToggleComments,
    onBookmarkSnippet, onCommentChange, onFetchUserIcon
}) => {
    return (
        <Card key={snippet.id} className="px-5 py-[17.5px] shadow-none">
            <div className="flex items-center mb-2.5">
                <img src={userIcons[snippet.userId]} alt="" className="w-10 h-10 rounded-full border" />
                <span className="font-bold ml-2.5">
                    <Link href={`/profile?user=${snippet.userId}`}>
                        {snippet.userName}
                    </Link>
                </span>
                <span className="ml-2.5 text-xs text-slate-400">
                    {snippet.timestamp ? (snippet.timestamp.toDate ? new Date(snippet.timestamp.toDate()).toLocaleString() : new Date(snippet.timestamp).toLocaleString()) : 'No timestamp'}
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger className="ml-auto">
                        <BsThreeDotsVertical className="text-lg" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {user && snippet.userId === user.uid && (
                            <>
                                <DropdownMenuItem onClick={() => onDeleteSnippet(snippet.id)}>
                                    <FiTrash className="mr-1.5 text-slate-500 dark:text-slate-300" />Delete
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuItem onClick={() => onCopyToClipboard(snippet.code)}>
                            <FiCopy className="mr-1.5 text-slate-500 dark:text-slate-300" />Copy Code
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="mb-2.5 text-sm flex">
                {snippet.description}
            </div>
            {snippet.language && (
                <>
                    <CodeBlock language={snippet.language}>
                        <pre className="whitespace-pre-wrap">{snippet.code}</pre>
                    </CodeBlock>
                    <pre className="hidden dark:block bg-slate-100 dark:bg-slate-900 p-2.5 text-sm whitespace-pre-wrap">{snippet.code}</pre>
                </>
            )}
            {!snippet.language && (
                <pre className="text-white bg-[#282c34] p-2.5 text-sm whitespace-pre-wrap">{snippet.code}</pre>
            )}
            {snippet.imageUrl && (
                <img src={snippet.imageUrl} alt="Snippet Image" className="mt-[15px] max-w-full md:max-w-[250px] h-auto rounded-md" />
            )}
            <div className="flex items-center mt-2.5 pt-2.5">
                <Button onClick={() => onLikeSnippet(snippet.id)} className="bg-transparent hover:bg-transparent h-0 p-0">
                    <FaHeart className={`text-lg mr-[10px] transition-all ${userLikes[snippet.id] ? 'text-red-500 dark:text-red-400' : 'text-slate-300'}`} />
                </Button>
                <span className="text-sm text-slate-500 dark:text-slate-400">{snippet.likes}</span>
                <Button onClick={() => onToggleComments(snippet.id)} className="bg-transparent hover:bg-transparent h-0 p-0 ml-3">
                    <FaReply className={`text-lg ${comments[snippet.id]?.some(comment => comment.userId === user?.uid) ? 'text-blue-500 dark:text-blue-400' : 'text-slate-300'}`} />
                </Button>
                <Button onClick={() => onBookmarkSnippet(snippet.id)} className="bg-transparent hover:bg-transparent h-0 p-0 ml-3">
                    <FaBookmark className={`text-lg ${userBookmarks[snippet.id] ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-300'}`} />
                </Button>
            </div>
            {showComments[snippet.id] && (
                <div className="mt-5">
                    <div className="flex items-center">
                        <Input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment[snippet.id] || ''}
                            onChange={(e) => onCommentChange(snippet.id, e.target.value)}
                        />
                        <Button className="ml-3 bg-blue-500 hover:bg-blue-600 dark:text-white" onClick={() => onAddComment(snippet.id)}>Post<IoIosSend className="ml-[5px] text-lg hidden md:block" /></Button>
                    </div>
                    <div className="my-2.5">
                        {comments[snippet.id]?.map(comment => (
                            <div key={comment.id} className='pt-[10px] pb-[15px] border-b'>
                                <div className="flex items-center">
                                    {userIcons[comment.userId] && (
                                        <img
                                            src={userIcons[comment.userId]}
                                            alt=""
                                            className="w-[30px] h-[30px] rounded-full mr-2.5 border"
                                        />
                                    )}
                                    <span className="font-bold">
                                        <Link href={`/profile?user=${comment.userId}`}>
                                            {comment.userName}
                                        </Link>
                                    </span>
                                    <span className="text-xs text-slate-400 ml-2.5">{comment.timestamp ? (comment.timestamp.toDate ? new Date(comment.timestamp.toDate()).toLocaleString() : new Date(comment.timestamp).toLocaleString()) : 'No timestamp'}</span>
                                </div>
                                <div className="text-sm text-slate-700 dark:text-slate-400 ml-10">
                                    {comment.text}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default SnippetCard;