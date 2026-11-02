# Couper les mots

Petite appli pour apprendre à remettre les espaces entre les mots d'une phrase.

- **Jouer en ligne :** https://lechampdelaurore-boop.github.io/couper-les-mots/
- Le bouton 🏠 ramène à la page d'accueil de toutes les applis : https://lechampdelaurore-boop.github.io/

## Une séance (environ 5 minutes, 6 phrases)

1. **Écouter et compter** : la phrase est lue à voix haute. On tape sur le tambour une fois par mot entendu. Si le compte n'est pas bon, la phrase est relue mot par mot, avec un rond qui s'allume pour chaque mot.
2. **Couper** : la phrase s'affiche collée en grandes lettres (« Lechatdort »). On touche entre deux lettres pour remettre une espace. Une bonne coupe brille en vert. Une coupe fausse se referme doucement, la carte secoue la tête et la phrase est relue (« Écoute encore »).
3. **Aide** : le bouton 💡 surligne un petit mot connu (le, sur, dans…). Après deux coupes fausses, l'aide arrive toute seule : la phrase finit toujours par être réussie.

Quand la phrase est longue, elle est affichée sur plusieurs lignes, coupées entre deux mots : ces espaces-là sont offertes.

À la fin : étoiles, badge du jour, et un personnage qui dit « À demain ! ».

## Progression

- Niveau 1 : phrases de 3 mots. Niveau 2 : 4 ou 5 mots. Niveau 3 : phrases plus longues. Niveau 4 : l'apostrophe (*l'arbre*, *j'aime*) : à l'endroit de l'apostrophe, la coupe fait apparaître ’.
- Un trophée et le niveau suivant après 10 phrases du niveau réussies sans erreur ni aide. Le niveau ne redescend jamais tout seul.
- Après une phrase difficile, la prochaine phrase nouvelle est prise un niveau plus bas.
- Répétition espacée : une phrase ratée revient plus tard dans la séance et le lendemain ; une phrase réussie revient dans 1, 2, 4, 7, 14 puis 30 jours.
- Pas de chrono, pas de croix rouge, pas de vies perdues.

## Espace parent

Lien « Espace parent » en bas de l'accueil, puis garder le doigt appuyé 2 secondes sur « Ouvrir ».

- **Ses phrases à lui** : les phrases de ses dictées, une par ligne. Elles passent en priorité dans les séances, et le bouton « Mes phrases à moi » lance une séance avec elles seules. Un lien permet de les copier sur un autre appareil (les phrases sont dans le lien lui-même, rien n'est envoyé sur un serveur).
- **Niveau** : à changer à la main si besoin.
- **Carnet de bord** : par jour, le nombre de phrases, celles réussies du premier coup, les coupes ratées et les aides ; puis les phrases les plus difficiles.

Tout reste dans le navigateur de l'appareil (clés `marc.couper.*`) : aucun compte, et rien n'est envoyé sur internet.

## Réglages (⚙)

Sons, animations, et lecture des consignes à voix haute. La phrase est lue par la voix française de l'appareil (synthèse vocale du navigateur) ; si l'appareil n'a pas de voix, le lien « Je n'entends rien ? » affiche la phrase.

## Fichiers

- `index.html` : toute l'appli (HTML, CSS et JavaScript, sans bibliothèque). Le haut du style est la charte commune des applis ; les 30 personnages de récompense sont les mêmes que dans tables-en-cartes.
- `sw.js` et `manifest.webmanifest` : mode hors ligne et installation. Après une modification des fichiers de l'appli, changer la valeur de `CACHE` dans `sw.js`.
- `fonts/` : polices Fredoka et Nunito (licence SIL Open Font License, voir les fichiers `OFL-*.txt`).
- `icons/` : icône de l'appli.
- `tests/telephone.cjs` et `.github/workflows/test-telephone.yml` : après chaque mise en ligne, GitHub ouvre le site publié dans Chrome au format téléphone (7 tailles d'écran) et vérifie que l'écran de séance ne défile pas et que la console n'a pas d'erreur. Résultat et captures dans l'onglet Actions. Lancement local : `npm install --no-save playwright && node tests/telephone.cjs`.
