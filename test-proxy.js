#!/usr/bin/env node

/**
 * Test rapide du proxy Vite pour l'authentification
 */

const axios = require('axios');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testProxyConnection() {
  log('🔍 Testing Vite Proxy Connection', 'bright');
  log('Frontend: http://localhost:5174', 'blue');
  log('Backend: http://localhost:8000', 'blue');
  log('Proxy: /api -> http://localhost:8000', 'blue');

  try {
    // Test de connexion au backend via le proxy
    log('\n🧪 Testing proxy connection...', 'cyan');
    
    const response = await axios.post('http://localhost:5174/api/auth/register', {
      email: 'test@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'User'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    log('✅ Proxy connection successful!', 'green');
    log(`   Status: ${response.status}`, 'green');
    log(`   Response: ${JSON.stringify(response.data, null, 2)}`, 'green');
    
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log('❌ Connection refused - Backend server not running', 'red');
      log('   Please start the backend server:', 'yellow');
      log('   cd "E-TAWJIHI GLOBAL (BACKEND)" && php -S localhost:8000 -t public', 'yellow');
    } else if (error.response) {
      log('✅ Proxy is working (backend responded)', 'green');
      log(`   Status: ${error.response.status}`, 'green');
      log(`   Error: ${error.response.data?.message || 'Backend error'}`, 'yellow');
      
      if (error.response.status === 500) {
        log('   This is expected - backend needs proper setup', 'yellow');
      }
      
      return true; // Proxy works, backend just needs setup
    } else {
      log('❌ Proxy test failed', 'red');
      log(`   Error: ${error.message}`, 'red');
      return false;
    }
  }
}

async function testFrontendAccess() {
  try {
    log('\n🧪 Testing frontend access...', 'cyan');
    
    const response = await axios.get('http://localhost:5174', {
      timeout: 5000
    });

    log('✅ Frontend is accessible!', 'green');
    log(`   Status: ${response.status}`, 'green');
    
    return true;
  } catch (error) {
    log('❌ Frontend not accessible', 'red');
    log(`   Error: ${error.message}`, 'red');
    log('   Please start the frontend server:', 'yellow');
    log('   cd "E-TAWJIHI GLOBAL (FRONT)" && npm run dev', 'yellow');
    
    return false;
  }
}

async function runTests() {
  const frontendOk = await testFrontendAccess();
  const proxyOk = await testProxyConnection();

  log('\n📊 Test Results:', 'bright');
  log(`Frontend Access: ${frontendOk ? '✅ OK' : '❌ FAILED'}`, frontendOk ? 'green' : 'red');
  log(`Proxy Connection: ${proxyOk ? '✅ OK' : '❌ FAILED'}`, proxyOk ? 'green' : 'red');

  if (frontendOk && proxyOk) {
    log('\n🎉 Everything is working!', 'green');
    log('You can now access the authentication system at:', 'green');
    log('   http://localhost:5174/auth-test', 'green');
  } else {
    log('\n⚠️  Some issues detected. Please check the setup.', 'yellow');
  }
}

// Gestion des erreurs
process.on('unhandledRejection', (error) => {
  log(`\n💥 Unhandled error: ${error.message}`, 'red');
  process.exit(1);
});

// Exécution des tests
if (require.main === module) {
  runTests().catch((error) => {
    log(`\n💥 Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { testProxyConnection, testFrontendAccess, runTests };
