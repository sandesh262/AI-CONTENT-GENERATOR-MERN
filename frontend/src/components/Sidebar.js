import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, CreditCard, Settings, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UsageTracker from './UsageTracker';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'History', icon: Clock, path: '/history' },
    { name: 'Billing', icon: CreditCard, path: '/billing' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-100 sidebar-gradient d-flex flex-column custom-sidebar"
    >
      {/* Logo and User Section */}
      <div className="p-4 border-bottom border-light border-opacity-10">
        <Link to="/" className="d-block text-center mb-4">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="d-flex align-items-center justify-content-center gap-2">
              <Sparkles className="text-white" size={24} />
              <span className="fs-4 fw-bold text-white">AI Generator</span>
            </div>
          </motion.div>
        </Link>
        
        <motion.div 
          className="user-profile text-center py-3 px-2 rounded-3 mb-2"
          whileHover={{ scale: 1.02 }}
        >
          <div className="avatar-circle mb-2 mx-auto d-flex align-items-center justify-content-center">
            <span className="text-gradient fw-bold fs-4">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <h6 className="mb-0 text-white">{user?.name || 'User'}</h6>
          <p className="text-white-50 small mb-0">{user?.email || 'user@example.com'}</p>
        </motion.div>
      </div>
      
      {/* Menu Items */}
      <div className="flex-grow-1 p-4">
        <h6 className="text-white-50 text-uppercase small mb-3 ms-2">Menu</h6>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
              whileHover={{ x: 5 }}
              className="position-relative"
            >
              <Link 
                to={item.path}
                className={`d-flex align-items-center gap-3 p-3 rounded-3 mb-2 text-decoration-none ${  
                  isActive 
                    ? 'menu-item-active' 
                    : 'menu-item'
                }`}
              >
                <div className={`menu-icon-container ${isActive ? 'menu-icon-active' : ''}`}>
                  <item.icon size={18} />
                </div>
                <span>{item.name}</span>
                
                <AnimatePresence>
                  {(hoveredItem === item.path || isActive) && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ms-auto"
                    >
                      <ChevronRight size={16} className={isActive ? 'text-white' : 'text-white-50'} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
              
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="active-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Usage Tracker and Logout */}
      <div className="mt-auto p-4">
        <UsageTracker />
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="d-flex align-items-center justify-content-center gap-3 p-3 rounded-3 w-100 logout-button mt-4"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </motion.button>
      </div>
      
      <style jsx>{`
        .sidebar-gradient {
          background: linear-gradient(180deg, #4776E6 0%, #8E54E9 100%);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        
        .user-profile {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .avatar-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }
        
        .text-gradient {
          background: linear-gradient(45deg, #ffffff, #f0f0f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .menu-item {
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          position: relative;
        }
        
        .menu-item:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }
        
        .menu-item-active {
          color: white;
          background: rgba(255, 255, 255, 0.15);
          position: relative;
        }
        
        .menu-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .menu-icon-active {
          background: rgba(255, 255, 255, 0.25);
        }
        
        .active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 20px;
          background: white;
          border-radius: 0 4px 4px 0;
        }
        
        .logout-button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          transition: all 0.3s ease;
        }
        
        .logout-button:hover {
          background: rgba(255, 0, 0, 0.2);
        }
      `}</style>
    </motion.div>
  );
};

export default Sidebar;
