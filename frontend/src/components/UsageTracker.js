import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const UsageTracker = () => {
  const { getUserUsage, user } = useAuth();
  const [usage, setUsage] = useState({
    usageCredits: 0,
    maxCredits: 1,
    percentageUsed: 0,
    plan: 'free'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsage = async () => {
      if (user) {
        setLoading(true);
        const response = await getUserUsage();
        if (response.success) {
          setUsage(response.usage);
        }
        setLoading(false);
      }
    };

    fetchUsage();
  }, [user, getUserUsage]);

  // Format large numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get color based on usage percentage
  const getProgressColor = () => {
    if (usage.percentageUsed < 50) return 'bg-success';
    if (usage.percentageUsed < 80) return 'bg-warning';
    return 'bg-danger';
  };

  if (loading) {
    return (
      <div className="p-2 rounded-3 bg-dark bg-opacity-25 placeholder-glow">
        <div className="placeholder col-9 mb-2"></div>
        <div className="placeholder col-12 mb-3"></div>
        <div className="placeholder col-6"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-2 rounded-3 bg-dark bg-opacity-25 mb-4"
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <Zap size={16} className="text-white me-2" />
          <span className="text-white small">Credits</span>
        </div>
        <span className="badge bg-primary bg-opacity-25 text-white text-capitalize small">
          {usage.plan} Plan
        </span>
      </div>
      
      <div className="progress-container mb-2">
        <motion.div 
          className="progress mb-1" 
          style={{ height: '8px' }}
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className={`progress-bar ${getProgressColor()}`} 
            style={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
            role="progressbar"
            aria-valuenow={usage.percentageUsed}
            aria-valuemin="0"
            aria-valuemax="100"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(usage.percentageUsed, 100)}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
        </motion.div>
      </div>
      
      <div className="d-flex justify-content-between small text-white-50">
        <span>{formatNumber(usage.usageCredits)} credits left</span>
        <span>{formatNumber(usage.maxCredits)} total</span>
      </div>

      <style jsx>{`
        .usage-tracker {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .usage-tracker-loading {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .credits-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.2);
        }
        
        .plan-badge {
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 500;
          font-size: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .progress-container {
          position: relative;
        }
        
        .progress {
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          overflow: hidden;
        }
        
        .progress-bar {
          border-radius: 10px;
          position: relative;
        }
        
        .progress-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3));
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
};

export default UsageTracker;
