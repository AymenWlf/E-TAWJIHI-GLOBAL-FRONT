import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  GraduationCap, 
  Users, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Globe,
  Star,
  TrendingUp,
  Activity,
  Languages,
  DollarSign
} from 'lucide-react';
import adminService from '../services/adminService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('establishments');
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [error, setError] = useState(null);
  const [programsError, setProgramsError] = useState(null);
  const [stats, setStats] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [programsPagination, setProgramsPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    type: '',
    universityType: '',
    isActive: ''
  });
  const [programsFilters, setProgramsFilters] = useState({
    search: '',
    establishmentId: '',
    degree: '',
    studyLevel: '',
    isActive: ''
  });

  // Load statistics
  useEffect(() => {
    loadStats();
  }, []);

  // Load establishments
  useEffect(() => {
    loadEstablishments();
  }, [pagination.page, filters]);

  // Load programs
  useEffect(() => {
    if (activeTab === 'programs') {
      loadPrograms();
    }
  }, [activeTab, programsPagination.page, programsFilters]);

  const loadStats = async () => {
    try {
      const response = await adminService.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.getEstablishments({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setEstablishments(response.data);
        setPagination(response.pagination);
      } else {
        setError('Failed to load establishments');
      }
    } catch (err) {
      setError(err.message || 'Failed to load establishments');
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    try {
      setLoadingPrograms(true);
      setProgramsError(null);
      const response = await adminService.getPrograms({
        ...programsFilters,
        page: programsPagination.page,
        limit: programsPagination.limit
      });
      if (response.success) {
        setPrograms(response.data);
        setProgramsPagination(response.pagination);
      } else {
        setProgramsError('Failed to load programs');
      }
    } catch (err) {
      setProgramsError(err.message || 'Failed to load programs');
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleProgramsPageChange = (newPage) => {
    setProgramsPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await adminService.toggleEstablishmentStatus(id);
      if (response.success) {
        loadEstablishments();
        loadStats();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet établissement ?')) {
      try {
        const response = await adminService.deleteEstablishment(id);
        if (response.success) {
          loadEstablishments();
          loadStats();
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, active: false },
    { id: 'establishments', label: 'Universités', icon: Building2, active: true },
    { id: 'programs', label: 'Programmes', icon: GraduationCap, active: false },
    { id: 'users', label: 'Utilisateurs', icon: Users, active: false, comingSoon: true },
    { id: 'translation-pricing', label: 'Prix Traductions', icon: Languages, active: false, route: '/admin/translation-pricing' },
    { id: 'parameters', label: 'Paramètres', icon: Settings, active: false }
  ];

  const getUniversityTypeColor = (type) => {
    switch (type) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCountryFlag = (country) => {
    const flags = {
      'France': '🇫🇷',
      'Canada': '🇨🇦',
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'Australia': '🇦🇺',
      'Netherlands': '🇳🇱',
      'Switzerland': '🇨🇭',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">E-TAWJIHI Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.comingSoon) return;
                if (item.route) {
                  navigate(item.route);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center px-6 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors ${
                activeTab === item.id ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : ''
              } ${item.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1">{item.label}</span>
              {item.comingSoon && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="ml-4 text-2xl font-semibold text-gray-900">
                {activeTab === 'establishments' && 'Gestion des Universités'}
                {activeTab === 'programs' && 'Gestion des Programmes'}
                {activeTab === 'parameters' && 'Paramètres système'}
                {activeTab !== 'establishments' && activeTab !== 'programs' && activeTab !== 'parameters' && 'Tableau de bord'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              {activeTab === 'establishments' && (
                <button 
                  onClick={() => navigate('/admin/establishments/new')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Université
                </button>
              )}
              {activeTab === 'programs' && (
                <button 
                  onClick={() => navigate('/admin/programs/new')}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau Programme
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeTab === 'establishments' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Universités</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.establishments.total}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Actives</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.establishments.active}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Programmes</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.programs.total}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pays</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.byCountry.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nom de l'université..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                    <select
                      value={filters.country}
                      onChange={(e) => handleFilterChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous les pays</option>
                      {stats?.byCountry.map((country) => (
                        <option key={country.country} value={country.country}>
                          {country.country} ({country.count})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous les types</option>
                      <option value="Public">Public</option>
                      <option value="Private">Privé</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type Université</label>
                    <select
                      value={filters.universityType}
                      onChange={(e) => handleFilterChange('universityType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous les types</option>
                      <option value="A">Type A</option>
                      <option value="B">Type B</option>
                      <option value="C">Type C</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      value={filters.isActive}
                      onChange={(e) => handleFilterChange('isActive', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous</option>
                      <option value="true">Actif</option>
                      <option value="false">Inactif</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Establishments Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Universités ({pagination.total})
                  </h3>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : error ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                      onClick={loadEstablishments}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Université
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pays
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Programmes
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {establishments.map((establishment) => (
                          <tr key={establishment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-12 w-12">
                                  {establishment.logo ? (
                                    <img
                                      className="h-12 w-12 rounded-lg object-cover"
                                      src={establishment.logo}
                                      alt={establishment.name}
                                    />
                                  ) : (
                                    <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                      <Building2 className="w-6 h-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {establishment.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {establishment.city}, {establishment.country}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">{getCountryFlag(establishment.country)}</span>
                                <span className="text-sm text-gray-900">{establishment.country}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUniversityTypeColor(establishment.universityType)}`}>
                                  {establishment.universityType || 'N/A'}
                                </span>
                                {establishment.featured && (
                                  <Star className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {establishment.programs || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                establishment.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {establishment.isActive ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleToggleStatus(establishment.id)}
                                  className={`p-2 rounded-lg ${
                                    establishment.isActive 
                                      ? 'text-red-600 hover:bg-red-50' 
                                      : 'text-green-600 hover:bg-green-50'
                                  }`}
                                  title={establishment.isActive ? 'Désactiver' : 'Activer'}
                                >
                                  {establishment.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => navigate(`/admin/establishments/${establishment.id}/edit`)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="Modifier"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(establishment.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {pagination.page} sur {pagination.pages} ({pagination.total} résultats)
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePageChange(pagination.page - 1)}
                          disabled={!pagination.hasPrev}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={() => handlePageChange(pagination.page + 1)}
                          disabled={!pagination.hasNext}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nom du programme ou université..."
                        value={programsFilters.search}
                        onChange={(e) => { setProgramsFilters(prev => ({ ...prev, search: e.target.value })); setProgramsPagination(prev => ({...prev, page: 1})); }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveau d'étude</label>
                    <select
                      value={programsFilters.studyLevel}
                      onChange={(e) => { setProgramsFilters(prev => ({ ...prev, studyLevel: e.target.value })); setProgramsPagination(prev => ({...prev, page: 1})); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous</option>
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="doctoral">Doctoral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diplôme</label>
                    <select
                      value={programsFilters.degree}
                      onChange={(e) => { setProgramsFilters(prev => ({ ...prev, degree: e.target.value })); setProgramsPagination(prev => ({...prev, page: 1})); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Master">Master</option>
                      <option value="PhD">PhD</option>
                      <option value="MBA">MBA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select
                      value={programsFilters.isActive}
                      onChange={(e) => { setProgramsFilters(prev => ({ ...prev, isActive: e.target.value })); setProgramsPagination(prev => ({...prev, page: 1})); }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Tous</option>
                      <option value="true">Actif</option>
                      <option value="false">Inactif</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => { setProgramsFilters({ search: '', establishmentId: '', degree: '', studyLevel: '', isActive: '' }); setProgramsPagination(prev => ({...prev, page: 1})); }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>
              </div>

              {/* Programs Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Programmes ({programsPagination.total})
                  </h3>
                </div>

                {loadingPrograms ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : programsError ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-red-600">{programsError}</p>
                    <button
                      onClick={loadPrograms}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Réessayer
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programme</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Université</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diplôme</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frais</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {programs.map((program) => (
                          <tr key={program.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{program.name}</div>
                              <div className="text-xs text-gray-500">{program.slug}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {program.establishment?.logo ? (
                                  <img src={program.establishment.logo} alt={program.establishment.name} className="h-8 w-8 rounded object-cover mr-2" />
                                ) : (
                                  <div className="h-8 w-8 rounded bg-gray-200 mr-2"></div>
                                )}
                                <div className="text-sm text-gray-900">{program.establishment?.name || '—'}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{program.degree || '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{program.studyLevel || '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{program.tuitionAmount ? `${program.tuitionAmount} ${program.tuitionCurrency || ''}` : '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${program.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {program.isActive ? 'Actif' : 'Inactif'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={async () => {
                                    try {
                                      await adminService.updateProgram(program.id, { isActive: !program.isActive });
                                      loadPrograms();
                                      loadStats();
                                    } catch (e) { setProgramsError(e.message); }
                                  }}
                                  className={`p-2 rounded-lg ${program.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                                  title={program.isActive ? 'Désactiver' : 'Activer'}
                                >
                                  {program.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => navigate(`/admin/programs/${program.id}/edit`)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title="Modifier"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (window.confirm('Supprimer ce programme ?')) {
                                      try {
                                        const res = await adminService.deleteProgram(program.id);
                                        if (res.success) { loadPrograms(); loadStats(); }
                                      } catch (e) { setProgramsError(e.message); }
                                    }
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {programsPagination.pages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {programsPagination.page} sur {programsPagination.pages} ({programsPagination.total} résultats)
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleProgramsPageChange(programsPagination.page - 1)}
                          disabled={!programsPagination.hasPrev}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={() => handleProgramsPageChange(programsPagination.page + 1)}
                          disabled={!programsPagination.hasNext}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestion des paramètres</h3>
                <p className="text-sm text-gray-600 mb-4">Ouvrir l'interface dédiée aux paramètres (catégories, langues, niveaux, diplômes, devises, etc.).</p>
                <button
                  onClick={() => navigate('/admin/parameters')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black"
                >
                  Ouvrir les paramètres
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
