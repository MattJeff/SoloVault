# 🚀 Guide de Déploiement Vercel - SoloVault

## ⚠️ IMPORTANT : Variables d'environnement requises

Pour que l'application fonctionne en production, tu DOIS configurer ces variables sur Vercel.

### 📝 Variables à ajouter sur Vercel

1. **Va sur Vercel Dashboard** : https://vercel.com/dashboard
2. **Sélectionne ton projet** SoloVault
3. **Settings → Environment Variables**
4. **Ajoute ces variables** :

```bash
# Supabase (OBLIGATOIRE pour le blog, quiz, users)
NEXT_PUBLIC_SUPABASE_URL=https://qwkieyypejlniuewavya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3a2lleXlwZWpsbml1ZXdhdnlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTEzMzAsImV4cCI6MjA3ODM4NzMzMH0.xSYcBsILphPwXnzz2WLsSGTU4PVKSXOMBovD784j624

# EmailJS (OBLIGATOIRE pour formulaires)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_i9zxlc7
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_otowczx
NEXT_PUBLIC_EMAILJS_QUOTE_TEMPLATE_ID=template_4fzeoqd
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=CRARgnTdiDCeXUgew

# App Config
NEXT_PUBLIC_URL=https://ton-domaine.vercel.app
NEXT_PUBLIC_ADMIN_CODE=1234
NEXT_PUBLIC_ADMIN_EMAIL=mhiguinen235@gmail.com

# Stripe (Optionnel si pas encore configuré)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PRICE_ID=price_your_id
```

### 🔄 Après avoir ajouté les variables

1. **Redéploie l'application** :
   - Deployments → ... (trois points) → Redeploy
   - Ou push un nouveau commit sur `main`

2. **Vérifie que ça fonctionne** :
   - Va sur ton site en production
   - Teste la création d'un article blog
   - Teste le quiz
   - Vérifie les logs dans Vercel

### 🐛 Debug si ça ne marche pas

1. **Vérifie les logs Vercel** :
   - Deployments → ton dernier deploy → Runtime Logs
   - Cherche les erreurs Supabase

2. **Vérifie que les variables sont bien définies** :
   - Settings → Environment Variables
   - Toutes les variables `NEXT_PUBLIC_*` doivent être là

3. **Vérifie Supabase** :
   - Va sur https://supabase.com/dashboard
   - Vérifie que les tables existent : `users`, `blog_posts`, `quiz_responses`, etc.
   - Vérifie les RLS policies

### ✅ Checklist de déploiement

- [ ] Variables d'environnement ajoutées sur Vercel
- [ ] Tables Supabase créées (exécute `supabase-setup.sql` et `supabase-blog-table.sql`)
- [ ] Migration users exécutée (`supabase-migration-users.sql`)
- [ ] Application redéployée
- [ ] Tests en production réussis

### 📊 Tables Supabase requises

```sql
-- Exécute ces scripts dans Supabase SQL Editor
1. supabase-setup.sql (users, user_progress, quiz_responses, referrals)
2. supabase-blog-table.sql (blog_posts)
3. supabase-migration-users.sql (colonnes source et page)
```

### 🎯 Commandes utiles

```bash
# Déployer manuellement
vercel --prod

# Voir les logs en temps réel
vercel logs --follow

# Lister les variables d'environnement
vercel env ls
```

---

**Note** : Sans les variables Supabase, l'app fonctionnera mais aucune donnée ne sera sauvegardée (blog, quiz, users).
