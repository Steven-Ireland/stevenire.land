import React, { useEffect, useState } from 'react';

const BackgroundEffect = ({
  scanlines = true,
  vignette = true,
}) => {
  const [scanlineDelay, setScanlineDelay] = useState('0s');

  useEffect(() => {
    // Calculate a consistent animation delay based on wall-clock time
    const cycleDuration = 8000; // 8s matches CSS
    const now = Date.now();
    const offset = now % cycleDuration;
    setScanlineDelay(`-${offset}ms`);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden',
    }}>
      
      {/* Moving Scanline Refresh */}
      <div 
        className="ScanlineAnimation" 
        style={{ animationDelay: scanlineDelay }}
      />

      {/* Scanlines */}
      {scanlines && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
        }} />
      )}
      
      {/* Vignette */}
      {vignette && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  );
};

export default BackgroundEffect;