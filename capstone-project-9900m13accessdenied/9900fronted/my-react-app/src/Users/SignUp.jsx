import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import ParticlesBg from 'particles-bg'
function SignUp() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirm_password, setRepassword] = React.useState('');
    const [user_type, setUsertype] = React.useState('');
    const [name, setName] = React.useState('');
    const [Message, setMessage] = React.useState('');
    const navigate = useNavigate();
    //sign up
    async function Signup() {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirm_password,
                user_type
            })
        });
        const data = await response.json();
        if (data.error) {
            setMessage(data.error);
            return;
        } else {
            setMessage(data.message)
            navigate('/login')
        }
        // if(response.ok){
        //     return <Navigate to={'/login'}/>
        // }
    }
    return (
        <>
            <h1 style={{ position: 'fixed', fontSize: '50px', justifyContent: 'center', left: '350px', color: '#333', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
                The Best Professionals Platform
            </h1>
            <br/>
            <br/>
            <br/>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <TextField
                    sx={{
                        width: 250,
                        textAlign: 'center'
                    }}
                    name="regname"
                    helperText="Please enter your name"
                    id="demo-helper-text-misaligned"
                    label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <br />
                <TextField
                    sx={{
                        width: 250,
                        textAlign: 'center'
                    }}
                    name="regemail"
                    helperText="Please enter your email"
                    id="demo-helper-text-misaligned"
                    label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <TextField
                    sx={{
                        width: 250,
                        textAlign: 'center'
                    }}
                    id="outlined-password-input"
                    type="password"
                    label="Password"
                    helperText="Please enter your password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                /><br />
                <TextField
                    sx={{
                        width: 250,
                        textAlign: 'center'
                    }}
                    id="outlined-password-input"
                    type="password"
                    label="Re-Password"
                    helperText="Confirm your password"
                    placeholder="Re-Password"
                    value={confirm_password}
                    onChange={(e) => setRepassword(e.target.value)}
                /><br />
                <FormControl sx={{ m: 1, minWidth: 250 }}>
                    <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={user_type}
                        label="UserType"
                        onChange={(e) => { setUsertype(e.target.value); console.log(e.target.value) }}
                    >
                        <MenuItem value={1}>Company User</MenuItem>
                        <MenuItem value={2}>Professional User</MenuItem>
                    </Select>
                    <FormHelperText>Chosse your user type</FormHelperText>
                </FormControl>
                <br />
                <Button variant="outlined" sx={{}} name="regbtn" onClick={Signup}>Sign Up</Button>
                <span style={{ fontSize: '12px', marginTop: '5px' }}>Already have an account? <Link href="/login">Sign in</Link></span><br />
                {
                    Message && (<div style={{ color: 'red' }}>{Message}</div>)
                }
            </div>
            <ParticlesBg type="cobweb" bg={true} />
        </>
    )
}

export default SignUp;