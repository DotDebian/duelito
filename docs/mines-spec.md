# Mines - Spécification du jeu

## Vue d'ensemble

Le jeu Mines est un jeu de type démineur où le joueur doit révéler des cases contenant des diamants tout en évitant les mines. Plus le joueur révèle de diamants consécutifs, plus le multiplicateur augmente.

## Layout

### Structure générale
Le jeu utilise le layout standard à deux panneaux :
- **Panneau gauche** : Contrôles de paris (380px) - déjà implémenté
- **Panneau droit** : Zone de jeu (flex-1)

### Zone de jeu
```
┌─────────────────────────────────────┐
│                          [Historique]│  <- En haut à droite
│                                      │
│     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│     │  │ │  │ │  │ │  │ │  │       │
│     └──┘ └──┘ └──┘ └──┘ └──┘       │
│     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│     │  │ │  │ │  │ │  │ │  │       │  <- Grille 5x5 centrée
│     └──┘ └──┘ └──┘ └──┘ └──┘       │
│     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│     │  │ │  │ │  │ │  │ │  │       │
│     └──┘ └──┘ └──┘ └──┘ └──┘       │
│     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│     │  │ │  │ │  │ │  │ │  │       │
│     └──┘ └──┘ └──┘ └──┘ └──┘       │
│     ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│     │  │ │  │ │  │ │  │ │  │       │
│     └──┘ └──┘ └──┘ └──┘ └──┘       │
│                                      │
│ [Zero Edge]            [Provably Fair]│  <- Badges en bas
└─────────────────────────────────────┘
```

## Grille de jeu

### Dimensions
- Grille : **5x5** (25 cases au total)
- Container : `grid grid-cols-5 gap-[6px]`
- Taille max : `max-w-[50dvh] xl:max-w-[512px]`
- Ratio : `aspect-square`

### Case individuelle
- Ratio : `aspect-square`
- Bordure : `rounded-8 border-2`
- Transition : `transition-all duration-100`
- Shadow de base : `shadow-[0px_2px_0px_0px_#161834]`

## États des cases

### 1. État initial (idle - avant bet)
Toutes les cases affichent une icône "épées croisées" désactivée.

| Propriété | Valeur |
|-----------|--------|
| Background | `bg-dark-500` |
| Border | `border-transparent` |
| Icône | SVG épées croisées |
| Taille icône | `size-[32%]` |
| Opacité icône | 50% |
| Cursor | `default` |

### 2. En jeu - case non révélée (playing - mode manuel)
Cases cliquables pendant une partie active.

| Propriété | Valeur |
|-----------|--------|
| Background | `bg-dark-400` |
| Hover | `hover:bg-dark-300` |
| Border | `border-transparent` |
| Icône | SVG épées croisées |
| Taille icône | `size-[32%]` |
| Cursor | `cursor-pointer` |

### 3. Case pré-sélectionnée (mode auto - avant bet)
En mode auto, le joueur sélectionne les cases à révéler avant de lancer la partie.

| Propriété | Valeur |
|-----------|--------|
| Background | `bg-blue-600` |
| Border | `border-transparent` |
| Icône | SVG épées croisées |
| Taille icône | `size-[32%]` |
| Cursor | `cursor-pointer` |

### 4. Diamant révélé (non cliqué par le joueur)
Case révélée automatiquement (ex: fin de partie).

| Propriété | Valeur |
|-----------|--------|
| Background | `bg-dark-700` |
| Border | `border-transparent` |
| Icône | Image diamant bleu |
| Taille icône | `size-[46%]` |

### 5. Diamant cliqué par le joueur
Case que le joueur a explicitement sélectionnée pendant la partie.

| Propriété | Valeur |
|-----------|--------|
| Background | `bg-[#091c2a]` (teal foncé) |
| Border | `border-green-700` |
| Icône | Image diamant bleu |
| Taille icône | `size-[50%]` (plus grand) |

### 6. Mine révélée (après game over)
Mines affichées à la fin de la partie.

| Propriété | Valeur |
|-----------|--------|
| Background | `bg-dark-700` |
| Border | `border-transparent` |
| Opacité | `opacity-60` |
| Icône | Image grenade |
| Taille icône | `size-[32%]` |

### 7. Mine explosée (case perdante)
La mine sur laquelle le joueur a cliqué.

| Propriété | Valeur |
|-----------|--------|
| Background | `bg-[#1d0b24]` (rouge foncé) |
| Border | `border-red-600` |
| Icône | Image explosion |
| Taille icône | `size-[85%]` |

## Modes de jeu

### Mode Manuel
1. Le joueur configure sa mise et le nombre de mines
2. Clic sur "Bet" pour démarrer
3. La grille devient interactive
4. Le joueur clique sur les cases une par une
5. À tout moment, il peut cliquer sur "Cashout" pour encaisser ses gains
6. S'il clique sur une mine, il perd sa mise

### Mode Auto
1. Le joueur configure sa mise, le nombre de mines, et le nombre de paris
2. **Avant de lancer** : le joueur sélectionne les cases à révéler sur la grille
   - Les cases sélectionnées passent en `bg-blue-600`
   - Il peut sélectionner autant de cases qu'il veut
3. Clic sur "Start Auto" pour lancer les parties automatiques
4. Pour chaque partie :
   - Les cases pré-sélectionnées sont révélées automatiquement dans l'ordre
   - Si toutes les cases sélectionnées sont des diamants → gain automatique (cashout)
   - Si une mine est touchée → perte, passage à la partie suivante
5. Les paramètres On Win / On Loss s'appliquent entre chaque partie

## Historique des résultats

Affiché en haut à droite de la zone de jeu.

### Container
```
h-[24px] xl:h-32
flex items-center gap-2
```

