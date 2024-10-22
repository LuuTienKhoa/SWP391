import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Avatar } from '@mui/material';
import { MdDashboard } from 'react-icons/md';
import { FaFish, FaShoppingCart } from 'react-icons/fa';

const StaffLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 flex flex-col bg-gray-800 text-white p-4 h-screen">
        <h2 className="text-2xl font-semibold mb-8 text-center">F Koi Staff</h2>
        <ul>
          {[
            { label: 'Dashboard', icon: <MdDashboard size={24} />, link: '/' },
            { label: 'Manage Koi', icon: <FaFish size={24} />, link: '/staff/manageKoi' },
            { label: 'Manage Batch', icon: <FaFish size={24} />, link: '/staff/manageKoiBatch' },
            { label: 'Manage Orders', icon: <FaShoppingCart size={24} />, link: '/staff/manageOrder' },
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
        {children}
      </div>
    </div>
  );
};

export default StaffLayout;
