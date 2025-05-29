import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Clock, Eye, Search } from 'lucide-react';
import moment from 'moment';
import DashboardLayout from '../components/DashboardLayout';
import MDEditor from '@uiw/react-md-editor';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/content/history');
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
    if (searchQuery.trim() === '') {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(item => 
        item.templateName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, history]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const viewContent = (content) => {
    setSelectedContent(content);
  };

  const closeModal = () => {
    setSelectedContent(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Content History</h1>
        <p className="text-gray-600">View your previously generated content</p>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by template name..."
            className="pl-10 form-input"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* History List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="py-4 border-b last:border-0">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No history found</h3>
              <p className="text-gray-500">
                {searchQuery ? `No results matching "${searchQuery}"` : "You haven't generated any content yet"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="divide-y">
                {filteredHistory.map((item) => (
                  <div key={item._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{item.templateName}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Generated {moment(item.createdAt).fromNow()} • 
                          {item.charactersGenerated.toLocaleString()} characters
                        </p>
                      </div>
                      <button
                        onClick={() => viewContent(item)}
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                        title="View content"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Content Viewer Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="font-semibold text-lg">{selectedContent.templateName}</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <MDEditor.Markdown 
                source={selectedContent.generatedContent} 
                style={{ whiteSpace: 'pre-wrap' }}
              />
            </div>
            <div className="border-t p-4 text-sm text-gray-500">
              Generated on {new Date(selectedContent.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default HistoryPage;
