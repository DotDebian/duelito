# Dice Game - Spécification

## Vue d'ensemble

Jeu de dés basé sur un système de probabilités où le joueur parie sur un nombre aléatoire (0-100) qui sera supérieur ou inférieur à un seuil choisi.

---

## Layout

```
┌─────────────────┬──────────────────────────────────────────┐
│                 │                                          │
│   Panneau de    │                                          │
│   contrôle      │           Zone de jeu                    │
│   (gauche)      │           (droite)                       │
│                 │                                          │
│                 │                                          │
└─────────────────┴──────────────────────────────────────────┘
```

---

## Panneau de contrôle - Mode Manual (gauche)

### Mode de jeu
- **Manual** / **Auto** (toggle tabs)

### Bet Amount
- Champ de saisie avec icône `$`
- Affichage solde en BTC à droite
- Boutons rapides : `½` | `2x` | `MAX`

### Profit on Win
- Affichage dynamique : `$ X.XX`
- Calculé : `betAmount × (multiplier - 1)`

### Bouton principal
- **"Roll Dice"** - Bouton bleu pleine largeur

---

## Panneau de contrôle - Mode Auto (gauche)

Lorsque le toggle **Auto** est sélectionné, le panneau affiche des options supplémentaires :

### Bet Amount
*(identique au mode Manual)*

### Number of Bets
- Champ numérique (nombre de rolls à effectuer)
- Bouton **∞** : Mode infini (jusqu'à stop manuel ou limite atteinte)

### On Win
Comportement après une victoire :
| Option | Description |
|--------|-------------|
| **Reset** | Revenir à la mise initiale |
| **Increase by** | Augmenter la mise de X% |

- Champ pourcentage à droite (ex: `0 %`)

### On Loss
Comportement après une défaite :
| Option | Description |
|--------|-------------|
| **Reset** | Revenir à la mise initiale |
| **Increase by** | Augmenter la mise de X% (stratégie Martingale) |

- Champ pourcentage à droite (ex: `0 %`)

### Conditions d'arrêt

| Champ | Description |
|-------|-------------|
| **Stop on Profit** | Arrêter si profit total ≥ montant (`$ 0.00`) |
| **Stop on Loss** | Arrêter si perte totale ≥ montant (`$ 0.00`) |

### Profit on Win
*(identique au mode Manual)*

### Bouton principal
- **"Start Autobet"** → Lance la séquence automatique
- Devient **"Stop Autobet"** pendant l'exécution

---

## Zone de jeu (droite)

### Historique des résultats (haut droite)

Badges affichant les derniers rolls, alignés à droite :

```
                                    [52.31] [14.87] [87.70]
                                     rouge   rouge   vert
```

| Propriété | Valeur |
|-----------|--------|
| **Position** | Haut droite de la zone de jeu |
| **Ordre** | Nouveaux résultats à droite, anciens poussés à gauche |
| **Style Win** | Texte vert, sans fond |
| **Style Lose** | Texte rouge, sans fond |
| **Affichage** | Nombre avec 2 décimales |

### Slider de résultat

Barre horizontale représentant visuellement la plage 0-100 :

```
┌────────────────────────────────────────────────────────┐
│ ●─────────────ROUGE─────────────●────VERT────●────────●│
│                              [✕]                       │
└────────────────────────────────────────────────────────┘
  0                            50                      100
```

- **Zone rouge** : Perdant (0 → seuil)
- **Zone verte** : Gagnant (seuil → 100)
- **Curseur central** : Position du seuil (draggable)
- **Points** : Marqueurs aux positions 0, 50, 100

**Contraintes du curseur :**
| Propriété | Valeur |
|-----------|--------|
| **Minimum** | 2.00 |
| **Maximum** | 99.98 |
| **Affichage visuel** | 0 → 100 |
| **Précision** | 2 décimales |

> Le curseur ne peut jamais atteindre 0 ou 100, garantissant toujours une chance de gain/perte.

### Champs de configuration

| Champ | Valeur par défaut | Description |
|-------|-------------------|-------------|
| **Multiplier** | 2.0000 | Multiplicateur de gain (bouton ✕ pour reset) |
| **Roll Over** | 50.05 | Seuil à dépasser (bouton ↻ pour inverser en Roll Under) |
| **Win Chance** | 49.95% | Probabilité de victoire |

### Relations mathématiques
```
Win Chance = 100 - Roll Over (mode "Roll Over")
Win Chance = Roll Over (mode "Roll Under")
Multiplier = 100 / Win Chance
```

### Badges en bas
- 🔒 **Zero Edge** - Pas d'avantage maison
- ✓ **Provably Fair** - Vérifiabilité cryptographique

---

## Animation du résultat

### Tooltip de roll

Élément en forme de tooltip (avec flèche vers le bas) affichant le résultat :

```
        ┌────────┐
        │ 87.70  │
        └───▼────┘
            │
────●───────────────────●─────────────●────────────●────
```

| Propriété | Valeur |
|-----------|--------|
| **Fond Win** | Vert (`green-500`) |
| **Fond Lose** | Rouge (`red-500`) |
| **Texte** | Blanc, nombre avec 2 décimales |

### Séquence d'animation

1. **Départ** : Tooltip apparaît à l'extrémité gauche (position 0)
2. **Transition** : Déplacement horizontal fluide vers la position du résultat
3. **Arrivée** : Tooltip se stabilise à la position finale
4. **Persistance** : Reste visible jusqu'au prochain roll

---

## Logique de jeu

1. Le joueur définit sa mise et le seuil (Roll Over)
2. Au clic sur "Roll Dice", un nombre aléatoire (0.00-100.00) est généré
3. **Si résultat > Roll Over** → Victoire (mise × multiplicateur)
4. **Si résultat ≤ Roll Over** → Défaite (perte de la mise)

---

## États visuels

| État | Slider | Curseur |
|------|--------|---------|
| **Idle** | Rouge/Vert statique | Position du seuil |
| **Rolling** | Animation pulse | Animation spin |
| **Win** | Flash vert | Stable |
| **Lose** | Flash rouge | Stable |

---

## Structure des fichiers suggérée

```
app/dice/
├── page.tsx              # Page principale
├── layout.tsx            # Metadata "Dice | Duel"
├── components/
│   ├── DiceGame.tsx      # Container principal
│   ├── DiceSlider.tsx    # Barre de résultat
│   ├── DiceControls.tsx  # Panneau gauche
│   ├── ResultTooltip.tsx # Tooltip animé du résultat
│   ├── ResultHistory.tsx # Historique haut droite
│   └── index.ts          # Barrel exports
├── hooks/
│   └── useDiceGame.ts    # Logique de jeu
└── types.ts              # Types TypeScript
```

---

## Références visuelles

- `docs/images/dice-manual.png` - Mode Manual
- `docs/images/dice-auto.png` - Mode Auto
- `docs/images/dice-result.png` - Animation résultat
