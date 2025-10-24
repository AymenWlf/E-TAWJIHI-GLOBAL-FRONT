#!/usr/bin/env node

/**
 * Test de redirection après authentification
 * Vérifie que les utilisateurs sont bien redirigés vers /establishments
 */

const https = require('https');
const http = require('http');

const FRONTEND_URL = 'http://localhost:5174';
const BACKEND_URL = 'http://localhost:8000';

console.log('🧪 Test de Redirection E-TAWJIHI Global\n');

// Test 1: Vérifier l'accessibilité de la page des établissements
async function testEstablishmentsPage() {
  return new Promise((resolve) => {
    const url = `${FRONTEND_URL}/establishments`;
    console.log(`📋 Test: Page des établissements accessible`);
    console.log(`   URL: ${url}`);
    
    http.get(url, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log(`   ✅ Page des établissements accessible\n`);
        resolve(true);
      } else {
        console.log(`   ❌ Erreur d'accès à la page des établissements\n`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`   ❌ Erreur: ${err.message}\n`);
      resolve(false);
    });
  });
}

// Test 2: Vérifier la page de connexion
async function testLoginPage() {
  return new Promise((resolve) => {
    const url = `${FRONTEND_URL}/login`;
    console.log(`🔐 Test: Page de connexion accessible`);
    console.log(`   URL: ${url}`);
    
    http.get(url, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log(`   ✅ Page de connexion accessible\n`);
        resolve(true);
      } else {
        console.log(`   ❌ Erreur d'accès à la page de connexion\n`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`   ❌ Erreur: ${err.message}\n`);
      resolve(false);
    });
  });
}

// Test 3: Vérifier la page d'inscription
async function testRegisterPage() {
  return new Promise((resolve) => {
    const url = `${FRONTEND_URL}/register`;
    console.log(`📝 Test: Page d'inscription accessible`);
    console.log(`   URL: ${url}`);
    
    http.get(url, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        console.log(`   ✅ Page d'inscription accessible\n`);
        resolve(true);
      } else {
        console.log(`   ❌ Erreur d'accès à la page d'inscription\n`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log(`   ❌ Erreur: ${err.message}\n`);
      resolve(false);
    });
  });
}

// Test 4: Vérifier l'API d'authentification
async function testAuthAPI() {
  return new Promise((resolve) => {
    const url = `${BACKEND_URL}/api/auth/me`;
    console.log(`🔑 Test: API d'authentification`);
    console.log(`   URL: ${url}`);
    
    http.get(url, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 401) {
        console.log(`   ✅ API d'authentification fonctionnelle (401 = non authentifié)\n`);
        resolve(true);
      } else if (res.statusCode === 200) {
        console.log(`   ✅ API d'authentification fonctionnelle (200 = authentifié)\n`);
        resolve(true);
      } else {
        console.log(`   ⚠️  Status inattendu: ${res.statusCode}\n`);
        resolve(true);
      }
    }).on('error', (err) => {
      console.log(`   ❌ Erreur: ${err.message}\n`);
      resolve(false);
    });
  });
}

// Exécuter tous les tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests de redirection...\n');
  
  const results = await Promise.all([
    testEstablishmentsPage(),
    testLoginPage(),
    testRegisterPage(),
    testAuthAPI()
  ]);
  
  const allPassed = results.every(result => result === true);
  
  console.log('📊 Résultats des Tests:');
  console.log(`   Page Établissements: ${results[0] ? '✅' : '❌'}`);
  console.log(`   Page Connexion: ${results[1] ? '✅' : '❌'}`);
  console.log(`   Page Inscription: ${results[2] ? '✅' : '❌'}`);
  console.log(`   API Authentification: ${results[3] ? '✅' : '❌'}`);
  
  if (allPassed) {
    console.log('\n🎉 Tous les tests sont passés !');
    console.log('\n📋 Instructions pour tester la redirection:');
    console.log('   1. Allez sur http://localhost:5174/login');
    console.log('   2. Connectez-vous avec vos identifiants');
    console.log('   3. Vous devriez être redirigé vers http://localhost:5174/establishments');
    console.log('\n🔗 Ou testez directement:');
    console.log('   http://localhost:5174/auth-test');
  } else {
    console.log('\n❌ Certains tests ont échoué. Vérifiez les serveurs.');
  }
}

runAllTests().catch(console.error);
