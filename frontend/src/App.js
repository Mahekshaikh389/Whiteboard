import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';
import './App.css';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [roomId, setRoomId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('https://whiteboard-backend-s12x.onrender.com/');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('user-count-updated', (count) => {
      setUserCount(count);
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = (roomCode) => {
    if (socket && roomCode) {
      socket.emit('join-room', roomCode);
      setRoomId(roomCode);
    }
  };

  const leaveRoom = () => {
    if (socket && roomId) {
      socket.emit('leave-room', roomId);
      setRoomId('');
      setUserCount(0);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Collaborative Whiteboard</h1>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          {roomId && (
            <div className="room-info">
              <span>Room: {roomId}</span>
              <span>Users: {userCount}</span>
              <button onClick={leaveRoom} className="leave-button">Leave Room</button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {!roomId ? (
          <RoomJoin onJoinRoom={joinRoom} />
        ) : (
          <Whiteboard socket={socket} roomId={roomId} />
        )}
      </main>
    </div>
  );
};

export default App;
