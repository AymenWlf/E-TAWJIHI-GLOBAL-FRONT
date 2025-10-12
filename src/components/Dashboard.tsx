import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Mail, Shield, BookOpen, Brain, Target, Search, Building } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  E-Tawjihi.ma
                </h1>
                <p className="text-xs text-gray-500">Tableau de bord</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bienvenue, {currentUser?.firstName || 'Utilisateur'} ! 👋
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Découvrez votre parcours d'orientation personnalisé avec E-Tawjihi
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
              <p className="text-gray-700">
                Votre compte a été créé avec succès. Vous pouvez maintenant accéder à tous nos services d'orientation.
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <User className="h-6 w-6 mr-3 text-blue-600" />
            Informations du compte
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{currentUser?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium text-gray-900">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Rôles</p>
                  <div className="flex flex-wrap gap-2">
                    {currentUser?.roles.map((role, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 p-3 rounded-xl w-fit mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Test d'orientation</h3>
            <p className="text-gray-600 text-sm mb-4">
              Passez notre test basé sur le modèle RIASEC pour découvrir vos intérêts.
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Commencer le test →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-green-100 p-3 rounded-xl w-fit mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommandations</h3>
            <p className="text-gray-600 text-sm mb-4">
              Recevez des suggestions personnalisées de filières et d'écoles.
            </p>
            <button className="text-green-600 hover:text-green-700 font-semibold text-sm">
              Voir mes résultats →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 p-3 rounded-xl w-fit mb-4">
              <Search className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recherche d'écoles</h3>
            <p className="text-gray-600 text-sm mb-4">
              Explorez plus de 200 établissements d'enseignement supérieur.
            </p>
            <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
              Explorer les écoles →
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="bg-orange-100 p-3 rounded-xl w-fit mb-4">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Suivi des candidatures</h3>
            <p className="text-gray-600 text-sm mb-4">
              Gérez vos candidatures et suivez leur progression.
            </p>
            <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
              Mes candidatures →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <Brain className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Commencer l'orientation</h4>
                <p className="text-sm opacity-90">Passez le test d'orientation</p>
              </div>
            </button>

            <button className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <Search className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Rechercher des écoles</h4>
                <p className="text-sm opacity-90">Explorez nos partenaires</p>
              </div>
            </button>

            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Voir mes résultats</h4>
                <p className="text-sm opacity-90">Consultez vos recommandations</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
