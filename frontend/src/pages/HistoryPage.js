import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Clock, Eye, Search, Calendar, FileText, Download, Copy, X, Filter, Sparkles, ChevronRight } from 'lucide-react';
import moment from 'moment';
import DashboardLayout from '../components/DashboardLayout';
import MDEditor from '@uiw/react-md-editor';
import { motion, AnimatePresence } from 'framer-motion';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/content/history');
        if (response.data.success) {
          setHistory(response.data.contents);
          setFilteredHistory(response.data.contents);
        }
      } catch (error) {
        toast.error('Failed to load history');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    let filtered = [...history];
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(item => 
        item.templateName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply date filter
    if (filterOption !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt);
        switch(filterOption) {
          case 'today':
            return itemDate >= today;
          case 'yesterday':
            return itemDate >= yesterday && itemDate < today;
          case 'week':
            return itemDate >= lastWeek;
          case 'month':
            return itemDate >= lastMonth;
          default:
            return true;
        }
      });
    }
    
    setFilteredHistory(filtered);
  }, [searchQuery, history, filterOption]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const viewContent = (content) => {
    setSelectedContent(content);
  };

  const closeModal = () => {
    setSelectedContent(null);
    setCopied(false);
  };
  
  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Content copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy content');
    }
  };
  
  const handleDownload = (content, templateName) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Content downloaded successfully');
  };
  
  const setFilter = (option) => {
    setFilterOption(option);
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
                <Clock size={22} className="me-2 text-primary" />
                Content History
              </h1>
              <p className="text-muted">View and manage your previously generated content</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Search size={18} className="text-muted" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by template name..."
                    className="form-control border-start-0 ps-0"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="dropdown">
                  <button className="btn btn-outline-secondary d-flex align-items-center justify-content-between w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <div className="d-flex align-items-center">
                      <Filter size={16} className="me-2" />
                      <span>Filter: {filterOption === 'all' ? 'All Time' : 
                        filterOption === 'today' ? 'Today' :
                        filterOption === 'yesterday' ? 'Yesterday' :
                        filterOption === 'week' ? 'Last 7 Days' : 'Last 30 Days'}</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                  <ul className="dropdown-menu w-100">
                    <li><button className="dropdown-item" onClick={() => setFilter('all')}>All Time</button></li>
                    <li><button className="dropdown-item" onClick={() => setFilter('today')}>Today</button></li>
                    <li><button className="dropdown-item" onClick={() => setFilter('yesterday')}>Yesterday</button></li>
                    <li><button className="dropdown-item" onClick={() => setFilter('week')}>Last 7 Days</button></li>
                    <li><button className="dropdown-item" onClick={() => setFilter('month')}>Last 30 Days</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* History List */}
      {loading ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <div className="placeholder-glow">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="py-3 border-bottom">
                  <div className="placeholder col-4 mb-2"></div>
                  <div className="placeholder col-7 mb-1"></div>
                  <div className="placeholder col-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {filteredHistory.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-0 shadow-sm text-center"
            >
              <div className="card-body p-5">
                <div className="mb-4 p-3 rounded-circle bg-light d-inline-block mx-auto">
                  <Clock size={32} className="text-secondary" />
                </div>
                <h3 className="fs-5 fw-medium mb-2">No history found</h3>
                <p className="text-muted mb-0">
                  {searchQuery ? `No results matching "${searchQuery}"` : "You haven't generated any content yet"}
                </p>
                {searchQuery && (
                  <button 
                    className="btn btn-sm btn-outline-secondary mt-3"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="list-group list-group-flush">
                {filteredHistory.map((item, index) => (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="list-group-item list-group-item-action p-4 border-bottom"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1 fw-medium d-flex align-items-center">
                          <FileText size={16} className="me-2 text-primary" />
                          {item.templateName}
                        </h5>
                        <p className="text-muted small mb-0 d-flex align-items-center">
                          <Calendar size={14} className="me-1" />
                          <span className="me-2">{moment(item.createdAt).format('MMM D, YYYY [at] h:mm A')}</span>
                          <span className="badge bg-light text-secondary rounded-pill">
                            {item.charactersGenerated.toLocaleString()} characters
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => viewContent(item)}
                        className="btn btn-sm btn-primary rounded-pill d-flex align-items-center"
                        style={{
                          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                          border: 'none'
                        }}
                      >
                        <Eye size={14} className="me-1" />
                        View
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="card-footer bg-white border-0 text-center py-3">
                <p className="text-muted small mb-0">
                  Showing {filteredHistory.length} of {history.length} entries
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Content Viewer Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)', 
              zIndex: 1050 
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-4 shadow-lg w-100"
              style={{ maxWidth: '800px', maxHeight: '90vh' }}
            >
              <div className="d-flex flex-column h-100" style={{ maxHeight: '90vh' }}>
                <div className="border-bottom p-4 d-flex justify-content-between align-items-center">
                  <h4 className="fw-semibold mb-0 d-flex align-items-center">
                    <Sparkles size={18} className="me-2 text-primary" />
                    {selectedContent.templateName}
                  </h4>
                  <button
                    onClick={closeModal}
                    className="btn btn-sm btn-light rounded-circle"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="p-0 overflow-auto flex-grow-1">
                  <div className="content-toolbar bg-light p-2 border-bottom d-flex justify-content-between align-items-center">
                    <span className="badge bg-primary rounded-pill d-flex align-items-center">
                      <Sparkles size={12} className="me-1" />
                      AI Generated
                    </span>
                    <div className="d-flex gap-2">
                      <button 
                        onClick={() => handleCopy(selectedContent.generatedContent)}
                        className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-secondary'} d-flex align-items-center`}
                      >
                        <Copy size={14} className="me-1" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button 
                        onClick={() => handleDownload(selectedContent.generatedContent, selectedContent.templateName)}
                        className="btn btn-sm btn-outline-primary d-flex align-items-center"
                      >
                        <Download size={14} className="me-1" />
                        Download
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white">
                    <MDEditor.Markdown 
                      source={selectedContent.generatedContent} 
                      style={{
                        whiteSpace: 'pre-wrap',
                        fontSize: '16px',
                        lineHeight: '1.6'
                      }}
                      className="content-markdown"
                    />
                  </div>
                </div>
                
                <div className="border-top p-3 text-muted small d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Calendar size={14} className="me-1" />
                    Generated on {new Date(selectedContent.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <span className="badge bg-light text-secondary">
                      {selectedContent.charactersGenerated?.toLocaleString() || 0} characters
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default HistoryPage;
