# FAIR

Former les Associations à l'IA Responsable : site et supports de formation pour les clubs sportifs.

## Contenu

- `index.html` : accueil du site ; pages légales `mentions-legales.html` et `confidentialite.html`
- `assets/` : styles, scripts, polices, images, vidéos et logos du site
- `formation.html` : accueil de la formation, niveau 0 et progression
- `formation-1.html` à `formation-5.html` : les cinq modules du niveau 0
  1. Créer ses comptes
  2. Bien demander (méthode C.L.U.B.)
  3. L'IA sans risque (vérifier, protéger, arnaques, charte IA)
  4. Fichiers, photos, voix
  5. Mon premier dossier (feuille de route, quiz, attestation)
- `formation-n1.html` : accueil du niveau 1 « L'IA au quotidien du club » (ouvert pour l'instant, lié depuis `formation.html` et `formation-5.html`)
- `formation-n1-1.html` à `formation-n1-5.html` : les cinq modules du niveau 1, avec le club fil rouge « AS Exemple Handball »
  1. Écrire aux adhérents (fiche du club, convocations en série, méthode C.A.L.M.E., FALC et traduction)
  2. Réseaux et affiches (ligne éditoriale, calendrier, posts, visuels, droit à l'image)
  3. Réunions et AG (ordre du jour, transcription, compte rendu fidèle, suivi, assemblée générale)
  4. Préparer ses séances (fiche du groupe, séance, imprévus, inclusion, cycle, limites)
  5. La rentrée du club (feuille de route en 8 étapes, quiz final, attestation « Niveau 1 validé »)
- `formation-n2.html` : accueil du niveau 2 « Ses outils sur mesure » (ouvert pour l'instant, lié depuis `formation.html`, `formation-n1.html` et `formation-n1-5.html`)
- `formation-n2-1.html` à `formation-n2-5.html` : les cinq modules du niveau 2, avec l'AS Exemple une saison plus tard (Camille au secrétariat, Théo à la communication, Nadia responsable technique)
  1. L'assistant du secrétariat (méthode C.O.A.C.H., générateur d'instructions, création dans ChatGPT, Claude ou Gemini, les six tests)
  2. L'assistant de la communication (documents de référence, exemples de style, droit à l'image, ligne « Sources »)
  3. L'assistant des éducateurs (cadre technique, garde-fous santé et sécurité, amorces, partage, mode d'emploi)
  4. Les modèles du bureau (fiche modèle en six rubriques, gabarits de documents, bibliothèque « IA du club », adoption)
  5. La boîte à outils du club (registre des outils, entretien et passation, feuille de route en 8 étapes, quiz final, attestation « Niveau 2 validé »)
- `formation-fiches.html` : fiches mémo A4 à imprimer
- `formation-animateur.html` : guide de l'animateur (2 séances de 2 h)
- `assets/css/formation.css` et `assets/js/formation.js` : style et comportements communs aux pages de formation
- `assets/css/niveau.css` : composants des modules des niveaux 1 et 2 (objectifs, générateurs, exercices, « repérez les erreurs », bibliothèques, quiz)
- `assets/formation/` : captures du module 1 (`claude-N.png`, `chatgpt-N.png`, `gemini-N.png`)
- `medias-bonus/` : médias non utilisés
- `assets/logo/` : logos FAIR en SVG (icône, blanc, horizontal, vertical)
- `CREDITS.md` : crédits des photos et vidéos

La progression (check-lists, quiz, brouillons) est enregistrée dans le `localStorage` du navigateur, sous les clés `fair-module1` à `fair-module5`, `fair-quiz0` et `fair-attestation` pour le niveau 0, et `fair-n1-module1` à `fair-n1-module5`, `fair-n1-quiz1` à `fair-n1-quiz4`, `fair-n1-quiz` (quiz final) et `fair-n1-club` (la fiche du club, reprise dans les demandes des modules 2 à 5 et dans les générateurs du niveau 2) pour le niveau 1, et `fair-n2-module1` à `fair-n2-module5`, `fair-n2-quiz1` à `fair-n2-quiz4`, `fair-n2-quiz` (quiz final), `fair-n2-coach`, `fair-n2-com`, `fair-n2-educ`, `fair-n2-modele` et `fair-n2-registre` (les générateurs) pour le niveau 2. Rien n'est envoyé.

Pour ajouter un module, déclarez-le dans `MODULES` (niveau 0), `N1` (niveau 1) ou `N2` (niveau 2) de `assets/js/formation.js` avec sa clé et son nombre de cases.

Après une modification de `formation.css` ou `niveau.css`, augmentez le numéro `?v=` du lien dans les pages `formation*.html`, sinon les navigateurs peuvent garder l'ancienne version en cache.

## Aperçu local

```bash
python -m http.server 5173
```

Puis ouvrir http://localhost:5173
