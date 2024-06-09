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
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
    const [newRoomName, setNewRoomName] = useState('');
    const [password, setRoomPassword] = useState('');
    const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [roomPassword, setRoomPasswordInput] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'rooms'), (snapshot) => {
            const roomsData = snapshot.docs.map(doc => {
                const data = doc.data();
                return { id: doc.id, name: data.name || 'Unnamed Room', password: data.password } as Room;
            });
            setRooms(roomsData);
            setFilteredRooms(roomsData);
        });

        return () => unsubscribe();
    }, []);

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

        await addDoc(collection(db, 'rooms'), roomData);
        setNewRoomName('');
        setIsPasswordEnabled(false);
        setRoomPassword('');
        setIsDialogOpen(false); // Close the dialog
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
        <div>
            <div className="flex justify-end mb-3">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="font-normal">Create Room</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Create a Room</AlertDialogTitle>
                            <AlertDialogDescription>You can create a room by deciding on a name. You can also set a password.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col gap-3">
                            <Input value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} placeholder="New Room Name" className="font-light" />
                            <div className="flex items-center space-x-2">
                                <Checkbox id="setPassword" checked={isPasswordEnabled} onCheckedChange={(checked: boolean) => setIsPasswordEnabled(checked)} />
                                <Label htmlFor="setPassword" className="font-normal">Set Password</Label>
                            </div>
                            {isPasswordEnabled && (
                                <Input type="password" value={password} onChange={(e) => setRoomPassword(e.target.value)} placeholder="Password" className="font-light" />
                            )}
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="font-normal">Cancel</AlertDialogCancel>
                            <Button onClick={createRoom} className="font-normal">Create</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <Card className="room-selector p-5">
                <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search Room" className="mb-3 font-light" />
                <ScrollArea className="h-[150px] rounded-md border p-3">
                    {filteredRooms.map(room => (
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
        </div>
    );
};

export default RoomSelector;