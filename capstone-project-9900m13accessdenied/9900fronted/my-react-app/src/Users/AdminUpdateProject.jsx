import React from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useParams } from 'react-router-dom';

// Inside your component

const AdminUpdateProject = () => {
    const [updatepname, setUpdatePname] = React.useState('');
    const [updatestartdate, setUpdateStartdate] = React.useState('');
    const [updateenddate, setUpdateEnddate] = React.useState('');
    const [updatedesc, setUpdateDesc] = React.useState('');
    const [updatepjmessage, setUpdatePjMessage] = React.useState('');
    const [alertInfo, setAlertInfo] = React.useState('info'); // Assuming you have a state for alert type
    const params = useParams();
    const projectid = params.projectId;
    console.log('Project ID:', projectid)
    const EditProject = async () => {
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
            setUpdatePjMessage(data.message);
            return;
        } else {
            setUpdatePjMessage(data.message);
            setAlertInfo('success');
        }
    };

    return (
        <div name='div5' style={{
            position: 'fixed',
            height: '650px',
            width: '1130px',
            top: '90px',
            left: '150px',
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

    );
};

export default AdminUpdateProject;
