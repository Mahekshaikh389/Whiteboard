import React from 'react';
import './Toolbar.css';

const Toolbar = ({ tool, onToolChange, onClearCanvas }) => {
  const colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ff0000' },
    { name: 'Blue', value: '#0000ff' },
    { name: 'Green', value: '#00ff00' }
  ];

  const handleColorChange = (color) => {
    onToolChange({ color });
  };

  const handleWidthChange = (e) => {
    onToolChange({ width: parseInt(e.target.value) });
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      onClearCanvas();
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-section">
        <label className="toolbar-label">Pencil Tool</label>
        <div className="tool-icon">✏️</div>
      </div>

      <div className="toolbar-section">
        <label className="toolbar-label">Colors</label>
        <div className="color-picker">
          {colors.map((color) => (
            <button
              key={color.value}
              className={`color-button ${tool.color === color.value ? 'active' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => handleColorChange(color.value)}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>
      </div>

      <div className="toolbar-section">
        <label className="toolbar-label">
          Stroke Width: {tool.width}px
        </label>
        <input
          type="range"
          min="1"
          max="20"
          value={tool.width}
          onChange={handleWidthChange}
          className="width-slider"
        />
        <div className="width-preview">
          <div 
            className="width-circle"
            style={{
              width: `${tool.width}px`,
              height: `${tool.width}px`,
              backgroundColor: tool.color
            }}
          />
        </div>
      </div>

      <div className="toolbar-section">
        <button 
          className="clear-button"
          onClick={handleClear}
          title="Clear Canvas"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default Toolbar;