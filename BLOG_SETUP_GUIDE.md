# 📝 Guide de Configuration du Blog SoloVault

## 🎯 Vue d'ensemble

Le système de blog est maintenant intégré à SoloVault avec un éditeur WYSIWYG complet et une gestion CRUD depuis le dashboard admin.

## 📋 Étape 1 : Configuration Supabase

### Créer la table blog_posts

1. Connecte-toi à ton dashboard Supabase : https://supabase.com/dashboard
2. Sélectionne ton projet : `qwkieyypejlniuewavya`
3. Va dans **SQL Editor**
4. Copie et exécute le contenu du fichier `supabase-blog-table.sql`

Le script va créer :
- ✅ Table `blog_posts` avec tous les champs nécessaires
- ✅ Index pour optimiser les performances
- ✅ Trigger pour mettre à jour `updated_at` automatiquement
- ✅ Row Level Security (RLS) avec policies

### Structure de la table

```sql
- id (UUID) - Identifiant unique
- title (TEXT) - Titre de l'article
- slug (TEXT) - URL-friendly (unique)
- excerpt (TEXT) - Résumé court (SEO)
- content (TEXT) - Contenu HTML de l'article
- cover_image (TEXT) - URL de l'image de couverture
- author_email (TEXT) - Email de l'auteur
- author_name (TEXT) - Nom de l'auteur
- category (TEXT) - Catégorie (Tutoriel, Astuce, Guide, etc.)
- tags (TEXT[]) - Array de tags
- status (TEXT) - draft | published | archived
- published_at (TIMESTAMP) - Date de publication
- created_at (TIMESTAMP) - Date de création
- updated_at (TIMESTAMP) - Date de modification
- views (INTEGER) - Nombre de vues
- reading_time (INTEGER) - Temps de lecture en minutes
```

## 🎨 Étape 2 : Utiliser l'éditeur

### Accéder à l'éditeur

1. Va sur `/admin` (code: 1234)
2. Clique sur l'onglet **📝 Blog**
3. Clique sur **Nouvel article**

### Fonctionnalités de l'éditeur

#### Barre d'outils
- **Undo/Redo** : Annuler/Refaire
- **Formatage** : Gras, Italique, Souligné, Barré, Code
- **Titres** : H1, H2
- **Listes** : À puces, Numérotées, Citations
- **Alignement** : Gauche, Centre, Droite
- **Médias** : Liens, Images, Vidéos YouTube

#### Champs du formulaire
- **Titre*** : Titre de l'article (génère automatiquement le slug)
- **Slug*** : URL de l'article (ex: `mon-premier-article`)
- **Extrait** : Description courte pour SEO (max 160 caractères)
- **Image de couverture** : URL de l'image (ex: Unsplash, Imgur)
- **Catégorie** : Tutoriel, Astuce, Guide, Inspiration, Analyse
- **Statut** : Brouillon, Publié, Archivé
- **Contenu*** : Éditeur riche WYSIWYG

### Ajouter des images

1. Upload ton image sur un service (Imgur, Cloudinary, etc.)
2. Copie l'URL de l'image
3. Dans l'éditeur, clique sur l'icône **Image**
4. Colle l'URL et clique sur **Ajouter**

### Ajouter des vidéos YouTube

1. Copie l'URL de la vidéo YouTube
2. Clique sur l'icône **YouTube**
3. Colle l'URL et clique sur **Ajouter**

### Ajouter des liens

1. Sélectionne le texte à transformer en lien
2. Clique sur l'icône **Lien**
3. Entre l'URL et clique sur **Ajouter**

## 📊 Étape 3 : Gérer les articles

### Liste des articles

Dans l'onglet Blog, tu vois :
- **Miniature** : Image de couverture
- **Titre et slug**
- **Statut** : Publié, Brouillon, Archivé
- **Catégorie**
- **Temps de lecture** (calculé automatiquement)
- **Nombre de vues**
- **Date de publication**

### Actions disponibles
- **Modifier** : Éditer l'article
- **Voir** : Prévisualiser sur le site public
- **Supprimer** : Supprimer définitivement

## 🌐 Étape 4 : Pages publiques

### Page liste : /astuces

Affiche tous les articles publiés avec :
- Recherche par titre/contenu
- Filtre par catégorie
- Cards avec image, titre, extrait
- Temps de lecture et vues

### Page article : /astuces/[slug]

Affiche l'article complet avec :
- Image de couverture
- Métadonnées (catégorie, date, temps de lecture, vues)
- Contenu formaté
- Bouton de partage
- Articles similaires (même catégorie)
- CTA vers le dashboard

## 🔗 Navigation

Le lien **Astuces** a été ajouté dans la navbar :
- Desktop : Entre logo et "À propos"
- Mobile : Dans le menu hamburger

## 🎯 Workflow recommandé

### 1. Créer un brouillon
- Crée l'article avec statut "Brouillon"
- Rédige le contenu
- Ajoute les images et médias
- Sauvegarde

### 2. Prévisualiser
- Clique sur "Voir" pour prévisualiser
- Vérifie le rendu
- Retourne modifier si nécessaire

### 3. Publier
- Change le statut en "Publié"
- Vérifie que l'extrait et l'image sont remplis
- Sauvegarde
- L'article apparaît sur /astuces

## 📈 Statistiques

Les articles trackent automatiquement :
- **Vues** : Incrémenté à chaque visite
- **Temps de lecture** : Calculé automatiquement (200 mots/min)
- **Date de publication** : Définie automatiquement lors de la publication

## 🎨 Catégories disponibles

- **Tutoriel** : Guides pas-à-pas
- **Astuce** : Tips rapides
- **Guide** : Guides complets
- **Inspiration** : Success stories
- **Analyse** : Analyses de marché

Tu peux en ajouter d'autres en modifiant le select dans `/app/admin/page.tsx` (ligne ~917).

## 🔒 Sécurité

- ✅ Row Level Security activé sur Supabase
- ✅ Seuls les articles "published" sont visibles publiquement
- ✅ Dashboard admin protégé par code PIN
- ✅ Validation des données côté serveur

## 🚀 Prochaines étapes

Pour améliorer le blog :
1. Ajouter un système de commentaires
2. Intégrer un service d'upload d'images (Cloudinary)
3. Ajouter des analytics détaillés
4. Créer un système de newsletter
5. Ajouter des tags cliquables
6. Implémenter la recherche full-text

## 📝 Notes importantes

- Le slug doit être unique (erreur si doublon)
- Les images doivent être hébergées en externe
- Le contenu est stocké en HTML
- Les vidéos YouTube sont embedded automatiquement
- Le temps de lecture est recalculé à chaque modification

## 🆘 Troubleshooting

### L'éditeur ne s'affiche pas
- Vérifie que Tiptap est installé : `npm list @tiptap/react`
- Redémarre le serveur : `npm run dev`

### Les articles ne s'affichent pas
- Vérifie que la table `blog_posts` existe dans Supabase
- Vérifie que les articles ont le statut "published"
- Vérifie les logs de la console

### Les images ne s'affichent pas
- Vérifie que l'URL de l'image est accessible
- Vérifie que l'URL commence par `http://` ou `https://`
- Utilise des services d'hébergement d'images fiables

## 🎉 C'est tout !

Ton système de blog est maintenant opérationnel. Tu peux commencer à créer du contenu pour attirer et engager ton audience !
