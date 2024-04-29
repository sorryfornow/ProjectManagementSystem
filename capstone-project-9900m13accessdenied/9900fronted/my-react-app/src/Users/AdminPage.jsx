import React, { useEffect, useRef } from 'react';
import { List } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PersonAddIcon from '@mui/icons-material/PersonAddAltOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined';
import axios from 'axios';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import {
  TableContainer,
  Grid,
  Divider,
  Checkbox,
  Select,
  MenuItem,
  Alert,
  Container,
  Modal,
  Button,
  TextField,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Collapse,
  Link,
  Box,
  Table as InnerTable,
  TableHead as InnerTableHead,
  TableRow as InnerTableRow,
  TableCell as InnerTableCell
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
function AdminPage() {
  const navigate = useNavigate();
  //show/hide sidebar content
  const [div1visible, setDiv1] = React.useState(false);

  const [div2visible, setDiv2] = React.useState(false);
  const [div3visible, setDiv3] = React.useState(false);
  const [div4visible, setDiv4] = React.useState(false);
  const [div5visible, setDiv5] = React.useState(false);

  const [alertType, setAlertType] = React.useState('info');
  const showDiv1 = () => {
    setDiv1(true);

    viewallcompanyuser()
    setDiv2(false);
    setDiv3(false);
    setDiv4(false);
    setDiv5(false);



  };
  const showDiv2 = () => {
    setDiv1(false);

    setDiv2(true);
    viewallprofuser()
    setDiv3(false);
    setDiv4(false);
    setDiv5(false);
  };
  const showDiv3 = () => {
    setDiv1(false);
    getallprojects();
    setDiv2(false);
    setDiv3(true);
    setDiv4(false);
    setDiv5(false);
  };
  const showDiv4 = () => {
    setDiv1(false);

    setDiv2(false);
    setDiv3(false);
    setDiv4(true);
    setDiv5(false);
  };
  const showDiv5 = () => {
    setDiv1(false);

    setDiv2(false);
    setDiv3(false);
    setDiv4(false);
    setDiv5(true);
    viewallapplications()
  };
  useEffect(() => {
    showDiv1()
  }, [])



  const logout = () => {
    localStorage.removeItem('type')
    localStorage.removeItem('uid')
    localStorage.removeItem('email')
    window.location.href = '/login'
  };
  //view all company user
  const [viewcompanyuser, setViewCompanyUser] = React.useState([])
  const [viewcompanyusermessage, setViewCompanyUserMessage] = React.useState('')
  async function viewallcompanyuser() {
    const response = await fetch(`http://localhost:5000/admin-view-company-users`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',

      },
    });
    const data = await response.json();
    if (data.code === "404") {

      setViewCompanyUserMessage(data.message);
      setAlertType('error')
      return;
    } else {
      const usersWithProjectDetails = await Promise.all(data.users.map(async (user) => {
        const projects = await Promise.all(user.projects.map(async (pid) => {
          const projectName = await getpjnameid(pid);
          return { id: pid, name: projectName || `Unknown (${pid})` }; // Object with both ID and name
        }));

        return { ...user, projects };
      }));
      setAlertType('')

      setViewCompanyUser(usersWithProjectDetails);
    }
  }
  React.useEffect(() => {
    setFilteredUsers(viewcompanyuser);
  }, [viewcompanyuser]);

  //view all prof user
  const [viewprofuser, setViewProfUser] = React.useState([])
  const [viewprofusermessage, setViewProfUserMessage] = React.useState('')
  async function viewallprofuser() {
    const response = await fetch(`http://localhost:5000/admin-view-professional-users`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',

      },
    });
    const data = await response.json();
    if (data.code === "404") {
      setViewProfUserMessage(data.message);
      setAlertType('error')
      return;
    } else {
      const usersWithProjectDetails = await Promise.all(data.users.map(async (user) => {
        const projectsApplied = await Promise.all(user.projects_applied.map(async (pid) => {
          const projectName = await getpjnameid(pid);
          console.log(`Project Name for ID ${pid}:`, projectName);
          return { id: pid, name: projectName || `Unknown (${pid})` };
        }));

        const projectsCompleted = await Promise.all(user.projects_completed.map(async (pid) => {
          const projectName = await getpjnameid(pid);
          console.log(`Project Name for ID ${pid}:`, projectName);
          return { id: pid, name: projectName || `Unknown (${pid})` };
        }));

        return { ...user, projects_applied: projectsApplied, projects_completed: projectsCompleted };
      }));
      setAlertType('')
      setViewProfUser(usersWithProjectDetails);
    }
  }
  React.useEffect(() => {
    setFilteredProfUsers(viewprofuser);
  }, [viewprofuser]);

  //search user
  const [searchname, setSearchName] = React.useState('');
  const [searchmessage, setSearchMessage] = React.useState('');
  const [filteredUsers, setFilteredUsers] = React.useState(viewcompanyuser);
  const handleSearch = () => {
    if (searchname.trim() === '') {
      setFilteredUsers(viewcompanyuser); // If the search field is empty, show all users
    } else {
      const filtered = viewcompanyuser.filter(user =>
        user.company_name.toLowerCase().includes(searchname.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };
  const handleReset = () => {
    setSearchName(''); // Clear the search input
    setFilteredUsers(viewcompanyuser); // Reset the filtered users to show all users
  };

  //search prof
  const [searchprofname, setSearchProfName] = React.useState('');
  const [searchprofmessage, setSearchProfMessage] = React.useState('');
  async function searchprofuser() {
    const response = await fetch('http://localhost:5000/admin-view-user-profile', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        user_name: searchprofname
      })
    });
    const data = await response.json();
    if (data.code === "404") {
      setSearchProfMessage(data.message);
      setAlertType('error')
      return;
    } else {
      setAlertType('')
      setViewProfUser([data.user])

    }
  }
  const [filteredprofUsers, setFilteredProfUsers] = React.useState([]);

  const handleSearchprof = () => {
    const filtered = viewprofuser.filter(user =>
      user.prof_name.toLowerCase().includes(searchprofname.toLowerCase())
    );
    setFilteredProfUsers(filtered);
  };

  const handleprofReset = () => {
    setSearchName(''); // Clear the search input
    setFilteredUsers(viewprofuser); // Reset the filtered users to show all users
  };

  //view applicants
  const [applications, setApplications] = React.useState([]);
  const [applimessage, setAppliMessage] = React.useState('');
  async function viewallapplications() {
    const response = await fetch(`http://localhost:5000/admin-view-applications`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',

      },
    });
    const data = await response.json();
    if (data.code === "404") {
      setAppliMessage(data.message);
      setAlertType('error')
      return;
    } else {
      const applicationsWithNamesAndProjects = await Promise.all(data.applications.map(async (application) => {
        const userName = await getnamebyuid(application.user_id);
        const projectName = await getpjnameid(application.project_id);
        return {
          ...application,
          userName: userName || 'Unknown User',
          projectName: projectName || 'Unknown Project'
        };
      }));
      setAlertType('')

      setApplications(applicationsWithNamesAndProjects);
    }
  }
  //get prof name by uid
  async function getnamebyuid(uid) {
    const response = await fetch('http://localhost:5000/professional/profile', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        user_id: parseInt(uid, 10),
        // user_id:show_user_id
      })
    });
    const data = await response.json();
    if (data.error) {

      return;
    } else {

      return data.prof_name
    }
  }
  //get uid by name
  async function getuidbyname(name) {
    const response = await fetch('http://localhost:5000/view-profile-by-name', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        user_name: name
      })
    });
    const data = await response.json();
    if (data.code === "404") {
      return;
    } else {
      return data.user.uid
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
  //view message 2 users
  const [user1Name, setUser1Name] = React.useState('');
  const [user2Name, setUser2Name] = React.useState('');
  const [error, setError] = React.useState('');
  const [conversations, setConversations] = React.useState('');

  const fetchAndPairMessages = async () => {
    try {
      const response = await axios.post('http://localhost:5000/admin-view-messages-between-two-users', {
        user1_name: user1Name,
        user2_name: user2Name,
      });

      const twomessages = response.data.messages;
      if (response.data.code === "404") {
        setError(response.data.message)
        setAlertType('error')
        return;
      } else {
        setAlertType('')
      }
      const conversation = {
        userIds: [user1Name, user2Name], // Assuming these are the user IDs or names
        messages: twomessages.map(msg => ({
          sender: msg.sender,
          recipient: msg.recipient,
          message: msg.message,
          timestamp: msg.timestamp
        }))
      };

      setConversations(conversation);


    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  //view all projects
  const [allprojects, setAllProjects] = React.useState([]);
  async function getallprojects() {
    const response = await fetch(`http://localhost:5000/admin-view-projects`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },

    });
    const data = await response.json();
    if (data.code === "404") {
      return;
    } else {
      setAllProjects(data.projects)
    }
  }
  //open update project page
  const openupdatepjpage = (projectId) => {
    navigate(`/admin/updateproject/${projectId}`)
  }
  //change status
  const [markprojectmessage, setMarkProjectMessage] = React.useState('')
  const mark = async (project_id, status, name) => {
    // First, get the user ID from the name
    const uid = await getuidbyname(name);
    if (!uid) {
      // Handle the case where the user ID could not be retrieved
      setMarkProjectMessage('User not found');
      setAlertType('error');
      return;
    }

    // Continue with the existing logic of the mark function
    const response = await fetch(`http://localhost:5000/company-change_project_status/${parseInt(project_id, 10)}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        user_id: uid,
        new_status: status
      })
    });
    const data = await response.json();
    if (data.code === "404") {
      setMarkProjectMessage(data.message);
      setAlertType('error');
      return;
    } else {
      setMarkProjectMessage(data.message);
      setAlertType('success');
      window.location.reload();
    }
  };
  //send msg to all
  const [toallmessage, setToAllMessage] = React.useState('');
  const [responseMessage, setResponseMessage] = React.useState('');
  const sendToAllMessage = async () => {
    
      const response = await fetch('http://localhost:5000/admin-send-message-to-all-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          message: toallmessage,
        }),
      });
      const data = await response.json();
      if (data.code === '404') {
        setAlertType('error');
        setResponseMessage(data.message);
      } else {
        setAlertType('success');
        setResponseMessage(data.message);
      }
  };
  const handleTextChange = (event) => {
    setToAllMessage(event.target.value);
  };






  return (
    <>
      {/* Header */}
      <header>
        <div className='navbar' style={{
          position: 'fixed',
          alignItems: 'center',
          display: 'flex',
          left: 0,
          right: 0,
          height: "70px",
          backgroundImage: 'url("https://images.pexels.com/photos/313563/sand-pattern-wave-texture-313563.jpeg?auto=compress&cs=tinysrgb&w=800")',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)',
          color: '#fff',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ color: "black", marginLeft: '25px' }}>Admin Dashboard</h2>

        </div>
      </header>
      {/* Side bar */}
      <div className='sidebar'>
        <List>
          <ListItem>
            <ListItemButton onClick={showDiv1}>
              <AssignmentIndIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Company Users" />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
            <ListItemButton onClick={showDiv2}>
              <AssignmentIndIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Professional Users" />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
            <ListItemButton onClick={showDiv3}>
              <AssignmentIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="View Projects" />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
            <ListItemButton onClick={showDiv4}>
              <MailIcon /><ListItemText sx={{ textAlign: 'center' }} primary="View Messages" />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
            <ListItemButton onClick={showDiv5}>
              <PersonAddIcon /><ListItemText sx={{ textAlign: 'center' }} primary="View Applications" />
            </ListItemButton>
          </ListItem>
          <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)', borderBottom: '1px solid rgb(53,57,63)' }}>
            <ListItemButton onClick={logout}>
              <ExitToAppIcon /><ListItemText sx={{ textAlign: 'center' }} primary="Log out" />
            </ListItemButton>
          </ListItem>

        </List>
      </div>
      {/* Content */}


      <div name='div1' style={{
        display: div1visible ? 'block' : 'none',
        position: 'fixed',
        height: '650px',
        width: '1130px',
        top: '90px',
        left: '250px',
        overflow: 'auto'
      }}>
        <TableContainer component={Paper}>
          <Typography variant="h4" component="h2" gutterBottom>
            Company Users
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              sx={{ width: 'auto' }}
              label="Search by name"
              variant="outlined"
              value={searchname}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => { handleSearch(); }}
            >
              Search
            </Button>
            {/* <Button variant="contained" color="secondary" onClick={handleReset}>
              Reset
            </Button> */}
          </Box>

          {searchmessage && (
            <Alert severity="info" sx={{ mt: 2 }}>
              {searchmessage}
            </Alert>
          )}
          <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">UID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Projects</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell align="center" component="th" scope="row">
                    {user.uid}
                  </TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center"><Link href={`/companyuser_profile/${user.company_name}`}>{user.company_name}</Link></TableCell>
                  <TableCell align="center">
                    {user.projects.length > 0 ? (
                      user.projects.map((project, index) => (
                        <React.Fragment key={project.id}>
                          <Link href={`/projects/${project.id}`}>{project.name}</Link>
                          {index < user.projects.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))
                    ) : (
                      <span>No projects</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {viewcompanyuser.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="subtitle1">
                      No company users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {viewcompanyusermessage && (
          <Box mt={2} width="100%">
            <Alert severity={alertType}>{viewcompanyusermessage}</Alert>
          </Box>
        )}
      </div>

      {/* view prof users */}
      <div name='div2' style={{
        display: div2visible ? 'block' : 'none',
        position: 'fixed',
        height: '650px',
        width: '1130px',
        top: '90px',
        left: '250px',

        overflow: 'auto'
      }}>
        <TableContainer component={Paper}>
          <Typography variant="h4" component="h2" gutterBottom>
            Professional Users
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <TextField
              sx={{ width: 'auto' }}
              label="Search by name"
              variant="outlined"
              value={searchprofname}
              onChange={(e) => setSearchProfName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => { handleSearchprof(); }}
            >
              Search
            </Button>
            {/* <Button variant="contained" color="secondary" onClick={handleprofReset}>
              Reset
            </Button> */}
            {searchprofmessage && (
              <Alert severity={alertType} sx={{ mt: 2 }}>
                {searchprofmessage}
              </Alert>
            )}
          </Box>
          <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">UID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Applied Projects</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Completed Projects</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredprofUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell align="center" component="th" scope="row">
                    {user.uid}
                  </TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center"><Link href={`/prof_profile/${user.prof_name}`}>{user.prof_name}</Link></TableCell>
                  <TableCell align="center">
                    {user.projects_applied.length > 0 ? (
                      user.projects_applied.map((project, index) => (
                        <React.Fragment key={project.id}>
                          <Link href={`/projects/${project.id}`}>{project.name}</Link>
                          {index < user.projects_applied.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))
                    ) : (
                      <span>No applied projects</span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {user.projects_completed.length > 0 ? (
                      user.projects_completed.map((project, index) => (
                        <React.Fragment key={project.id}>
                          <Link href={`/projects/${project.id}`}>{project.name}</Link>
                          {index < user.projects_completed.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))
                    ) : (
                      <span>No completed projects</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {viewprofuser.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="subtitle1">
                      No Professional users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {viewprofusermessage && (
          <Box mt={2} width="100%">
            <Alert severity={alertType}>{viewprofusermessage}</Alert>
          </Box>
        )}
      </div>
      <div name='div3' style={{
        display: div3visible ? 'block' : 'none',
        position: 'fixed',
        height: '650px',
        width: '1130px',
        top: '90px',
        left: '250px',
        overflow: 'auto'
      }}>
        <TableContainer component={Paper}>
          <Typography variant="h4" gutterBottom>All Projects</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center'>Project ID</TableCell>
                <TableCell align='center'>Project Name</TableCell>
                <TableCell align='center'>Company Name</TableCell>
                <TableCell align='center'>Start Date</TableCell>
                <TableCell align='center'>End Date</TableCell>
                <TableCell align='center'>Current Status</TableCell>
                <TableCell align='center'>Description</TableCell>
                <TableCell align='center'>Edit</TableCell>
                <TableCell align='center'>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allprojects.map((project) => (
                <TableRow key={project.project_id}>
                  <TableCell align='center'>{project.project_id}</TableCell>
                  <TableCell align='center'>{project.project_name}</TableCell>
                  <TableCell align='center'>{project.company_name}</TableCell>
                  <TableCell align='center'>{project.start_date}</TableCell>
                  <TableCell align='center'>{project.end_date}</TableCell>
                  <TableCell align='center'>{project.status}</TableCell>
                  <TableCell align='center'>{project.description}</TableCell>
                  <TableCell align='center'><Button onClick={() => { openupdatepjpage(project.project_id) }}>Update</Button></TableCell>
                  <TableCell align='center'>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value="Select Status"
                      label="Your Label"
                      onChange={(e) => { mark(project.project_id, e.target.value, project.company_name) }}
                    >
                      <MenuItem value="Select Status" disable>Select Status</MenuItem>
                      <MenuItem value={"open"}>Open</MenuItem>
                      <MenuItem value={"ongoing"}>Ongoing</MenuItem>
                      <MenuItem value={"completed"}>Completed</MenuItem>
                      {/* Add more MenuItem components as needed */}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {markprojectmessage && (
          <Alert severity={alertType} sx={{ mt: 2 }}>
            {markprojectmessage}
          </Alert>
        )}






      </div>
      <div name='div4' style={{
        display: div4visible ? 'block' : 'none',
        position: 'fixed',
        height: '650px',
        width: '1130px',
        top: '90px',
        left: '250px',
        border: '1px solid',
        overflow: 'auto'
      }}>
        <Box
          sx={{ maxWidth: 500, mx: 'auto', p: 2 }} // Margin top for spacing
        >
          <Typography variant="h5" mb={3}>Announcement</Typography>
          <TextField
            label="Announcement"
            variant="outlined"
            margin="normal"
            multiline
            value={toallmessage}
            rows={4} // Adjust the number of rows as needed
            fullWidth
            onChange={handleTextChange} // Makes the TextField take the full width of its parent container
            sx={{ width: '80%' }} // Adjust width as needed, or use 'fullWidth' for 100% width
          />
          <br />
          <Button variant='outlined' onClick={sendToAllMessage}>Send</Button>
          {responseMessage && (
            <Alert severity={alertType} sx={{ mt: 2 }}>
              {responseMessage}
            </Alert>
          )}
        </Box>

        <Box sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>


          <Typography variant="h5" mb={2}>Messages between Users</Typography>
          <Box mb={2}>
            <TextField
              label="User 1 Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={user1Name}
              onChange={(e) => setUser1Name(e.target.value)}
            />
            <TextField
              label="User 2 Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={user2Name}
              onChange={(e) => setUser2Name(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={() => { fetchAndPairMessages() }}>Query</Button>
          </Box>
          <Paper elevation={3}>
            <List>
              {conversations && (
                <div>
                  <h1>Conversation between {user1Name} and {user2Name}</h1>
                  <Grid container spacing={2}>
                    {conversations.messages.map((msg, index) => (
                      <React.Fragment key={index}>
                        <Grid item xs={12}>
                          <List>
                            <ListItem>
                              <ListItemText
                                primary={msg.sender === user2Name ? `Sent: ${msg.message}` : `Received: ${msg.message}`}
                                secondary={new Date(msg.timestamp).toLocaleString()}
                              />
                            </ListItem>
                          </List>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </div>
              )}
            </List>
          </Paper>
        </Box>
        {error && (
          <Box mt={2} width="100%">
            <Alert severity={alertType}>{error}</Alert>
          </Box>
        )}
      </div>
      <div name='div5' style={{
        display: div5visible ? 'block' : 'none',
        position: 'fixed',
        height: '650px',
        width: '1130px',
        top: '90px',
        left: '250px',
        border: '1px solid',
        overflow: 'auto'
      }}>
        <TableContainer component={Paper}>
          <Table aria-label="applications table">
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>User Name</TableCell>
                <TableCell>Project ID</TableCell>
                <TableCell>Project Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.user_id}>
                  <TableCell component="th" scope="row">
                    {application.user_id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Link href={`/prof_profile/${application.userName}`}>{application.userName}</Link>
                  </TableCell>
                  <TableCell> {application.project_id}</TableCell>
                  <TableCell><Link href={`/projects/${application.project_id}`}>{application.projectName}</Link></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>


      {/* Footer */}
      <footer>
        <div name='footer' style={{
          position: 'absolute',
          bottom: 0,
          color: 'lightgray',
          textAlign: 'center',
          padding: '10px',
          width: '100%',
          backgroundColor: 'rgb(34,34,34)'
        }}>&copy;9900 CompanyManagement
        </div>
      </footer>
    </>
  );
}

export default AdminPage