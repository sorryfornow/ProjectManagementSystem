import React, { useRef, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import ParticlesBg from 'particles-bg'

function LoginPage({ E }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [user_type, setUsertype] = React.useState('');
  const [Message, setMessage] = React.useState('');



  //login
  async function login() {
    const response = await fetch('http://localhost:5000/', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        user_type
      })
    });
    const data = await response.json();
    if (data.error) {
      setMessage(data.error);
      return;
    } else {
      setMessage(data.message)
      console.log(data)
      localStorage.setItem('type', data['user-type'])
      localStorage.setItem('uid', data['token'])
      localStorage.setItem('email', email)

    }
  }
  if (localStorage.getItem('type') === "1") {
    // return <Navigate to={`/companydashboard`} />
    //window.location.href = `/companydashboard/${email}`
    return <Navigate to={`/companydashboard`} />
  }
  if (localStorage.getItem('type') === "2") {
    return <Navigate to={`/professionaldashboard/${email}`} />
  }
  if (localStorage.getItem('type') === "3") {
    return <Navigate to={`/admin`} />
  }


  return (
    <>

      
        <h1 style={{position:'fixed', fontSize: '50px',justifyContent: 'center', left:'350px',color: '#333', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
          The Best Professionals Platform
        </h1>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <TextField
          sx={{
            width: 250,
            textAlign: 'center'
          }}
          name="logemail"
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
            <MenuItem value={3}>Admin</MenuItem>
            
          </Select>
          <FormHelperText>Chosse your user type</FormHelperText>
        </FormControl>

        <Button variant="outlined" sx={{}} name="loginbtn" onClick={login}>Sign in</Button>
        <span style={{ fontSize: '12px', marginTop: '5px' }}><Link href="/register">Create an account</Link></span><br />
        {
          Message && (<div style={{ color: 'red' }}>{Message}</div>)
        }
      </div>
      <ParticlesBg type="cobweb" bg={true} />


    </>
  )
}

export default LoginPage;
