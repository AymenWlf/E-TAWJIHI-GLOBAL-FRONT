import React, { useState, useEffect } from 'react';
import { 
  Clock, Globe, CheckCircle, ExternalLink, 
  Share2, ShoppingCart, Filter,
  ChevronDown, ChevronUp, X, CreditCard, Building
} from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import testVoucherService, { TestVoucher } from '../../services/testVoucherService';
import { 
  TEST_CATEGORIES,
  getTestStatus,
  getTestStatusColor
} from '../../types/testTypes';

interface TestVouchersSectionProps {
  language: string;
}

const TestVouchersSection: React.FC<TestVouchersSectionProps> = ({ language }) => {
  const { formatPrice, userCurrency } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testVouchers, setTestVouchers] = useState<TestVoucher[]>([]);
  const [filteredTests, setFilteredTests] = useState<TestVoucher[]>([]);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);
  const [formattedPrices, setFormattedPrices] = useState<{[key: string]: {discounted: string, original: string}}>({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestVoucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentLanguage = language;

  // Load test vouchers from API
  useEffect(() => {
    const loadTestVouchers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await testVoucherService.getTestVouchers(currentLanguage, selectedCategory);
        setTestVouchers(response.data);
        setFilteredTests(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load test vouchers');
      } finally {
        setLoading(false);
      }
    };

    loadTestVouchers();
  }, [currentLanguage, selectedCategory]);

  // Format prices when test vouchers change or currency changes
  useEffect(() => {
    const formatAllPrices = async () => {
      if (testVouchers.length === 0) return;
      
      const prices: {[key: string]: {discounted: string, original: string}} = {};
      for (const test of testVouchers) {
        const discountedPrice = await formatPrice(test.discountedPrice, userCurrency);
        const originalPrice = await formatPrice(test.originalPrice, userCurrency);
        prices[test.id.toString()] = { discounted: discountedPrice, original: originalPrice };
      }
      setFormattedPrices(prices);
    };
    formatAllPrices();
  }, [testVouchers, userCurrency, formatPrice]);

  const handleTestClick = (test: TestVoucher) => {
    setExpandedTest(expandedTest === test.id.toString() ? null : test.id.toString());
  };

  const handleShare = (test: TestVoucher) => {
    if (test.shareLink && test.shareLink !== '#') {
      window.open(test.shareLink, '_blank');
    } else {
      // Copy current URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const handleBuy = (test: TestVoucher) => {
    setSelectedTest(test);
    setShowPaymentModal(true);
  };


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {currentLanguage === 'en' ? 'My Test Vouchers' : 'Mes Vouchers de Test'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentLanguage === 'en' 
                ? 'Purchase test vouchers for English and graduate exams' 
                : 'Achetez des vouchers de test pour les examens d\'anglais et de cycle supérieur'
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              {currentLanguage === 'en' ? 'Global Recognition' : 'Reconnaissance Mondiale'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage === 'en' ? 'Filter by Category' : 'Filtrer par Catégorie'}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {currentLanguage === 'en' ? 'All Tests' : 'Tous les Tests'}
          </button>
          
          {TEST_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{currentLanguage === 'en' ? category.name : category.nameFr}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">
              {currentLanguage === 'en' ? 'Loading test vouchers...' : 'Chargement des vouchers de test...'}
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'en' ? 'Error loading tests' : 'Erreur de chargement des tests'}
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentLanguage === 'en' ? 'Retry' : 'Réessayer'}
            </button>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {currentLanguage === 'en' ? 'No tests found' : 'Aucun test trouvé'}
            </h3>
            <p className="text-gray-500">
              {currentLanguage === 'en' 
                ? 'No tests available for the selected category.' 
                : 'Aucun test disponible pour la catégorie sélectionnée.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="border border-gray-200 rounded-lg p-6 transition-all hover:shadow-md cursor-pointer"
                onClick={() => handleTestClick(test)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border">
                      <img 
                        src={test.vendorLogo} 
                        alt={`${test.vendor} logo`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div 
                        className={`w-12 h-12 ${test.color} rounded-lg flex items-center justify-center text-white text-xl hidden`}
                        style={{ display: 'none' }}
                      >
                        {test.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {test.name}
                      </h3>
                      <p className="text-sm text-gray-500">{test.vendor}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTestStatusColor(test.status)}`}>
                      {getTestStatus(test.status, currentLanguage)}
                    </span>
                    {expandedTest === test.id.toString() ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {test.description}
                </p>

                {/* Pricing */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {formattedPrices[test.id.toString()]?.discounted || `${test.discountedPrice} ${test.currency}`}
                    </span>
                    {test.originalPrice > test.discountedPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formattedPrices[test.id.toString()]?.original || `${test.originalPrice} ${test.currency}`}
                      </span>
                    )}
                  </div>
                  {test.originalPrice > test.discountedPrice && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                      {currentLanguage === 'en' ? 'Save' : 'Économisez'} {formattedPrices[test.id.toString()]?.original || `${test.originalPrice} ${test.currency}`}
                    </span>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedTest === test.id.toString() && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {/* Vendor Info */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        <Globe className="w-4 h-4 text-blue-600 mr-2" />
                        {currentLanguage === 'en' ? 'Official Vendor' : 'Vendeur Officiel'}
                      </h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-20 h-10 bg-gray-100 rounded border flex items-center justify-center">
                          <img 
                            src={test.vendorLogo} 
                            alt={`${test.vendor} logo`}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'block';
                            }}
                          />
                          <span 
                            className="text-sm font-medium text-gray-600 hidden"
                            style={{ display: 'none' }}
                          >
                            {test.vendor}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{test.vendor}</p>
                          <p className="text-xs text-gray-500">
                            {currentLanguage === 'en' ? 'Official test provider' : 'Fournisseur officiel de tests'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recognition */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        {currentLanguage === 'en' ? 'Recognition' : 'Reconnaissance'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {test.recognition}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        {currentLanguage === 'en' ? 'Key Features' : 'Caractéristiques Clés'}
                      </h4>
                      <ul className="space-y-1">
                        {test.features.map((feature: string, index: number) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Validity */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                        <Clock className="w-4 h-4 text-blue-600 mr-2" />
                        {currentLanguage === 'en' ? 'Validity' : 'Validité'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {test.validity}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(test);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">
                          {currentLanguage === 'en' ? 'Share' : 'Partager'}
                        </span>
                      </button>
                      
                      {test.status === 'available' && test.buyLink && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuy(test);
                          }}
                          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {currentLanguage === 'en' ? 'Buy Now' : 'Acheter Maintenant'}
                          </span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentLanguage === 'en' ? 'Choose Payment Method' : 'Choisir le Moyen de Paiement'}
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Test Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border">
                  <img 
                    src={selectedTest.vendorLogo} 
                    alt={`${selectedTest.vendor} logo`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className={`w-10 h-10 ${selectedTest.color} rounded-lg flex items-center justify-center text-white text-lg hidden`}
                    style={{ display: 'none' }}
                  >
                    {selectedTest.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {selectedTest.name}
                  </h4>
                  <p className="text-sm text-gray-500">{selectedTest.vendor}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {currentLanguage === 'en' ? 'Price' : 'Prix'}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {formattedPrices[selectedTest.id.toString()]?.discounted || `${selectedTest.discountedPrice} ${selectedTest.currency}`}
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-gray-700">
                {currentLanguage === 'en' ? 'Payment Methods' : 'Moyens de Paiement'}
              </h4>
              
              {/* Credit Card */}
              <button
                onClick={() => {
                  // Handle credit card payment
                  console.log('Credit card payment for:', selectedTest.name);
                  setShowPaymentModal(false);
                }}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">
                    {currentLanguage === 'en' ? 'Credit/Debit Card' : 'Carte de Crédit/Débit'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentLanguage === 'en' ? 'Visa, Mastercard, American Express' : 'Visa, Mastercard, American Express'}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>

              {/* PayPal */}
              <button
                onClick={() => {
                  // Handle PayPal payment
                  console.log('PayPal payment for:', selectedTest.name);
                  setShowPaymentModal(false);
                }}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">PP</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">PayPal</p>
                  <p className="text-sm text-gray-500">
                    {currentLanguage === 'en' ? 'Pay with your PayPal account' : 'Payer avec votre compte PayPal'}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => {
                  // Handle bank transfer
                  console.log('Bank transfer for:', selectedTest.name);
                  setShowPaymentModal(false);
                }}
                className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">
                    {currentLanguage === 'en' ? 'Bank Transfer' : 'Virement Bancaire'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentLanguage === 'en' ? 'Direct bank transfer' : 'Virement bancaire direct'}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-800">
                  {currentLanguage === 'en' 
                    ? 'Secure payment processing with SSL encryption' 
                    : 'Traitement de paiement sécurisé avec chiffrement SSL'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestVouchersSection;
