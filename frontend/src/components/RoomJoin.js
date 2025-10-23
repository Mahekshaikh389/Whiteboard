import React, { useState } from 'react';
import './RoomJoin.css';

const RoomJoin = ({ onJoinRoom }) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomCode.trim().length < 4 || roomCode.trim().length > 8) {
      setError('Room code must be 4-8 characters long');
      return;
    }
    setError('');
    onJoinRoom(roomCode.trim().toUpperCase());
  };

  const handleCreateNew = () => {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    onJoinRoom(newRoomCode);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 8) {
      setRoomCode(value);
      setError('');
    }
  };

  return (
    <div className="room-join">
      <video
    className="background-video"
    src="/collabrative-whiteborld-video.mp4"
    autoPlay
    loop
    muted
  ></video>

      <div className="room-join-container">
        <h2>Join a Whiteboard Room</h2>
        
        <form onSubmit={handleSubmit} className="room-form">
          <div className="input-group">
            <input
              type="text"
              value={roomCode}
              onChange={handleInputChange}
              placeholder="Enter room code"
              className="room-input"
              maxLength={8}
            />
            <button type="submit" className="join-button" disabled={!roomCode.trim()}>
              Join Room
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button onClick={handleCreateNew} className="create-button">
          Create New Room
        </button>

        <div className="instructions">
          <p>Enter a room code to join an existing whiteboard or create a new one.</p>
          <p>Room codes are 4-8 characters (letters and numbers only).</p>
        </div>
      </div>
    </div>
  );
};

export default RoomJoin;
