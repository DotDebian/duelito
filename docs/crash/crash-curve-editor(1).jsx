import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function CrashCurveEditor() {
  const [crashPoint, setCrashPoint] = useState(30);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [yPadding, setYPadding] = useState(1.5); // Marge au-dessus du multiplicateur actuel
  
  const curveCanvasRef = useRef(null);
  const gameCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const CANVAS_WIDTH = 832;
  const CANVAS_HEIGHT = 738;

  // Formule quadratique: m(t) = 1 + (t/10)²
  const calculateMultiplier = useCallback((t) => {
    return 1 + Math.pow(t / 10, 2);
  }, []);

  // Dessiner la courbe complète (pour référence)
  const drawCurve = useCallback(() => {
    const canvas = curveCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const padding = 70;
    const graphWidth = CANVAS_WIDTH - padding * 2;
    const graphHeight = CANVAS_HEIGHT - padding * 2;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const crashMultiplier = calculateMultiplier(crashPoint);
    const maxTime = crashPoint;
    const maxMult = crashMultiplier * 1.1;

    const multToY = (m) => {
      return CANVAS_HEIGHT - padding - ((m - 1) / (maxMult - 1)) * graphHeight;
    };

    const timeToX = (t) => {
      return padding + (t / maxTime) * graphWidth;
    };

    // Grid
    ctx.strokeStyle = '#1a1a3e';
    ctx.lineWidth = 1;
    
    const yStep = maxMult > 50 ? 10 : maxMult > 20 ? 5 : maxMult > 10 ? 2 : 1;
    for (let m = 1; m <= maxMult; m += yStep) {
      const y = multToY(m);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(CANVAS_WIDTH - padding, y);
      ctx.stroke();
    }
    
    const timeStep = maxTime > 60 ? 10 : maxTime > 30 ? 5 : maxTime > 15 ? 2 : 1;
    for (let t = 0; t <= maxTime; t += timeStep) {
      const x = timeToX(t);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, CANVAS_HEIGHT - padding);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#4a4a7e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, CANVAS_HEIGHT - padding);
    ctx.lineTo(CANVAS_WIDTH - padding, CANVAS_HEIGHT - padding);
    ctx.stroke();

    // Labels Y
    ctx.fillStyle = '#8888aa';
    ctx.font = '12px monospace';
    ctx.textAlign = 'right';
    
    for (let m = 1; m <= maxMult; m += yStep) {
      const y = multToY(m);
      ctx.fillText(`${m.toFixed(0)}x`, padding - 10, y + 4);
    }

    // Labels X
    ctx.textAlign = 'center';
    for (let t = 0; t <= maxTime; t += timeStep) {
      const x = timeToX(t);
      ctx.fillText(`${t}s`, x, CANVAS_HEIGHT - padding + 20);
    }

    // Titre
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Courbe Complète (référence)', CANVAS_WIDTH / 2, 30);

    // Formule
    ctx.fillStyle = '#00ff88';
    ctx.font = '18px monospace';
    ctx.fillText('m(t) = 1 + (t/10)²', CANVAS_WIDTH / 2, 58);

    // Info
    ctx.fillStyle = '#ffaa00';
    ctx.font = '14px monospace';
    ctx.fillText(`Crash @ ${crashPoint.toFixed(0)}s = ${crashMultiplier.toFixed(2)}x`, CANVAS_WIDTH / 2, 80);

    // Dessiner la courbe
    ctx.strokeStyle = '#00ff88';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let started = false;
    for (let px = 0; px <= graphWidth; px++) {
      const t = (px / graphWidth) * maxTime;
      const mult = calculateMultiplier(t);
      const x = padding + px;
      const y = multToY(mult);
      
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Points de référence
    [10, 20, 30].forEach(t => {
      if (t <= maxTime) {
        const mult = calculateMultiplier(t);
        const x = timeToX(t);
        const y = multToY(mult);
        
        ctx.fillStyle = '#00aaff';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '11px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${t}s → ${mult.toFixed(2)}x`, x + 10, y - 5);
      }
    });

    // Point de crash
    const crashX = timeToX(crashPoint);
    const crashY = multToY(crashMultiplier);
    
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(crashX, crashY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [crashPoint, calculateMultiplier]);

  // Canvas de jeu avec échelle dynamique
  const drawGame = useCallback(() => {
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const padding = 70;
    const graphWidth = CANVAS_WIDTH - padding * 2;
    const graphHeight = CANVAS_HEIGHT - padding - 200;

    const crashMultiplier = calculateMultiplier(crashPoint);
    const hasCrashed = elapsedTime >= crashPoint;
    const displayMult = hasCrashed ? crashMultiplier : currentMultiplier;
    const displayTime = hasCrashed ? crashPoint : elapsedTime;

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    if (hasCrashed) {
      gradient.addColorStop(0, '#2a0a0a');
      gradient.addColorStop(1, '#0a0a1a');
    } else if (isAnimating) {
      gradient.addColorStop(0, '#0a2a1a');
      gradient.addColorStop(1, '#0a0a1a');
    } else {
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(1, '#0a0a1a');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Multiplicateur géant
    ctx.fillStyle = hasCrashed ? '#ff4444' : '#00ff88';
    ctx.font = 'bold 80px monospace';
    ctx.textAlign = 'center';
    
    let multText = displayMult.toFixed(2);
    ctx.fillText(`${multText}x`, CANVAS_WIDTH / 2, 100);

    if (hasCrashed) {
      ctx.fillStyle = '#ff4444';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('CRASHED!', CANVAS_WIDTH / 2, 145);
    }

    ctx.fillStyle = '#8888aa';
    ctx.font = '20px monospace';
    ctx.fillText(`${displayTime.toFixed(2)}s`, CANVAS_WIDTH / 2, 175);

    // === ÉCHELLE DYNAMIQUE ===
    // Le max Y s'adapte au multiplicateur actuel avec une marge
    const maxDisplayMult = Math.max(displayMult * yPadding, 1.5);
    const maxDisplayTime = Math.max(displayTime * 1.3, 5);

    const multToY = (m) => {
      // Échelle linéaire simple, commence à 1
      const normalized = (m - 1) / (maxDisplayMult - 1);
      return CANVAS_HEIGHT - padding - normalized * graphHeight;
    };

    const timeToX = (t) => {
      return padding + (t / maxDisplayTime) * graphWidth;
    };

    // Grid dynamique
    ctx.strokeStyle = '#1a1a3e';
    ctx.lineWidth = 1;
    
    // Calcul intelligent des steps Y
    const range = maxDisplayMult - 1;
    let yStep;
    if (range > 100) yStep = 20;
    else if (range > 50) yStep = 10;
    else if (range > 20) yStep = 5;
    else if (range > 10) yStep = 2;
    else if (range > 5) yStep = 1;
    else yStep = 0.5;
    
    for (let m = 1; m <= maxDisplayMult; m += yStep) {
      const y = multToY(m);
      if (y >= 190 && y <= CANVAS_HEIGHT - padding) {
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(CANVAS_WIDTH - padding, y);
        ctx.stroke();
      }
    }

    // Axes
    ctx.strokeStyle = '#4a4a7e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, 190);
    ctx.lineTo(padding, CANVAS_HEIGHT - padding);
    ctx.lineTo(CANVAS_WIDTH - padding, CANVAS_HEIGHT - padding);
    ctx.stroke();

    // Labels Y dynamiques
    ctx.fillStyle = '#666688';
    ctx.font = '11px monospace';
    ctx.textAlign = 'right';
    for (let m = 1; m <= maxDisplayMult; m += yStep) {
      const y = multToY(m);
      if (y >= 190 && y <= CANVAS_HEIGHT - padding) {
        const label = m >= 100 ? m.toFixed(0) : m.toFixed(1);
        ctx.fillText(`${label}x`, padding - 8, y + 4);
      }
    }

    // Labels X
    ctx.textAlign = 'center';
    const timeStep = maxDisplayTime > 30 ? 10 : maxDisplayTime > 15 ? 5 : maxDisplayTime > 8 ? 2 : 1;
    for (let t = 0; t <= maxDisplayTime; t += timeStep) {
      const x = timeToX(t);
      ctx.fillText(`${t.toFixed(0)}s`, x, CANVAS_HEIGHT - padding + 18);
    }

    // Courbe - on dessine depuis t=0 jusqu'à maintenant
    ctx.strokeStyle = hasCrashed ? '#ff4444' : '#00ff88';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    let started = false;
    const steps = Math.max(100, Math.floor(displayTime * 20));
    
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * displayTime;
      const mult = calculateMultiplier(t);
      const x = timeToX(t);
      const y = multToY(mult);
      
      // Clip au graphe
      if (y < 190) continue;
      
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Point actuel avec glow
    const currentX = timeToX(displayTime);
    const currentY = multToY(displayMult);
    
    if (currentY >= 185) {
      ctx.shadowColor = hasCrashed ? '#ff4444' : '#00ff88';
      ctx.shadowBlur = 20;
      ctx.fillStyle = hasCrashed ? '#ff4444' : '#00ff88';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Indicateur d'échelle
    ctx.fillStyle = '#666688';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`échelle: 1x - ${maxDisplayMult.toFixed(1)}x`, CANVAS_WIDTH - padding, 205);

  }, [currentMultiplier, elapsedTime, isAnimating, crashPoint, calculateMultiplier, yPadding]);

  // Animation - simule les updates serveur toutes les 200ms
  useEffect(() => {
    if (isAnimating) {
      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = ((timestamp - startTimeRef.current) / 1000) * speed;
        
        setElapsedTime(elapsed);
        const mult = calculateMultiplier(elapsed);
        setCurrentMultiplier(mult);
        
        if (elapsed >= crashPoint) {
          setIsAnimating(false);
          setElapsedTime(crashPoint);
          setCurrentMultiplier(calculateMultiplier(crashPoint));
          return;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, crashPoint, speed, calculateMultiplier]);

  useEffect(() => { drawCurve(); }, [drawCurve]);
  useEffect(() => { drawGame(); }, [drawGame]);

  const startAnimation = () => {
    setCurrentMultiplier(1.0);
    setElapsedTime(0);
    startTimeRef.current = null;
    setIsAnimating(true);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setCurrentMultiplier(1.0);
    setElapsedTime(0);
    startTimeRef.current = null;
  };

  const crashMult = calculateMultiplier(crashPoint);

  return (
    <div className="min-h-screen bg-gray-900 p-3">
      <h1 className="text-2xl font-bold text-white text-center mb-3">
        🎰 Crash Curve Editor
      </h1>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-3 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Crash: {crashPoint.toFixed(0)}s = {crashMult.toFixed(2)}x
            </label>
            <input 
              type="range"
              min="10"
              max="120"
              step="1"
              value={crashPoint}
              onChange={(e) => setCrashPoint(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Vitesse: {speed.toFixed(1)}x {speed === 1 ? '(réel)' : ''}
            </label>
            <input 
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-1">
              Marge Y: {((yPadding - 1) * 100).toFixed(0)}% au-dessus
            </label>
            <input 
              type="range"
              min="1.1"
              max="3"
              step="0.1"
              value={yPadding}
              onChange={(e) => setYPadding(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              Espace entre le point et le haut du graphe
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded font-bold"
          >
            ▶ START
          </button>
          <button
            onClick={() => setIsAnimating(false)}
            disabled={!isAnimating}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white px-6 py-2 rounded font-bold"
          >
            ⏸ PAUSE
          </button>
          <button
            onClick={resetAnimation}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-bold"
          >
            ↺ RESET
          </button>
          <button
            onClick={() => setSpeed(1)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-sm"
          >
            1x
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        <div className="flex flex-col items-center">
          <h2 className="text-white text-sm mb-1">📐 Courbe Complète (référence)</h2>
          <canvas 
            ref={curveCanvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="rounded-lg border border-gray-700"
          />
        </div>
        
        <div className="flex flex-col items-center">
          <h2 className="text-white text-sm mb-1">🎮 Vue Client (échelle dynamique)</h2>
          <canvas 
            ref={gameCanvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="rounded-lg border border-gray-700"
          />
        </div>
      </div>

      {/* Instructions pour LLM */}
      <div className="bg-gray-800 rounded-lg p-4 max-w-5xl mx-auto">
        <h3 className="text-white font-bold text-lg mb-3">📋 Instructions pour implémentation (à fournir au LLM)</h3>
        
        <div className="bg-gray-900 rounded p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap">
{`## Crash Game - Courbe du Multiplicateur

### Formule mathématique (CALCUL)
Le multiplicateur suit une courbe quadratique :

  m(t) = 1 + (t/10)²

Où t = temps en secondes.

### Points de référence
- t = 0s  → 1.00x
- t = 10s → 2.00x
- t = 20s → 5.00x
- t = 30s → 10.00x
- t = 40s → 17.00x
- t = 50s → 26.00x

### Architecture

SERVEUR:
- Calcule le multiplicateur toutes les 200ms
- Broadcast { multiplier, elapsed } aux clients
- Le client ne connaît PAS le crash point à l'avance

CLIENT (affichage):
- Reçoit le multiplicateur en temps réel
- Échelle Y dynamique: maxY = currentMultiplier * ${yPadding.toFixed(1)}
- La courbe se "recompresse" au fur et à mesure

### Implémentation Serveur

function getMultiplier(elapsedSeconds: number): number {
  return 1 + Math.pow(elapsedSeconds / 10, 2);
}

let startTime = Date.now();
let crashMultiplier = 10.00; // Provably fair

const gameLoop = setInterval(() => {
  const elapsed = (Date.now() - startTime) / 1000;
  const multiplier = getMultiplier(elapsed);
  
  broadcast({ 
    multiplier: Math.floor(multiplier * 100) / 100,
    elapsed 
  });
  
  if (multiplier >= crashMultiplier) {
    clearInterval(gameLoop);
    broadcast({ crashed: true, finalMultiplier: crashMultiplier });
  }
}, 200);

### Implémentation Client (Canvas)

const Y_PADDING = ${yPadding.toFixed(1)}; // Marge au-dessus du multiplicateur

function drawCurve(ctx, currentMult, elapsed, history) {
  const graphHeight = 500;
  const graphWidth = 700;
  
  // Échelle dynamique
  const maxY = Math.max(currentMult * Y_PADDING, 1.5);
  const maxX = Math.max(elapsed * 1.3, 5);
  
  // Fonction de conversion
  const multToY = (m) => graphHeight - ((m - 1) / (maxY - 1)) * graphHeight;
  const timeToX = (t) => (t / maxX) * graphWidth;
  
  // Dessiner la courbe depuis l'historique
  ctx.beginPath();
  history.forEach((point, i) => {
    const x = timeToX(point.elapsed);
    const y = multToY(point.multiplier);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

### Stockage historique côté client

const history = [];

socket.on('update', (data) => {
  history.push({ 
    multiplier: data.multiplier, 
    elapsed: data.elapsed 
  });
  drawCurve(ctx, data.multiplier, data.elapsed, history);
});

socket.on('crashed', () => {
  history = []; // Reset pour le prochain round
});`}
        </div>
      </div>
    </div>
  );
}
