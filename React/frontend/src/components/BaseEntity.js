import React, { useState } from 'react';

/**
 * A component to display a single, expandable base entity.
 * It manages its own expanded/collapsed state.
 * @param {object} entity - The base entity object.
 * @param {string} entity.name - The name of the base class.
 * @param {string} entity.description - The description of the base class.
 * @param {string[]} entity.properties - A list of properties for the base class.
 */
function BaseEntity({ entity }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    // Don't toggle if there are no properties to show
    if (entity.properties.length === 0) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <li style={{ textAlign: 'left', margin: '5px 0' }}>
      <button onClick={toggleExpand} style={{ marginRight: '10px', width: '25px', cursor: entity.properties.length > 0 ? 'pointer' : 'default', opacity: entity.properties.length > 0 ? 1 : 0.5 }}>
        {entity.properties.length > 0 ? (isExpanded ? '-' : '+') : ' '}
      </button>
      <span>{`${entity.name} : ${entity.description}`}</span>
      {isExpanded && entity.properties.length > 0 && (
        <ul style={{ marginTop: '5px', marginLeft: '45px', listStyleType: 'circle' }}>
          {entity.properties.map((prop, index) => (
            <li key={index}>{prop}</li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default BaseEntity;