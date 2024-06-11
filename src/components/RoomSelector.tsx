import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
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
} from '@/components/ui/alert-dialog'

interface Room {
    id: string;
    name: string;
    password?: string;
}

interface RoomSelectorProps {
    currentRoom: string | null;
    setCurrentRoom: (roomId: string) => void;
    topic: string;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ currentRoom, setCurrentRoom, topic }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [password, setRoomPassword] = useState('');
    const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [roomPassword, setRoomPasswordInput] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isHidden, setIsHidden] = useState(false); // 表示・非表示の状態を管理

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'rooms', topic, 'rooms'), (snapshot) => {
            const roomsData = snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, name: data.name || 'Unnamed Room', password: data.password } as Room;
            });
            setRooms(roomsData);
            setFilteredRooms(roomsData);
        });

        return () => unsubscribe();
    }, [topic]);

    useEffect(() => {
        setFilteredRooms(
            rooms.filter(room =>
                room.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, rooms]);

    const createRoom = async () => {
        if (newRoomName.trim() === '') return;

        const roomData: Omit<Room, 'id'> = { name: newRoomName };
        if (isPasswordEnabled && password.trim() !== '') {
            roomData.password = password;
        }

        await addDoc(collection(db, 'rooms', topic, 'rooms'), roomData);
        setNewRoomName('');
        setIsPasswordEnabled(false);
        setRoomPassword('');
    };

    const handleRoomSelect = (room: Room) => {
        if (room.password) {
            setSelectedRoom(room);
            setIsDialogOpen(true);
        } else {
            setCurrentRoom(room.id);
        }
    };

    const handlePasswordConfirm = () => {
        if (selectedRoom && selectedRoom.password === roomPassword) {
            setCurrentRoom(selectedRoom.id);
            setRoomPasswordInput('');
            setIsDialogOpen(false);
        } else {
            setError("Incorrect password");
        }
    };

    const toggleVisibility = () => {
        setIsHidden(!isHidden);
    };

    return (
        <div>
            <Card className="pt-5">
                <CardContent>
                    <div className="contents sm:flex justify-between items-center">
                        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Threads" className="w-full" />
                        <div className="flex">
                            <Button className="w-full sm:w-auto sm:ml-3 mt-3 sm:mt-0" onClick={toggleVisibility}>
                                {isHidden ? 'Show' : 'Hide'} Threads
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="w-full sm:w-auto ml-3 mt-3 sm:mt-0">Create</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Create a Thread</AlertDialogTitle>
                                        <AlertDialogDescription>You can create a thread by deciding on a name. You can also set a password.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex flex-col gap-3">
                                        <Input value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} placeholder="New Thread Name" />
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="setPassword" checked={isPasswordEnabled} onCheckedChange={(checked: boolean) => setIsPasswordEnabled(checked)} />
                                            <Label htmlFor="setPassword" className="font-normal">Set Password</Label>
                                        </div>
                                        {isPasswordEnabled && (
                                            <Input type="password" value={password} onChange={(e) => setRoomPassword(e.target.value)} placeholder="Password" />
                                        )}
                                    </div>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                        <Button onClick={createRoom} className="rounded-full">Create</Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    {!isHidden && (
                        <ScrollArea className="h-[150px] rounded-md border px-[10px] py-2.5 mt-5">
                            {filteredRooms.map(room => (
                                <div key={room.id} className={`room-item ${room.id === currentRoom ? 'border cursor-pointer px-4 py-2 my-2 bg-slate-100 dark:bg-muted/60 rounded-full' : 'cursor-pointer px-4 p-2 my-2'}`} onClick={() => handleRoomSelect(room)}>
                                    {room.name}
                                </div>
                            ))}
                        </ScrollArea>
                    )}
                </CardContent>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Enter Room Password</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please enter the password to join this room.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Input type="password" value={roomPassword} onChange={(e) => setRoomPasswordInput(e.target.value)} placeholder="Password" className="my-2" />
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handlePasswordConfirm}>Confirm</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                {error && (
                    <AlertDialog open>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Error</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {error}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setError(null)}>Close</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </Card>
        </div>
    );
};

export default RoomSelector;