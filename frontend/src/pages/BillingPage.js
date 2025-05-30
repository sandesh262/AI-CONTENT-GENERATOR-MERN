import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Check, CreditCard, Zap, Shield, Star, Award, RefreshCw, Sparkles, Gem, Clock } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const BillingPage = () => {
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState('');
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const { user, updateUserPlan } = useAuth();

  useEffect(() => {
    const fetchPlansAndKey = async () => {
      try {
        const response = await axios.get('/api/billing/plans');
        if (response.data.success) {
          setPlans(response.data.plans);
          
          // Get Razorpay key from response if available
          if (response.data.razorpayKey) {
            setRazorpayKey(response.data.razorpayKey);
          }
          
          // Check if payment is enabled
          setPaymentEnabled(response.data.paymentEnabled || false);
          
          // Show warning if payment is not enabled
          if (response.data.paymentEnabled === false) {
            toast.warning('Payment gateway is not configured. Upgrade functionality is disabled.', {
              autoClose: 5000,
              position: 'top-center'
            });
          }
        }
      } catch (error) {
        toast.error('Failed to load subscription plans');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlansAndKey();
  }, []);

  const handleSubscribe = async (planId) => {
    // Check if payment is enabled
    if (!paymentEnabled) {
      toast.warning('Payment gateway is not configured. Please contact support.', {
        position: 'top-center'
      });
      return;
    }
    
    try {
      setProcessingPayment(true);
      
      // Create order
      const orderResponse = await axios.post('/api/billing/create-order', { planId });
      
      if (!orderResponse.data.success) {
        toast.error(orderResponse.data.message || 'Failed to create order');
        return;
      }
      
      const order = orderResponse.data.order;
      
      // Initialize Razorpay
      const options = {
        key: razorpayKey, // Using key from backend
        amount: order.amount,
        currency: order.currency,
        name: 'AI Content Generator',
        description: `Subscription to ${plans[planId].name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await axios.post('/api/billing/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId
            });
            
            if (verifyResponse.data.success) {
              toast.success('Payment successful! Your plan has been upgraded.');
              updateUserPlan(verifyResponse.data.user);
            }
          } catch (error) {
            toast.error('Payment verification failed');
            console.error(error);
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#4f46e5'
        }
      };
      
      if (!window.Razorpay) {
        toast.error('Razorpay SDK failed to load. Please refresh the page and try again.');
        console.error('Razorpay SDK not found');
        setProcessingPayment(false);
        return;
      }

      if (!razorpayKey) {
        toast.error('Payment gateway configuration is missing. Please contact support.');
        console.error('Razorpay Key is missing');
        setProcessingPayment(false);
        return;
      }

      try {
        const razorpay = new window.Razorpay(options);
        
        // Add event handlers for better error tracking
        razorpay.on('payment.failed', function(response) {
          console.error('Payment failed:', response.error);
          toast.error(`Payment failed: ${response.error.description}`);
        });
        
        razorpay.open();
      } catch (error) {
        toast.error(`Failed to process payment: ${error.message || 'Unknown error'}`);
        console.error('Razorpay error:', error);
      } finally {
        setProcessingPayment(false);
      }
    } catch (error) {
      toast.error(`Payment initialization failed: ${error.message || 'Unknown error'}`);
      console.error('Payment initialization error:', error);
      setProcessingPayment(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
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
                <CreditCard size={22} className="me-2 text-primary" />
                Subscription Plans
              </h1>
              <p className="text-muted">Upgrade your plan to get more content generation credits</p>
            </div>
          </div>
        </div>

      {/* Current Plan */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center">
            <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
              <CreditCard size={24} className="text-primary" />
            </div>
            <div>
              <h5 className="card-title mb-1">Current Plan</h5>
              <div className="d-flex align-items-center">
                <span className="text-capitalize fw-medium">{user?.plan || 'Free'} Plan</span>
                {user?.plan && user.plan !== 'free' && (
                  <span className="badge bg-success bg-opacity-10 text-success ms-2 d-flex align-items-center">
                    <Check size={12} className="me-1" /> Active
                  </span>
                )}
              </div>
            </div>
            {user?.credits && (
              <div className="ms-auto text-end">
                <div className="text-muted small">Available Credits</div>
                <div className="d-flex align-items-center justify-content-end">
                  <Zap size={16} className="text-warning me-1" />
                  <span className="fw-semibold">{user.credits.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="row g-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="placeholder-glow">
                    <div className="placeholder col-6 mb-3" style={{ height: '24px' }}></div>
                    <div className="placeholder col-4 mb-4" style={{ height: '32px' }}></div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="placeholder col-1 me-2 rounded-circle" style={{ height: '20px', width: '20px' }}></div>
                      <div className="placeholder col-8" style={{ height: '16px' }}></div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="placeholder col-1 me-2 rounded-circle" style={{ height: '20px', width: '20px' }}></div>
                      <div className="placeholder col-7" style={{ height: '16px' }}></div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="placeholder col-1 me-2 rounded-circle" style={{ height: '20px', width: '20px' }}></div>
                      <div className="placeholder col-9" style={{ height: '16px' }}></div>
                    </div>
                    <div className="placeholder col-12 mt-4" style={{ height: '40px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-4">
          {/* Free Plan */}
          <div className="col-md-4">
            <motion.div 
              className={`card border-0 shadow-sm h-100 ${user?.plan === 'free' ? 'border border-primary' : ''}`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {user?.plan === 'free' && (
                <div className="position-absolute top-0 end-0 mt-3 me-3">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                    Current Plan
                  </span>
                </div>
              )}
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-light p-2 me-2">
                    <Sparkles size={18} className="text-primary" />
                  </div>
                  <h5 className="card-title mb-0">Free Plan</h5>
                </div>
                
                <div className="mb-4">
                  <span className="display-6 fw-bold">₹0</span>
                  <span className="text-muted">/month</span>
                </div>
                
                <div className="mb-4 flex-grow-1">
                  <div className="d-flex align-items-start mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>500,000 characters per month</span>
                  </div>
                  <div className="d-flex align-items-start mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>Access to basic templates</span>
                  </div>
                  <div className="d-flex align-items-start">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>Email support</span>
                  </div>
                </div>
                
                <button
                  className={`btn ${user?.plan === 'free' ? 'btn-light disabled' : 'btn-outline-primary'} w-100 py-2`}
                  disabled={user?.plan === 'free'}
                >
                  {user?.plan === 'free' ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <Check size={18} className="me-2" />
                      Active
                    </span>
                  ) : 'Downgrade'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Premium Plan */}
          <div className="col-md-4">
            <motion.div 
              className={`card border-0 shadow-sm h-100 ${user?.plan === 'premium' ? 'border border-primary' : ''}`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="position-absolute top-0 start-0 w-100" style={{ height: '6px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}></div>
              
              {user?.plan === 'premium' && (
                <div className="position-absolute top-0 end-0 mt-3 me-3">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                    Current Plan
                  </span>
                </div>
              )}
              
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-2 me-2">
                    <Star size={18} className="text-primary" />
                  </div>
                  <h5 className="card-title mb-0">Premium Plan</h5>
                </div>
                
                <div className="mb-4">
                  <span className="display-6 fw-bold">{formatPrice(plans.premium?.price || 999).replace('₹', '₹')}</span>
                  <span className="text-muted">/month</span>
                </div>
                
                <div className="mb-4 flex-grow-1">
                  <div className="d-flex align-items-start mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>2 Million characters per month</span>
                  </div>
                  <div className="d-flex align-items-start mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>Access to all templates</span>
                  </div>
                  <div className="d-flex align-items-start mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>Priority support</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSubscribe('premium')}
                  className={`btn ${user?.plan === 'premium' ? 'btn-light disabled' : 'btn-primary'} w-100 py-2`}
                  style={user?.plan !== 'premium' ? { background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', border: 'none' } : {}}
                  disabled={user?.plan === 'premium' || processingPayment || !paymentEnabled}
                  title={!paymentEnabled ? 'Payment gateway not configured' : ''}
                >
                  {user?.plan === 'premium' ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <Check size={18} className="me-2" />
                      Active
                    </span>
                  ) : processingPayment ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <RefreshCw size={18} className="me-2 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="d-flex align-items-center justify-content-center">
                      <Zap size={18} className="me-2" />
                      Upgrade
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Enterprise Plan */}
          <div className="col-md-4">
            <motion.div 
              className={`card border-0 shadow-sm h-100 ${user?.plan === 'enterprise' ? 'border border-primary' : ''}`}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="position-absolute top-0 start-0 w-100" style={{ height: '6px', background: 'linear-gradient(90deg, #8b5cf6, #d946ef)' }}></div>
              
              <div className="position-absolute top-0 end-0 mt-3 me-3">
                {user?.plan === 'enterprise' ? (
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                    Current Plan
                  </span>
                ) : (
                  <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill">
                    <Award size={12} className="me-1" /> Best Value
                  </span>
                )}
              </div>
              
              <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="rounded-circle bg-purple bg-opacity-10 p-2 me-2" style={{ backgroundColor: 'rgba(157, 78, 221, 0.1)' }}>
                    <Gem size={18} style={{ color: '#9d4edd' }} />
                  </div>
                  <h5 className="card-title mb-0">Enterprise Plan</h5>
                </div>
                
                <div className="mb-4">
                  <span className="display-6 fw-bold">{formatPrice(plans.enterprise?.price || 2499).replace('₹', '₹')}</span>
                  <span className="text-muted">/month</span>
                </div>
                
                <div className="mb-4 flex-grow-1">
                  <div className="d-flex align-items-start mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>5 Million characters per month</span>
                  </div>
                  <div className="d-flex align-items-start mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>Access to all templates</span>
                  </div>
                  <div className="d-flex align-items-start mb-3">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>Priority support</span>
                  </div>
                  <div className="d-flex align-items-start">
                    <div className="rounded-circle bg-success bg-opacity-10 p-1 me-2 mt-1">
                      <Check size={14} className="text-success" />
                    </div>
                    <span>Custom templates</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleSubscribe('enterprise')}
                  className={`btn ${user?.plan === 'enterprise' ? 'btn-light disabled' : 'btn-primary'} w-100 py-2`}
                  style={user?.plan !== 'enterprise' ? { background: 'linear-gradient(90deg, #8b5cf6, #d946ef)', border: 'none' } : {}}
                  disabled={user?.plan === 'enterprise' || processingPayment || !paymentEnabled}
                  title={!paymentEnabled ? 'Payment gateway not configured' : ''}
                >
                  {user?.plan === 'enterprise' ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <Check size={18} className="me-2" />
                      Active
                    </span>
                  ) : processingPayment ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <RefreshCw size={18} className="me-2 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="d-flex align-items-center justify-content-center">
                      <Shield size={18} className="me-2" />
                      Upgrade
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Payment Information */}
      <div className="card border-0 bg-light mt-4">
        <div className="card-body p-4">
          <div className="d-flex mb-3">
            <div className="rounded-circle bg-info bg-opacity-10 p-2 me-3">
              <Shield size={20} className="text-info" />
            </div>
            <div>
              <h5 className="mb-1 fw-medium">Secure Payments</h5>
              <p className="text-muted mb-0">All transactions are secure and encrypted</p>
            </div>
          </div>
          
          <div className="d-flex mb-3">
            <div className="rounded-circle bg-warning bg-opacity-10 p-2 me-3">
              <Clock size={20} className="text-warning" />
            </div>
            <div>
              <h5 className="mb-1 fw-medium">Automatic Renewal</h5>
              <p className="text-muted mb-0">Your subscription will renew automatically each month</p>
            </div>
          </div>
          
          <div className="d-flex">
            <div className="rounded-circle bg-success bg-opacity-10 p-2 me-3">
              <CreditCard size={20} className="text-success" />
            </div>
            <div>
              <h5 className="mb-1 fw-medium">Flexible Cancellation</h5>
              <p className="text-muted mb-0">You can cancel your subscription at any time from your account settings</p>
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default BillingPage;
