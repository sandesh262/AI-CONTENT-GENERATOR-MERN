import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Copy, Download } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

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
            <div className="card-body p-4">
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center p-2" style={{ width: '60px', height: '60px' }}>
                  <img src={template?.icon} alt={template?.name} style={{ width: '36px', height: '36px' }} />
                </div>
                <div>
                  <h2 className="fs-4 fw-bold">{template?.name}</h2>
                  <p className="text-secondary mb-0">{template?.desc}</p>
                </div>
              </div>

              <div className="bg-light p-3 rounded-3 mb-4">
                <h6 className="fw-bold mb-2">Instructions</h6>
                <p className="small mb-0">Fill in the form below with your requirements. The more details you provide, the better the generated content will be. All fields marked with * are required.</p>
              </div>

              <form onSubmit={handleSubmit}>
                {template?.form?.map((field, index) => (
                  <div key={index} className="mb-4">
                    <label className="form-label fw-semibold">
                      {field.label}
                      {field.required && <span className="text-danger ms-1">*</span>}
                    </label>
                    
                    {field.field === 'input' ? (
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || ''}
                        required={field.required}
                        className="form-control form-control-lg shadow-sm border-0"
                      />
                    ) : field.field === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder || ''}
                        required={field.required}
                        className="form-control form-control-lg shadow-sm border-0"
                        style={{ minHeight: '150px' }}
                      />
                    ) : null}
                    {field.description && (
                      <div className="form-text small">{field.description}</div>
                    )}
                  </div>
                ))}

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg py-3 fw-semibold mt-3 d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Generating Content...
                      </>
                    ) : (
                      'Generate Content'
                    )}
                  </button>
                  <p className="text-center small text-secondary mt-2 mb-0">Using 1 credit</p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column - Output Section */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center p-4">
              <div>
                <h5 className="fw-bold mb-1">Generated Content</h5>
                <p className="text-secondary small mb-0">Your content will appear here after generation</p>
              </div>
              
              {generatedContent && (
                <div className="d-flex gap-2">
                  <button
                    onClick={handleDownload}
                    className="btn btn-outline-primary"
                    title="Download as markdown"
                  >
                    <Download size={18} className="me-2" />
                    Download
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
                    title="Copy to clipboard"
                  >
                    <Copy size={18} className="me-2" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="card-body p-4" style={{ minHeight: '500px', backgroundColor: '#f9f9f9' }}>
              {generatedContent ? (
                <div className="bg-white p-4 rounded-3 shadow-sm">
                  <MDEditor.Markdown 
                    source={generatedContent} 
                    style={{ whiteSpace: 'pre-wrap' }}
                  />
                </div>
              ) : (
                <div className="text-center py-5 my-5">
                  <img 
                    src="/SpecificTemplete.jpg" 
                    alt="Content Preview" 
                    className="img-fluid mb-4" 
                    style={{ maxHeight: '200px', opacity: 0.4 }} 
                  />
                  <h4 className="fw-bold text-secondary">Your content will appear here</h4>
                  <p className="text-secondary">Fill out the form and click Generate Content</p>
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
