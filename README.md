# Secure Movie Watchlist API (Node.js / Express / RBAC & JWT)

API RESTful sécurisée développée en **Node.js** et **Express**, intégrant une authentification par jetons **JWT** et un contrôle d'accès granulaire basé sur les rôles (**RBAC**).

---

## 🔐 Fonctionnalités de Sécurité & Architecture

* **Sécurisation HTTP :** Intégration du middleware **Helmet** pour la configuration sécurisée des en-têtes HTTP (anti-XSS, clickjacking, etc.).
* **Authentification sans état (Stateless) :** Implémentation d'un flux d'authentification par jeton porteur (**Bearer JWT**) avec gestion de l'expiration et validation cryptographique.
* **Contrôle d'accès basé sur les rôles (RBAC) :**
  * Rôle `parent` : Privilèges complets de gestion (lecture, ajout, modification, suppression sur l'ensemble des listes).
  * Rôle `child` : Principe de moindre privilège (accès en modification strictement restreint à sa propre liste personnelle).
* **Architecture modulaire :** Séparation stricte entre les middlewares de sécurité (`authenticate`, `authorizeModification`), les routeurs Express et la couche d'accès aux données.

---

## Spécification des Endpoints

### Authentification (`/api/auth`)
| Méthode | Route | Description | Statut |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authentification utilisateur & génération du token JWT | `200`, `400`, `401` |

### Watchlists (`/api/watchlist`) *(Authentification requise)*
| Méthode | Route | Rôle requis | Statut |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/watchlist/:userId` | Authentifié (tous rôles) | `200`, `404` |
| `POST` | `/api/watchlist/:userId/movies` | `parent` ou propriétaire (`child`) | `201`, `403`, `404` |
| `PUT` | `/api/watchlist/:userId/movies/:movieId` | `parent` ou propriétaire (`child`) | `200`, `403`, `404` |
| `DELETE` | `/api/watchlist/:userId/movies/:movieId` | `parent` ou propriétaire (`child`) | `200`, `403`, `404` |

---

## Démarrage Rapide

### Prérequis
* Node.js (v18+)
* npm

### Installation & Lancement
```bash
# Cloner le dépôt
git clone https://github.com/HamzaSekkaoui/secure-movie-watchlist-api.git
cd secure-movie-watchlist-api

# Installer les dépendances
npm install

# Démarrer le serveur
npm start
