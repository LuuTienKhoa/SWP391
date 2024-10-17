import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Button } from '@mui/material';
import { MdDashboard } from 'react-icons/md';
import { FaUsers, FaFish } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa'; 

import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Tailwind for styling
import 'tailwindcss/tailwind.css';

export default function AdminPage() {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Is Authenticated:", isAuthenticated);
    console.log("User Role:", userRole);
    
    if (!isAuthenticated || userRole !== 0) { 
      navigate('/'); 
    }
  }, [isAuthenticated, userRole, navigate]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 flex flex-col bg-gray-800 text-white p-4 h-screen">
        <h2 className="text-2xl font-semibold mb-8 text-center">F Koi</h2>
        <ul>
          {[
            { label: 'Dashboard', icon: <MdDashboard size={24} />, link:'/' },
            { label: 'Manage User', icon: <FaUsers size={24} />, link:'manage-user'},
            { label: 'Manage Koi', icon: <FaFish size={24} />, link:'manageKoi'},
            { label: 'Manage Orders', icon: <FaShoppingCart size={24} />, link:'manage-order' },
          ].map((item, index) => (  
            <li key={index} className="mb-4">
              <Link to={item.link}>
              <Button
                startIcon={
                  <Avatar
                    sx={{
                      backgroundColor: '#0288d1',
                      height: 48,
                      width: 48,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                }
              >
                {item.label}
              </Button>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <Button
            color="inherit"
            startIcon={
              <Avatar
                sx={{
                  backgroundColor: '#0288d1',
                  height: 48,
                  width: 48,
                }}
              >
                S
              </Avatar>
            }
          >
            Sign In
          </Button>
          <Button
            color="inherit"
            startIcon={
              <Avatar
                sx={{
                  backgroundColor: '#0288d1',
                  height: 48,
                  width: 48,
                }}
              >
              </Avatar>
            }
            className="mt-4"
          >
            Return
          </Button>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-hidden">
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* Metrics Cards */}
        <Grid container spacing={4}>
          {[
            { title: "Today's Sales", value: '$2,500', percentage: '+20% from yesterday' },
            { title: "Total Koi Fish in Inventory", value: '120', percentage: '-10% from last week' },
            { title: 'New Orders', value: '15', percentage: '+5 from yesterday' },
            { title: 'Returning Customers', value: '85', percentage: '+15% from last month' },
          ].map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" gutterBottom>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'green' }}>
                    {card.percentage}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Sales Trends
              </Typography>
              <div className="chart-container" style={{ height: '300px', overflow: 'hidden' }}>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Sales in $',
                        data: [1200, 1500, 1800, 2200, 2000, 2300, 2500, 2600, 2700, 3000, 3100, 3200],
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        borderColor: 'rgba(75,192,192,1)',
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        suggestedMax: 4000,
                      },
                    },
                  }}
                  height={300}
                  redraw
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Koi Fish Inventory
              </Typography>
              <div className="chart-container" style={{ height: '300px', overflow: 'hidden' }}>
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Number of Koi Fish',
                        data: [150, 140, 130, 120, 110, 105, 100, 120, 125, 140, 135, 130],
                        backgroundColor: 'rgba(153,102,255,0.2)',
                        borderColor: 'rgba(153,102,255,1)',
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        suggestedMax: 200,
                      },
                    },
                  }}
                  height={300}
                  redraw
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
