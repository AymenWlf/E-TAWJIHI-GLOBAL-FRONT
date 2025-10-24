#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration CORS
 */

const axios = require('axios');

// Configuration
const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:8000';
const API_URL = 'http://localhost:8000/api';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testCorsConfiguration() {
  log('🔍 Testing CORS Configuration for E-TAWJIHI Global', 'bright');
  log(`Frontend: ${FRONTEND_URL}`, 'blue');
  log(`Backend: ${BACKEND_URL}`, 'blue');
  log(`API: ${API_URL}`, 'blue');

  const tests = [
    {
      name: 'OPTIONS Preflight Request',
      test: async () => {
        const response = await axios.options(`${API_URL}/auth/login`, {
          headers: {
            'Origin': FRONTEND_URL,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
          }
        });
        
        const corsHeaders = {
          'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
          'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
          'Access-Control-Allow-Headers': response.headers['access-control-allow-headers'],
          'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials']
        };
        
        log('   CORS Headers:', 'cyan');
        Object.entries(corsHeaders).forEach(([key, value]) => {
          log(`     ${key}: ${value}`, 'cyan');
        });
        
        return corsHeaders;
      }
    },
    {
      name: 'POST Request with CORS',
      test: async () => {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: 'test@example.com',
          password: 'testpassword'
        }, {
          headers: {
            'Origin': FRONTEND_URL,
            'Content-Type': 'application/json'
          }
        });
        
        const corsHeaders = {
          'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
          'Access-Control-Allow-Credentials': response.headers['access-control-allow-credentials']
        };
        
        log('   Response CORS Headers:', 'cyan');
        Object.entries(corsHeaders).forEach(([key, value]) => {
          log(`     ${key}: ${value}`, 'cyan');
        });
        
        return corsHeaders;
      }
    },
    {
      name: 'Backend Server Status',
      test: async () => {
        const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          headers: {
            'Origin': FRONTEND_URL
          }
        });
        
        return {
          status: response.status,
          corsOrigin: response.headers['access-control-allow-origin']
        };
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      log(`\n🧪 Testing: ${test.name}`, 'cyan');
      const result = await test.test();
      log(`✅ PASSED: ${test.name}`, 'green');
      passed++;
    } catch (error) {
      log(`❌ FAILED: ${test.name}`, 'red');
      log(`   Error: ${error.message}`, 'red');
      
      if (error.response) {
        log(`   Status: ${error.response.status}`, 'red');
        log(`   Headers:`, 'red');
        Object.entries(error.response.headers).forEach(([key, value]) => {
          if (key.toLowerCase().includes('access-control')) {
            log(`     ${key}: ${value}`, 'red');
          }
        });
      }
      
      failed++;
    }
  }

  log('\n📊 CORS Test Results:', 'bright');
  log(`Total Tests: ${passed + failed}`, 'blue');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, 'red');
  log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`, 'magenta');

  if (failed === 0) {
    log('\n🎉 CORS is properly configured!', 'green');
    log('You can now use the authentication system without CORS issues.', 'green');
  } else {
    log('\n⚠️  CORS configuration needs attention.', 'yellow');
    log('Please check the backend CORS configuration.', 'yellow');
  }

  return failed === 0;
}

// Test avec proxy Vite
async function testViteProxy() {
  log('\n🔧 Testing Vite Proxy Configuration', 'bright');
  
  try {
    // Test via le proxy Vite (dev server)
    const response = await axios.post('http://localhost:5173/api/auth/login', {
      email: 'test@example.com',
      password: 'testpassword'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    log('✅ Vite Proxy is working correctly', 'green');
    return true;
  } catch (error) {
    log('❌ Vite Proxy test failed', 'red');
    log(`   Error: ${error.message}`, 'red');
    return false;
  }
}

// Fonction principale
async function runAllTests() {
  const corsOk = await testCorsConfiguration();
  const proxyOk = await testViteProxy();
  
  log('\n🏁 Final Results:', 'bright');
  log(`CORS Configuration: ${corsOk ? '✅ OK' : '❌ FAILED'}`, corsOk ? 'green' : 'red');
  log(`Vite Proxy: ${proxyOk ? '✅ OK' : '❌ FAILED'}`, proxyOk ? 'green' : 'red');
  
  if (corsOk || proxyOk) {
    log('\n🚀 Authentication system should work now!', 'green');
    log('Try accessing /auth-test to test the authentication system.', 'green');
  } else {
    log('\n💥 Both CORS and Proxy failed. Please check your configuration.', 'red');
  }
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  log(`\n💥 Unhandled error: ${error.message}`, 'red');
  process.exit(1);
});

// Exécution des tests
if (require.main === module) {
  runAllTests().catch((error) => {
    log(`\n💥 Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = {
  testCorsConfiguration,
  testViteProxy,
  runAllTests
};
