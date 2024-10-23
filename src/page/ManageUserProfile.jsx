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
          const token = localStorage.getItem('accessToken');
  
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


  const handleDeleteUser = async (userId) => {
      try{
        window.confirm('Are you sure you want to delete this user?');
        const token = localStorage.getItem('accessToken');
          if (!token) {
            navigate('/login');
            return;
          }
        const response = await api.delete(`/User/delete/${userId}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) { //tranh hieu nham 
          setUsers(users.filter((user) => user.userID !== userId));
        } else {
          console.error('Error deleting user:', response.data);
        }
      }catch (err){
        console.error('Error', err);
      }
  };


  return (
    <div className="p-6 ">
            <h1 className="text-3xl font-bold mb-6 text-center">User Profiles</h1>

      {/* User Cards */}
      <Grid container spacing={4} className="pt-10">
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
                  email: {user.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Phone Number: {user.phone}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Role: {user.role === 0 ? 'Admin' : 'Customer'}
                </Typography>
                <div className="flex justify-between mt-4">
                  <Button variant="contained" color="primary">
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.userID)}>
                    Delete
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
