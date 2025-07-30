import React, { useRef, useEffect, useState } from 'react';
import './DrawingCanvas.css';

const DrawingCanvas = ({ socket, roomId, tool, onDrawingStateChange }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Set canvas context properties
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('draw-start', (data) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(data.x * canvas.width, data.y * canvas.height);
      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.width;
    });

    socket.on('draw-move', (data) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.lineTo(data.x * canvas.width, data.y * canvas.height);
      ctx.stroke();
    });

    socket.on('draw-end', () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      ctx.closePath();
    });

    return () => {
      socket.off('draw-start');
      socket.off('draw-move');
      socket.off('draw-end');
    };
  }, [socket]);

  const getRelativePosition = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
      absX: clientX - rect.left,
      absY: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getRelativePosition(e);

    setIsDrawing(true);
    onDrawingStateChange(true);

    ctx.beginPath();
    ctx.moveTo(pos.absX, pos.absY);
    ctx.strokeStyle = tool.color;
    ctx.lineWidth = tool.width;

    setLastPoint({ x: pos.x, y: pos.y });
    setCurrentPath([{ x: pos.x, y: pos.y }]);

    // Emit to other users
    if (socket) {
      socket.emit('draw-start', {
        roomId,
        x: pos.x,
        y: pos.y,
        color: tool.color,
        width: tool.width
      });
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getRelativePosition(e);

    ctx.lineTo(pos.absX, pos.absY);
    ctx.stroke();

    setLastPoint({ x: pos.x, y: pos.y });
    setCurrentPath(prev => [...prev, { x: pos.x, y: pos.y }]);

    // Emit to other users
    if (socket) {
      socket.emit('draw-move', {
        roomId,
        x: pos.x,
        y: pos.y
      });
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.closePath();
    setIsDrawing(false);
    onDrawingStateChange(false);
    setLastPoint(null);

    // Emit to other users
    if (socket) {
      socket.emit('draw-end', {
        roomId,
        path: currentPath,
        color: tool.color,
        width: tool.width
      });
    }

    setCurrentPath([]);
  };

  return (
    <canvas
      ref={canvasRef}
      className="drawing-canvas"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
};

export default DrawingCanvas;