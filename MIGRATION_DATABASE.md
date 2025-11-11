# Migration vers une Base de Données

## Problème Actuel

Le système de gamification (points, badges, parrainage, leaderboard) utilise actuellement des **fichiers JSON locaux** pour stocker les données :
- `data/user-progress.json` - Progression des utilisateurs
- `data/referrals.json` - Données de parrainage
- `data/quiz-responses.json` - Réponses au quiz

### Limitation sur Vercel

**⚠️ Ces fichiers ne fonctionnent PAS en production sur Vercel** car :
- Les fonctions serverless sont éphémères
- Pas de filesystem persistant
- Chaque invocation repart de zéro

**Résultat** : Le système fonctionne en local mais **échoue en production**.

## Solution Temporaire (Actuelle)

Le composant `ReferralSystem` utilise maintenant un **fallback côté client** :
- Si l'API échoue → Génération du code de parrainage côté client
- Les liens de parrainage fonctionnent
- **MAIS** : Pas de tracking persistant des parrainages

## Solution Permanente : Base de Données

Pour que tout fonctionne en production, il faut migrer vers une vraie base de données.

### Option 1 : Supabase (Recommandé - Gratuit)

**Avantages** :
- ✅ Gratuit jusqu'à 500 MB
- ✅ PostgreSQL
- ✅ API REST automatique
- ✅ Auth intégré
- ✅ Facile à configurer

**Setup** :
```bash
npm install @supabase/supabase-js
```

**Configuration** :
1. Créer un compte sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Créer les tables :

```sql
-- Table user_progress
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  points INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  level INTEGER DEFAULT 1,
  actions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW()
);

-- Table referrals
CREATE TABLE referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by TEXT,
  referred_users JSONB DEFAULT '[]'::jsonb,
  call_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table quiz_responses
CREATE TABLE quiz_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  answers JSONB NOT NULL,
  result_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performances
CREATE INDEX idx_user_progress_email ON user_progress(email);
CREATE INDEX idx_user_progress_points ON user_progress(points DESC);
CREATE INDEX idx_referrals_email ON referrals(email);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
```

4. Ajouter les variables d'environnement :
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Créer un client Supabase :

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

6. Migrer les API routes :

```typescript
// app/api/track-action/route.ts
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { email, action, metadata } = await request.json()

  // Get or create user
  const { data: user, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('email', email)
    .single()

  if (!user) {
    // Create new user
    await supabase.from('user_progress').insert({
      email,
      points: ACTIONS_POINTS[action],
      // ... autres champs
    })
  } else {
    // Update existing user
    await supabase
      .from('user_progress')
      .update({
        points: user.points + ACTIONS_POINTS[action],
        last_activity: new Date().toISOString()
      })
      .eq('email', email)
  }

  // ... reste du code
}
```

### Option 2 : MongoDB Atlas (Alternative gratuite)

**Avantages** :
- ✅ Gratuit jusqu'à 512 MB
- ✅ NoSQL (proche des JSON actuels)
- ✅ Facile à migrer depuis JSON

**Setup** :
```bash
npm install mongodb
```

### Option 3 : Vercel Postgres

**Avantages** :
- ✅ Intégration native Vercel
- ✅ PostgreSQL
- ✅ Facile à déployer

**Inconvénients** :
- ❌ Payant (après free tier)

## Migration Recommandée

**Je recommande Supabase** car :
1. Gratuit pour commencer
2. Évolutif (peut gérer des millions d'users)
3. Interface admin pour voir les données
4. API REST automatique
5. Auth intégré si besoin plus tard

## Prochaines Étapes

1. **Court terme** : Le système fonctionne avec le fallback client (codes de parrainage fonctionnent mais pas de tracking)
2. **Moyen terme** : Migrer vers Supabase (1-2h de travail)
3. **Long terme** : Ajouter analytics et métriques avancées

## Impact Utilisateur

**Actuellement** :
- ✅ L'app ne crash plus
- ✅ Les liens de parrainage sont générés
- ⚠️ Le tracking des parrainages ne persiste pas en production
- ⚠️ Le leaderboard ne fonctionne pas correctement en production
- ⚠️ Les points/badges ne persistent pas entre sessions en production

**Après migration DB** :
- ✅ Tout fonctionne en production
- ✅ Données persistantes
- ✅ Performance améliorée
- ✅ Scalable

## Besoin d'Aide ?

Si tu veux que je t'aide à migrer vers Supabase, fais-le moi savoir ! Je peux :
1. Configurer Supabase
2. Créer les tables
3. Migrer tous les API routes
4. Tester en production

📧 Prêt à migrer ? Dis-moi !
