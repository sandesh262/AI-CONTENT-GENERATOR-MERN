import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User, Lock, Shield, Eye, EyeOff, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  
  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
  // Check password strength
  useEffect(() => {
    const { newPassword } = passwordData;
    if (!newPassword) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }
    
    // Simple password strength check
    let strength = 0;
    let feedback = '';
    
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[a-z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;
    
    switch(strength) {
      case 0:
      case 1:
        feedback = 'Very weak';
        break;
      case 2:
        feedback = 'Weak';
        break;
      case 3:
        feedback = 'Medium';
        break;
      case 4:
        feedback = 'Strong';
        break;
      case 5:
        feedback = 'Very strong';
        break;
      default:
        feedback = '';
    }
    
    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  }, [passwordData]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    
    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const result = await updateProfile({
        password: passwordData.newPassword,
        currentPassword: passwordData.currentPassword
      });
      
      if (result.success) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update password');
      console.error(error);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header with gradient accent */}
        <div className="position-relative mb-4 pb-2">
          <div className="position-absolute top-0 start-0 w-100" style={{ height: '3px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef)' }}></div>
          <div className="d-flex justify-content-between align-items-center pt-3">
            <div>
              <h1 className="fs-4 fw-bold mb-1 d-flex align-items-center">
                <Shield size={22} className="me-2 text-primary" />
                Account Settings
              </h1>
              <p className="text-muted">Manage your profile and security settings</p>
            </div>
          </div>
        </div>

        <div className="row g-4">
        {/* Profile Settings */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white p-4 border-0 d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                <User size={20} className="text-primary" />
              </div>
              <h5 className="card-title mb-0 fw-semibold">Profile Information</h5>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-medium">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <User size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-medium">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="form-control border-start-0 ps-0"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
                
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 px-4 d-flex align-items-center justify-content-center"
                    style={{
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    disabled={profileLoading}
                  >
                    {profileLoading ? (
                      <>
                        <RefreshCw size={18} className="me-2 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} className="me-2" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Password Settings */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white p-4 border-0 d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-3">
                <Lock size={20} className="text-primary" />
              </div>
              <h5 className="card-title mb-0 fw-semibold">Security Settings</h5>
            </div>
            
            <div className="card-body p-4">
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="form-label fw-medium">Current Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Lock size={16} className="text-muted" />
                    </span>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-control border-start-0 border-end-0 ps-0"
                      placeholder="Enter your current password"
                      required
                    />
                    <button 
                      type="button" 
                      className="input-group-text bg-light border-start-0"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-muted" />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label fw-medium">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Shield size={16} className="text-muted" />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="form-control border-start-0 border-end-0 ps-0"
                      placeholder="Create a new password"
                      minLength="8"
                      required
                    />
                    <button 
                      type="button" 
                      className="input-group-text bg-light border-start-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-muted" />}
                    </button>
                  </div>
                  
                  {passwordData.newPassword && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small className="text-muted">Password strength:</small>
                        <small className={`fw-medium ${passwordStrength < 3 ? 'text-danger' : passwordStrength < 4 ? 'text-warning' : 'text-success'}`}>
                          {passwordFeedback}
                        </small>
                      </div>
                      <div className="progress" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar ${passwordStrength < 3 ? 'bg-danger' : passwordStrength < 4 ? 'bg-warning' : 'bg-success'}`} 
                          role="progressbar" 
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          aria-valuenow={(passwordStrength / 5) * 100} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-medium">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <CheckCircle size={16} className="text-muted" />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="form-control border-start-0 border-end-0 ps-0"
                      placeholder="Confirm your new password"
                      minLength="8"
                      required
                    />
                    <button 
                      type="button" 
                      className="input-group-text bg-light border-start-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} className="text-muted" /> : <Eye size={16} className="text-muted" />}
                    </button>
                  </div>
                  
                  {passwordData.newPassword && passwordData.confirmPassword && (
                    <div className="mt-2">
                      {passwordData.newPassword === passwordData.confirmPassword ? (
                        <small className="text-success d-flex align-items-center">
                          <CheckCircle size={14} className="me-1" />
                          Passwords match
                        </small>
                      ) : (
                        <small className="text-danger d-flex align-items-center">
                          <AlertCircle size={14} className="me-1" />
                          Passwords do not match
                        </small>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 px-4 d-flex align-items-center justify-content-center"
                    style={{
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                    disabled={passwordLoading || (passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword)}
                  >
                    {passwordLoading ? (
                      <>
                        <RefreshCw size={18} className="me-2 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Shield size={18} className="me-2" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SettingsPage;
