import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector, useDispatch } from 'react-redux'
import { getState, initState } from '../redux/slices/authSlice'
import PropTypes from 'prop-types'

const Avatar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Ferme le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    // Supprimer le token du localStorage
    localStorage.removeItem('token');
    // Réinitialiser l'état d'authentification
    dispatch(initState());
    navigate('/security/login');
  };
  
  const initials = user?.username?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initials}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user?.username || 'Utilisateur'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'email@example.com'}</p>
            </div>
            
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Modifier le profil
            </Link>
            <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              Paramètres
            </Link>
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
            >
              Se déconnecter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Avatar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string
  })
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, connectedUser } = useSelector(getState);

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/security/login', label: 'Connexion', auth: false },
    { path: '/security/register', label: 'Inscription', auth: false }
  ];

  // Filtrer les éléments de navigation en fonction de l'état d'authentification
  const filteredNavItems = navItems.filter(item => 
    item.auth === undefined || item.auth === false && !isAuthenticated || item.auth === true && isAuthenticated
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-color">TaskManager</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-8 mr-8">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'text-primary-color font-semibold'
                      : 'text-gray-600 hover:text-primary-color'
                  } transition-colors duration-200`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            {isAuthenticated && <Avatar user={connectedUser} />}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && <Avatar user={connectedUser} />}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-4 text-gray-600 hover:text-primary-color focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-primary-color text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </nav>
  )
}

export default Navbar 