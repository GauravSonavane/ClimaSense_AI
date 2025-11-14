import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface WeatherParticlesProps {
  type: 'rain' | 'snow' | 'clouds';
  intensity?: number;
}

export const WeatherParticles = ({ type, intensity = 50 }: WeatherParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: intensity }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: type === 'snow' ? Math.random() * 4 + 2 : Math.random() * 2 + 1,
      speed: type === 'clouds' ? Math.random() * 0.5 + 0.2 : Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev =>
        prev.map(p => {
          let newY = p.y + p.speed;
          let newX = p.x;

          if (type === 'clouds') {
            newX = p.x + p.speed;
            if (newX > 100) newX = -10;
          } else {
            if (newY > 100) newY = -5;
          }

          return { ...p, y: newY, x: newX };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [type, intensity]);

  const getParticleStyle = (particle: Particle) => {
    const baseStyle = {
      position: 'absolute' as const,
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      opacity: particle.opacity,
      pointerEvents: 'none' as const,
    };

    if (type === 'rain') {
      return {
        ...baseStyle,
        width: `${particle.size}px`,
        height: `${particle.size * 10}px`,
        background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.6))',
        transform: 'rotate(10deg)',
      };
    }

    if (type === 'snow') {
      return {
        ...baseStyle,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        background: 'white',
        borderRadius: '50%',
        boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
      };
    }

    // clouds
    return {
      ...baseStyle,
      width: `${particle.size * 30}px`,
      height: `${particle.size * 15}px`,
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      filter: 'blur(10px)',
    };
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => (
        <div key={particle.id} style={getParticleStyle(particle)} />
      ))}
    </div>
  );
};
