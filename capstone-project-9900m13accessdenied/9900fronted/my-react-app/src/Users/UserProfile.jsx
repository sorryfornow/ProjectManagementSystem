import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, TextField, Alert, Rating, Button, CardContent, Typography, List, Link, ListItem, ListItemText } from '@mui/material';
import Mail from '@mui/icons-material/Mail';


const UserProfile = () => {
    const { userName } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [projectMarks, setProjectMarks] = useState([]);

    //getprofileebyname
    async function getprofileyname() {
        const response = await fetch(`http://localhost:5000/admin-view-user-profile`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_name: userName
            })

        });
        const data = await response.json();
        if (data.code === "404") {
            return;
        } else {
            const user = data.user;
    
            // Check if user.projects_completed exists and is an array
            if (Array.isArray(user.projects_completed) && user.projects_completed.length > 0) {
                const projectNames = await Promise.all(
                    user.projects_completed.map(pid => getpjnameid(pid))
                );
                setUserProfile({ ...user, projects_completed_names: projectNames });
                
            } else {

                // Handle the case where projects_completed is not present or empty
                setUserProfile(data.user);
            }
        }
    }

    useEffect(() => {
        getprofileyname()
    }, [userName]);
    useEffect(() => {
        if (userProfile) {
            fetchProjectNames();
        }
    }, [userProfile]);
    // Edit
    const [cpassword, setCpassword] = React.useState('');
    const [emessage, setEmessage] = React.useState('');
    const [alertInfo, setAlertInfo] = React.useState('');
    async function EditCompany(uid, e) {
        const response = await fetch('http://localhost:5000/company-edit-profile', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_id: parseInt(uid, 10),
                password: cpassword,
                email: e
            })
        });
        const data = await response.json();
        if (data.code === "404") {
            setAlertInfo('error');
            setEmessage(data.message)
            return;
        } else {
            setEmessage(data.message)
            setAlertInfo('success')
        }
    }
    //edit prof
    const [editpassword, setEditPassword] = React.useState('');
    const [editmessage, setEditMessage] = React.useState('');
    async function editprofile(uid, mail, name) {
        const response = await fetch('http://localhost:5000/professional/profile/edit', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                updated_data: {
                    "email": mail,
                    "password": editpassword,
                    "prof_name": name

                },
                user_id: parseInt(uid, 10)

            })

        });
        const data = await response.json();
        if (data.code === "404") {
            setEditMessage(data.message);
            setAlertInfo('error')
            return;
        } else {
            setEditMessage(data.message)
            setAlertInfo('success')
        }
    }
    //pjname by id
    async function getpjnameid(pid) {
        const response = await fetch(`http://localhost:5000/company-view-project/${parseInt(pid, 10)}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },

        });
        const data = await response.json();
        if (data.code === "404") {
            return;
        } else {
            return data.project.project_name
        }
    }


    if (!userProfile) {
        return <Typography>Project not found</Typography>;
    }

    const isCompanyUser = userProfile.user_type === 1;
    // const fetchProjectNames = async () => {
    //     const markEntries = Object.entries(userProfile.mark_list || {});
    //     const projectNames = await Promise.all(markEntries.map(async ([projectId, mark]) => {
    //         const projectName = await getpjnameid(projectId);
    //         return { id: projectId, name: projectName, mark };
    //     }));

    //     setProjectMarks(projectNames);
    // };
    const fetchProjectNames = async () => {
        if (userProfile && userProfile.mark_list) {
            const markEntries = Object.entries(userProfile.mark_list);
            const projectNames = await Promise.all(markEntries.map(async ([projectId, mark]) => {
                const projectName = await getpjnameid(projectId);
                return { id: projectId, name: projectName, mark };
            }));
            setProjectMarks(projectNames);
        }
    };

    // const renderMarkList = () => {
    //     if (projectMarks.length === 0) {
    //         return <ListItemText primary="No ratings yet" />;
    //     }
    //     return projectMarks.map((project, index) => (
    //         <ListItem key={index}>
    //             <Link href={`/projects/${project.id}`}><ListItemText primary={`Project: ${project.name}`} /></Link>
    //             <Rating name="read-only" value={project.mark} readOnly />
    //         </ListItem>
    //     ));
    // };
    const renderMarkList = () => {
        if (!userProfile || !userProfile.mark_list || projectMarks.length === 0) {
            return <ListItemText primary="No rating yet" />;
        }
        return projectMarks.map((project, index) => (
            <ListItem key={index}>
                Project:<Link href={`/projects/${project.id}`}><ListItemText primary={ project.name} /></Link>
                <Rating name="read-only" value={project.mark} readOnly />
            </ListItem>
        ));
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        User Profile
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary="User ID" secondary={userProfile.uid} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="User Name" secondary={userName} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Email" secondary={userProfile.email} />
                        </ListItem>
                        {isCompanyUser ? (
                            <>

                                PASSWORD:<br /><TextField
                                    sx={{
                                        width: 250,
                                        textAlign: 'center'
                                    }}
                                    id="outlined-password-input"
                                    type="password"
                                    label="Password"
                                    helperText="enter company password"
                                    placeholder="Password"
                                    value={cpassword}
                                    onChange={(e) => setCpassword(e.target.value)} />
                                <br />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={() => { EditCompany(userProfile.uid,userProfile.email) }}
                                >
                                    Update
                                </Button>
                                {emessage && (
                                    <Box mt={2} width="100%">
                                        <Alert severity={alertInfo}>{emessage}</Alert>
                                    </Box>
                                )}
                            </>
                        ) : (
                            <>
                            <ListItem>
                            <ListItemText primary="Mark List" />
                            <List>
                                {renderMarkList()}
                            </List>
                        </ListItem>
                                PASSWORD:<br /><TextField
                                    sx={{
                                        width: 250,
                                        textAlign: 'center'
                                    }}
                                    id="outlined-password-input"
                                    type="password"
                                    label="Password"
                                    helperText="enter prof password"
                                    placeholder="Password"
                                    value={editpassword}
                                    onChange={(e) => setEditPassword(e.target.value)} />
                                <br />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={() => { editprofile(userProfile.uid, userProfile.email, userName) }}
                                >
                                    Update
                                </Button>
                                {editmessage && (
                                    <Box mt={2} width="100%">
                                        <Alert severity={alertInfo}>{editmessage}</Alert>
                                    </Box>
                                )}

                            </>
                        )}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default UserProfile;
