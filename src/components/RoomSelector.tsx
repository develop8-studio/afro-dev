import { useState, useEffect } from 'react'
import { collection, addDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/firebaseConfig'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
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
import { Separator } from "@/components/ui/separator"

interface Room {
    id: string;
    name: string;
    password?: string;
}

interface RoomSelectorProps {
    currentRoom: string | null;
    setCurrentRoom: (roomId: string) => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({ currentRoom, setCurrentRoom }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [password, setRoomPassword] = useState('');
    const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [roomPassword, setRoomPasswordInput] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'rooms'), (snapshot) => {
        const roomsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room));
        setRooms(roomsData);
        });

        return () => unsubscribe();
    }, []);

    const createRoom = async () => {
        if (newRoomName.trim() === '') return;

        const roomData: Omit<Room, 'id'> = { name: newRoomName };
        if (isPasswordEnabled && password.trim() !== '') {
            roomData.password = password;
        }

        await addDoc(collection(db, 'rooms'), roomData);
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

    return (
        <Card className="room-selector mb-5 p-5">
        <CardTitle className="text-xl">Select Room</CardTitle>
        <div className="create-room flex my-3">
            <Input value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} placeholder="New Room Name" className="font-light" />
            <Button onClick={createRoom} className="ml-3 font-normal">Create</Button>
        </div>
        <div className="flex items-center space-x-2 mb-3">
            <Checkbox id="setPassword" checked={isPasswordEnabled} onCheckedChange={(checked: boolean) => setIsPasswordEnabled(checked)} />
            <Label htmlFor="setPassword" className="font-normal">Set Password</Label>
        </div>
        {isPasswordEnabled && (
            <Input type="password" value={password} onChange={(e) => setRoomPassword(e.target.value)} placeholder="Password" className="mb-3 font-light" />
        )}
        <Separator className="my-5 block sm:hidden" />
        <ScrollArea className="h-[150px] rounded-md border p-3">
            {rooms.map(room => (
            <div key={room.id} className={`room-item ${room.id === currentRoom ? 'font-semibold cursor-pointer p-1' : 'cursor-pointer p-1'}`} onClick={() => handleRoomSelect(room)}>
                {room.name}
            </div>
            ))}
        </ScrollArea>

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
    );
};

export default RoomSelector;