# 🔧 Solution CORS pour E-TAWJIHI Global

## 🚨 Problème Identifié

```
Access to XMLHttpRequest at 'http://localhost:8000/api/auth/register' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solutions Implémentées

### **1. Configuration Proxy Vite (Solution Immédiate)**

#### **vite.config.ts**

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
});
```

#### **Configuration API**

```typescript
// src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
```

### **2. Configuration CORS Backend Symfony**

#### **config/packages/cors.yaml**

```yaml
cors:
  allow_origin:
    - "http://localhost:3000"
    - "http://127.0.0.1:3000"
    - "http://localhost:5173"
    - "http://127.0.0.1:5173"
    - "http://localhost:4173"
    - "http://127.0.0.1:4173"
    - "https://e-tawjihi.ma"
    - "https://www.e-tawjihi.ma"
    - "https://e-tawjihi.com"
    - "https://www.e-tawjihi.com"
  allow_methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"]
  allow_headers:
    - "Content-Type"
    - "Authorization"
    - "X-Requested-With"
    - "Accept"
    - "Origin"
    - "Access-Control-Request-Method"
    - "Access-Control-Request-Headers"
  allow_credentials: true
  max_age: 3600
  exposed_headers: ["*"]
```

#### **CorsController.php**

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class CorsController extends AbstractController
{
    #[Route('/api/{path}', name: 'cors_preflight', methods: ['OPTIONS'], requirements: ['path' => '.*'])]
    public function handlePreflight(Request $request): Response
    {
        $response = new Response();

        $response->headers->set('Access-Control-Allow-Origin', $this->getAllowedOrigin($request));
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '3600');
        $response->headers->set('Access-Control-Expose-Headers', '*');

        return $response;
    }

    private function getAllowedOrigin(Request $request): string
    {
        $allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:4173',
            'http://127.0.0.1:4173',
            'https://e-tawjihi.ma',
            'https://www.e-tawjihi.ma',
            'https://e-tawjihi.com',
            'https://www.e-tawjihi.com'
        ];

        $origin = $request->headers->get('Origin');

        if (in_array($origin, $allowedOrigins)) {
            return $origin;
        }

        return $allowedOrigins[0];
    }
}
```

#### **CorsListener.php**

```php
<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CorsListener implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::RESPONSE => ['onKernelResponse', 9999],
        ];
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        $request = $event->getRequest();
        $response = $event->getResponse();

        if (str_starts_with($request->getPathInfo(), '/api')) {
            $this->addCorsHeaders($request, $response);
        }
    }

    private function addCorsHeaders(Request $request, Response $response): void
    {
        $allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:4173',
            'http://127.0.0.1:4173',
            'https://e-tawjihi.ma',
            'https://www.e-tawjihi.ma',
            'https://e-tawjihi.com',
            'https://www.e-tawjihi.com'
        ];

        $origin = $request->headers->get('Origin');

        if (in_array($origin, $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } else {
            $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Max-Age', '3600');
        $response->headers->set('Access-Control-Expose-Headers', '*');
    }
}
```

## 🚀 Instructions de Démarrage

### **Option 1: Utiliser le Proxy Vite (Recommandé pour le développement)**

1. **Démarrer le serveur de développement avec proxy :**

```bash
cd "E-TAWJIHI GLOBAL (FRONT)"
npm run dev
```

2. **Le frontend sera accessible sur :**

   - `http://localhost:5173` (avec proxy automatique vers backend)

3. **Tester l'authentification :**
   - Aller sur `http://localhost:5173/auth-test`
   - Tester les fonctionnalités d'authentification

### **Option 2: Configuration CORS Backend (Pour la production)**

1. **Installer le bundle CORS Symfony :**

```bash
cd "E-TAWJIHI GLOBAL (BACKEND)"
composer require nelmio/cors-bundle
```

2. **Démarrer le serveur backend :**

```bash
php -S localhost:8000 -t public
```

3. **Démarrer le frontend :**

```bash
cd "E-TAWJIHI GLOBAL (FRONT)"
npm run dev
```

4. **Tester la configuration CORS :**

```bash
npm run test:cors
```

## 🧪 Tests de Validation

### **Test CORS Automatisé**

```bash
# Tester la configuration CORS
npm run test:cors

# Tester l'authentification
npm run test:auth
```

### **Test Manuel**

1. Ouvrir `http://localhost:5173/auth-test`
2. Tester la connexion avec des identifiants de test
3. Vérifier que les requêtes passent sans erreur CORS

## 🔍 Dépannage

### **Erreurs Courantes**

#### **1. "Access-Control-Allow-Origin" manquant**

- **Solution** : Vérifier que le CorsListener est bien enregistré
- **Vérification** : `npm run test:cors`

#### **2. "Preflight request failed"**

- **Solution** : Vérifier que les requêtes OPTIONS sont gérées
- **Vérification** : Contrôleur CorsController actif

#### **3. "Credentials not allowed"**

- **Solution** : Vérifier `Access-Control-Allow-Credentials: true`
- **Vérification** : Configuration CORS complète

### **Logs de Débogage**

#### **Frontend (Console navigateur)**

```javascript
// Vérifier les requêtes réseau
// Onglet Network > XHR/Fetch
// Vérifier les headers de réponse
```

#### **Backend (Logs serveur)**

```bash
# Vérifier les logs du serveur PHP
# Headers CORS dans les réponses
```

## 📊 Vérification de la Solution

### **Headers CORS Attendus**

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
Access-Control-Expose-Headers: *
```

### **Test de Fonctionnement**

1. ✅ **Requête OPTIONS** : Réponse 200 avec headers CORS
2. ✅ **Requête POST** : Réponse avec headers CORS
3. ✅ **Authentification** : Login/Register fonctionnels
4. ✅ **Pas d'erreur CORS** : Console navigateur propre

## 🎯 Résultat Final

Après application de ces solutions :

- ✅ **Proxy Vite** : Contourne CORS en développement
- ✅ **CORS Backend** : Configuration complète pour la production
- ✅ **Tests automatisés** : Validation de la configuration
- ✅ **Authentification** : Système fonctionnel sans erreurs CORS

**Le système d'authentification E-TAWJIHI Global fonctionne maintenant sans problème CORS !** 🚀
