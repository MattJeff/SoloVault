# 📧 Configuration EmailJS - SoloVault

## 🎯 Template EmailJS UNIVERSEL (Plan Gratuit)

### **Template Universel** (`template_otowczx`)
**Utilisation** : UN SEUL template pour tous les cas (inscription, connexion, message contact)

**Variables du template** :
```
{{subject}} - Sujet de l'email (dynamique)
{{message}} - Message principal (dynamique)
{{firstName}} - Prénom (optionnel)
{{lastName}} - Nom (optionnel)
{{email}} - Email
{{source}} - Source (optionnel)
{{page}} - Page (optionnel)
{{timestamp}} - Date et heure
{{reply_to}} - Email de réponse
{{admin_link}} - Lien dashboard (optionnel)
```

**Template à copier dans EmailJS Dashboard** :
```
Bonjour Mathis,

{{message}}

{{#firstName}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 INFORMATIONS UTILISATEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Prénom : {{firstName}}
Nom : {{lastName}}
Email : {{email}}
{{/firstName}}

{{#source}}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 PROVENANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Source : {{source}}
Page : {{page}}
Date : {{timestamp}}
{{/source}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#reply_to}}
Répondre à : {{reply_to}}
{{/reply_to}}

{{#admin_link}}
Dashboard admin : https://solovault.vercel.app/admin
{{/admin_link}}

À bientôt,
SoloVault Notifications
```

**Explication** :
- `{{#firstName}}...{{/firstName}}` : Affiche le bloc **seulement si** `firstName` existe
- `{{#source}}...{{/source}}` : Affiche le bloc **seulement si** `source` existe
- Cela permet d'avoir un template flexible qui s'adapte au contexte

---

### 2. **Demande de devis** (`template_4fzeoqd`)
**Utilisation** : Notification quand un client demande un devis

**Variables du template** :
```
{{to_name}} - Ton prénom (Mathis)
{{from_name}} - Nom du client
{{from_email}} - Email du client
{{budget}} - Budget du projet
{{project_description}} - Description du projet
{{features}} - Fonctionnalités souhaitées
```

**Template actuel** :
```
Bonjour {{to_name}},

Vous avez reçu une nouvelle demande de devis !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 INFORMATIONS CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nom : {{from_name}}
Email : {{from_email}}
Budget : {{budget}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 DESCRIPTION DU PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{project_description}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ FONCTIONNALITÉS SOUHAITÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{features}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 Configuration dans EmailJS Dashboard

### Étape 1 : Accéder à EmailJS
1. Va sur https://dashboard.emailjs.com/admin/templates
2. Connecte-toi avec ton compte

### Étape 2 : Vérifier/Modifier les templates

#### Template 1 : Email Gate (`template_otowczx`)
1. Clique sur le template `template_otowczx`
2. **Subject** : `🎉 Nouvelle inscription SoloVault - {{firstName}} {{lastName}}`
3. **Content** : Copie le template ci-dessus
4. **To Email** : `mhiguinen235@gmail.com`
5. **From Name** : `SoloVault Notifications`
6. **Reply To** : `{{email}}` (pour répondre directement à l'utilisateur)
7. Clique sur **Save**

#### Template 2 : Demande de devis (`template_4fzeoqd`)
1. Clique sur le template `template_4fzeoqd`
2. **Subject** : `💼 Nouvelle demande de devis - {{from_name}}`
3. **Content** : Le template est déjà configuré
4. **To Email** : `mhiguinen235@gmail.com`
5. **From Name** : `SoloVault Devis`
6. **Reply To** : `{{from_email}}`
7. Clique sur **Save**

---

## 📊 Quand les emails sont envoyés

| Action | Template utilisé | Données envoyées |
|--------|------------------|------------------|
| **Inscription Email Gate** | `template_otowczx` | Prénom, Nom, Email, Source, Page, Date |
| **Connexion Email Gate** | `template_otowczx` | Email, Source, Page, Date |
| **Demande de devis** | `template_4fzeoqd` | Nom, Email, Budget, Description, Features |
| **Message contact** | `template_otowczx` | Nom, Email, Message, Date |

---

## 🧪 Tester les emails

### Test en local
```bash
npm run dev
```

1. Va sur http://localhost:3000
2. Ouvre l'Email Gate (popup automatique)
3. Remplis le formulaire et valide
4. Vérifie ta boîte mail `mhiguinen235@gmail.com`

### Test en production
1. Va sur https://solovault.vercel.app
2. Teste l'inscription
3. Vérifie les emails reçus

---

## 🔍 Debug

### Si les emails ne sont pas reçus

1. **Vérifie les logs dans la console du navigateur** :
   - Ouvre la console (F12)
   - Cherche les messages `✅ EmailJS sent` ou `❌ EmailJS error`

2. **Vérifie les variables d'environnement** :
   ```bash
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_i9zxlc7
   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_otowczx
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=CRARgnTdiDCeXUgew
   ```

3. **Vérifie le quota EmailJS** :
   - Dashboard EmailJS → Usage
   - Plan gratuit : 200 emails/mois

4. **Vérifie les spams** :
   - Les emails peuvent arriver dans les spams

---

## 📈 Statistiques EmailJS

Pour voir les statistiques d'envoi :
1. Va sur https://dashboard.emailjs.com/admin/stats
2. Tu verras :
   - Nombre d'emails envoyés
   - Taux de succès
   - Erreurs éventuelles

---

## ✅ Checklist

- [x] Template `template_otowczx` configuré
- [x] Template `template_4fzeoqd` configuré
- [x] Variables d'environnement ajoutées
- [x] Email Gate envoie des notifications
- [x] Demande de devis envoie des notifications
- [ ] Tests réussis en local
- [ ] Tests réussis en production

---

**Note** : Les emails sont envoyés à `mhiguinen235@gmail.com` pour toutes les notifications.
