import {AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

const Navbar = () => {

    const userData = true;

    return (
        <div>
            <AppBar position="static" sx={{backgroundColor:'#424242' , minWidth:'1000px'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <NavLink to={'/'} style={{textDecoration:'none', color:'white'}}>
                            MessengerWS
                        </NavLink>
                    </Typography>
                    {userData? (
                        <div style={{display:'flex', alignItems:'center'}}>
                            <p style={{fontSize:'18px', marginTop:'15px', marginRight:'10px'}}>Welcome, koog7!</p>
                            <Button color="inherit">Log out</Button>
                        </div>
                    ):(
                        <div>
                            <NavLink to={'/login'}>
                                <Button color="inherit">Log in</Button>
                            </NavLink>
                            <NavLink to={'/reg'}>
                                <Button color="inherit">Sign up</Button>
                            </NavLink>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Navbar;