import React, { useState } from 'react';
import { 
  X, CreditCard, Building, 
  Lock, CheckCircle, ArrowRight, 
  AlertCircle, Shield, Clock
} from 'lucide-react';
import { Service, PaymentMethod } from '../../types/serviceTypes';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  language: string;
  paymentMethods: PaymentMethod[];
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  service,
  language,
  paymentMethods
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    setPaymentStep('details');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep('success');
    }, 3000);
  };

  const getPaymentMethodIcon = (methodId: string) => {
    switch (methodId) {
      case 'stripe_card':
        return <CreditCard className="w-6 h-6" />;
      case 'bank_transfer':
        return <Building className="w-6 h-6" />;
      case 'paypal':
        return <div className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center text-xs font-bold">P</div>;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getPaymentMethodColor = (methodId: string) => {
    switch (methodId) {
      case 'stripe_card':
        return 'bg-blue-500';
      case 'bank_transfer':
        return 'bg-green-500';
      case 'paypal':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderPaymentMethods = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'Choose Payment Method' : 'Choisir le Mode de Paiement'}
      </h3>
      
      {paymentMethods.map(method => (
        <button
          key={method.id}
          onClick={() => handlePaymentMethodSelect(method.id)}
          className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition-colors text-left"
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${getPaymentMethodColor(method.id)} rounded-xl flex items-center justify-center text-white`}>
              {getPaymentMethodIcon(method.id)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {language === 'en' ? method.name : method.nameFr}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'en' ? method.description : method.descriptionFr}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      ))}
    </div>
  );

  const renderPaymentDetails = () => {
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setPaymentStep('method')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>
          <div className={`w-12 h-12 ${getPaymentMethodColor(selectedPaymentMethod)} rounded-xl flex items-center justify-center text-white`}>
            {getPaymentMethodIcon(selectedPaymentMethod)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'en' ? selectedMethod?.name : selectedMethod?.nameFr}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'en' ? selectedMethod?.description : selectedMethod?.descriptionFr}
            </p>
          </div>
        </div>

        {selectedPaymentMethod === 'stripe_card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Card Number' : 'Numéro de Carte'}
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'Expiry Date' : 'Date d\'Expiration'}
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'en' ? 'CVV' : 'CVV'}
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'en' ? 'Cardholder Name' : 'Nom du Titulaire'}
              </label>
              <input
                type="text"
                placeholder={language === 'en' ? 'John Doe' : 'Jean Dupont'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'bank_transfer' && (
          <div className="bg-blue-50 p-6 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-4">
              {language === 'en' ? 'Bank Transfer Details' : 'Détails du Virement Bancaire'}
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">{language === 'en' ? 'Bank Name:' : 'Nom de la Banque:'}</span>
                <span className="font-medium text-blue-900">Attijariwafa Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">{language === 'en' ? 'Account Number:' : 'Numéro de Compte:'}</span>
                <span className="font-medium text-blue-900">1234567890123456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">{language === 'en' ? 'SWIFT Code:' : 'Code SWIFT:'}</span>
                <span className="font-medium text-blue-900">BCMAMAMC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">{language === 'en' ? 'Reference:' : 'Référence:'}</span>
                <span className="font-medium text-blue-900">ETAWJIH-{service.id.toUpperCase()}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">
                  {language === 'en' 
                    ? 'Please include the reference number in your transfer description'
                    : 'Veuillez inclure le numéro de référence dans la description de votre virement'
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        {selectedPaymentMethod === 'paypal' && (
          <div className="bg-yellow-50 p-6 rounded-xl text-center">
            <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              P
            </div>
            <h4 className="font-semibold text-yellow-900 mb-2">
              {language === 'en' ? 'PayPal Payment' : 'Paiement PayPal'}
            </h4>
            <p className="text-yellow-700 text-sm">
              {language === 'en' 
                ? 'You will be redirected to PayPal to complete your payment securely'
                : 'Vous serez redirigé vers PayPal pour finaliser votre paiement en toute sécurité'
              }
            </p>
          </div>
        )}

        <button
          onClick={handlePayment}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Lock className="w-5 h-5" />
          <span>
            {language === 'en' ? 'Pay Securely' : 'Payer en Toute Sécurité'}
          </span>
        </button>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {language === 'en' ? 'Processing Payment...' : 'Traitement du Paiement...'}
      </h3>
      <p className="text-gray-600">
        {language === 'en' 
          ? 'Please wait while we process your payment securely'
          : 'Veuillez patienter pendant que nous traitons votre paiement en toute sécurité'
        }
      </p>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {language === 'en' ? 'Payment Successful!' : 'Paiement Réussi !'}
      </h3>
      <p className="text-gray-600 mb-6">
        {language === 'en' 
          ? 'Your service has been activated. You will receive a confirmation email shortly.'
          : 'Votre service a été activé. Vous recevrez un email de confirmation sous peu.'
        }
      </p>
      <button
        onClick={onClose}
        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
      >
        {language === 'en' ? 'Continue' : 'Continuer'}
      </button>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {language === 'en' ? 'Complete Purchase' : 'Finaliser l\'Achat'}
            </h2>
            <p className="text-sm text-gray-600">
              {language === 'en' ? service.name : service.nameFr}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Service Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${service.color} rounded-xl flex items-center justify-center text-white text-xl`}>
                {service.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {language === 'en' ? service.name : service.nameFr}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? service.category.name : service.category.nameFr}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {service.price.toLocaleString()} {service.currency}
              </div>
              {service.duration && (
                <div className="text-sm text-gray-600">
                  {language === 'en' ? service.duration : service.durationFr}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Content */}
        <div className="p-6">
          {paymentStep === 'method' && renderPaymentMethods()}
          {paymentStep === 'details' && renderPaymentDetails()}
          {paymentStep === 'processing' && renderProcessing()}
          {paymentStep === 'success' && renderSuccess()}
        </div>

        {/* Security Notice */}
        {paymentStep !== 'success' && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>
                {language === 'en' 
                  ? 'Your payment is secured with 256-bit SSL encryption'
                  : 'Votre paiement est sécurisé avec un chiffrement SSL 256-bit'
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
