import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <Link to="/" className="flex items-center">
                  <span className="text-2xl font-bold text-white drop-shadow-lg">TaskManager</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/security/login" 
                  className="inline-flex items-center px-4 py-2 border border-white/30 text-sm font-medium rounded-md text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200"
                >
                  Connexion
                </Link>
                <Link 
                  to="/security/register" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200"
                >
                  Inscription
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h2 className="text-5xl font-bold mb-6">
                Gérez vos tâches avec <span className="text-yellow-300">simplicité</span>
              </h2>
              <p className="text-xl mb-8">
                Organisez votre travail, suivez vos progrès et atteignez vos objectifs plus efficacement.
              </p>
              <div className="space-x-4">
                <Link 
                  to="/security/register" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Commencer
                </Link>
                <Link 
                  to="/security/login" 
                  className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Se connecter
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="glass p-8 rounded-2xl">
                <img 
                  src="/task-management-illustration.svg" 
                  alt="Task Management" 
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Pourquoi choisir TaskManager ?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Organisation Simplifiée",
                description: "Créez et gérez vos tâches en quelques clics",
                icon: "📋"
              },
              {
                title: "Suivi en Temps Réel",
                description: "Visualisez votre progression avec des graphiques",
                icon: "📊"
              },
              {
                title: "Collaboration Facile",
                description: "Partagez vos tâches avec votre équipe",
                icon: "👥"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="card hover:scale-105"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              Prêt à commencer ?
            </h3>
            <p className="text-xl text-indigo-100 mb-8">
              Rejoignez des milliers d&apos;utilisateurs qui ont déjà simplifié leur gestion de tâches.
            </p>
            <Link 
              to="/security/register" 
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Créer un compte gratuitement
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage; 