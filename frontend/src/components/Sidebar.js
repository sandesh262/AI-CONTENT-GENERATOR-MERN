import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, CreditCard, Settings, LogOut, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UsageTracker from './UsageTracker';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  
  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'History', icon: Clock, path: '/history' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-100 sidebar-gradient d-flex flex-column custom-sidebar"
    >
      {/* Logo Section */}
      <div className="p-4 border-bottom border-light border-opacity-10 mb-3">
        <Link to="/" className="d-block text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <div className="d-flex align-items-center justify-content-center gap-2">
              <motion.div
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut" 
                }}
              >
                <Sparkles className="text-white" size={26} />
              </motion.div>
              <span className="fs-4 fw-bold text-white">AI Generator</span>
            </div>
          </motion.div>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="p-4">
        {/* Main Navigation Items */}
        <div className="mb-4">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.div 
                key={item.name}
                className="mb-3"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link 
                  to={item.path} 
                  className={`nav-link d-flex align-items-center justify-content-between py-3 px-4 rounded-3 position-relative ${isActive ? 'active-nav-item' : 'nav-item'}`}
                  style={{
                    background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    transition: 'all 0.3s ease',
                    width: '100%'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon size={20} className={isActive ? 'text-white' : 'text-white-50'} />
                    </motion.div>
                    <span className={`ms-3 ${isActive ? 'text-white fw-medium' : 'text-white-50'}`}>{item.name}</span>
                  </div>
                  
                  <AnimatePresence>
                    {(hoveredItem === item.name || isActive) && (
                      <motion.div 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                      >
                        <ChevronRight size={16} className="text-white-50" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {isActive && (
                    <motion.div 
                      className="position-absolute start-0 top-0 bottom-0 rounded-pill"
                      style={{ 
                        width: '4px', 
                        background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                        left: '0px'
                      }}
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        {/* Billing Link */}
        <motion.div
          className="mb-4"
          whileHover={{ x: 5 }}
          onMouseEnter={() => setHoveredItem('billing')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link 
            to="/billing" 
            className={`nav-link d-flex align-items-center justify-content-between py-3 px-4 rounded-3 position-relative ${location.pathname === '/billing' ? 'active-nav-item' : 'nav-item'}`}
            style={{
              background: location.pathname === '/billing' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
          >
            <div className="d-flex align-items-center">
              <CreditCard size={20} className={location.pathname === '/billing' ? 'text-white' : 'text-white-50'} />
              <span className={`ms-3 ${location.pathname === '/billing' ? 'text-white fw-medium' : 'text-white-50'}`}>Billing</span>
            </div>
            
            <AnimatePresence>
              {(hoveredItem === 'billing' || location.pathname === '/billing') && (
                <motion.div 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                >
                  <ChevronRight size={16} className="text-white-50" />
                </motion.div>
              )}
            </AnimatePresence>
            
            {location.pathname === '/billing' && (
              <motion.div 
                className="position-absolute start-0 top-0 bottom-0 rounded-pill"
                style={{ 
                  width: '4px', 
                  background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                  left: '0px'
                }}
                layoutId="activeIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </Link>
        </motion.div>
        
        {/* Usage Tracker */}
        <UsageTracker />
        
        {/* Logout Button */}
        <motion.button
          onClick={logout}
          className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 py-2 px-4 mt-4"
          style={{
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
          whileHover={{ 
            scale: 1.03,
            background: 'rgba(255, 255, 255, 0.1)'
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ 
              repeat: Infinity, 
              repeatType: 'reverse',
              duration: 1.5,
              ease: "easeInOut" 
            }}
          >
            <LogOut size={18} />
          </motion.div>
          <span>Logout</span>
        </motion.button>
      </div>
      
      {/* Empty div to maintain spacing */}
      <div className="mt-auto"></div>
      
      <style jsx>{`
        .sidebar-gradient {
          background: linear-gradient(180deg, #4776E6 0%, #8E54E9 100%);
          width: 320px !important;
          min-width: 320px !important;
          max-width: 320px !important;
        }
        
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .active-nav-item {
          font-weight: 500;
        }
        
        .credits-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
        }
        
        .plan-badge {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 12px;
          padding: 4px 8px;
          font-size: 0.75rem;
        }
      `}</style>
    </motion.div>
  );
};

export default Sidebar;
