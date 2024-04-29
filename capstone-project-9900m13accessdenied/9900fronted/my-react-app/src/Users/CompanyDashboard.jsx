import { List } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddIcon from '@mui/icons-material/Add';
import PageviewIcon from '@mui/icons-material/Pageview';
import CampaignIcon from '@mui/icons-material/Campaign';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MarkunreadIcon from '@mui/icons-material/Markunread';

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
    Box,
    Table as InnerTable,
    TableHead as InnerTableHead,
    TableRow as InnerTableRow,
    TableCell as InnerTableCell
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MailIcon from '@mui/icons-material/Mail';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import './sidebar.css'
import { useParams, BrowserRouter as Router, Route, Link, Routes, Navigate } from 'react-router-dom';

function CompanyDashboard() {
    const { email } = useParams();
    const [emessage, seteMessage] = React.useState('');
    const [cmessage, setcMessage] = React.useState('');
    const [vmessage, setvMessage] = React.useState('');
    const [greeting, setGreeting] = React.useState('');
    //auto click-edit account
    const buttonRef = useRef(null);
    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.click();
        }
    }, []);
    //show side bar function
    const [div1visible, setDiv1] = React.useState(false);
    const [div2visible, setDiv2] = React.useState(false);
    const [div3visible, setDiv3] = React.useState(false);
    const [div4visible, setDiv4] = React.useState(false);
    const [div5visible, setDiv5] = React.useState(false);
    const [div6visible, setDiv6] = React.useState(false);
    const [div7visible, setDiv7] = React.useState(false);
    //show profile
    const [showprofilemessage, setShowProfileMessage] = React.useState('');
    const [showcompanyprofile, setShowCompanyProfile] = React.useState('');
    const [profileopen, setProfileOpen] = React.useState(false)
    const handleshowprofileOpen = () => setProfileOpen(true);
    const handleshowprofileClose = () => {
        setProfileOpen(false);
        showDiv4()
    };

    //edit project
    const [cname, setCname] = React.useState('');
    const [cemail, setCemail] = React.useState('');
    const [cpassword, setCpassword] = React.useState('');
    const [cprojects, setCprojects] = React.useState([]);

    // create project
    //const [project_info, setPinfo] = React.useState('');
    // const [project_id, setPid] = React.useState('');
    const [project_name, setPname] = React.useState('');
    //const [company_name, setPcompanyname] = React.useState('');
    const [start_date, setPstartdate] = React.useState('');
    const [end_date, setPenddate] = React.useState('');
    //const [status, setPstatus] = React.useState('');
    const [description, setPdescription] = React.useState('');
    const [participants, setParticipants] = React.useState([]);

    //view project
    const [vgetproject, setVgetproject] = React.useState([]);
    const [getcompletedprojectid, setGetCompletedProjectId] = React.useState([]);
    const [viewprojectmessage, setViewProjectMessage] = React.useState('')

    //project request
    const [projectrequestpid, setProjectRequestPid] = React.useState('');
    const [projectrequestuserid, setProjectRequestUserid] = React.useState('');
    const [projectrequestmessage, setProjectRequestMessage] = React.useState('');

    //mark project
    //const [markprojectid, setMarkProjectId] = React.useState('');
    const [markprojectmessage, setMarkProjectMessage] = React.useState('');

    //rate prof
    const [ratepid, setRatePid] = React.useState('');
    const [rateuserid, setRateUserid] = React.useState('');
    const [ratescore, setRateScore] = React.useState('');
    const [ratemessage, setRateMessage] = React.useState('');

    const [alertInfo, setAlertInfo] = React.useState('info');

    //message
    const [sendmessageopen, setsendmessageOpen] = React.useState(false);
    const [selectedapplicantName, setSelectedApplicantName] = React.useState("");
    const handlesendmessageOpen = (applicantname) => {
        setSelectedApplicantName(applicantname)

        setSendMessageError('')
        setsendmessageOpen(true);
    };
    const handlesendmessageClose = () => setsendmessageOpen(false);

    // show diff side bar function
    const showDiv1 = () => {
        showprofile();
        handleshowprofileOpen();

        setDiv1(true);
        setDiv2(false);
        setDiv3(false);
        setDiv4(false);
        setDiv5(false);
        setDiv6(false);
        setDiv7(false);
    };
    const showDiv2 = () => {
        setDiv1(false);
        setDiv2(true);
        setDiv3(false);
        setDiv4(false);
        setDiv5(false);
        setDiv6(false);
        setDiv7(false);

    };
    const showDiv3 = () => {
        setDiv1(false);
        setDiv2(false);
        setDiv3(true);
        setDiv4(false);
        setDiv5(false);
        setDiv6(false);
        setDiv7(false);

    };
    const showDiv4 = () => {
        setDiv1(false);
        setDiv2(false);
        setDiv3(false);
        setDiv4(true);
        ViewProject(localStorage.getItem('companyname'));
        setDiv5(false);
        setDiv6(false);
        setDiv7(false);

    };
    const showDiv5 = () => {
        setDiv1(false);
        setDiv2(false);
        setDiv3(false);
        setDiv4(false);
        setDiv5(true);
        setDiv6(false);
        setDiv7(false);

    };
    const showDiv6 = () => {
        setDiv1(false);
        setDiv2(false);
        setDiv3(false);
        setDiv4(false);
        setDiv5(false);
        setDiv6(true);
        ViewProject(localStorage.getItem('companyname'))
        showcompletedproject()


        setDiv7(false);


    };
    const showDiv7 = () => {
        setDiv1(false);
        setDiv2(false);
        setDiv3(false);
        setDiv4(false);
        setDiv5(false);
        setDiv6(false);
        setDiv7(true);
        fetchAndPairMessages(parseInt(localStorage.getItem('uid')));

    };

    //logout
    function logout() {
        localStorage.removeItem('type')
        localStorage.removeItem('uid')
        localStorage.removeItem('companyname')
        localStorage.removeItem('email')
        localStorage.removeItem('projectid')
        window.location.href = '/login'
    }

    //send message
    const [sendmessage, setSendMessage] = React.useState('');
    const [sendmessageerror, setSendMessageError] = React.useState('');

    async function Sendmessage() {
        if (sendmessage.trim() === '') {
            setSendMessageError('Message content cannot be empty.');
            setAlertInfo('error')
            return;
        }
        const uid = await getuidbyname(selectedapplicantName)
        const response = await fetch('http://localhost:5000/send-message', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                recipient_id: parseInt(uid),
                sender_id: parseInt(localStorage.getItem('uid'), 10),
                message: sendmessage

            })

        });
        const data = await response.json();
        if (data.code === "404") {
            setSendMessageError(data.message)
            setAlertInfo("error")
            return;
        } else {
            setSendMessageError(data.message)
            setAlertInfo("success")

        }
    }

    //view all message
    const [conversations, setConversations] = React.useState([]);
    const [selectedConversation, setSelectedConversation] = React.useState(null);
    // const pairMessages = (sent, received) => {
    //     const reversedSent = [...sent].reverse();
    //     const reversedReceived = [...received].reverse();
    //     console.log("r",reversedReceived)
        
    //     const pairs = reversedSent.map((s, index) => ({
    //         sent: s,
    //         received: reversedReceived[index] || { message: 'Waiting for reply...' },
            
    //     }));
    //     console.log("p",pairs)

    //     return pairs.reverse();
    // };
    const pairMessages = (sent, received) => {
        // Determine the longer array
        const longerArray = sent.length >= received.length ? [...sent].reverse() : [...received].reverse();
        const shorterArray = sent.length < received.length ? [...sent].reverse() : [...received].reverse();
    
        // Map over the longer array
        const pairs = longerArray.map((message, index) => {
            return {
                sent: sent.length >= received.length ? message : shorterArray[index] || { message: 'No sent message' },
                received: sent.length < received.length ? message : shorterArray[index] || { message: 'Waiting for reply...' },
            };
        });
    
        return pairs.reverse();
    }
    

    const fetchAndPairMessages = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/view-message/${userId}`);
            const { sent, received } = response.data.messages;
            console.log("111",received);
            // Extract unique user IDs from sent and received messages
            const uniqueUserIds = new Set([
                ...sent.map((message) => message.recipient),
                ...received.map((message) => message.sender),
            ]);

            // Create conversations based on unique user IDs
            const conversations = await Promise.all(Array.from(uniqueUserIds).map(async (conversationUserId) => {
                const sentMessages = sent.filter((message) => message.recipient === conversationUserId);
                const receivedMessages = received.filter((message) => message.sender === conversationUserId);
                console.log("222",receivedMessages)
                const profName = await profnamebyuid(conversationUserId) || `UID:${conversationUserId}`;
                console.log(pairMessages(sentMessages, receivedMessages))
                return {
                    userId: conversationUserId,
                    userName: profName,
                    messages: pairMessages(sentMessages, receivedMessages),
                };
            
            }));
            
            setConversations(conversations);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
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

    useEffect(() => {
        getGreeting();
        showprofile();
    }, []);

    //Show company user profile
    async function showprofile() {
        const response = await fetch(`http://localhost:5000/company-view-profile/${parseInt(localStorage.getItem('uid'), 10)}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },

        });
        const data = await response.json();
        if (data.error) {
            setShowProfileMessage(data.message);
            return;
        } else {
            setShowProfileMessage(data.message)
            localStorage.setItem('companyname', data.company.company_name)
            setShowCompanyProfile(data.company)
        }
    }

    // Edit
    async function EditCompany() {
        const response = await fetch('http://localhost:5000/company-edit-profile', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_id: parseInt(localStorage.getItem('uid'), 10),
                email: cemail,
                password: cpassword,
            })
        });
        const data = await response.json();
        if (data.code === "404") {
            setAlertInfo('error');
            seteMessage(data.message)
            return;
        } else {
            seteMessage(data.message)
            localStorage.setItem('email', cemail)
            setAlertInfo('success')
        }
    }

    //Create
    async function CreateProject() {
        const response = await fetch('http://localhost:5000/company-create-project', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_id: parseInt(localStorage.getItem('uid'), 10),
                project_name,
                start_date,
                end_date,
                description,
            })
        });
        const data = await response.json();
        if (data.code === "404") {
            setcMessage(data.message)
            setAlertInfo('error');

            return;
        } else {
            setcMessage(data.message)
            setAlertInfo('success')
        }
    }

    //**CREATE participants change it to array
    const ParticipantsToArrary = (e) => {
        const inputValue = e.target.value;
        const inputArray = inputValue.split(',').map(item => item.trim());
        setParticipants(inputArray);
    };
    //**EDIT*********project change it to array
    const ProjectsToArrary = (e) => {
        const inputValue = e.target.value;
        const inputArray = inputValue.split(',').map(item => item.trim());
        setCprojects(inputArray);
    };

    //View
    async function ViewProject(mail) {
        const response = await fetch('http://localhost:5000/company-view-project', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                company_name: mail
            })
        });
        const data = await response.json();
        if (data.error) {
            setViewProjectMessage(data.message)
            return;
        } else {

            setViewProjectMessage('')
            //setVgetproject(data.projects)
            //filter completed project
            // const completedProjects = data.projects.filter(project => project.Status.toLowerCase() === 'completed');
            // const completedProjectIDs = completedProjects.map(project => project.projectID);
            // setGetCompletedProjectId(completedProjectIDs)
            if (data.projects && Array.isArray(data.projects)) {
                setVgetproject(data.projects);
                // filter completed project
                const completedProjects = data.projects.filter(project => project.Status.toLowerCase() === 'completed');
                const completedProjectIDs = completedProjects.map(project => project.projectID);
                setGetCompletedProjectId(completedProjectIDs);
            } else {
                // Handle the case where data.projects is not an array
                console.error('Error: data.projects is not an array', data.projects);
                // Optionally set some state here to show an error message in your UI
            }
        }
    }

    //Project approved
    async function ProjectRequest(name, pid) {
        const uid = await getuidbyname(name)
        const response = await fetch('http://localhost:5000/company-approve-professional', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                prof_id: parseInt(uid),
                project_id: parseInt(pid, 10),
                user_id: parseInt(localStorage.getItem('uid'), 10)
            })
        });
        const data = await response.json();
        if (data.code === "404") {
            setProjectRequestMessage(data.message)
            setAlertInfo("error")
            return;
        } else {
            setProjectRequestMessage(data.message)
            setAlertInfo("success")
        }
    }

    //Project reject
    const [projectrejectmessage, setProjectRejectMessage] = React.useState('');

    async function ProjectReject(name, pid) {
        const uid = await getuidbyname(name)
        const response = await fetch('http://localhost:5000/company-reject-professional', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                prof_id: parseInt(uid),
                project_id: parseInt(pid, 10),
                user_id: parseInt(localStorage.getItem('uid'), 10)
            })
        });
        const data = await response.json();
        if (data.code === "404") {
            setProjectRejectMessage(data.message)
            setAlertInfo("error")
            return;
        } else {
            setProjectRejectMessage(data.message)
            setAlertInfo("success")
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

    //mark project
    async function mark(project_id, status) {
        const response = await fetch(`http://localhost:5000/company-change_project_status/${parseInt(project_id, 10)}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_id: parseInt(localStorage.getItem('uid'), 10),
                new_status: status
            })
        });
        const data = await response.json();
        if (data.code === "404") {
            setMarkProjectMessage(data.message)
            setAlertInfo('error')
            return;
        } else {
            setMarkProjectMessage(data.message)
            setAlertInfo('success')
            window.location.reload();

        }
    }

    //edit project
    const [updatepname, setUpdatePname] = React.useState('');
    const [updatestartdate, setUpdateStartdate] = React.useState('')
    const [updateenddate, setUpdateEnddate] = React.useState('')
    const [updatedesc, setUpdateDesc] = React.useState('')
    const [updatepjmessage, setUpdatePjMessage] = React.useState('');

    async function EditProject(projectid) {
        const response = await fetch(`http://localhost:5000/company-edit-project/${projectid}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                project_name: updatepname,
                start_date: updatestartdate,
                end_date: updateenddate,
                description: updatedesc

            })
        });
        const data = await response.json();
        if (data.code === "404") {
            setAlertInfo('error');
            setUpdatePjMessage(data.message)
            return;
        } else {
            setUpdatePjMessage(data.message)
            setAlertInfo('success')
        }
    }


    //reat get approved prof id
    const [getapprovedproject, setGetApprovedProject] = React.useState([]);

    async function getprofid(pid) {
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
            setGetApprovedProject(data.project)
            return data.project
        }
    }

    //rate
    const [professionals, setProfessionals] = React.useState({});
    const [projects, setProjects] = React.useState([]);
    const showcompletedproject = async () => {
        const projectsData = await Promise.all(getcompletedprojectid.map(async (pid) => {
            return getprofid(pid);
        }));
        const validProjects = projectsData.filter(Boolean);
        setProjects(validProjects);
        console.log(projects)

    };


    const [viewingApprovedProfessionals, setViewingApprovedProfessionals] = React.useState([]);
    const [ratingprojectId, setratingPId] = React.useState(null);

    // Event handler for when the view button is clicked
    async function handleViewApprovedProfessionals(approvedProfessionals, pid) {
        // Initialize an array to hold the promises
        const namePromises = approvedProfessionals.map((uid) => profnamebyuid(uid));
        setratingPId(pid)

        try {
            // Wait for all promises to resolve
            const names = await Promise.all(namePromises);

            // Filter out any undefined values (in case of a 404 or other error)
            const validNames = names.filter(name => name);

            // Update the state with the valid names
            setViewingApprovedProfessionals(validNames);
        } catch (error) {
            // Handle errors, such as network issues, or if the endpoint is down
            console.error('Error fetching professional names:', error);
            // Optionally update the state to reflect that an error occurred
        }
    }


    //Rate
    const [ratings, setRatings] = React.useState({});
    const [rankrateDictionary, setRankRateDictionary] = React.useState({});
    const [sortedrank, setSortedrank] = React.useState({});
    const handleSortByScore = () => {
        const sortedUsers = Object.entries(rankrateDictionary).sort((a, b) => b[1] - a[1]);
        setSortedrank(sortedUsers);
    };
    //show ranked modal
    const [satrvalue, setStarValue] = React.useState(0);
    const [showRankRating, setShowRankRating] = React.useState(false);
    const toggleRankRating = () => {
        handleSortByScore();  // Assuming you want to sort the list every time you open the rank rating
        setShowRankRating(!showRankRating);
    };


    const insertIntoDictionary = (key, value) => {
        setRankRateDictionary(prevDictionary => ({
            ...prevDictionary,
            [key]: value
        }));
    };
    const handleRatingChange = (professionalId, newRating, pid) => {
        setRatings(prevRatings => ({
            ...prevRatings,
            [professionalId]: newRating,
        }));
        console.log(professionalId)
        Rate(pid, professionalId, newRating)
    };

    async function Rate(pid, profname, ratescore) {
        const profuid = await getuidbyname(profname)
        const response = await fetch('http://localhost:5000/company-rate-professional', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                project_id: pid,
                user_id: parseInt(localStorage.getItem('uid'), 10),
                prof_id: profuid,
                rating: ratescore
            })
        });
        const data = await response.json();
        if (data.code === "404") {
            setRateMessage(data.message)
            setAlertInfo('error')
            return;
        } else {
            setRateMessage(data.message)
            setAlertInfo('success')

        }
    }


    //Show professional user profile
    async function profnamebyuid(uid) {
        const response = await fetch('http://localhost:5000/professional/profile', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                user_id: parseInt(uid, 10),
            })
        });
        const data = await response.json();
        if (data.code === "404") {
            return;
        } else {
            return data.prof_name
        }
    }

    // load view projects page
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



    // Applicants & view project
    const Row = ({ project }) => {
        const [open, setOpen] = React.useState(false);
        const [applicants, setApplicants] = React.useState([]);
        const [loading, setLoading] = React.useState(false);
        const [error, setError] = React.useState('');
        const handleToggle = async () => {
            // Toggle the open state
            setOpen(!open);
            // If applicants are already fetched, do not fetch again
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/view-applicants/${project.projectName}`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.error) {
                    setError('Failed to fetch applicants');
                    // Handle the error properly here
                } else {
                    setApplicants(data.result);


                }
            } catch (e) {
                setError('Failed to fetch applicants');
            }
            if (!open && applicants.length === 0) {
                setLoading(false)
            }

        };

        return (
            <>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setOpen(!open)
                                handleToggle()

                            }}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell align="center">{project.projectID}</TableCell>
                    <TableCell align="center">{project.projectName}</TableCell>
                    <TableCell align="center">{project.startDate}</TableCell>
                    <TableCell align="center">{project.endDate}</TableCell>
                    <TableCell align="center">{project.Status}</TableCell>
                    <TableCell align="center">
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            value="Select Status"
                            label="Status"
                            onChange={(e) => mark(project.projectID, e.target.value)}
                        >
                            <MenuItem value="Select Status" disable>Select Status</MenuItem>
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="ongoing">Ongoing</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>

                        </Select>
                    </TableCell>
                    <TableCell align="center">
                        <Button onClick={() => {
                            localStorage.setItem('projectid', project.projectID)
                            showDiv5()

                        }}>Edit</Button>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box margin={1}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Project Details
                                </Typography>
                                <InnerTable size="small" aria-label="details">
                                    <InnerTableHead>
                                        <InnerTableRow>
                                            <InnerTableCell>Description</InnerTableCell>
                                            <InnerTableCell>Application</InnerTableCell>
                                            {/* Add more detail headers if needed */}
                                        </InnerTableRow>
                                    </InnerTableHead>
                                    <tbody>
                                        <InnerTableRow>
                                            <InnerTableCell component="th" scope="row">
                                                {project.Description}
                                            </InnerTableCell>
                                            <InnerTableCell>
                                                {loading && <div>No Applicants...</div>}
                                                {error && <div>{error}</div>}
                                                {!loading && !error && applicants.map((applicant, index) => (
                                                    <Grid container alignItems="center" spacing={1} key={index}>
                                                        <Grid item xs={12} sm={3}>
                                                            <div>{applicant}</div>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button color="success" size="small" variant="outlined"
                                                                onClick={() => {
                                                                    ProjectRequest(applicant, project.projectID)
                                                                }}>approve</Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button color="error" size="small" variant="outlined"
                                                                onClick={() => {
                                                                    ProjectReject(applicant, project.projectID)
                                                                }}>reject</Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button size="small" variant="outlined" onClick={() => {
                                                                handlesendmessageOpen(applicant)
                                                            }}>Contact</Button>
                                                        </Grid>
                                                    </Grid>
                                                ))}
                                            </InnerTableCell>
                                            {/* Add more detail data cells if needed */}
                                        </InnerTableRow>
                                    </tbody>
                                </InnerTable>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>

        );
    };
    //show project rating
    const [pjratingmodalopen, setPjRatingModalOpen] = React.useState(false);
    const [pjrating, setPjRating] = React.useState([]);
    const GetPJRating = async (marklist) => {
        if (marklist && typeof marklist === 'object') {
            const ratingsWithNames = await Promise.all(
                Object.entries(marklist).map(async ([uid, score]) => {
                    const name = await profnamebyuid(uid);
                    return { uid, name, score };
                })
            );

            setPjRating(ratingsWithNames);
            setPjRatingModalOpen(true);
        } else {
            console.error('Invalid marklist:', marklist);
            // Handle the error case here
        }
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
                    <h2 style={{ color: "black", marginLeft: '25px' }}>Company Management Dashboard</h2>
                    <Button sx={{ left: '180px' }} onClick={() => setOpenadminmsgModal(true)}><MarkunreadIcon /></Button>
                    <h4 style={{ color: "black", marginRight: '30px' }}>{greeting}{localStorage.getItem('email')}</h4>

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
            {/* Side bar */}
            <div className='sidebar'>
                <List>
                    <ListItem>
                        <ListItemButton onClick={showDiv1}>
                            <AssignmentIndIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Show Profile" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv2}>
                            <AccountBoxIcon /><ListItemText sx={{ textAlign: 'center' }} primary="Edit Account" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv3}>
                            <AddIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Create Project" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv4}>
                            <PageviewIcon /><ListItemText sx={{ textAlign: 'center' }} primary="View Projects" />
                        </ListItemButton>
                    </ListItem>
                    {/*********** Div5 *******/}
                    {/* <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
            <ListItemButton onClick={showDiv5}>
              <CampaignIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Edit Project" />
            </ListItemButton>
          </ListItem> */}
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv6}>
                            <PersonSearchIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Rate Professionals" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ borderTop: '1px solid rgb(53,57,63)' }}>
                        <ListItemButton onClick={showDiv7}>
                            <MailIcon /> <ListItemText sx={{ textAlign: 'center' }} primary="Message Box" />
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

            {/*show profile*/}
            <div name='div1' style={{
                display: div1visible ? 'block' : 'none',
                position: 'fixed',
                height: '650px',
                width: '1130px',
                top: '90px',
                left: '250px',
                border: '1px solid',
                overflow: 'auto'
            }}>
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
                            {showcompanyprofile && (
                                <>
                                    <Typography variant="h6">
                                        Name: {showcompanyprofile.company_name}
                                    </Typography>
                                    <Typography variant="h6">
                                        Email: {showcompanyprofile.email}
                                    </Typography>
                                    <br />
                                    <Button variant="contained" color="primary" onClick={() => {
                                        showDiv2();
                                        setProfileOpen(false)
                                    }}>
                                        Edit
                                    </Button>
                                </>

                            )}
                        </Typography>
                    </Box>
                </Modal>

            </div>

            {/* Edit account */}
            <div name='div2' style={{
                display: div2visible ? 'block' : 'none',
                position: 'fixed',
                height: '650px',
                width: '1130px',
                top: '90px',
                left: '250px',
                border: '1px solid',
                overflow: 'auto'
            }}>

                <Container component="main" maxWidth="xs">
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Update Company Information
                        </Typography>

                        <Box
                            sx={{
                                mt: 1,
                            }}
                            noValidate
                            autoComplete="off"
                        >

                            <TextField
                                label="Email"
                                variant="outlined"
                                name="cemail"
                                value={cemail}
                                onChange={(e) => setCemail(e.target.value)}
                                margin="normal"
                                fullWidth
                            />

                            <TextField
                                label="Password"
                                variant="outlined"
                                type="password"
                                name="cpassword"
                                value={cpassword}
                                onChange={(e) => setCpassword(e.target.value)}
                                margin="normal"
                                fullWidth
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={EditCompany}
                            >
                                Update
                            </Button>
                            {emessage && (
                                <Box mt={2} width="100%">
                                    <Alert severity={alertInfo}>{emessage}</Alert>
                                </Box>
                            )}


                        </Box>
                    </Box>
                </Container>


            </div>
            {/* Create Project */}
            <div name='div3' style={{
                display: div3visible ? 'block' : 'none',
                position: 'fixed',
                height: '650px',
                width: '1130px',
                top: '90px',
                left: '250px',
                border: '1px solid',
                overflow: 'auto'
            }}>
                <Container maxWidth="sm">
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        marginTop={4}
                        mb={4}
                    >
                        <Typography variant="h4">Create Project</Typography>
                        <TextField
                            sx={{ width: '250px' }}
                            label="Project Name"
                            name="projectname"
                            value={project_name}
                            onChange={(e) => setPname(e.target.value)}
                            margin="normal"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ normal: 'DD/MM/YYYY' }}>
                            <DatePicker
                                sx={{ width: '250px', mb: '4px', mt: '4px' }}

                                label="Start Date"
                                format="DD/MM/YYYY"
                                value={start_date}
                                onChange={(newDate) => setPstartdate(newDate ? newDate.format('YYYYMMDD') : '')}
                                renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                            />
                            <DatePicker
                                sx={{ width: '250px', mb: '4px', mt: '4px' }}
                                label="End Date"
                                format="DD/MM/YYYY"
                                value={end_date}
                                onChange={(newDate) => setPenddate(newDate ? newDate.format('YYYYMMDD') : '')}
                                renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                            />
                        </LocalizationProvider>
                        <TextField
                            sx={{ width: '250px' }}
                            label="Description"
                            name="description"
                            value={description}
                            onChange={(e) => setPdescription(e.target.value)}
                            margin="normal"
                            multiline
                            minRows={3}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={CreateProject}
                            style={{ marginTop: 16 }}
                        >
                            Create
                        </Button>

                        {cmessage && (
                            <Box mt={2} width="100%">
                                <Alert severity={alertInfo}>{cmessage}</Alert>
                            </Box>
                        )}

                    </Box>
                </Container>

            </div>
            {/* View Project */}
            <div name='div4' style={{
                display: div4visible ? 'block' : 'none',
                position: 'fixed',
                height: '650px',
                width: '1130px',
                top: '90px',
                left: '250px',
                overflow: 'auto'
            }}>

                <TableContainer component={Paper}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Projects Management
                    </Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell align="center">Project ID</TableCell>
                                <TableCell align="center">Project Name</TableCell>
                                <TableCell align="center">Start Date</TableCell>
                                <TableCell align="center">End Date</TableCell>
                                <TableCell align="center">Current Status</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Update Porject</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(vgetproject ?? []).length > 0 ? (vgetproject.map((project) => (
                                <Row key={project.projectID} project={project} />
                            ))) : (
                                <TableRow>
                                    <TableCell colSpan="the number of columns in your table">
                                        No projects found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>


                {viewprojectmessage && (
                    <Box mt={2} width="100%">
                        <Alert severity={alertInfo}>{viewprojectmessage}</Alert>
                    </Box>
                )}
                {markprojectmessage && (
                    <Box mt={2} width="100%">
                        <Alert severity={alertInfo}>{markprojectmessage}</Alert>
                    </Box>
                )}
                {projectrequestmessage && (
                    <Box mt={2} width="100%">
                        <Alert severity={alertInfo}>{projectrequestmessage}</Alert>
                    </Box>
                )}
                {projectrejectmessage && (
                    <Box mt={2} width="100%">
                        <Alert severity={alertInfo}>{projectrejectmessage}</Alert>
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
                                onChange={(e) => {
                                    setSendMessage(e.target.value)
                                }}
                            />
                            <br />
                            <br />
                            <Button variant="outlined" onClick={Sendmessage}>Send</Button>
                            {sendmessageerror && (
                                <Box mt={2} width="100%">
                                    <Alert severity={alertInfo}>{sendmessageerror}</Alert>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Modal>


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
                <Container maxWidth="sm">
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        marginTop={4}
                        mb={4}
                    >
                        <Typography variant="h4">Update Project</Typography>
                        <TextField
                            sx={{ width: '250px' }}
                            label="Project Name"
                            name="projectname"
                            value={updatepname}
                            onChange={(e) => setUpdatePname(e.target.value)}
                            margin="normal"
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ normal: 'DD/MM/YYYY' }}>
                            <DatePicker
                                sx={{ width: '250px', mb: '4px', mt: '4px' }}

                                label="Start Date"
                                format="DD/MM/YYYY"
                                value={updatestartdate}
                                onChange={(newDate) => setUpdateStartdate(newDate ? newDate.format('YYYYMMDD') : '')}
                                renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                            />
                            <DatePicker
                                sx={{ width: '250px', mb: '4px', mt: '4px' }}
                                label="End Date"
                                format="DD/MM/YYYY"
                                value={updateenddate}
                                onChange={(newDate) => setUpdateEnddate(newDate ? newDate.format('YYYYMMDD') : '')}
                                renderInput={(params) => <TextField fullWidth {...params} margin="normal" />}
                            />
                        </LocalizationProvider>
                        <TextField
                            sx={{ width: '250px' }}
                            label="Description"
                            name="description"
                            value={updatedesc}
                            onChange={(e) => setUpdateDesc(e.target.value)}
                            margin="normal"
                            multiline
                            minRows={3}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => EditProject(parseInt(localStorage.getItem('projectid')))}
                            style={{ marginTop: 16 }}
                        >
                            Update
                        </Button>
                        {updatepjmessage && (
                            <Box mt={2} width="100%">
                                <Alert severity={alertInfo}>{updatepjmessage}</Alert>
                            </Box>
                        )}

                    </Box>
                </Container>

            </div>
            <div name='div6' style={{
                display: div6visible ? 'block' : 'none',
                position: 'fixed',
                height: '650px',
                width: '1130px',
                top: '90px',
                left: '250px',
                overflow: 'auto'
            }}>
                <TableContainer component={Paper}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Rating Management
                    </Typography>
                    <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
                        <TableHead>
                            <TableRow>

                                <TableCell align="center">Project Name</TableCell>
                                <TableCell align="center">Start Date</TableCell>
                                <TableCell align="center">End Date</TableCell>
                                <TableCell align="center">Current Status</TableCell>
                                <TableCell align="center">Professional</TableCell>
                                <TableCell align="center">Ranking</TableCell>
                                <TableCell align="center">Feedback</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.length > 0 ? (
                                projects.map((project) => (
                                    <TableRow key={project.project_id}>
                                        <TableCell align="center">{project.company_name}</TableCell>
                                        <TableCell align="center">{project.start_date}</TableCell>
                                        <TableCell align="center">{project.end_date}</TableCell>
                                        <TableCell align="center">completed</TableCell>
                                        <TableCell align="center">
                                            <Button variant='outlined' onClick={() => {
                                                handleViewApprovedProfessionals(project.approved_professionals, project.project_id)
                                            }}>view</Button>
                                        </TableCell>
                                        <TableCell align="center"><Button variant="outlined"
                                            onClick={toggleRankRating}>Result</Button>
                                        </TableCell>
                                        <TableCell align="center"><Button variant="outlined" onClick={() => GetPJRating(project.mark_list)}
                                        >GET</Button>
                                        </TableCell>
                                        {showRankRating && <SortedRankRating sortedRank={sortedrank} type={true} />}

                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell align="center" colSpan={6}>
                                        No completed projects found.
                                    </TableCell>
                                </TableRow>
                            )}

                        </TableBody>
                        {/*project feedback*/}
                        <Modal
                            open={pjratingmodalopen}
                            onClose={() => setPjRatingModalOpen(false)}

                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                            }}>
                                <Typography variant="h6">Project Feedback</Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Rating</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pjrating.map(({ uid, name, score }) => (
                                            <TableRow key={uid}>
                                                <TableCell>{name || uid}</TableCell>
                                                <TableCell>
                                                    <Rating value={score / 2} readOnly />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Modal>


                        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <List>
                                {viewingApprovedProfessionals.map((professional, index) => (
                                    <Paper key={index} elevation={2} sx={{ my: 2, p: 2 }}>
                                        <ListItem alignItems="flex-start">
                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                <Typography component="div" variant="subtitle1">
                                                    Professional: {professional.name || professional} {/* Use professional.name if it's an object */}
                                                </Typography>
                                                <Typography component="div" variant="caption">
                                                    Project ID: {ratingprojectId}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        mt: 1
                                                    }}
                                                >
                                                    <Rating
                                                        name={`rating-${professional.id}`} // Replace `professional.id` with actual ID property if needed
                                                        value={satrvalue[professional] || 0} // The value should probably come from your component's state or props
                                                        precision={0.5}
                                                        icon={<StarIcon fontSize="inherit" />}
                                                        onChange={(event, newValue) => {
                                                            setStarValue(prevRatings => ({ ...prevRatings, [professional]: newValue }))
                                                            handleRatingChange(professional, newValue * 2, ratingprojectId);
                                                            insertIntoDictionary(professional, newValue * 2)// Adjust for 10 scale
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </ListItem>
                                        {index < viewingApprovedProfessionals.length - 1 && <Divider />}
                                    </Paper>
                                ))
                                }
                            </List>
                        </Box>


                    </Table>
                </TableContainer>
                {ratemessage && (
                    <Box mt={2} width="100%">
                        <Alert severity={alertInfo}>{ratemessage}</Alert>
                    </Box>
                )}


            </div>
            <div name='div7' style={{
                display: div7visible ? 'block' : 'none',
                position: 'fixed',
                height: '650px',
                width: '1130px',
                top: '90px',
                left: '250px',
                border: '1px solid',
                overflow: 'auto'
            }}>
                <h1>Message Box</h1>
               
                <List component="nav">
                    {conversations.map((conversation, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemButton onClick={() => setSelectedConversation(conversation)}>
                                    <ListItemText primary={`Conversation with: ${conversation.userName}`} />
                                </ListItemButton>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
                {selectedConversation && (
                    <div>
                        <h1>Messages with: {selectedConversation.userName}</h1>
                        <Grid container spacing={2}>
                            {selectedConversation.messages.map((pair, index) => (
                                <React.Fragment key={index}>
                                    <Grid item xs={6}>
                                        <List>
                                            <ListItem>
                                                <ListItemText primary={`Sent: ${pair.sent.message}`}
                                                    secondary={new Date(pair.sent.timestamp).toLocaleString()} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <List>
                                            <ListItem>
                                                <ListItemText primary={`Received: ${pair.received.message}`}
                                                    secondary={new Date(pair.received.timestamp).toLocaleString() || ''} />
                                            </ListItem>
                                        </List>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </div>
                )}

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

function SortedRankRating({ sortedRank, type }) {
    const [open, setOpen] = React.useState(false);
    React.useEffect(() => {
        setOpen(type);
    }, [type]); // Only re-run the effect if `type` changes

    const handleClose = () => setOpen(false);

    // Modal style
    const style = {
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
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Ranking Results
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {sortedRank.map(([name, score], index) => (
                            <Box key={name} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ mr: 2, fontWeight: 'bold' }}>{name}:</Typography>
                                <Rating name="read-only" value={score / 2} readOnly />
                            </Box>
                        ))}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}


export default CompanyDashboard;
