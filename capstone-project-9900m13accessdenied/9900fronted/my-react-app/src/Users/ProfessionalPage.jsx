import React, { useEffect } from 'react';
import { List } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import PageviewIcon from '@mui/icons-material/Pageview';
import ArticleIcon from '@mui/icons-material/Article';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import TaskIcon from '@mui/icons-material/Task';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SearchIcon from '@mui/icons-material/Search';
import MailIcon from '@mui/icons-material/Mail';
import Rating from '@mui/material/Rating';
import { Typography, Divider, Tooltip, Paper, Container, Box, TextField, InputAdornment, IconButton, Grid } from '@mui/material';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useParams, BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import './sidebar.css'
function ProfessionalDashboard() {
    //show side bar function
    const [div1visible, setDiv1] = React.useState(false);
    const [div2visible, setDiv2] = React.useState(false);
    const [div3visible, setDiv3] = React.useState(false);//available

    const [div4visible, setDiv4] = React.useState(false);
    const [div5visible, setDiv5] = React.useState(false);
    const [div6visible, setDiv6] = React.useState(false);
    const [greeting, setGreeting] = React.useState('');
    const { email } = useParams();
    //Available Project
    const [availableprojectmessge, setAvaliableProjectMessage] = React.useState('');
    const [availableprojects, setAvaliableProjects] = React.useState([]);
    //search by name
    const [availablesearchname, setAvaliableSearchName] = React.useState('');

    //Aplly Project
    // const [applyuserid, setApplyUserid] = React.useState('');
    const [applyprojectid, SetApplyProjectid] = React.useState('');
    const [applymessage, setApplyMessage] = React.useState('');

    //View applied projects
    const [appliedproject, setAppliedProject] = React.useState([]);
    const [appliedprojectmessage, setAppliedProjectMessage] = React.useState('');

    //View completed projects
    const [completedproject, setCompletedProject] = React.useState([]);
    const [completedprojectmessage, setCompletedProjectMessage] = React.useState('');

    //Show professional user profile******************
    // const [show_user_id, setShow_User_Id] = React.useState('');
    const [showusermessage, setShowUserMessage] = React.useState('');
    const [showprofprofile, setShowProfProfile] = React.useState('');

    //Edit prof profile
    const [editname, setEditName] = React.useState('');
    const [editpassword, setEditPassword] = React.useState('');
    const [editemail, setEditMail] = React.useState('')
    const [editid, setEditId] = React.useState('');
    const [editmessage, setEditMessage] = React.useState('');
    //message
    const [sendmessageopen, setsendmessageOpen] = React.useState(false);
    const handlesendmessageOpen = (name) => {
        getuidbyname(name);
        setSendMessageError('')
        setsendmessageOpen(true);
    };
    const handlesendmessageClose = () => setsendmessageOpen(false);
    //showprofile
    const [profileopen, setProfileOpen] = React.useState(false)
    const handleshowprofileOpen = () => setProfileOpen(true);
    const handleshowprofileClose = () => setProfileOpen(false);

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const [alertopen, setAlertOpen] = React.useState(false);
    const [alerttype, setAlertType] = React.useState('error');

    const alerthandleClick = () => {
        setAlertOpen(true);
    };

    const alerthandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setAlertOpen(false);
    };



    //logout
    function logout() {
        localStorage.removeItem('type')
        localStorage.removeItem('uid')
        localStorage.removeItem('companyusername')
        window.location.href = '/login'
    }
    //show profile
    const showDiv1 = () => {
        showprofile();
        setDiv1(true);
        setDiv2(false);
        setDiv3(false);
        handleshowprofileOpen();

        setDiv4(false);
        setDiv5(false);
        setDiv6(false);
    };
    //edit proefile
    const showDiv2 = () => {
        setDiv1(false);
        setDiv2(true);
        setDiv3(false);
        handleshowprofileClose()
        setDiv4(false);
        setDiv5(false);
        setDiv6(false);

    };
    //avaliable project
    const showDiv3 = () => {
        availableproject();
        setDiv1(false);
        setDiv2(false);
        setDiv3(true);

        setDiv4(false);
        setDiv5(false);
        setDiv6(false);

    };


    //message
    const showDiv4 = () => {
        setDiv1(false);
        setDiv2(false);
        setDiv3(false);
        fetchAndPairMessages(parseInt(localStorage.getItem('uid')));


        setDiv4(true);
        setDiv5(false);
        setDiv6(false);

    };
    //applied project
    const showDiv5 = () => {
        viewappliedproject();
        setDiv1(false);
        setDiv2(false);
        setDiv3(false);

        setDiv4(false);
        setDiv5(true);
        setDiv6(false);

    };
    //completed project
    const showDiv6 = () => {
        viewcompletedproject();
        setDiv1(false);
        setDiv2(false);
        setDiv3(false);

        setDiv4(false);
        setDiv5(false);
        setDiv6(true);

    };
    // greeting function
    function getGreeting() {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        if (currentHour < 12) {
            setGreeting('Good morning, ');
        } else if (currentHour < 18) {
            setGreeting('Good afternoon, ');
        } else {
            setGreeting('Good evening, ');
        }
    }
  
    //Available Projects
    async function availableproject() {
        const response = await fetch('http://localhost:5000/search_projects', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.error) {
            setAvaliableProjectMessage(data.error);
            return;
        } else {
            setAvaliableProjects(data)

        }
        if (Array.isArray(data) && data.length === 0) {
            setAvaliableProjectMessage('No completed projects found.');
        }
    }
    //search by name
    async function availableprojectsearchbyname() {
        const response = await fetch(`http://localhost:5000/search_projects?search=${availablesearchname}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        const data = await response.json();
        if (data.error) {
            setAvaliableProjectMessage(data.error);
            return;
        } else {
            setAvaliableProjects(data)

        }
        if (Array.isArray(data) && data.length === 0) {
            setAvaliableProjectMessage('No completed projects found.');
        }

    }
    //getprojectnamebyid
    async function getpjnamebyid(pid) {
        const response = await fetch(`http://localhost:5000/company-view-profile/${parseInt(pid, 10)}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },

        });
        const data = await response.json();
        if (data.error) {
            return;
        } else {
            return data.project.project_name
        }
    }
    //getname by uid
    async function getnamebyuid(uid) {
        const response = await fetch(`http://localhost:5000/company-view-profile/${parseInt(uid, 10)}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },

        });
        const data = await response.json();
        if (data.error) {
            return;
        } else {
            return data.company.company_name
        }
    }


    // Apply Project
    async function applyproject(projectname) {
        const response = await fetch(`http://localhost:5000/project/apply/${projectname}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',

            },
            body: JSON.stringify({
                user_id: parseInt(localStorage.getItem('uid'), 10)

            })
        });
        const data = await response.json();
        if (data.code === "404") {
            alerthandleClick();
            setApplyMessage(data.message);
            setAlertType('error')
            return;
        } else {
            alerthandleClick();
            setAlertType('success')
            setApplyMessage(data.message)

        }
    }

    //View Applied Project
    async function viewappliedproject() {
        const response = await fetch('http://localhost:5000/professional/applied_projects', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_id: parseInt(localStorage.getItem('uid'), 10),
            })
        });
        const data = await response.json();
        if (data.code === "404") {
            setAppliedProjectMessage(data.message)
            setAlertType('error')
            return
        } else {
            setAppliedProject(data);
            setAppliedProjectMessage(data.message)
            setAlertType('')
        }
    }

    //View completed projects
    async function viewcompletedproject() {
        const response = await fetch('http://localhost:5000/professional/completed_projects', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_id: parseInt(localStorage.getItem('uid'), 10),
            })
        });
        const data = await response.json();

        if (data.code === "404") {
            setCompletedProjectMessage(data.message);
            setAlertType('error')
            return;
        } else {
            setAlertType('')
            setCompletedProject(data)

        }
    }
    //rate project
    const [starvalue,setStarValue]=React.useState(0);
    const [ratemessage, setRateMessage] = React.useState('');
    const handleRatingChange = async (projectId, newRating) => {
        const response = await fetch('http://localhost:5000/professional-rate-project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                project_id: projectId,
                user_id: parseInt(localStorage.getItem('uid'), 10),
                rating: parseInt(newRating, 10),
            }),
        });

        const result = await response.json();
        // Handle the response from the server
        if (result.code === "404") {
            setRateMessage(result.message)
            setAlertType('error')
        } else {
           // setRateMessage(result.message)
           // setAlertType('success')

        }
    };



    //Show professional user profile
    async function showprofile() {
        const response = await fetch('http://localhost:5000/professional/profile', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_id: parseInt(localStorage.getItem('uid'), 10),
                // user_id:show_user_id
            })
        });
        const data = await response.json();
        if (data.error) {
            setShowUserMessage(data.message);
            return;
        } else {
            setShowUserMessage(data.message)
            setShowProfProfile(data)
        }
    }


    //Edit prof profile
    async function editprofile() {
        const response = await fetch('http://localhost:5000/professional/profile/edit', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                updated_data: {
                    "email": editemail,
                    "password": editpassword,
                    "prof_name": editname
                },
                user_id: parseInt(localStorage.getItem('uid'), 10)

            })

        });
        const data = await response.json();
        if (data.code === "404") {
            setEditMessage(data.message);
            setAlertType('error')
            return;
        } else {
            setEditMessage(data.message)
            setAlertType('success')
        }
    }
    //get uid by name
    async function getuidbyname(companyuser_name) {
        const response = await fetch('http://localhost:5000/view-profile-by-name', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_name: companyuser_name
            })
        });
        const data = await response.json();
        if (data.error) {

            return;
        } else {

            localStorage.setItem('companyusername', parseInt(data.user.uid, 10))
            console.log(data)
        }
    }

    //send message
    const [sendmessage, setSendMessage] = React.useState('');
    const [sendmessageerror, setSendMessageError] = React.useState('');
    async function Sendmessage() {
        if (sendmessage.trim() === '') {
            setSendMessageError('Message content cannot be empty.');
            setAlertType('error')
            return;
        }
        const response = await fetch('http://localhost:5000/send-message', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                recipient_id: parseInt(localStorage.getItem('companyusername'), 10),
                sender_id: parseInt(localStorage.getItem('uid'), 10),
                message: sendmessage

            })

        });
        const data = await response.json();

        if (data.code === "404") {
            setSendMessageError(data.message)
            setAlertType('error')
            return;
        } else {
            setSendMessageError(data.message)
            setAlertType('success')
            localStorage.removeItem('companyusername')

        }
    }
   

    //view all message
    const [conversations, setConversations] = React.useState([]);
    const [selectedConversation, setSelectedConversation] = React.useState(null);
    const pairMessages = (sent, received) => {
        const reversedSent = [...sent].reverse();
        const reversedReceived = [...received].reverse();

        const pairs = reversedSent.map((s, index) => ({
            sent: s,
            received: reversedReceived[index] || { message: 'Waiting for reply...' },
        }));

        return pairs.reverse();
    };

    const fetchAndPairMessages = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/view-message/${userId}`);
            const { sent, received } = response.data.messages;

            // Extract unique user IDs from sent and received messages
            const uniqueUserIds = new Set([
                ...sent.map((message) => message.recipient),
                ...received.map((message) => message.sender),
            ]);

            // Create conversations based on unique user IDs
            const conversations = await Promise.all(Array.from(uniqueUserIds).map(async (conversationUserId) => {
                const sentMessages = sent.filter((message) => message.recipient === conversationUserId);
                const receivedMessages = received.filter((message) => message.sender === conversationUserId);
                const compName = await getnamebyuid(conversationUserId) || `UID:${conversationUserId}`;

                return {
                    userId: conversationUserId,
                    userName: compName,
                    messages: pairMessages(sentMessages, receivedMessages),
                };
            }));

            setConversations(conversations);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    useEffect(() => {
        showDiv3();
    }, [])
    //receive adminmsg
    const [adminmsg, setAdminMsg] = React.useState([])
    const [openadminmsgModal, setOpenadminmsgModal] = React.useState(false);
    async function getadminmsg() {
        const response = await fetch(`http://localhost:5000/view-message/${parseInt(localStorage.getItem('uid'), 10)}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },

        });
        const data = await response.json();
        if (data.code === "404") {
            return;
        } else {
            const filteredMessages = data.messages.received.filter(msg => msg.sender === 1);
            setAdminMsg(filteredMessages);
        }
    }
    useEffect(()=>{
    getadminmsg() 
    },[])
    const modaladminmsgStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };






    return (
        <>
            {/* Header */}
            <header>
                <div className='navbar' style={{
                    position: 'fixed',
                    backgroundImage: 'url("https://images.pexels.com/photos/313563/sand-pattern-wave-texture-313563.jpeg?auto=compress&cs=tinysrgb&w=800")',
                    alignItems: 'center',
                    display: 'flex', left: 0, right: 0, height: "70px",
                    justifyContent: 'space-between'
                }}>
                    <h2 style={{ color: "black", marginLeft: '25px' }}>Professional Dashboard</h2>
                    <Button sx={{ left: '180px' }} onClick={() => setOpenadminmsgModal(true)}><MarkunreadIcon /></Button>
                    <h4 style={{ color: "black", marginRight: '30px' }}>{greeting}{email}</h4>
                </div>
            </header>
            <div>
               
                <Modal
                    open={openadminmsgModal}
                    onClose={() => setOpenadminmsgModal(false)}
                    aria-labelledby="modal-title"
                >
                    <Box sx={modaladminmsgStyle}>
                        <Typography id="modal-title" variant="h6" component="h2">
                            Received Messages from Sender 1
                        </Typography>
                        {adminmsg.length > 0 ? (
                        <ul>
                            {adminmsg.map((message, index) => (
                                <li key={index}>
                                    <p><strong>Message:</strong> {message.message}</p>
                                    <p><strong>Timestamp:</strong> {new Date(message.timestamp).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                        ):(
                            <Typography variant="subtitle1">No announcement</Typography>
                        )}
                    </Box>
                </Modal>
            </div>
            {/* Side Bar */}
            <div className='sidebar'>
                <List>
                    <ListItem>
                        <ListItemButton onClick={showDiv1}>
                            <AssignmentIndIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Show Profile" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv2}>
                            <ModeEditIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Edit Profile" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv3}>
                            <ArticleIcon /><ListItemText sx={{ textAlign: 'center' }} primary="Available Projects" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv4}>
                            <MailIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Message Box" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv5}>
                            <PageviewIcon /><ListItemText sx={{ textAlign: 'center' }} primary="View applied project" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv6}>
                            <TaskIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="View completed project" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)', borderBottom: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={logout}>
                            <ExitToAppIcon /><ListItemText sx={{ textAlign: 'center' }} primary="Logout" />
                        </ListItemButton>
                    </ListItem>

                </List>
            </div>
            {/* Content */}
            <div className='div1' style={{ display: div1visible ? 'block' : 'none', position: 'fixed', height: '650px', width: '1110px', top: '90px', left: '270px', border: '1px solid', overflow: 'auto' }}>
                <Modal
                    open={profileopen}
                    onClose={handleshowprofileClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {showprofprofile && (
                                <>
                                    <Typography variant="h6">
                                        Name: {showprofprofile.prof_name}
                                    </Typography>
                                    <Typography variant="h6">
                                        Email: {showprofprofile.email}
                                    </Typography>
                                    <Rating_in_profile_Component showprofprofile={showprofprofile} />
                                    <br />
                                    <Button variant="contained" color="primary" onClick={showDiv2}>
                                        Edit
                                    </Button>
                                </>

                            )}
                        </Typography>
                    </Box>
                </Modal>



            </div >
            <div className='div2' style={{ display: div2visible ? 'block' : 'none', position: 'fixed', height: '650px', width: '1110px', top: '90px', paddingLeft: '10px', left: '270px', border: '1px solid', overflow: 'auto' }}>

                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h4">
                            Edit Profile
                        </Typography>

                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoComplete="name"
                                value={editname}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={editemail}
                                onChange={(e) => setEditMail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={editpassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={editprofile}
                            >
                                Edit
                            </Button>
                        </Box>

                        {editmessage && (
                            <Box mt={2} width="100%">
                                <Alert severity={alerttype}>{editmessage}</Alert>
                            </Box>
                        )}
                    </Box>
                </Container>

            </div>

            <div className='div3' style={{ display: div3visible ? 'block' : 'none', position: 'fixed', height: '650px', width: '1110px', top: '90px', left: '270px', paddingLeft: '10px', overflow: 'auto' }}>
                <Box sx={{ mt: 3, mb: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Find a Project?
                    </Typography>

                    <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                        <TextField
                            label="Search by project name"
                            variant="outlined"
                            className='searchByName'
                            value={availablesearchname}
                            onChange={(e) => setAvaliableSearchName(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={availableprojectsearchbyname}>
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"><strong>Company User Name</strong></TableCell>
                                    <TableCell align="center"><strong>Project Name</strong></TableCell>
                                    <TableCell align="center"><strong>Start Date</strong></TableCell>
                                    <TableCell align="center"><strong>End Date</strong></TableCell>
                                    <TableCell align="center"><strong>Apply</strong></TableCell>
                                    <TableCell align="center"><strong>Contact</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(availableprojects ?? []).length > 0 ? availableprojects.map((project, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{project.company_name}</TableCell>
                                        {/* <TableCell align="center">{project.project_name}</TableCell> */}
                                        <TableCell align="center">
                                            <Tooltip title={project.description}>
                                                <span>{project.project_name}</span> {/* Tooltip needs a child element like span to work */}
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell align="center">{project.start_date}</TableCell>
                                        <TableCell align="center">{project.end_date}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" color="primary" onClick={() => applyproject(project.project_name)}>
                                                Apply
                                            </Button>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" color="primary" onClick={() => handlesendmessageOpen(project.company_name)}>
                                                Contact
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (<TableRow>
                                    <TableCell colSpan="the number of columns in your table">
                                        No projects found.
                                    </TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                {/* apply alert at the bottom */}
                {/* <Stack spacing={2} sx={{ width: '50px', position: 'fixed', top: '90px' }}>
                    <Snackbar open={alertopen} autoHideDuration={5000} onClose={alerthandleClose}>
                        <Alert onClose={alerthandleClose} severity={alerttype} sx={{ width: '100%' }}>
                            {applymessage}
                        </Alert>
                    </Snackbar>
                </Stack> */}
                {applymessage && (
                    <Box mt={2} width="100%">
                        <Alert severity={alerttype}>{applymessage}</Alert>
                    </Box>
                )}

                {/* send message */}
                <Modal
                    open={sendmessageopen}
                    onClose={handlesendmessageClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Send Message
                        </Typography>
                        <Box id="modal-modal-description" sx={{ mt: 2 }}>
                            <TextField
                                sx={{ width: "400px" }}
                                id="outlined-multiline-static"
                                multiline
                                rows={4}
                                onChange={(e) => { setSendMessage(e.target.value) }}
                            />
                            <br />
                            <br />
                            <Button variant="outlined" onClick={Sendmessage}>Send</Button>
                            {sendmessageerror && (
                                <Box mt={2} width="100%">
                                    <Alert severity={alerttype}>{sendmessageerror}</Alert>
                                </Box>
                            )}


                        </Box>
                    </Box>
                </Modal>



                {
                    availableprojectmessge && (<div style={{ color: 'red' }}>{availableprojectmessge}</div>)
                }

            </div>


            <div className='div4' style={{ display: div4visible ? 'block' : 'none', position: 'fixed', height: '650px', width: '1100px', top: '90px', paddingLeft: '10px', left: '270px', border: '1px solid', overflow: 'auto' }}>

                <h1>Message Box</h1>
                <List component="nav">
                    {conversations.map((conversation, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemButton onClick={() => setSelectedConversation(conversation)}>
                                    <ListItemText primary={`Conversation with UID: ${conversation.userName}`} />
                                </ListItemButton>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>

                {selectedConversation && (
                    <div>
                        <h1>Messages with UID: {selectedConversation.userId}</h1>
                        <Grid container spacing={2}>
                            {selectedConversation.messages.map((pair, index) => (
                                <React.Fragment key={index}>
                                    <Grid item xs={6}>
                                        <List>
                                            <ListItem>
                                                <ListItemText primary={`Sent: ${pair.sent.message}`} secondary={new Date(pair.sent.timestamp).toLocaleString()} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <List>
                                            <ListItem>
                                                <ListItemText primary={`Received: ${pair.received.message}`} secondary={new Date(pair.received.timestamp).toLocaleString() || ''} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </div>
                )}


            </div>

            <div className='div5' style={{ display: div5visible ? 'block' : 'none', position: 'fixed', height: '650px', width: '1110px', top: '90px', paddingLeft: '10px', left: '270px', overflow: 'auto' }}>
                <h1>Applied Projects</h1>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>Company User Name</strong></TableCell>
                                <TableCell align="center"><strong>Project Name</strong></TableCell>
                                <TableCell align="center"><strong>Start Date</strong></TableCell>
                                <TableCell align="center"><strong>End Date</strong></TableCell>
                                <TableCell align="center"><strong>Status</strong></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appliedproject.length > 0 ? (
                                appliedproject.map((project, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{project.company_name}</TableCell>
                                        <TableCell align="center">{project.project_name}</TableCell>
                                        <TableCell align="center">{project.start_date}</TableCell>
                                        <TableCell align="center">{project.end_date}</TableCell>
                                        <TableCell align="center">{project.status}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell align="center" colSpan={5}>No applied projects</TableCell>
                                </TableRow>
                            )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                {appliedprojectmessage && (
                    <Box mt={2} width="100%">
                        <Alert severity={alerttype}>{appliedprojectmessage}</Alert>
                    </Box>
                )}

            </div>

            <div className='div6' style={{ display: div6visible ? 'block' : 'none', position: 'fixed', height: '650px', width: '1100px', top: '90px', paddingLeft: '10px', left: '270px', border: '1px solid', overflow: 'auto' }}>
                <h1>Completed Projects</h1>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><strong>Project ID</strong></TableCell>
                                <TableCell align="center"><strong>Company Name</strong></TableCell>
                                <TableCell align="center"><strong>Project Name</strong></TableCell>
                                <TableCell align="center"><strong>Start Date</strong></TableCell>
                                <TableCell align="center"><strong>End Date</strong></TableCell>
                                <TableCell align="center"><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Rating</strong></TableCell>


                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {completedproject.length > 0 ? (
                                completedproject.map((project, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{project.project_id}</TableCell>
                                        <TableCell align="center">{project.company_name}</TableCell>
                                        <TableCell align="center">{project.project_name}</TableCell>
                                        <TableCell align="center">{project.start_date}</TableCell>
                                        <TableCell align="center">{project.end_date}</TableCell>
                                        <TableCell align="center">{project.status}</TableCell>
                                        <TableCell align="center">
                                            <Rating
                                                name="rating"
                                                value={starvalue[project.project_id]||0} // Assuming the rating is out of 10, divide by 2 for a 5-star scale
                                                precision={0.5}
                                                onChange={(event, newValue) => {
                                                    setStarValue(prevRatings => ({ ...prevRatings, [project.project_id]: newValue }));
                                                    // Call a function to handle the rating change
                                                    handleRatingChange(project.project_id, newValue * 2);

                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell align="center" colSpan={5}>No completed projects</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {completedprojectmessage && (
                    <Box mt={2} width="100%">
                        <Alert severity={alerttype}>{completedprojectmessage}</Alert>
                    </Box>
                )}
                {ratemessage && (
                    <Box mt={2} width="100%">
                        <Alert severity={alerttype}>{ratemessage}</Alert>
                    </Box>
                )}


            </div>
            {/* Footer */}
            <footer>
                <div className='footer' style={{ position: 'absolute', bottom: 0, color: 'lightgray', height: '10px', textAlign: 'center', padding: '10px', width: '100%', backgroundColor: 'rgb(34,34,34)' }}>&copy;9900 Professional Dashboard</div>
            </footer>

        </>

    );


}
function Rating_in_profile_Component({ showprofprofile}) {
    const [projectNames, setProjectNames] = React.useState({});
       //getname by uid
       async function getnamebyuid(uid) {
        const response = await fetch(`http://localhost:5000/company-view-project/${parseInt(uid, 10)}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },

        });
        const data = await response.json();
        if (data.error) {
            return;
        } else {
            
            return data.project.project_name
            
        }
    }
    
    useEffect(() => {
      async function fetchProjectNames() {
        const projectNamesMap = {};
  
        for (const id of Object.keys(showprofprofile.mark_list)) {
          projectNamesMap[id] = await getnamebyuid(id);
        }
        
        setProjectNames(projectNamesMap);
      }
  
      if (Object.keys(showprofprofile.mark_list).length > 0) {
        fetchProjectNames();
      }
    }, [showprofprofile.mark_list]);
  
    return (
      <Typography>
        {Object.entries(showprofprofile.mark_list).map(([id, mark]) => (
          <Typography key={id}>
            Project: {projectNames[id] || 'Loading...'}, Mark: 
            <Rating sx={{ top: '5px' }} name="read-only" value={mark / 2} readOnly />
          </Typography>
        ))}
      </Typography>
    );
  }

export default ProfessionalDashboard;
