import React from 'react';

function VisualizerOptions({ value, onChange }) {
  return (
    <div>
      <label>Visualizer Options: </label>
      {['All', 'Solid', 'Point', 'Base'].map((type) => (
        <label key={type} style={{ marginLeft: 10 }}>
          <input
            type="radio"
            name="classType"
            value={type}
            checked={value === type}
            onChange={() => onChange(type)}
          />
          {type}
        </label>
      ))}
    </div>
  );
}

export default VisualizerOptions;