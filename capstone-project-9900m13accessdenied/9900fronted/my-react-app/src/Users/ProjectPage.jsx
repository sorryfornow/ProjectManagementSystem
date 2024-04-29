import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import {Table, TableBody, TableCell,TextField, TableContainer, TableRow, Paper } from '@mui/material';

const ProjectPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);

  //getprojectnamebyid
  async function getpjbyid() {
    const response = await fetch(`http://localhost:5000/company-view-project/${parseInt(projectId, 10)}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        },

    });
    const data = await response.json();
    if (data.code==="404") {
        return;
    } else {
        setProject(data.project)
        
    }
}
useEffect(()=>{
    getpjbyid()
}, [])
//search project


    if (!project) {
        return <Typography>Project not found</Typography>;
    }

    return (
        
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Project Details
              </Typography>
             
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="project details table">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">Project Name</TableCell>
                      <TableCell>{project.project_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Project ID</TableCell>
                      <TableCell>{project.project_id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Company</TableCell>
                      <TableCell>{project.company_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Start Date</TableCell>
                      <TableCell>{new Date(project.start_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">End Date</TableCell>
                      <TableCell>{new Date(project.end_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Description</TableCell>
                      <TableCell>{project.description}</TableCell>
                    </TableRow>
                    {/* <TableRow>
                      <TableCell component="th" scope="row">Approved Professionals</TableCell>
                      <TableCell>{project.approved_professionals.join(', ')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">Applied Professionals</TableCell>
                      <TableCell>{project.applied_professionals.join(', ')}</TableCell>
                    </TableRow> */}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
        
    );
};

export default ProjectPage;
