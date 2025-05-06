import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getState } from './redux/slices/authSlice';
import LandingPage from './pages/LandingPage';
import Home from './pages/home';
import Layout from './pages/layout';
import Login from './pages/login';
import Register from './pages/register';
import Activation from './pages/activation';
import PrivateRoute from './components/privateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const { isAuthenticated } = useSelector(getState);
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen w-screen bg-background-color text-text-color">
      {!isLandingPage && <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Routes de sécurité */}
          <Route path="/security">
            <Route path="login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
            <Route path="register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
            <Route path="activation/:token" element={<Activation />} />
          </Route>

          {/* Routes alternatives pour compatibilité */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
          <Route path="/activation/:token" element={<Activation />} />
          
          {/* Routes protégées */}
          <Route element={<Layout />}>
            <Route 
              path="/home" 
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } 
            />
          </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
}

export default App;
