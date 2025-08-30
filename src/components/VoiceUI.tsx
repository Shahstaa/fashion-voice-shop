import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Pause, Play } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import useVoiceAgent from '@/hooks/useVoiceAgent';

interface VoiceUIProps {
  isActive: boolean;
  onEnd: () => void;
}

export const VoiceUI = ({ isActive, onEnd }: VoiceUIProps) => {
  const { language } = useLanguage();
  const { endAgent, isActive: isVoiceActive } = useVoiceAgent();
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [waveHeights, setWaveHeights] = useState([8, 12, 16, 12, 8, 10, 14, 18, 14, 10]);
  const rafRef = useRef<number | null>(null);

  // Simulate listening state for demo mode or real mode
  useEffect(() => {
    if (isActive && !isPaused) {
      setIsListening(true);
      // Check if we have real voice agent or demo mode
      const voiceAgentActive = isVoiceActive();
      
      if (voiceAgentActive) {
        // Real voice agent is active, don't simulate
        console.log('VoiceUI - Real voice agent active');
      } else {
        // Demo mode - simulate periodic listening activity
        console.log('VoiceUI - Demo mode active');
        const demoInterval = setInterval(() => {
          setIsListening(prev => !prev);
        }, 3000); // Toggle every 3 seconds

        return () => clearInterval(demoInterval);
      }
    } else {
      setIsListening(false);
    }
  }, [isActive, isPaused, isVoiceActive]);

  // Animate wave heights when listening
  useEffect(() => {
    if (isListening && !isPaused) {
      const animate = () => {
        setWaveHeights(prev => 
          prev.map((_, i) => 
            8 + 16 * Math.abs(Math.sin(Date.now() / 500 + i * 0.5))
          )
        );
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // Reset to small heights when not listening
      setWaveHeights([8, 8, 8, 8, 8, 8, 8, 8, 8, 8]);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isListening, isPaused]);

  // Monitor voice agent status for real-time updates
  useEffect(() => {
    if (!isActive) return;

    const checkVoiceStatus = () => {
      const voiceActive = isVoiceActive();
      
      if (voiceActive) {
        // Real voice agent is active
        setIsListening(voiceActive && !isPaused);
      }
      // If no real voice agent, rely on demo mode from above useEffect
    };

    const interval = setInterval(checkVoiceStatus, 200);
    return () => clearInterval(interval);
  }, [isVoiceActive, isPaused, isActive]);

  const handlePause = () => {
    setIsPaused(!isPaused);
    // Note: Actual pause/resume would need to be implemented in the voice agent
  };

  const handleStop = () => {
    endAgent();
    onEnd();
  };

  if (!isActive) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-3xl shadow-2xl p-5 flex items-center gap-5 min-w-[320px] transition-all duration-300 hover:shadow-3xl">
        {/* Voice Wave Animation */}
        <div className="flex items-center justify-center space-x-1.5 min-w-[90px] bg-muted/30 rounded-2xl p-3">
          {waveHeights.map((height, i) => (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-purple-500 via-purple-400 to-pink-400 rounded-full transition-all duration-300 shadow-sm"
              style={{
                height: `${height}px`,
                transitionDelay: `${i * 0.05}s`,
                filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.4))',
              }}
            />
          ))}
        </div>

        {/* Separator */}
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-border to-transparent" />

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          {/* Pause/Resume Button - Squircle */}
          <button
            type="button"
            tabIndex={0}
            aria-label={isPaused ? "Resume voice" : "Pause voice"}
            className="flex items-center justify-center w-12 h-12 bg-muted hover:bg-muted/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{
              borderRadius: '20px', // Squircle effect
            }}
            onClick={handlePause}
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-foreground" />
            ) : (
              <Pause className="w-5 h-5 text-foreground" />
            )}
          </button>

          {/* Stop Button - Squircle */}
          <button
            type="button"
            tabIndex={0}
            aria-label="Stop voice"
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{
              borderRadius: '20px', // Squircle effect
            }}
            onClick={handleStop}
          >
            <Square className="w-5 h-5 text-white fill-white" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-3 text-sm min-w-[100px]">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${
              isListening && !isPaused ? 'bg-green-500' : 
              isPaused ? 'bg-yellow-500' : 'bg-gray-400'
            } transition-colors duration-200`} />
            {isListening && !isPaused && (
              <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-40" />
            )}
          </div>
          <span className="text-foreground font-bold tracking-wide">
            {isPaused ? 'Paused' : isListening ? 'Listening...' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};
