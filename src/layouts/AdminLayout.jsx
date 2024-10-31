import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Avatar } from '@mui/material';
import { MdDashboard } from 'react-icons/md';
import { FaFish, FaShoppingCart, } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa'
import { FaBox, FaTags, FaComments, FaTruck,FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Đảm bảo đã import useNavigate

const AdminLayout = ({ children }) => {
  const navigate = useNavigate(); // Khởi tạo navigate

  return (
    <div className="flex h-screen">
      <div className="w-64 flex flex-col bg-gray-800 text-white p-4 h-full fixed overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-8 text-center">F Koi Admin</h2>
        <ul>
          {[
            { label: 'Dashboard', icon: <MdDashboard size={24} />, link: '/admin' },
            { label: 'Manage User', icon: <FaUsers size={24} />, link: '/admin/manage-user' },
            { label: 'Manage Orders', icon: <FaShoppingCart size={24} />, link: '/admin/manageOrder' },
            { label: 'Manage Koi', icon: <FaFish size={24} />, link: '/admin/manageKoi' },
            { label: 'Manage Batch', icon: <FaBox size={24} />, link: '/admin/manageKoiBatch' }, 
            { label: 'Manage Promotion', icon: <FaTags size={24} />, link: '/admin/managePromotion' }, 
            { label: 'Manage Feedback', icon: <FaComments size={24} />, link: '/admin/manageFeedback' },  
            { label: 'Manage Consign', icon: <FaTruck size={24} />, link: '/admin/manageConsign' },  
            { label: 'Manage Delivery', icon: <FaTruck size={24} />, link: '/admin/manageDelivery' },  
            { label: 'Manage Consign Koi', icon: <FaTruck size={24} />, link: '/admin/manageConsignKoi' },  
            { label: 'Manage Feedback', icon: <FaTruck size={24} />, link: '/admin/manageFeedback' } , 
            { label: 'Manage Trans', icon: <FaTruck size={24} />, link: '/admin/manageTrans' }  

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
            onClick={() => navigate('/')} // Thêm sự kiện onClick để điều hướng về trang chủ
          >
            Home Page
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

export default AdminLayout;
