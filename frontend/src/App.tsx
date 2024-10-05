import './App.css'
import Navbar from "./components/Navbar.tsx";
import {Route, Routes} from "react-router-dom";
import Home from './containers/Home.tsx';
import Registration from "./containers/Auth/Registration.tsx";
import Login from './containers/Auth/Login.tsx';

const App = () => {

    return (
        <>
            <div>
                <Navbar />
            </div>
            <div>
                <Routes>
                    <Route path="/" element={(
                        <Home/>
                    )}/>
                    <Route path="/login" element={(
                        <Login/>
                    )}/>
                    <Route path="/reg" element={(
                        <Registration/>
                    )}/>
                </Routes>
            </div>
        </>
    )
}


export default App
