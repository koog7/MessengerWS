import UserSidebar from "../components/UserSidebar.tsx";
import {useParams} from "react-router-dom";

const Home = () => {

    const {id} = useParams();

    return (
        <div style={{display: "flex"}}>
            <div style={{width:'25%'}}>
                <UserSidebar />
            </div>
            <div style={{width:'75%'}}>
                <fieldset style={{height: '450px'}}>
                    <legend>Chat room</legend>
                    <p>Room id - {id}</p>
                    <div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span>User1:</span>
                            <p>Test message</p>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span>User2:</span>
                            <p>Test message</p>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <span>User3:</span>
                            <p>Test message</p>
                        </div>
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