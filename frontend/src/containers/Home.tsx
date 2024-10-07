import UserSidebar from "../components/UserSidebar.tsx";
import {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../app/store.ts";

const Home = () => {


    const userData = useSelector((state: RootState) => state.User.user)
    const [users , setUsers] = useState<string[]>([]);
    const [messages, setMessages] = useState<object[]>([]);

    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/message');

        ws.current.onopen = () => {
            if(userData && ws.current.readyState === WebSocket.OPEN){
                ws.current.send(JSON.stringify({
                    type: 'LOGIN',
                    token: userData.token
                }));
            }
        }

        if(ws.current){
            ws.current.onmessage = (message) => {
                const decodedMessage = JSON.parse(message.data)
                if (decodedMessage.type === 'ONLINE_USERS') {
                    setUsers(decodedMessage.payload);
                }

                if(decodedMessage.type === 'MESSAGE'){
                    setMessages((prevMessages) => [...prevMessages, decodedMessage]);
                }
            }
        }

    } , [])


    useEffect(() => {
        console.log(messages);
    }, [messages]);
    // useEffect(() => {
    //     if (messages) {
    //         console.log(messages.lastMessages);
    //     }
    // }, [messages]);


    return (
        <div style={{display: "flex"}}>
            <div style={{width:'25%'}}>
                <UserSidebar userName={users} />
            </div>
            <div style={{width:'75%'}}>
                <fieldset style={{height: '450px'}}>
                    <legend>Chat room</legend>
                    <div>
                        {messages && messages.length > 0 && messages[0].lastMessages && (
                            <div>
                                {messages[0].lastMessages.map((msg, index) => (
                                    <p key={index}>
                                        <strong>{msg.userId?.username}:</strong> {msg.message}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                </fieldset>
                <div style={{margin: '5px 5px 5px 10px'}}>
                    <input style={{width: '80%', minHeight: '30px', marginTop: '5px'}} placeholder={'Enter a message'}></input>
                    <button style={{marginLeft:'20px', padding:'7px 30px' , width:'110px'}}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Home;