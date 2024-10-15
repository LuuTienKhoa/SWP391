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


  const handleDeleteUser = async (userId) => {
      try{
        window.confirm('Are you sure you want to delete this user?');
        const token = localStorage.getItem('authToken');
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

  const handleEditUser = async (userId, updatedUserData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("No authentication token found. Redirecting to login.");
        return;
      }
  
      const response = await api.put('/User/edit', {
        UserID: userId, // Ensure you pass the correct user ID
        Username: updatedUserData.Username,
        Password: updatedUserData.Password,
        Name: updatedUserData.Name,
        Email: updatedUserData.Email,
        Phone: updatedUserData.Phone,
        Address: updatedUserData.Address,
        Role: updatedUserData.Role
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        console.log('User updated successfully:', response.data);
      } else {
        console.error('Error updating user:', response.data);
      }
    } catch (error) {
      console.error('Error during user update:', error);
    }
  };

  return (
    <div className="p-8">
      <Typography variant="h4" gutterBottom className="text-center py-5">
        Manage User Profiles
      </Typography>
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
                  <Button variant="contained" color="primary" onClick={() => handleEditUser(user.userID)}>
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
