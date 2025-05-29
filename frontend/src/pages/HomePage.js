import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, FileText, MessageSquare, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

const features = [
  {
    icon: <Zap className="text-primary" size={40} />,
    title: 'Lightning Fast',
    description: 'Generate high-quality content in seconds, not hours',
  },
  {
    icon: <FileText className="text-primary" size={40} />,
    title: '25+ Templates',
    description: 'From blog posts to social media captions and more',
  },
  {
    icon: <MessageSquare className="text-primary" size={40} />,
    title: 'Natural Language',
    description: 'Content that sounds human-written and engaging',
  },
  {
    icon: <Sparkles className="text-primary" size={40} />,
    title: 'SEO Optimized',
    description: 'Content designed to rank well in search engines',
  },
];

const HomePage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      
      {/* Hero Section */}
      <div className="position-relative" style={{ 
        background: 'linear-gradient(120deg, #4338ca 0%, #3b82f6 100%)',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        paddingBottom: '7rem'
      }}>
        {/* Animated Wave Background */}
        <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ opacity: 0.1 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ position: 'absolute', bottom: 0 }}>
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,186.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ position: 'absolute', top: 0, transform: 'rotate(180deg)' }}>
            <path fill="#ffffff" fillOpacity="0.5" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Glowing Orbs */}
        <div className="position-absolute rounded-circle" style={{ 
          top: '20%', 
          right: '15%', 
          width: '300px', 
          height: '300px', 
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', 
          filter: 'blur(40px)'
        }}></div>
        <div className="position-absolute rounded-circle" style={{ 
          bottom: '30%', 
          left: '10%', 
          width: '200px', 
          height: '200px', 
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', 
          filter: 'blur(30px)'
        }}></div>
        
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white mb-5 mb-lg-0">
              {/* Hero Badge */}
              <div className="d-inline-flex align-items-center rounded-pill bg-white bg-opacity-20 text-white fw-semibold px-3 py-2 mb-4">
                <span className="me-2">✨</span> Next-Gen Content Creation
              </div>
              
              {/* Hero Title */}
              <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: '1.1' }}>
                Create <span style={{ color: '#f0f9ff', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.3)', textUnderlineOffset: '8px' }}>Exceptional</span> Content with AI
              </h1>
              
              {/* Hero Description */}
              <p className="lead mb-5" style={{ opacity: 0.9, maxWidth: '550px', fontSize: '1.2rem' }}>
                Our AI-powered platform helps you generate high-quality content for blogs, social media, emails, and more in seconds.
              </p>

              {/* CTA Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Link to="/register" className="btn px-5 py-3" style={{ 
                  background: 'white',
                  color: '#4338ca',
                  fontWeight: '600',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.2s ease',
                  border: 'none'
                }}>
                  Get Started Free
                </Link>
                <Link to="/login" className="btn px-5 py-3" style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontWeight: '600',
                  borderRadius: '30px',
                  textDecoration: 'none',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'background 0.2s ease'
                }}>
                  Sign in
                </Link>
              </div>
              
              {/* Stats */}
              <div className="d-flex flex-wrap gap-4 mt-5">
                <div>
                  <div className="d-flex align-items-baseline">
                    <span className="display-6 fw-bold me-2">10x</span>
                    <span className="text-white-50">Faster</span>
                  </div>
                  <div className="small text-white-50">than manual writing</div>
                </div>
                <div>
                  <div className="d-flex align-items-baseline">
                    <span className="display-6 fw-bold me-2">25+</span>
                    <span className="text-white-50">Templates</span>
                  </div>
                  <div className="small text-white-50">for any content need</div>
                </div>
                <div>
                  <div className="d-flex align-items-baseline">
                    <span className="display-6 fw-bold me-2">100%</span>
                    <span className="text-white-50">Original</span>
                  </div>
                  <div className="small text-white-50">plagiarism-free content</div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 d-none d-lg-block">
              <div className="position-relative" style={{ height: '550px' }}>
                {/* Abstract Animated Shapes */}
                <div className="position-absolute" style={{ 
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden'
                }}>
                  {/* Large Circle */}
                  <div className="position-absolute rounded-circle" style={{ 
                    top: '10%',
                    right: '5%',
                    width: '300px',
                    height: '300px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                    animation: 'float 8s ease-in-out infinite'
                  }}></div>
                  
                  {/* Medium Circle */}
                  <div className="position-absolute rounded-circle" style={{ 
                    bottom: '15%',
                    left: '10%',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                    animation: 'float 6s ease-in-out infinite'
                  }}></div>
                  
                  {/* Small Circle */}
                  <div className="position-absolute rounded-circle" style={{ 
                    top: '40%',
                    left: '30%',
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
                    animation: 'float 4s ease-in-out infinite'
                  }}></div>
                </div>
                
                {/* Content Type Showcase */}
                <div className="position-absolute" style={{ 
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  maxWidth: '500px'
                }}>
                  <style>
                    {`
                      @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                        100% { transform: translateY(0px); }
                      }
                      
                      @keyframes pulse {
                        0% { opacity: 0.7; }
                        50% { opacity: 1; }
                        100% { opacity: 0.7; }
                      }
                      
                      .content-type-card {
                        transition: all 0.3s ease;
                      }
                      
                      .content-type-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                      }
                    `}
                  </style>
                  
                  <div className="row g-4">
                    <div className="col-6">
                      <div className="content-type-card h-100 p-4 rounded-4 d-flex flex-column align-items-center justify-content-center text-center" style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div className="rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ 
                          width: '70px', 
                          height: '70px', 
                          background: 'rgba(255, 255, 255, 0.2)',
                          animation: 'pulse 3s infinite'
                        }}>
                          <FileText size={35} className="text-white" />
                        </div>
                        <h5 className="text-white fw-bold mb-2">Blog Posts</h5>
                        <p className="text-white-50 mb-0 small">Professional articles optimized for engagement</p>
                      </div>
                    </div>
                    
                    <div className="col-6">
                      <div className="content-type-card h-100 p-4 rounded-4 d-flex flex-column align-items-center justify-content-center text-center" style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div className="rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ 
                          width: '70px', 
                          height: '70px', 
                          background: 'rgba(255, 255, 255, 0.2)',
                          animation: 'pulse 3s infinite'
                        }}>
                          <MessageSquare size={35} className="text-white" />
                        </div>
                        <h5 className="text-white fw-bold mb-2">Social Media</h5>
                        <p className="text-white-50 mb-0 small">Engaging posts that drive interaction</p>
                      </div>
                    </div>
                    
                    <div className="col-6">
                      <div className="content-type-card h-100 p-4 rounded-4 d-flex flex-column align-items-center justify-content-center text-center" style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div className="rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ 
                          width: '70px', 
                          height: '70px', 
                          background: 'rgba(255, 255, 255, 0.2)',
                          animation: 'pulse 3s infinite'
                        }}>
                          <Zap size={35} className="text-white" />
                        </div>
                        <h5 className="text-white fw-bold mb-2">Email Copy</h5>
                        <p className="text-white-50 mb-0 small">Compelling emails with high open rates</p>
                      </div>
                    </div>
                    
                    <div className="col-6">
                      <div className="content-type-card h-100 p-4 rounded-4 d-flex flex-column align-items-center justify-content-center text-center" style={{ 
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                      }}>
                        <div className="rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ 
                          width: '70px', 
                          height: '70px', 
                          background: 'rgba(255, 255, 255, 0.2)',
                          animation: 'pulse 3s infinite'
                        }}>
                          <Sparkles size={35} className="text-white" />
                        </div>
                        <h5 className="text-white fw-bold mb-2">Ad Copy</h5>
                        <p className="text-white-50 mb-0 small">Persuasive copy that converts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold mb-2">POWERFUL FEATURES</h6>
            <h2 className="display-5 fw-bold mb-3">Everything you need to create amazing content</h2>
            <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>Our AI-powered tools help you create professional content in minutes instead of hours.</p>
          </div>
          
          <div className="row g-4 justify-content-center">
            {features.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm p-4 rounded-4">
                  <div className="mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h4 className="fw-bold mb-3">{feature.title}</h4>
                  <p className="text-secondary mb-0">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="bg-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-5 mb-lg-0">
              <h6 className="text-primary fw-bold mb-2">HOW IT WORKS</h6>
              <h2 className="display-5 fw-bold mb-4">Create content in three simple steps</h2>
              <p className="lead text-secondary mb-5">Our platform makes content creation simple, fast, and effective.</p>
              
              <div className="d-flex mb-4">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-4" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                  <span className="fw-bold">1</span>
                </div>
                <div>
                  <h4 className="fw-bold mb-2">Choose a Template</h4>
                  <p className="text-secondary">Select from our wide range of content templates designed for different needs.</p>
                </div>
              </div>
              
              <div className="d-flex mb-4">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-4" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                  <span className="fw-bold">2</span>
                </div>
                <div>
                  <h4 className="fw-bold mb-2">Fill the Form</h4>
                  <p className="text-secondary">Provide some basic information about your content requirements and preferences.</p>
                </div>
              </div>
              
              <div className="d-flex">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-4" style={{ width: '50px', height: '50px', flexShrink: 0 }}>
                  <span className="fw-bold">3</span>
                </div>
                <div>
                  <h4 className="fw-bold mb-2">Get Results</h4>
                  <p className="text-secondary">Receive high-quality AI-generated content in seconds, ready to use or customize.</p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-7 d-none d-lg-block">
              <div className="position-relative" style={{ height: '450px' }}>
                {/* Floating UI Cards */}
                <div className="position-absolute shadow-lg" style={{ 
                  top: '10%',
                  right: '5%',
                  width: '65%',
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 3
                }}>
                  <div className="p-3 border-bottom bg-light">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle p-1 me-2">
                        <FileText size={16} className="text-white" />
                      </div>
                      <span className="fw-bold">Blog Post Generator</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="bg-light rounded p-2 mb-2"></div>
                    <div className="bg-light rounded p-2 mb-2" style={{ width: '85%' }}></div>
                    <div className="bg-light rounded p-2 mb-3" style={{ width: '70%' }}></div>
                    <div className="d-flex">
                      <div className="badge bg-primary me-2">SEO-Optimized</div>
                      <div className="badge bg-success">Ready to Publish</div>
                    </div>
                  </div>
                </div>
                
                <div className="position-absolute shadow-lg" style={{ 
                  bottom: '10%',
                  left: '10%',
                  width: '60%',
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 2
                }}>
                  <div className="p-3 border-bottom bg-light">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle p-1 me-2">
                        <MessageSquare size={16} className="text-white" />
                      </div>
                      <span className="fw-bold">Social Media Post</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="bg-light rounded p-2 mb-3" style={{ width: '90%' }}></div>
                    <div className="d-flex">
                      <div className="badge bg-info me-2">Engaging</div>
                      <div className="badge bg-warning text-dark">Trending</div>
                    </div>
                  </div>
                </div>
                
                {/* Main Generator Card */}
                <div className="position-absolute shadow-lg" style={{ 
                  top: '30%',
                  left: '25%',
                  width: '70%',
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  zIndex: 1
                }}>
                  <div className="p-3 border-bottom bg-light">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle p-1 me-2">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <span className="fw-bold">AI Content Generator</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="bg-light rounded-pill px-3 py-1 small">25+ Templates</div>
                      <div className="bg-primary bg-opacity-10 rounded-pill px-3 py-1 text-primary small">Pro</div>
                    </div>
                    <div className="bg-light rounded p-2 mb-2"></div>
                    <div className="bg-light rounded p-2 mb-3"></div>
                    <button className="btn btn-primary w-100 py-2">Generate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-5" style={{ backgroundColor: '#1a1a2e' }}>
        <div className="container py-5 text-center text-white">
          <h2 className="display-5 fw-bold mb-4">Ready to transform your content creation?</h2>
          <p className="lead mb-5 mx-auto" style={{ maxWidth: '700px', opacity: 0.9 }}>Join thousands of professionals who trust our AI to generate high-quality content that engages and converts.</p>
          <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 fw-semibold">
            Get started for free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-4 mb-md-0">
              <h5 className="fw-bold mb-3">AI Content Generator</h5>
              <p className="text-white-50 mb-0">Creating professional content has never been easier. Our AI-powered platform helps you generate high-quality content in seconds.</p>
            </div>
            <div className="col-md-2 mb-4 mb-md-0">
              <h6 className="fw-bold mb-3">Product</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Features</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Pricing</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Templates</a></li>
              </ul>
            </div>
            <div className="col-md-2 mb-4 mb-md-0">
              <h6 className="fw-bold mb-3">Company</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">About</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Blog</a></li>
                <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none">Contact</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="fw-bold mb-3">Subscribe to our newsletter</h6>
              <p className="text-white-50 mb-3">Get the latest updates and news directly in your inbox.</p>
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Your email address" />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </div>
          </div>
          <hr className="my-4 bg-secondary" />
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-white-50">© {new Date().getFullYear()} AI Content Generator. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-flex justify-content-center justify-content-md-end gap-3">
                <a href="#" className="text-white-50"><i className="bi bi-facebook"></i></a>
                <a href="#" className="text-white-50"><i className="bi bi-twitter"></i></a>
                <a href="#" className="text-white-50"><i className="bi bi-instagram"></i></a>
                <a href="#" className="text-white-50"><i className="bi bi-linkedin"></i></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
