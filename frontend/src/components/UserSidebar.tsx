import React from "react";

interface Props {
    userName: string[];
}

const UserSidebar:React.FC<Props> = ({userName}) => {
    return (
        <div>
            <fieldset style={{minHeight:'500px'}}>
                <legend style={{margin:'0 auto'}}>Online users</legend>

                <div style={{display:"flex", flexDirection:"column"}}>
                    {userName.map((user, index) => (
                        <p key={index} className={'users-online'}>{user}</p>
                    ))}
                </div>
            </fieldset>
        </div>
    );
};

export default UserSidebar;