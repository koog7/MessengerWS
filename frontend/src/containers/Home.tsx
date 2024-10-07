import UserSidebar from "../components/UserSidebar.tsx";
import {FormEvent, useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";

const Home = () => {


    const userData = useSelector((state: RootState) => state.User.user)
    const [users , setUsers] = useState<string[]>([]);
    const [messages, setMessages] = useState<object[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/message');
        console.log('connected')
        ws.current.onopen = () => {
            console.log('open');
            if(userData){
                ws.current.send(JSON.stringify({
                    type: 'LOGIN',
                    token: userData.token
                }));
                console.log('sended')
            }
        }

        ws.current.onmessage = (message) => {
            const decodedMessage = JSON.parse(message.data)

            if (decodedMessage.type === 'ONLINE_USERS') {
                setUsers(decodedMessage.payload);
            }

            if(decodedMessage.type === 'MESSAGE'){
                if(Array.isArray(decodedMessage.lastMessages)){
                    setMessages(decodedMessage.lastMessages);
                }else if (decodedMessage.message && decodedMessage.username){
                    setMessages((prevMessages) => [...prevMessages, decodedMessage]);
                }
            }
        }
    } , [])

    const sendNewMessage = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (newMessage.trim()) {
            ws.current.send(JSON.stringify({
                type: 'MESSAGE',
                message: newMessage,
                userId: userData?._id
            }));

            setNewMessage('');
        }
    }

    return (
        <div style={{display: "flex"}}>
            <div style={{width:'25%'}}>
                <UserSidebar userName={users} />
            </div>
            <div style={{width:'75%' }}>
                <fieldset style={{height: '450px' , overflowY: 'auto', display: 'flex', flexDirection: 'column-reverse'}}>
                    <legend>Chat room</legend>
                    <div>
                        {messages && messages.length > 0 && (
                            <div>
                                {messages.map((msg, index) => (
                                    <p key={index}>
                                        <strong>{msg.userId?.username ? msg.userId.username : msg.username}:</strong> {msg.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </fieldset>
                <div style={{margin: '5px 5px 5px 10px'}}>
                    <form onSubmit={sendNewMessage}>
                        <input style={{width: '80%', minHeight: '30px', marginTop: '5px'}} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={'Enter a message'}></input>
                        <button style={{marginLeft: '20px', padding: '7px 30px', width: '110px'}}>Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;