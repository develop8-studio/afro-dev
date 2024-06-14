import React, { useEffect, useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, storage } from '@/firebase/firebaseConfig';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Textarea } from '@/components/ui/textarea';
import { IoIosSend } from 'react-icons/io';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FaPlus } from 'react-icons/fa';

const highlightLanguages = [
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'swift', label: 'Swift' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Golang' },
];
highlightLanguages.sort((a, b) => a.label.localeCompare(b.label));

const CodeShareButton: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadButtonVariant, setUploadButtonVariant] = useState<'outline' | 'secondary'>('outline');
    const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage AlertDialog open/close

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const shareCode = async () => {
        if (!code.trim() || !description.trim()) return;

        let imageUrl = '';
        if (imageFile) {
            const storageRef = ref(storage, `images/${user?.uid}_${Date.now()}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
        }

        if (user) {
            await addDoc(collection(db, 'codes'), {
                code,
                description,
                userId: user.uid,
                userName: user.displayName,
                timestamp: serverTimestamp(),
                likes: 0,
                language,
                imageUrl,
            });

            setCode('');
            setDescription('');
            setLanguage('');
            setImageFile(null);
            setUploadButtonVariant('outline');
            setIsDialogOpen(false); // Close the dialog after sharing the code
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setUploadButtonVariant('secondary');
        } else {
            setUploadButtonVariant('outline');
        }
    };

    return (
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger>
                <Button className="flex bg-blue-500 hover:bg-blue-600 dark:text-white h-[37.5px]">
                    <FaPlus className="text-md mr-[7.5px] flex" />Share Code
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Share Code</AlertDialogTitle>
                    <AlertDialogDescription>
                        Let&apos;s share the awesome code you&apos;ve created with everyone!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Select value={language} onValueChange={(value) => setLanguage(value)}>
                    <SelectTrigger className="w-full sm:w-[150px] sm:mr-3">
                        <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {highlightLanguages.map((highlightLanguage) => (
                            <SelectItem key={highlightLanguage.value} value={highlightLanguage.value}>
                                {highlightLanguage.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description..." />
                <Textarea value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter your code..." />
                <Button onClick={() => fileInputRef.current?.click()} variant={uploadButtonVariant}>
                    Upload
                    <input ref={fileInputRef} type="file" onChange={handleImageChange} style={{ display: 'none' }}/>
                </Button>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={shareCode} className="">
                        Share<IoIosSend className="ml-[5px] text-lg hidden md:block" />
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CodeShareButton;