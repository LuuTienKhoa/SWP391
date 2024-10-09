import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Avatar, Grid, Button } from '@mui/material';
import { Line } from 'react-chartjs-2';
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
  useEffect(() => {
    // Scroll to top to prevent any auto-scrolling behavior when charts are rendered
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 flex flex-col bg-gray-800 text-white p-4 h-screen">
        <h2 className="text-2xl font-semibold mb-8">Material Tailwind React</h2>
        <ul>
          {[
            { label: 'Dashboard', icon: 'D' },
            { label: 'Profile', icon: 'P' },
            { label: 'Tables', icon: 'T' },
            { label: 'Notifications', icon: 'N' },
          ].map((item, index) => (
            <li key={index} className="mb-4">
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
                    {item.icon}
                  </Avatar>
                }
              >
                {item.label}
              </Button>
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
                S
              </Avatar>
            }
            className="mt-4"
          >
            Sign Up
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
            { title: "Today's Money", value: '$53k', percentage: '+55% than last week' },
            { title: "Today's Users", value: '2,300', percentage: '+3% than last month' },
            { title: 'New Clients', value: '3,462', percentage: '+5% than yesterday' },
            { title: 'Sales', value: '$103,430', percentage: '+5% than yesterday' },
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
                Website View
              </Typography>
              <div className="chart-container" style={{ height: '300px', overflow: 'hidden' }}>
                <Line
                  data={{
                    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
                    datasets: [
                      {
                        label: 'Views',
                        data: [12, 19, 3, 5, 2, 3, 7],
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
                        suggestedMax: 50, // Suggested max to avoid large imbalances
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
                Daily Sales
              </Typography>
              <div className="chart-container" style={{ height: '300px', overflow: 'hidden' }}>
                <Line
                  data={{
                    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Sales',
                        data: [65, 59, 80, 81, 56, 55, 40, 60, 80],
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
                        suggestedMax: 100, // Suggested max to control the y-axis scale
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
