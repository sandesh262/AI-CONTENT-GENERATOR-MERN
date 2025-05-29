import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const TemplateCard = ({ name, desc, icon, slug, category }) => {
  return (
    <div className="card template-card shadow-sm h-100">
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="rounded bg-light d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
            <img 
              src={icon} 
              alt={name} 
              style={{ width: '32px', height: '32px' }}
            />
          </div>
          <div>
            <span className="badge bg-light text-secondary">
              {category}
            </span>
          </div>
        </div>
        
        <h5 className="card-title fw-semibold mb-2">{name}</h5>
        <p className="card-text text-secondary small mb-3" style={{ minHeight: '40px' }}>{desc}</p>
        
        <Link 
          to={`/generate/${slug}`}
          className="text-primary text-decoration-none d-inline-flex align-items-center fw-medium"
        >
          Generate
          <ArrowRight className="ms-1" size={16} />
        </Link>
      </div>
    </div>
  );
};

export default TemplateCard;
