# Catalogue de bibliothèque — LOG3550 Devoir 1

**Étudiante :** Jenny Flore CHERFILS

**Cours :** LOG3550 Développement web, ISTEAH, professeur Samuel Jonathan JOSEPH

**Dépôt Git :** https://github.com/JennyFlore/devoir1-catalogue

## Description

Application web de catalogue de bibliothèque, en HTML, CSS et JavaScript purs (aucun framework ni bibliothèque externe). On peut consulter une liste de livres, les rechercher, les filtrer, les trier, en ajouter et en supprimer. La liste est conservée dans le navigateur. Ce frontend sera relié à une API FastAPI dans le devoir 2.

## Mode d'emploi

1. Ouvrir `index.html` dans un navigateur récent (ou avec l'extension Live Server de VS Code).
2. **Rechercher** : taper dans le champ « Rechercher ». La liste se met à jour à chaque lettre, sans tenir compte des majuscules ni des accents (« etranger » trouve « L'Étranger »).
3. **Filtrer** : choisir une catégorie et/ou cocher « Disponibles seulement ». Recherche, catégorie et disponibilité fonctionnent ensemble.
4. **Trier** : choisir un tri par titre ou par année, croissant ou décroissant.
5. **Emprunter** : le bouton « Emprunter » marque le livre comme emprunté (le bouton se grise).
6. **Ajouter** : remplir le formulaire en bas de page. Les erreurs s'affichent sous chaque champ.
7. **Supprimer** : le bouton « Supprimer » d'une carte demande une confirmation.
8. **Réinitialiser** : le bouton « Réinitialiser » remet les 10 livres de départ, après confirmation.

Les ajouts, suppressions et emprunts sont conservés après rechargement de la page.

## Structure du projet

```
devoir1/
  index.html
  css/styles.css
  js/data.js      tableau de départ (10 livres)
  js/app.js       affichage, recherche, filtres, tri, ajout, suppression, validation, localStorage
  README.md
```

## Choix de conception

- **HTML sémantique** : `header`, `nav`, `main`, `section`, `footer`, un seul `h1`, des `label` associés à chaque champ.
- **CSS mobile d'abord** : les styles de base visent le téléphone (une colonne). Deux points de rupture (`min-width: 600px` et `960px`) passent à deux puis trois colonnes avec CSS Grid. Les couleurs et espacements sont des variables `:root`.
- **Un seul point d'entrée pour l'affichage** : `mettreAJourAffichage()` filtre, trie puis redessine les cartes. Chaque action (recherche, ajout, suppression…) modifie les données puis appelle cette fonction.
- **Cartes créées avec le DOM** (`createElement`), jamais écrites à la main dans le HTML. `textContent` est utilisé à la place de `innerHTML`, pour qu'un titre contenant du HTML ne soit pas interprété comme du code.
- **Étiquettes lisibles sans la couleur** : « Disponible » et « Emprunté » sont écrits en toutes lettres, la couleur ne fait que renforcer l'information.
- **Validation côté client** avec `novalidate` sur le formulaire, pour remplacer les bulles du navigateur par des messages placés sous chaque champ (`aria-describedby`, `aria-live`, `aria-invalid`). Le focus va au premier champ fautif.
- **Sauvegarde** : la liste complète est enregistrée dans `localStorage` après chaque modification. Si la sauvegarde est illisible, l'application repart des livres de départ.

## Difficultés rencontrées

Je n'ai pas rencontré de difficulté particulière, car j'ai réalisé ce devoir avec l'aide de l'assistant Claude, qui m'a expliqué les termes et le code étape par étape. Ce cours a surtout été un rappel pour moi, parce que je ne l'ai pas suivi en même temps que le cours WEB1.

## Réponses aux deux questions d'explication

### Partie 1 : pourquoi les balises sémantiques plutôt qu'une suite de `div` ?

Les balises sémantiques (`header`, `nav`, `main`, `section`, `footer`) disent ce que contient chaque partie de la page, alors qu'une `div` ne dit rien. Pour l'accessibilité, les lecteurs d'écran s'en servent pour aider une personne aveugle à aller directement au menu ou au contenu principal. Pour le référencement, les moteurs de recherche comme Google comprennent mieux la page et sa structure, donc ils la classent mieux. Pour la maintenance, le code est plus facile à lire et à corriger, car on voit tout de suite le rôle de chaque bloc. Avec des `div`, il faut ajouter des classes et du code pour obtenir le même résultat, et le code devient long et confus.

### Partie 3 : différence entre `map`, `filter` et `forEach`

`forEach` parcourt un tableau et fait une action pour chaque élément, mais il ne renvoie rien. `map` parcourt un tableau et renvoie un nouveau tableau de même taille, où chaque élément est transformé. `filter` parcourt un tableau et renvoie un nouveau tableau avec seulement les éléments qui respectent une condition. Pour la recherche et le filtrage, j'ai utilisé `filter`, qui garde les livres correspondant au texte, à la catégorie et à la disponibilité. J'ai aussi utilisé `map` pour transformer chaque livre en carte, et `forEach` pour afficher les messages d'erreur du formulaire.

## Sources et outils d'assistance utilisés

- Assistant IA : Claude (Anthropic), utilisé pour m'aider à réaliser ce devoir étape par étape : explication des termes, proposition de code, relecture. J'ai testé, lu et compris le code avant de le garder.
- Documentation MDN Web Docs (HTML, CSS Grid, `localStorage`, `String.prototype.normalize`, ARIA) : https://developer.mozilla.org
- Validateur HTML du W3C : https://validator.w3.org
- Outils : Visual Studio Code, extension Live Server, Git et GitHub.
- Aucune image et aucune bibliothèque externe n'est utilisée. Les titres du catalogue sont des œuvres réelles, utilisées seulement comme données d'exemple.