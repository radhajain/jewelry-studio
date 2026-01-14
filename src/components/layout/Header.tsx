import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-h3 font-serif text-stone-900 hover:text-stone-600 transition-colors">
            Jewelry Studio
          </Link>

          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="text-body text-stone-600 hover:text-stone-900 transition-colors"
            >
              Collections
            </Link>
            <button
              onClick={() => navigate('/collections/new')}
              className="btn btn-primary"
            >
              New Collection
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
