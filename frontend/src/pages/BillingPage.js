import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Check, CreditCard } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const BillingPage = () => {
  const [plans, setPlans] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const { user, updateUserPlan } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/api/billing/plans');
        if (response.data.success) {
          setPlans(response.data.plans);
        }
      } catch (error) {
        toast.error('Failed to load subscription plans');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      setProcessingPayment(true);
      
      // Create order
      const orderResponse = await axios.post('/api/billing/create-order', { planId });
      
      if (!orderResponse.data.success) {
        toast.error('Failed to create order');
        return;
      }
      
      const order = orderResponse.data.order;
      
      // Initialize Razorpay
      const options = {
        key: 'rzp_test_placeholder', // Replace with actual key from backend in production
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
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error('Failed to process payment');
      console.error(error);
    } finally {
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Subscription Plans</h1>
        <p className="text-gray-600">Upgrade your plan to get more content generation credits</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-medium text-lg text-gray-800">Current Plan</h2>
            <p className="text-gray-600 capitalize">{user?.plan || 'Free'} Plan</p>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-2 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
              </div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className={`bg-white rounded-lg shadow-sm border p-6 ${user?.plan === 'free' ? 'ring-2 ring-indigo-500' : ''}`}>
            <h3 className="font-semibold text-xl mb-2">Free Plan</h3>
            <p className="text-2xl font-bold mb-4">₹0 <span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>500,000 characters per month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Access to basic templates</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Email support</span>
              </li>
            </ul>
            <button
              className={`w-full py-2 rounded-md border ${
                user?.plan === 'free' 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
              }`}
              disabled={user?.plan === 'free'}
            >
              {user?.plan === 'free' ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>

          {/* Premium Plan */}
          <div className={`bg-white rounded-lg shadow-sm border p-6 ${user?.plan === 'premium' ? 'ring-2 ring-indigo-500' : ''}`}>
            <h3 className="font-semibold text-xl mb-2">Premium Plan</h3>
            <p className="text-2xl font-bold mb-4">{formatPrice(plans.premium?.price || 999)} <span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>2 Million characters per month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Access to all templates</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('premium')}
              className={`w-full py-2 rounded-md ${
                user?.plan === 'premium' 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              disabled={user?.plan === 'premium' || processingPayment}
            >
              {user?.plan === 'premium' 
                ? 'Current Plan' 
                : processingPayment ? 'Processing...' : 'Upgrade'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className={`bg-white rounded-lg shadow-sm border p-6 ${user?.plan === 'enterprise' ? 'ring-2 ring-indigo-500' : ''}`}>
            <h3 className="font-semibold text-xl mb-2">Enterprise Plan</h3>
            <p className="text-2xl font-bold mb-4">{formatPrice(plans.enterprise?.price || 2499)} <span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>5 Million characters per month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Access to all templates</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Priority support</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Custom templates</span>
              </li>
            </ul>
            <button
              onClick={() => handleSubscribe('enterprise')}
              className={`w-full py-2 rounded-md ${
                user?.plan === 'enterprise' 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              disabled={user?.plan === 'enterprise' || processingPayment}
            >
              {user?.plan === 'enterprise' 
                ? 'Current Plan' 
                : processingPayment ? 'Processing...' : 'Upgrade'}
            </button>
          </div>
        </div>
      )}

      {/* Payment Information */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 border text-sm text-gray-600">
        <p>* Payments are processed securely through Razorpay. Your subscription will renew automatically each month.</p>
        <p>* You can cancel your subscription at any time from your account settings.</p>
      </div>
    </DashboardLayout>
  );
};

export default BillingPage;
