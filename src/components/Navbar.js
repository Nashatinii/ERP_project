import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, Folder as FolderIcon } from 'lucide-react';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <Link to="/" className="flex items-center">
          <HomeIcon size={20} className="mr-2" /> Home
        </Link>
        <Link to="/document-manager" className="flex items-center">
          <FolderIcon size={20} className="mr-2" /> Document Manager
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;