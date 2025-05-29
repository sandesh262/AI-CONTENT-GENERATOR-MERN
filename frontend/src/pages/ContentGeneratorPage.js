import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Copy, Download, Loader2, Sparkles, Info, Type, AlignLeft, List, Calendar } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const getFieldIcon = (type) => {
  switch (type) {
    case 'text':
      return <Type size={16} className="text-primary me-1" />;
    case 'textarea':
      return <AlignLeft size={16} className="text-primary me-1" />;
    case 'select':
      return <List size={16} className="text-primary me-1" />;
    case 'date':
      return <Calendar size={16} className="text-primary me-1" />;
    default:
      return <Type size={16} className="text-primary me-1" />;
  }
};

const ContentGeneratorPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`/api/templates/${slug}`);
        if (response.data.success) {
          setTemplate(response.data.template);
        } else {
          toast.error('Template not found');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load template');
        navigate('/dashboard');
      } finally {
        setTemplateLoading(false);
      }
    };

    fetchTemplate();
  }, [slug, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('/api/content/generate', {
        templateSlug: template.slug,
        templateName: template.name,
        formData,
        aiPrompt: template.aiPrompt
      });
      
      if (response.data.success) {
        setGeneratedContent(response.data.content.generatedContent);
        toast.success('Content generated successfully!');
      } else {
        toast.error('Failed to generate content');
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error('You have exhausted your credits. Please upgrade your plan.');
      } else {
        toast.error('Error generating content');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Content copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.slug}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (templateLoading) {
    return (
      <DashboardLayout>
        <div className="d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4 d-flex align-items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-link text-secondary d-flex align-items-center p-0 me-3"
        >
          <ArrowLeft size={18} className="me-1" />
          Back
        </button>
        <h1 className="fs-4 fw-bold mb-0">{template?.name}</h1>
      </div>

      <div className="row g-4">
        
        {/* Left Column - Form Section */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 p-4">
              <div className="d-flex align-items-start gap-3">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center p-2" style={{ width: '60px', height: '60px' }}>
                  <img src={template?.icon} alt={template?.name} style={{ width: '36px', height: '36px' }} />
                </div>
                <div>
                  <h2 className="fs-4 fw-bold mb-1">{template?.name}</h2>
                  <p className="text-secondary mb-0">{template?.desc}</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              <div className="bg-light p-3 rounded-3 mb-4 border-start border-primary border-4">
                <div className="d-flex align-items-center mb-2">
                  <Info size={18} className="text-primary me-2" />
                  <span className="text-primary fw-semibold">Instructions</span>
                </div>
                <p className="small mb-0">
                  Fill in the form below to generate content. All fields are required for optimal results.
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                {template?.form?.map((field, index) => (
                  <div className="mb-3" key={index}>
                    <label htmlFor={field.name} className="form-label fw-medium d-flex align-items-center">
                      {getFieldIcon(field.type)}
                      <span className="ms-1">{field.label}</span>
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        className="form-control"
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        rows="4"
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        required
                      />
                    ) : field.type === 'select' ? (
                      <select
                        className="form-select"
                        id={field.name}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select an option</option>
                        {field.options?.map((option, i) => (
                          <option key={i} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="form-control"
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        required
                      />
                    )}
                    
                    {field.helpText && (
                      <div className="form-text small">{field.helpText}</div>
                    )}
                  </div>
                ))}

                <div className="d-grid mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 rounded-pill d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin me-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} className="me-2" />
                        Generate Content
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            <div className="card-footer bg-white border-0 text-center p-3 d-flex align-items-center justify-content-center">
              <span className="badge bg-light text-primary rounded-pill px-3 py-2 d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-lightning-charge-fill me-1" viewBox="0 0 16 16">
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
                </svg>
                Using 1 credit
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Output Section */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center p-4">
              <div>
                <h5 className="fw-bold mb-1">Generated Content</h5>
                <p className="text-secondary small mb-0">Your AI-generated content will appear here</p>
              </div>

              {generatedContent && (
                <div className="d-flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="btn btn-outline-primary rounded-pill"
                    title="Download as markdown"
                  >
                    <Download size={16} className="me-1" />
                    Download
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`btn rounded-pill ${copied ? 'btn-success' : 'btn-primary'}`}
                    title="Copy to clipboard"
                  >
                    <Copy size={16} className="me-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

            <div className="card-body p-0" style={{ minHeight: '600px' }}>
              {generatedContent ? (
                <div className="content-display">
                  <div className="content-toolbar bg-light p-2 border-top border-bottom d-flex justify-content-between align-items-center">
                    <span className="badge bg-success rounded-pill">AI Generated</span>
                    <span className="text-muted small">{new Date().toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-white" style={{ overflowY: 'auto', maxHeight: '550px' }}>
                    <MDEditor.Markdown
                      source={generatedContent}
                      style={{
                        whiteSpace: 'pre-wrap',
                        fontSize: '16px',
                        lineHeight: '1.6'
                      }}
                      className="content-markdown"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 my-5 d-flex flex-column align-items-center justify-content-center" style={{ height: '500px' }}>
                  <div className="mb-4 p-4 rounded-circle bg-light">
                    <img
                      src="/SpecificTemplete.jpg"
                      alt="Content Preview"
                      className="img-fluid"
                      style={{ maxHeight: '150px', opacity: 0.6 }}
                    />
                  </div>
                  <h4 className="fw-bold text-secondary mb-3">Ready to generate content</h4>
                  <p className="text-secondary mb-4 w-75">Fill out the form on the left and click the Generate Content button to create AI-powered content for your needs.</p>
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded-circle me-3">
                      <span className="text-primary">1</span>
                    </div>
                    <span>Fill the form</span>
                    <div className="mx-3">→</div>
                    <div className="bg-light p-2 rounded-circle me-3">
                      <span className="text-primary">2</span>
                    </div>
                    <span>Generate content</span>
                    <div className="mx-3">→</div>
                    <div className="bg-light p-2 rounded-circle me-3">
                      <span className="text-primary">3</span>
                    </div>
                    <span>Use or download</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentGeneratorPage;
