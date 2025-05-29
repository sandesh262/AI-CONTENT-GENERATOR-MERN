import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Search, Filter, RefreshCw, Sparkles } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import TemplateCard from '../components/TemplateCard';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/api/templates');
        if (response.data.success) {
          const templatesData = response.data.templates;
          console.log('Templates loaded:', templatesData);
          setTemplates(templatesData);
          setFilteredTemplates(templatesData);
          
          // Extract unique categories and sort them alphabetically
          const uniqueCategories = [...new Set(templatesData.map(template => template.category))].sort();
          console.log('Categories extracted:', uniqueCategories);
          setCategories(uniqueCategories);
        }
      } catch (error) {
        toast.error('Failed to load templates');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  useEffect(() => {
    let result = [...templates]; // Create a new array to avoid reference issues
    console.log('Filtering templates. Total templates:', templates.length);
    console.log('Current category filter:', selectedCategory);
    console.log('Current search query:', searchQuery);
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      result = result.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('After search filter:', result.length, 'templates');
    }
    
    // Apply category filter
    if (selectedCategory !== '') {
      result = result.filter(template => template.category === selectedCategory);
      console.log('After category filter:', result.length, 'templates');
    }
    
    console.log('Final filtered templates:', result.length);
    setFilteredTemplates(result);
  }, [searchQuery, templates, selectedCategory]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    console.log('Category selected:', category);
    setSelectedCategory(category);
  };

  const resetFilters = () => {
    console.log('Resetting all filters');
    setSearchQuery('');
    setSelectedCategory('');
    setFilteredTemplates(templates);
  };

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hero-section rounded-4 p-4 mb-5"
      >
        <div className="mb-4">
          <h1 className="display-6 fw-bold mb-2">
            <span className="text-white">Welcome back,</span> <span className="text-white">{user?.name}</span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="ms-2 d-inline-block"
            >
              <Sparkles className="text-warning" size={24} />
            </motion.span>
          </h1>
          <p className="text-white mb-0 opacity-75">Choose a template to create your content</p>
        </div>
        
        {/* Search and Filter Section - now inside the hero section */}
        <div className="mt-4">
          <div className="row align-items-center g-3">
            <div className="col-lg-6 mb-3 mb-lg-0">
              <div className="position-relative search-container">
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                  <Search className="search-icon" size={20} />
                </div>
                <motion.input
                  whileFocus={{ boxShadow: '0 0 0 0.25rem rgba(255, 255, 255, 0.25)' }}
                  type="text"
                  placeholder="Search templates by name or category..."
                  className="form-control form-control-lg ps-5 border-0 shadow-sm search-input"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="position-relative filter-container">
                <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                  <Filter className="filter-icon" size={18} />
                </div>
                <motion.select 
                  whileFocus={{ boxShadow: '0 0 0 0.25rem rgba(255, 255, 255, 0.25)' }}
                  className="form-select form-select-lg ps-5 border-0 shadow-sm filter-select"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </motion.select>
              </div>
            </div>
            <div className="col-lg-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2 reset-btn"
                onClick={resetFilters}
              >
                <RefreshCw size={16} />
                Reset
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
      
      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
          box-shadow: 0 8px 20px rgba(71, 118, 230, 0.2);
        }
        .search-container:hover .search-icon {
          color: #ffffff !important;
          transform: scale(1.1);
        }
        .search-icon {
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .search-input {
          background-color: rgba(255, 255, 255, 0.9);
        }
        .search-input:focus {
          background-color: #ffffff;
          border-color: #4776E6;
        }
        .filter-container:hover .filter-icon {
          color: #ffffff !important;
          transform: scale(1.1);
        }
        .filter-icon {
          color: #ffffff;
          transition: all 0.3s ease;
        }
        .filter-select {
          background-color: rgba(255, 255, 255, 0.9);
        }
        .filter-select:focus {
          background-color: #ffffff;
          border-color: #8E54E9;
        }
        .reset-btn {
          background-color: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
          color: #ffffff;
        }
        .reset-btn:hover {
          background: #ffffff;
          border-color: transparent;
          color: #8E54E9;
          box-shadow: 0 4px 12px rgba(142, 84, 233, 0.2);
        }
      `}</style>


      {/* Templates Display Section */}
      {loading ? (
        <div className="row g-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card shadow-sm p-4 placeholder-glow">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="placeholder rounded bg-secondary" style={{ width: '48px', height: '48px' }}></div>
                  <div className="placeholder col-4 rounded"></div>
                </div>
                <div className="placeholder col-8 mb-2"></div>
                <div className="placeholder col-12 mb-1"></div>
                <div className="placeholder col-7 mb-3"></div>
                <div className="placeholder col-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-secondary">No templates found matching your criteria</p>
            </div>
          ) : (
            <>
              {/* If no category is selected or we're showing all categories */}
              {!selectedCategory && (
                <>
                  {/* Popular Templates */}
                  <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="fw-bold mb-0">Popular Templates</h2>
                      <button className="btn btn-link text-decoration-none p-0">View all</button>
                    </div>
                    <div className="row g-4">
                      {filteredTemplates
                        .filter(template => template.category === 'Blog' || template.category === 'Marketing')
                        .slice(0, 3)
                        .map((template) => (
                          <div key={template.slug} className="col-md-6 col-lg-4">
                            <TemplateCard
                              name={template.name}
                              desc={template.desc}
                              icon={template.icon}
                              slug={template.slug}
                              category={template.category}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Social Media Templates */}
                  <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="fw-bold mb-0">Social Media</h2>
                      <button className="btn btn-link text-decoration-none p-0">View all</button>
                    </div>
                    <div className="row g-4">
                      {filteredTemplates
                        .filter(template => template.category === 'Social Media')
                        .map((template) => (
                          <div key={template.slug} className="col-md-6 col-lg-4">
                            <TemplateCard
                              name={template.name}
                              desc={template.desc}
                              icon={template.icon}
                              slug={template.slug}
                              category={template.category}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Blog Templates */}
                  <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="fw-bold mb-0">Blog Content</h2>
                      <button className="btn btn-link text-decoration-none p-0">View all</button>
                    </div>
                    <div className="row g-4">
                      {filteredTemplates
                        .filter(template => template.category === 'Blog')
                        .map((template) => (
                          <div key={template.slug} className="col-md-6 col-lg-4">
                            <TemplateCard
                              name={template.name}
                              desc={template.desc}
                              icon={template.icon}
                              slug={template.slug}
                              category={template.category}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Email Marketing Templates */}
                  <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="fw-bold mb-0">Email Marketing</h2>
                      <button className="btn btn-link text-decoration-none p-0">View all</button>
                    </div>
                    <div className="row g-4">
                      {filteredTemplates
                        .filter(template => template.category === 'Email')
                        .map((template) => (
                          <div key={template.slug} className="col-md-6 col-lg-4">
                            <TemplateCard
                              name={template.name}
                              desc={template.desc}
                              icon={template.icon}
                              slug={template.slug}
                              category={template.category}
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* SEO Content Templates */}
                  <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h2 className="fw-bold mb-0">SEO Content</h2>
                      <button className="btn btn-link text-decoration-none p-0">View all</button>
                    </div>
                    <div className="row g-4">
                      {filteredTemplates
                        .filter(template => template.category === 'SEO')
                        .map((template) => (
                          <div key={template.slug} className="col-md-6 col-lg-4">
                            <TemplateCard
                              name={template.name}
                              desc={template.desc}
                              icon={template.icon}
                              slug={template.slug}
                              category={template.category}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}

              {/* If a specific category is selected, only show that category */}
              {selectedCategory && (
                <div className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0">{selectedCategory}</h2>
                    <button className="btn btn-link text-decoration-none p-0">View all</button>
                  </div>
                  <div className="row g-4">
                    {filteredTemplates.map((template) => (
                      <div key={template.slug} className="col-md-6 col-lg-4">
                        <TemplateCard
                          name={template.name}
                          desc={template.desc}
                          icon={template.icon}
                          slug={template.slug}
                          category={template.category}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
