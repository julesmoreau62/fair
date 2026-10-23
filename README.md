# FAIR

Former les Associations à l'IA Responsable : site et supports de formation pour les clubs sportifs.

## Contenu

- `index.html` : accueil du site ; pages légales `mentions-legales.html` et `confidentialite.html`
- `label.html` : le label « Club IA responsable » (portée, démarche, liste des clubs labellisés, règlement d'usage). Pour ajouter un club, copier la ligne d'exemple en commentaire dans le tableau `#clubs` et retirer la ligne « vide »
- `404.html` : page « introuvable », servie automatiquement par Netlify
- `robots.txt` et `sitemap.xml` : référencement (adresse du site : https://fair-asso.fr). Ajoutez chaque nouvelle page publique au sitemap
- `_redirects` : règles Netlify ; `index-version-longue.html`, `medias-bonus/` et `.claude/` restent dans le dossier mais renvoient une 404 en ligne
- `assets/` : styles, scripts, polices, images, vidéos et logos du site
- `formation.html` : accueil de la formation (les six niveaux en bref, avec la progression de chacun), puis le niveau 0 (`#niveau-0`) et ses ressources
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
- `formation-n3.html` : accueil du niveau 3 « Financer et développer » (ouvert pour l'instant, lié depuis `formation.html`, `formation-n1.html`, `formation-n2.html` et `formation-n2-5.html`)
- `formation-n3-1.html` à `formation-n3-5.html` : les cinq modules du niveau 3, avec l'AS Exemple qui veut grandir (Camille vice-présidente chargée des projets, le trésorier, Nadia, Théo). Les chiffres de l'action fil rouge « Le hand au quartier des Tilleuls » se répondent d'un module à l'autre : à modifier partout ensemble
  1. Le projet du club (diagnostic chiffré sans donnée personnelle, enquête auprès des adhérents, axes et objectifs, méthode É.Q.U.I.P.E., générateur de fiche action)
  2. Le dossier de subvention (qui finance quoi, appel à projets lu comme l'instructeur, budget prévisionnel calculé dans la page, rédaction sans rien inventer, pièces et signature)
  3. Partenaires et mécènes (offre de partenariat, parrainage ou mécénat, proposition sur mesure, rendez-vous, convention et suivi)
  4. Rendre compte (suivi des indicateurs, bilan honnête, prévu et réalisé, compte rendu financier, mêmes chiffres pour tous)
  5. La saison des financements (fiche de suivi des demandes, calendrier, dossier permanent, feuille de route en 8 étapes, quiz final, attestation « Niveau 3 validé »)
- `formation-n4.html` : accueil du niveau 4 « Automatiser à plusieurs » (ouvert pour l'instant, lié depuis `formation.html`, `formation-n1.html` à `formation-n3.html` et `formation-n3-5.html`)
- `formation-n4-1.html` à `formation-n4-5.html` : les cinq modules du niveau 4, avec l'AS Exemple qui manque de bras (Malik, étudiant qui veut « tout automatiser », la secrétaire, Camille, le président)
  1. Ce qui s'automatise (assistant, automatisation ou agent, inventaire des tâches, temps vraiment gagné, feux vert, orange, rouge, méthode R.E.L.A.I.S., générateur de fiche)
  2. Des données propres (formulaire minimal, questionnaire de santé des mineurs, tableur unique, générateur de mention d'information, registre des traitements, pseudonymisation)
  3. Construire un flux (anatomie d'un flux, outils du plus simple au plus puissant, l'IA qui prépare sans décider, six tests sur un faux tableur, générateur de plan de flux)
  4. L'IA en équipe (espace d'équipe, réunions sans enregistrement caché, générateur de règles d'équipe, agents, arrivées et départs)
  5. Le club en relais (registre des automatisations, plan de continuité, feuille de route en 8 étapes, quiz final, attestation « Niveau 4 validé »)
- `formation-automatisations.html` : le catalogue des automatisations (12 recettes en R.E.L.A.I.S., filtrées par domaine, avec la demande à copier ; 4 sont prêtes dans le dépôt modèle). Lié depuis `formation-n4.html`, `formation-n4-3.html` et l'atelier
- `formation-n4-atelier.html` : atelier pratique « Ma première tâche programmée », hors progression du niveau (check-list `fair-n4-atelier`, quiz `fair-n4-atelier-quiz`, traducteur d'horaire `fair-n4-cron`). Lié depuis `formation-n4.html`, `formation-n4-3.html`, `formation-n4-5.html` et le catalogue
- Dépôt modèle des robots, à part : https://github.com/julesmoreau62/modele-automatisations-club (quatre workflows GitHub Actions, données fictives de l'AS Exemple Handball, mode essai par défaut). Les pages y renvoient : il doit rester public et marqué comme modèle (template)
- `formation-fiches.html` : fiches mémo A4 à imprimer
- `formation-animateur.html` : guide de l'animateur (2 séances de 2 h)
- `assets/css/formation.css` et `assets/js/formation.js` : style et comportements communs aux pages de formation
- `assets/css/niveau.css` : composants des modules des niveaux 1 à 4 (objectifs, générateurs, exercices, « repérez les erreurs », bibliothèques, quiz)
- `assets/formation/` : captures du module 1 (`claude-N.png`, `chatgpt-N.png`, `gemini-N.png`)
- `medias-bonus/` : médias non utilisés
- `assets/logo/` : logos FAIR en SVG (icône, blanc, horizontal, vertical) ; `fair-logo-blanc-court.svg`, sans la devise, sert à l'en-tête des pages de formation
- `assets/label/` : badge du label en SVG, texte vectorisé (fond bleu nuit, `-clair`, `-mono`), un jeu par année d'attribution
- `CREDITS.md` : crédits des photos et vidéos

La progression (check-lists, quiz, brouillons) est enregistrée dans le `localStorage` du navigateur, sous les clés `fair-module1` à `fair-module5`, `fair-quiz0` et `fair-attestation` pour le niveau 0, et `fair-n1-module1` à `fair-n1-module5`, `fair-n1-quiz1` à `fair-n1-quiz4`, `fair-n1-quiz` (quiz final) et `fair-n1-club` (la fiche du club, reprise dans les demandes des modules 2 à 5 et dans les générateurs du niveau 2) pour le niveau 1, et `fair-n2-module1` à `fair-n2-module5`, `fair-n2-quiz1` à `fair-n2-quiz4`, `fair-n2-quiz` (quiz final), `fair-n2-coach`, `fair-n2-com`, `fair-n2-educ`, `fair-n2-modele` et `fair-n2-registre` (les générateurs) pour le niveau 2, et `fair-n3-module1` à `fair-n3-module5`, `fair-n3-quiz1` à `fair-n3-quiz4`, `fair-n3-quiz` (quiz final), `fair-n3-fiche`, `fair-n3-budget`, `fair-n3-partenaire`, `fair-n3-bilan` et `fair-n3-suivi` (les générateurs) pour le niveau 3, et `fair-n4-module1` à `fair-n4-module5`, `fair-n4-quiz1` à `fair-n4-quiz4`, `fair-n4-quiz` (quiz final), `fair-n4-relais`, `fair-n4-mention`, `fair-n4-flux`, `fair-n4-regles` et `fair-n4-registre` (les générateurs) pour le niveau 4. Les attestations des niveaux 1 à 4 reprennent le nom et le club gardés sous `fair-attestation`. Rien n'est envoyé.

Pour ajouter un module, déclarez-le dans `MODULES` (niveau 0), `N1` à `N4` (niveaux 1 à 4) de `assets/js/formation.js` avec sa clé et son nombre de cases.

Après une modification de `formation.css`, `niveau.css` ou `formation.js`, augmentez le numéro `?v=` du lien dans les pages `formation*.html`, sinon les navigateurs peuvent garder l'ancienne version en cache.

Les pages publiques portent une adresse de référence (`canonical`) et des balises de partage (`og:`) avec des adresses complètes en https://fair-asso.fr : à reprendre sur toute nouvelle page.

## Aperçu local

```bash
python -m http.server 5173
```

Puis ouvrir http://localhost:5173
