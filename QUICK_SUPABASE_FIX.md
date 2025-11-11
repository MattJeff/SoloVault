# 🚨 Fix rapide : Erreur 401 Supabase

## Problème
```
GET https://qwkieyypejlniuewavya.supabase.co/rest/v1/users 401 (Unauthorized)
Invalid API key
```

## Solution en 3 étapes

### 1️⃣ Récupérer vos clés Supabase

1. Allez sur : https://qwkieyypejlniuewavya.supabase.co
2. Cliquez sur **Settings** (⚙️) en bas à gauche
3. Allez dans **API**
4. Copiez ces deux valeurs :

```
Project URL: https://qwkieyypejlniuewavya.supabase.co
anon public: eyJhbGc... (une très longue clé)
```

### 2️⃣ Ajouter dans .env.local

Ouvrez (ou créez) le fichier `.env.local` à la racine du projet et ajoutez :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://qwkieyypejlniuewavya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (collez votre clé anon ici)
```

**⚠️ Utilisez la clé "anon public", PAS la "service_role" !**

### 3️⃣ Redémarrer le serveur

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

---

## Vérification

Après redémarrage, vous devriez voir dans la console :

✅ **Si configuré correctement :**
```
✅ User authenticated: { id: "uuid", email: "...", ... }
```

⚠️ **Si pas encore configuré :**
```
⚠️ Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL...
✅ User authenticated: { id: "timestamp", ... } (localStorage fallback)
```

---

## L'app fonctionne quand même !

Même sans Supabase, l'application continue de fonctionner :
- ✅ Données sauvegardées dans localStorage
- ✅ Données sauvegardées dans data/users.json
- ✅ Toutes les fonctionnalités accessibles

**Mais avec Supabase :**
- 🔥 Données synchronisées en temps réel
- 🔥 Accessible depuis n'importe quel appareil
- 🔥 Backup automatique dans le cloud

---

## Besoin d'aide ?

Voir le guide complet : `SUPABASE_SETUP_GUIDE.md`
