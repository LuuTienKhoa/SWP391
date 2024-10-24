import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Avatar } from '@mui/material';
import { MdDashboard } from 'react-icons/md';
import { FaFish, FaShoppingCart } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';
import { FaBox, FaTags, FaComments, FaTruck,FaArrowLeft } from 'react-icons/fa'; 

const StaffLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 flex flex-col bg-gray-800 text-white p-4 h-full fixed">
        <h2 className="text-2xl font-semibold mb-8 text-center">F Koi Staff</h2>
        <ul>
          {[
            { label: 'Dashboard', icon: <MdDashboard size={24} />, link: '/staff' },
            { label: 'Manage User', icon: <FaUsers size={24} />, link: '/staff/manage-user' },
            { label: 'Manage Orders', icon: <FaShoppingCart size={24} />, link: '/staff/manageOrder' },
            { label: 'Manage Koi', icon: <FaFish size={24} />, link: '/staff/manageKoi' },
            { label: 'Manage Batch', icon: <FaBox size={24} />, link: '/staff/manageKoiBatch' },  // Changed to FaBox
            { label: 'Manage Promotion', icon: <FaTags size={24} />, link: '/staff/managePromotion' },  // Changed to FaTags
            { label: 'Manage Feedback', icon: <FaComments size={24} />, link: '/staff/manageFeedback' },  // Changed to FaComments
            { label: 'Manage Consign', icon: <FaTruck size={24} />, link: '/staff/manageConsign' }  // Changed to FaTruck

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
                <FaArrowLeft size={24} color="white" /> 
              </Avatar>
            }
            className="mt-4"
          >
            Return
          </Button>
        </div>

      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
};

export default StaffLayout;
