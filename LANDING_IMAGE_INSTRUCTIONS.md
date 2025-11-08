# Instructions pour l'image de la Landing Page

## 📸 Image requise : `exemple_landing.png`

Pour compléter la landing page, vous devez ajouter une capture d'écran du dashboard.

### Emplacement
Placez l'image ici : `/public/exemple_landing.png`

### Spécifications recommandées
- **Format** : PNG
- **Dimensions** : 1200 x 700 pixels (ratio 16:9)
- **Contenu** : Screenshot du dashboard avec quelques projets visibles
- **Qualité** : Haute résolution pour un rendu net

### Comment créer l'image

1. Ouvrez le dashboard : http://localhost:3000/dashboard
2. Prenez une capture d'écran complète du dashboard
3. Redimensionnez à 1200x700px si nécessaire
4. Sauvegardez comme `exemple_landing.png`
5. Placez le fichier dans `/public/exemple_landing.png`

### Alternative temporaire

En attendant, un placeholder élégant est affiché automatiquement sur la landing page.

### Après ajout de l'image

Une fois l'image ajoutée, vous pouvez mettre à jour le code dans `/app/page.tsx` :

```tsx
{/* Remplacer le placeholder par : */}
<Image 
  src="/exemple_landing.png" 
  alt="Dashboard Preview" 
  width={1200}
  height={700}
  className="w-full h-auto"
  priority
/>
```

Et n'oubliez pas de réimporter `Image` de `next/image` en haut du fichier.
