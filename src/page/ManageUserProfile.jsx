import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import api from '../config/axios'; // Import your axios instance
import 'tailwindcss/tailwind.css';

export default function ManageUserProfiles() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const token = localStorage.getItem('authToken');
  
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await api.get('User/profile/all', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
  
      fetchUsers();
    }, [navigate]);

  const handleEditUser = (userId) => {
    
  };

  const handleDeleteUser = async (userId) => {

  };

  const handleViewProfile = (userId) => {

  };

  return (
    <div className="p-8">
      <Typography variant="h4" gutterBottom>
        Manage User Profiles
      </Typography>

      {/* User Cards */}
      <Grid container spacing={4}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.userID}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-2">
                  {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Username: {user.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Role: {user.role === 0 ? 'Admin' : 'Customer'}
                </Typography>
                <div className="flex justify-between mt-4">
                  <Button variant="contained" color="primary" onClick={() => handleEditUser(user.userID)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.userID)}>
                    Delete
                  </Button>
                  <Button variant="outlined" onClick={() => handleViewProfile(user.userID)}>
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
