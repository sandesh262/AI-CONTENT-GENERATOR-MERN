import React from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  return (
    <div className="d-flex min-vh-100 dashboard-container">
      <div className="d-none d-md-block sidebar-container">
        <Sidebar />
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow-1 main-content"
      >
        <main className="p-4">
          {children}
        </main>
      </motion.div>

      <style jsx>{`
        .dashboard-container {
          background-color: #f8f9fa;
          position: relative;
          overflow: hidden;
        }
        
        .sidebar-container {
          width: 320px !important;
          min-width: 320px !important;
          max-width: 320px !important;
          flex: 0 0 320px;
        }
        
        .main-content {
          background-color: #f8f9fa;
          min-height: 100vh;
          overflow-y: auto;
        }
        
        @media (min-width: 768px) {
          .main-content {
            border-top-left-radius: 30px;
            border-bottom-left-radius: 30px;
            margin-left: -20px;
            padding-left: 20px;
            box-shadow: -10px 0 20px rgba(0, 0, 0, 0.03);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
