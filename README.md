# FAIR

Former les Associations à l'IA Responsable : site et supports de formation pour les clubs sportifs.

## Contenu

- `refonte/` : nouveau site (accueil `index.html`, `formation.html`, pages légales, `assets/`)
- `refonte/assets/formation/` : captures du module 1 (`claude-N.png`, `chatgpt-N.png`, `gemini-N.png`)
- `Site FAIR.html` : ancien site, conservé tel quel
- `medias-bonus/` : médias non utilisés
- Logos FAIR (SVG) à la racine

## Aperçu local

```bash
python -m http.server 5173 --directory refonte
```

Puis ouvrir http://localhost:5173