### Badge de résultat
```
rounded-[6px] px-4
min-w-[48px] h-full
flex items-center justify-center
font-semibold text-b-md
cursor-pointer
```

| Type | Classes |
|------|---------|
| Perte (0.00) | `text-dark-200 bg-dark-500` |
| Gain | `text-green-500 bg-green-800` |

Le résultat le plus récent est mis en évidence, les autres sont atténués.

## Popup de victoire (Cashout)

Affiché au centre de la grille quand le joueur encaisse ses gains.

### Position
```
absolute left-1/2 top-1/2
-translate-x-1/2 -translate-y-1/2
min-w-[142px]
```

### Structure
```html
<div class="rounded-8 border-2 border-green-600 bg-green-600 text-center">
  <!-- Multiplicateur -->
  <h3 class="px-16 pb-8 pt-[12px] text-h-lg text-dark-900">
    x1.30
  </h3>
  <!-- Montant gagné -->
  <div class="rounded-b-8 bg-dark-900 p-8">
    <CurrencyDisplay amount={gainAmount} />
  </div>
</div>
```

## Phases de jeu

### 1. Idle
- Grille avec icônes épées (état initial)
- Bouton "Bet" actif (manuel) ou grille interactive pour sélection (auto)
- Nombre de mines configurable (1-24)

### 2. Selecting (mode auto uniquement)
- Le joueur clique sur les cases pour les pré-sélectionner
- Cases sélectionnées : `bg-blue-600`
- Clic à nouveau pour désélectionner
- Bouton "Start Auto" devient actif quand au moins 1 case est sélectionnée

### 3. Playing
- **Mode manuel** : Cases cliquables, révéler une par une
- **Mode auto** : Cases révélées automatiquement selon la sélection
- Bouton transformé en "Cashout" avec multiplicateur actuel (manuel)
- À chaque diamant trouvé :
  - Animation de révélation (fade-in + scale)
  - Mise à jour du multiplicateur

### 4. Won (Cashout)
- Popup de victoire au centre
- Toutes les cases révélées (diamants + mines)
- Cases non cliquées par le joueur avec `opacity-60`
- Résultat ajouté à l'historique (vert)

### 5. Lost
- Mine explosée affichée
- Toutes les cases révélées
- Toutes les cases avec `opacity-60`
- Résultat ajouté à l'historique (0.00)

## Assets requis

| Asset | Usage |
|-------|-------|
| `icon-mines-diamond-blue.png` | Diamant trouvé |
| `icon-mines-bomb.png` | Mine (grenade) révélée |
| `icon-mines-explosion.png` | Mine explosée |
| SVG épées croisées | Case non révélée |

## Calcul du multiplicateur

Le multiplicateur est calculé selon une formule probabiliste basée sur :
- Le nombre total de cases (25)
- Le nombre de mines
- Le nombre de diamants déjà révélés

### Formule
```
Pour chaque révélation i (de 0 à n-1) :
  probabilité_survie[i] = (cases_safe_restantes - i) / (cases_totales_restantes - i)

multiplicateur_cumulé = 0.99 / (probabilité_survie[0] × probabilité_survie[1] × ... × probabilité_survie[n-1])
```

Le facteur 0.99 représente un house edge de 1% (ou 1.00 pour Zero Edge).

### Exemples avec 3 mines (22 diamants sur 25)

| Diamants révélés | Calcul | Multiplicateur |
|------------------|--------|----------------|
| 1 | 0.99 / (22/25) | 1.12x |
| 2 | 0.99 / (22/25 × 21/24) | 1.30x |
| 3 | 0.99 / (22/25 × 21/24 × 20/23) | 1.49x |
| 4 | ... | 1.72x |
| 5 | ... | 2.00x |

### Exemples avec 1 mine (24 diamants sur 25)

| Diamants révélés | Multiplicateur |
|------------------|----------------|
| 1 | 1.03x |
| 5 | 1.19x |
| 10 | 1.55x |
| 20 | 4.75x |
| 24 | 24.75x |

### Exemples avec 10 mines (15 diamants sur 25)

| Diamants révélés | Multiplicateur |
|------------------|----------------|
| 1 | 1.65x |
| 2 | 2.91x |
| 3 | 5.45x |
| 5 | 22.73x |

### Implémentation suggérée
```typescript
function calculateMultiplier(
  totalTiles: number,      // 25
  mineCount: number,       // 1-24
  revealedCount: number,   // nombre de diamants révélés
  houseEdge: number = 0.01 // 1% ou 0 pour Zero Edge
): number {
  const safeTiles = totalTiles - mineCount;
  let probability = 1;

  for (let i = 0; i < revealedCount; i++) {
    probability *= (safeTiles - i) / (totalTiles - i);
  }

  return (1 - houseEdge) / probability;
}
```

## Animations

### Révélation de case (fade-in + scale)
```css
/* État initial (caché) */
.tile-content {
  opacity: 0;
  transform: scale(0.5);
}

/* État révélé */
.tile-content.revealed {
  opacity: 1;
  transform: scale(1);
  transition: opacity 200ms ease-out, transform 200ms ease-out;
}
```

### Popup de victoire
- Apparition avec `opacity: 0 → 1` et `transform: scale(0.9) → scale(1)`
- Durée : 300ms
- Easing : ease-out

### Hover sur cases
- Transition de background `bg-dark-400` → `bg-dark-300`
- Durée : 100ms

### Explosion de mine
- L'icône explosion apparaît avec un scale plus prononcé (0.3 → 1)
- Optionnel : léger shake sur la case

## Badges en bas

Identiques aux autres jeux :
- **Zero Edge** : Icône maison + texte
- **Provably Fair** : Icône checkmark + texte
