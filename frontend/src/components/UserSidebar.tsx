import {NavLink} from "react-router-dom";

const UserSidebar = () => {
    return (
        <div>
            <fieldset style={{minHeight:'500px'}}>
                <legend style={{margin:'0 auto'}}>Online users</legend>

                <div style={{display:"flex", flexDirection:"column"}}>
                    <NavLink className={'users-online'} to={'/1'}>Bo Sinn</NavLink>
                    <NavLink className={'users-online'} to={'/2'}>Bo Sinn</NavLink>
                    <NavLink className={'users-online'} to={'/3'}>Bo Sinn</NavLink>
                </div>
            </fieldset>
        </div>
    );
};

export default UserSidebar;