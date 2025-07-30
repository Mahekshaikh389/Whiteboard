import React, { useState, useRef, useEffect } from 'react';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';
import './Whiteboard.css';

const Whiteboard = ({ socket, roomId }) => {
  const [drawingTool, setDrawingTool] = useState({
    color: '#000000',
    width: 3
  });
  const [cursors, setCursors] = useState({});
  const [isDrawing, setIsDrawing] = useState(false);
  const whiteboardRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Socket event listeners for drawing
    socket.on('draw-start', (data) => {
      // Handle remote draw start
    });

    socket.on('draw-move', (data) => {
      // Handle remote draw move
    });

    socket.on('draw-end', (data) => {
      // Handle remote draw end
    });

    socket.on('clear-canvas', () => {
      // Handle remote canvas clear
      const canvas = whiteboardRef.current?.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    socket.on('cursor-move', (data) => {
      setCursors(prev => ({
        ...prev,
        [data.userId]: {
          x: data.x,
          y: data.y,
          color: data.color || '#ff0000'
        }
      }));
    });

    socket.on('user-left', (userId) => {
      setCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    });

    return () => {
      socket.off('draw-start');
      socket.off('draw-move');
      socket.off('draw-end');
      socket.off('clear-canvas');
      socket.off('cursor-move');
      socket.off('user-left');
    };
  }, [socket]);

  const handleMouseMove = (e) => {
    if (!socket || isDrawing) return;

    const rect = whiteboardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Throttle cursor updates
    socket.emit('cursor-move', {
      roomId,
      x: x / rect.width,
      y: y / rect.height
    });
  };

  const handleToolChange = (newTool) => {
    setDrawingTool({ ...drawingTool, ...newTool });
  };

  const handleClearCanvas = () => {
    if (socket) {
      socket.emit('clear-canvas', { roomId });
    }
    const canvas = whiteboardRef.current?.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="whiteboard" ref={whiteboardRef} onMouseMove={handleMouseMove}>
      <Toolbar 
        tool={drawingTool}
        onToolChange={handleToolChange}
        onClearCanvas={handleClearCanvas}
      />
      
      <div className="canvas-container">
        <DrawingCanvas
          socket={socket}
          roomId={roomId}
          tool={drawingTool}
          onDrawingStateChange={setIsDrawing}
        />
        <UserCursors cursors={cursors} />
      </div>
    </div>
  );
};

export default Whiteboard;