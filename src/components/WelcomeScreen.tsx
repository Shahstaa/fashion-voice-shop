import { useState, useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useVoice } from '@/hooks/useVoice';
import { GridBG } from './ui/GridBG';

// Helper to generate a smooth, morphing blob path
function getBlobPath(radius: number, t: number, seed: number, cx = 81, cy = 81) {
  // 8 control points for a smooth blob
  const points = [];
  const N = 8;
  for (let i = 0; i < N; i++) {
    const angle = (2 * Math.PI * i) / N;
    // Animate radius for each point
    const phase = t * 0.8 + i * 0.7 + seed * 1.3;
    const amp = 10 + 3 * Math.sin(phase * 0.6 + i * 0.5 + seed);
    const r = radius + amp * Math.sin(phase + Math.sin(i + seed));
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push([x, y]);
  }
  // Catmull-Rom to Bezier for smoothness
  let d = '';
  for (let i = 0; i < N; i++) {
    const p0 = points[(i - 1 + N) % N];
    const p1 = points[i];
    const p2 = points[(i + 1) % N];
    const p3 = points[(i + 2) % N];
    if (i === 0) d += `M${p1[0]},${p1[1]}`;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  d += 'Z';
  return d;
}

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const { t, language } = useLanguage();
  const { startVoice } = useVoice();
  const [isListening, setIsListening] = useState(false);
  const [waveHeights, setWaveHeights] = useState([12, 16, 24, 16, 12]);
  const [blobTimes, setBlobTimes] = useState([0, 0, 0]);
  const rafRef = useRef<number | null>(null);

  const handleStart = () => {
    startVoice();
    onStart();
  };

  // Animate blob times
  useEffect(() => {
    const animate = () => {
      setBlobTimes((prev) => prev.map((t, i) => t + 0.018 + i * 0.003));
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsListening((prev) => !prev);
      setWaveHeights((prev) =>
        prev.map((_, i) => 12 + 12 * Math.abs(Math.sin(Date.now() / 1200 + i)))
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-background overflow-hidden">
      <GridBG />
      <div className="max-w-4xl mx-auto text-center w-full relative z-10">
        {/* Main Content */}
        <div className="mb-16">
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent leading-[1.18] ${language === 'ar' ? 'pb-2' : ''}`}
            style={language === 'ar' ? { lineHeight: 1.18, paddingBottom: '0.5rem' } : {}}
          >
            {t('welcome.title')}
          </h1>
          <h2 className="text-2xl md:text-3xl text-foreground mb-4 font-light">
            {t('welcome.subtitle')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 font-light">
            {t('welcome.description')}
          </p>
        </div>
        {/* Interactive Area */}
        <div className="flex flex-col items-center">
          <div className="relative mb-12" style={{ width: 220, height: 220 }}>
            {/* 2 animated, overlapping, morphing SVG bubbles (theme-aware, premium color) */}
            {[0, 1].map((i) => {
              const size = 210 + i * 32;
              const radius = 90 + i * 18;
              const cx = 110, cy = 110;
              // Theme-aware, premium gradients
              const colors = [
                'url(#bubbleGradient0)',
                'url(#bubbleGradient1)'
              ];
              const opacities = [0.22, 0.16];
              const blurs = [1.5, 2.5];
              return (
                <svg
                  key={i}
                  width={size}
                  height={size}
                  viewBox="0 0 220 220"
                  fill="none"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                >
                  <defs>
                    {/* Premium, theme-aware gradients */}
                    <radialGradient id="bubbleGradient0" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity="0.85" />
                      <stop offset="40%" stopColor="#a21caf" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity="0.35" />
                    </radialGradient>
                    <radialGradient id="bubbleGradient1" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f472b6" stopOpacity="0.7" />
                      <stop offset="40%" stopColor="#a21caf" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity="0.35" />
                    </radialGradient>
                    {/* Subtle white highlight/shine, less visible in light mode */}
                    <radialGradient id={`bubbleHighlight${i}`} cx="60%" cy="35%" r="35%">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <path
                    d={getBlobPath(radius, blobTimes[i], i * 1.7, cx, cy)}
                    fill={colors[i]}
                    opacity={opacities[i]}
                    style={{ filter: `blur(${blurs[i]}px)` }}
                  />
                  {/* Subtle highlight overlay for bubble effect */}
                  <path
                    d={getBlobPath(radius, blobTimes[i], i * 1.7, cx, cy)}
                    fill={`url(#bubbleHighlight${i})`}
                    opacity={0.35}
                  />
                </svg>
              );
            })}
            {/* Mic button - always perfectly centered, hover only on button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                tabIndex={0}
                aria-label="Start talking"
                className="inline-flex items-center justify-center w-[108px] h-[108px] rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transition-all duration-300 focus:outline-none hover:scale-110"
                onClick={handleStart}
              >
                <Mic className="w-14 h-14 text-white" />
              </button>
            </div>
          </div>
          {/* Voice Waveform Indicator */}
          <div className="flex items-center justify-center space-x-1 mb-12 min-h-[36px]">
            {waveHeights.map((h, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full transition-all duration-700"
                style={{
                  height: isListening ? `${h}px` : '8px',
                  transitionDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
