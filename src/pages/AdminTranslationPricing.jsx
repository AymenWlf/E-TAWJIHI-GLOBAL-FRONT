import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Languages,
  DollarSign,
  Search,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAllParameters } from '../hooks/useAllParameters';
import adminService from '../services/adminService';

const AdminTranslationPricing = () => {
  const navigate = useNavigate();
  const { parameters: allParams, loading: paramsLoading } = useAllParameters();
  const [language, setLanguage] = useState('fr');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [formData, setFormData] = useState({
    fromLanguage: '',
    toLanguage: '',
    price: ''
  });

  // Get language options from parameters
  const getLanguageOptions = () => {
    if (!allParams?.languages || !Array.isArray(allParams.languages)) {
      return [];
    }
    return allParams.languages.map(lang => ({
      code: lang.code,
      label: language === 'fr' ? (lang.labelFr || lang.labelEn) : lang.labelEn,
      labelFr: lang.labelFr || lang.labelEn,
      labelEn: lang.labelEn || lang.code
    }));
  };


  // Load prices
  useEffect(() => {
    const loadPrices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await adminService.getTranslationPrices();
        if (response.success) {
          // Handle both single price and array of prices
          if (response.data) {
            setPrices(Array.isArray(response.data) ? response.data : [response.data]);
          } else {
            setPrices([]);
          }
        } else {
          setError(response.message || response.error || 'Erreur lors du chargement des prix');
        }
      } catch (err) {
        console.error('Error loading translation prices:', err);
        setError(err.message || 'Erreur lors du chargement des prix');
        // Set empty array on error to prevent undefined issues
        setPrices([]);
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.fromLanguage || !formData.toLanguage || !formData.price) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (formData.fromLanguage === formData.toLanguage) {
      setError('La langue source et la langue cible doivent être différentes');
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('Le prix doit être un nombre positif');
      return;
    }

    try {
      const priceData = {
        fromLanguage: formData.fromLanguage,
        toLanguage: formData.toLanguage,
        price: priceValue,
        currency: 'MAD'
      };

      let response;
      if (editingPrice) {
        response = await adminService.updateTranslationPrice(editingPrice.id, priceData);
      } else {
        response = await adminService.createTranslationPrice(priceData);
      }

      if (response.success) {
        // Reload prices from server
        const pricesResponse = await adminService.getTranslationPrices();
        if (pricesResponse.success && pricesResponse.data) {
          setPrices(pricesResponse.data);
        }

        setSuccess(response.message || (editingPrice ? 'Prix mis à jour avec succès' : 'Prix ajouté avec succès'));
        
        // Reset form
        setFormData({
          fromLanguage: '',
          toLanguage: '',
          price: ''
        });
        setShowForm(false);
        setEditingPrice(null);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (price) => {
    setEditingPrice(price);
    setFormData({
      fromLanguage: price.fromLanguage,
      toLanguage: price.toLanguage,
      price: price.price.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce prix ?')) {
      return;
    }

    try {
      const response = await adminService.deleteTranslationPrice(id);
      if (response.success) {
        // Reload prices from server
        const pricesResponse = await adminService.getTranslationPrices();
        if (pricesResponse.success && pricesResponse.data) {
          setPrices(pricesResponse.data);
        }
        setSuccess(response.message || 'Prix supprimé avec succès');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPrice(null);
    setFormData({
      fromLanguage: '',
      toLanguage: '',
      price: ''
    });
    setError(null);
  };

  const getLanguageLabel = (code) => {
    const lang = getLanguageOptions().find(l => l.code === code);
    return lang ? lang.label : code;
  };

  // Filter prices based on search
  const filteredPrices = prices.filter(price => {
    const fromLang = getLanguageLabel(price.fromLanguage).toLowerCase();
    const toLang = getLanguageLabel(price.toLanguage).toLowerCase();
    const search = searchTerm.toLowerCase();
    return fromLang.includes(search) || toLang.includes(search);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-800 rounded-lg flex items-center justify-center">
                  <Languages className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestion des Prix de Traduction</h1>
                  <p className="text-sm text-gray-500">Configurez les prix par langue</p>
                </div>
              </div>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un Prix</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPrice ? 'Modifier le Prix' : 'Nouveau Prix de Traduction'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue Source *
                  </label>
                  <select
                    value={formData.fromLanguage}
                    onChange={(e) => setFormData({ ...formData, fromLanguage: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner la langue source</option>
                    {paramsLoading ? (
                      <option disabled>Chargement des langues...</option>
                    ) : (
                      getLanguageOptions().map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* To Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue Cible *
                  </label>
                  <select
                    value={formData.toLanguage}
                    onChange={(e) => setFormData({ ...formData, toLanguage: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner la langue cible</option>
                    {paramsLoading ? (
                      <option disabled>Chargement des langues...</option>
                    ) : (
                      getLanguageOptions()
                        .filter(lang => lang.code !== formData.fromLanguage)
                        .map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.label}
                          </option>
                        ))
                    )}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix par Page (MAD) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingPrice ? 'Enregistrer' : 'Ajouter'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par langue..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Prices List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
              <p className="mt-4 text-gray-500">Chargement des prix...</p>
            </div>
          ) : filteredPrices.length === 0 ? (
            <div className="p-12 text-center">
              <Languages className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'Aucun prix trouvé pour votre recherche' : 'Aucun prix configuré. Cliquez sur "Ajouter un Prix" pour commencer.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Langue Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Langue Cible
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix par Page
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPrices.map((price) => (
                    <tr key={price.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Languages className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {getLanguageLabel(price.fromLanguage)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Languages className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {getLanguageLabel(price.toLanguage)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {price.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">{price.currency}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(price)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(price.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>
      </div>
    </div>
  );
};

export default AdminTranslationPricing;

