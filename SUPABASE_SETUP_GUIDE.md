# 🔐 Guide de Configuration Supabase pour SoloVault

## 📋 Étapes de configuration

### 1. Récupérer vos clés API Supabase

1. Allez sur votre dashboard Supabase : https://qwkieyypejlniuewavya.supabase.co
2. Cliquez sur **Settings** (⚙️) dans la barre latérale
3. Allez dans **API**
4. Vous verrez deux clés importantes :
   - **Project URL** : `https://qwkieyypejlniuewavya.supabase.co`
   - **anon public** (clé publique) : commence par `eyJhbGc...`
   - **service_role** (clé secrète) : commence par `eyJhbGc...`

### 2. Ajouter les variables d'environnement

Dans votre fichier `.env.local`, ajoutez :

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qwkieyypejlniuewavya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
```

**⚠️ IMPORTANT :**
- Utilisez la clé **anon public** (pas la service_role)
- La clé anon est sécurisée pour le frontend
- Ne commitez JAMAIS le fichier `.env.local` sur Git

### 3. Créer les tables dans Supabase

1. Allez dans **SQL Editor** sur votre dashboard Supabase
2. Copiez-collez le contenu du fichier `supabase-setup.sql`
3. Cliquez sur **Run** pour exécuter le script
4. Vérifiez que les tables sont créées dans **Table Editor**

### 4. Vérifier la configuration

Après avoir ajouté les variables d'environnement :

1. Redémarrez votre serveur de développement :
   ```bash
   npm run dev
   ```

2. Ouvrez la console du navigateur (F12)
3. Essayez de vous connecter via la popup
4. Vous devriez voir :
   ```
   ✅ User authenticated: { id: "uuid", email: "...", ... }
   ```

### 5. Tables créées

Le script `supabase-setup.sql` crée les tables suivantes :

- **users** : Authentification (email, nom, prénom, dates)
- **user_progress** : Gamification (points, badges, niveau)
- **referrals** : Système de parrainage
- **quiz_responses** : Réponses aux quiz

### 6. Troubleshooting

#### Erreur 401 Unauthorized
```
Invalid API key
```
**Solution :** Vérifiez que vous avez bien copié la clé **anon public** (pas service_role)

#### Erreur "relation does not exist"
```
relation "users" does not exist
```
**Solution :** Exécutez le script SQL dans l'éditeur SQL de Supabase

#### Les données ne s'enregistrent pas
**Solution :** Vérifiez les Row Level Security policies dans Supabase → Authentication → Policies

### 7. Mode développement sans Supabase

Si vous ne voulez pas configurer Supabase immédiatement, l'application fonctionne quand même !

**Fallback automatique :**
- ✅ Les données sont sauvegardées dans `localStorage`
- ✅ Les données sont sauvegardées dans `data/users.json`
- ✅ Toutes les fonctionnalités restent accessibles
- ⚠️ Mais les données ne sont pas synchronisées entre appareils

### 8. Variables d'environnement complètes

Votre fichier `.env.local` devrait ressembler à :

```bash
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_i9zxlc7
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_otowczx
NEXT_PUBLIC_EMAILJS_QUOTE_TEMPLATE_ID=template_4fzeoqd
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=CRARgnTdiDCeXUgew

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qwkieyypejlniuewavya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_ID=price_...

# App Configuration
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_CODE=1234
NEXT_PUBLIC_ADMIN_EMAIL=mhiguinen235@gmail.com
```

### 9. Déploiement sur Vercel

N'oubliez pas d'ajouter les variables d'environnement sur Vercel :

1. Allez sur votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redéployez votre application

---

## ✅ Checklist de configuration

- [ ] Récupérer l'URL Supabase
- [ ] Récupérer la clé anon public
- [ ] Ajouter les variables dans `.env.local`
- [ ] Exécuter le script SQL dans Supabase
- [ ] Redémarrer le serveur de dev
- [ ] Tester la connexion
- [ ] Vérifier les logs dans la console
- [ ] Ajouter les variables sur Vercel (production)

---

**Besoin d'aide ?** Vérifiez les logs dans la console du navigateur (F12) pour plus de détails sur les erreurs.
