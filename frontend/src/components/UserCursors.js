import React from 'react';
import './UserCursors.css';

const UserCursors = ({ cursors }) => {
  return (
    <div className="user-cursors">
      {Object.entries(cursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="user-cursor"
          style={{
            left: `${cursor.x * 100}%`,
            top: `${cursor.y * 100}%`,
            borderColor: cursor.color
          }}
        >
          <div 
            className="cursor-dot"
            style={{ backgroundColor: cursor.color }}
          />
          <div 
            className="cursor-label"
            style={{ color: cursor.color }}
          >
            User {userId.slice(-4)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserCursors;