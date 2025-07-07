import React, { useState } from 'react';

/**
 * Parses the content of an FGD file and returns three lists: solid, point, base.
 * Handles multi-line entity definitions and most FGD formats.
 * @param {string} text - The content of the FGD file.
 * @returns {{solid: string[], point: string[], base: string[]}}
 */
function parseFGD(text) {
  const solid = [];
  const point = [];
  const base = [];

  // Regex patterns
  const entityRe = /^@(\w+Class).*?=\s*([^\s:]+)\s*:\s*"([^"]+)"/i;
  // Improved baseclass regex: matches with or without base(...) and with or without description
  const baseRe = /^@(?:BaseClass|baseclass)(?:\s+\w+\([^)]+\))*\s*=\s*([^\s:]+)(?:\s*:\s*"([^"]*)")?/i;

  const lines = text.split(/\r?\n/);
  let block = [];

  // Modified regex to capture properties within base classes
  const propertyRe = /(\w+)\(\s*(string|integer|float|choices)?\s*\)\s*:\s*"([^"]*)"/g;


  // Processes a block of lines to extract entity or base class information
  function processBlock(blockLines) {
    if (!blockLines.length) return;
    const blockText = blockLines.join(' ');
    let match = entityRe.exec(blockText);
    if (match) {
      const [, entityType, entityName, description] = match;
      const entry = `${entityName} : ${description}`;
      if (
        ["solidclass", "targetclass", "ammoclass", "weaponclass", "monsterclass"].includes(entityType.toLowerCase())
      ) {
        solid.push(entry);
      } else if (entityType.toLowerCase() === "pointclass") {
        point.push(entry);
      }
    } else {
      const baseMatch = baseRe.exec(blockText);
      if (baseMatch) {
        const [, name, description] = baseMatch;

        // Extract properties
        const properties = [];
        let propertyMatch;
        while ((propertyMatch = propertyRe.exec(blockText)) !== null) {
          const [, propertyName, propertyType, propertyDescription] = propertyMatch;
          properties.push(`${propertyName}${propertyType ? ' (' + propertyType + ')' : ''}: ${propertyDescription}`);
        }

        // Create the entry object to match the BaseEntity component's expected props
        const entry = {
          name: name || 'UnnamedBase',
          description: description || '',
          properties: properties
        };

        base.push(entry);

      }
    }
  }

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('//')) continue;
    if (line.startsWith('@') && block.length) {
      processBlock(block);
      block = [];
    }
    block.push(line);
  }
  // Process last block
  if (block.length) {
    processBlock(block);
  }

  return { solid, point, base };
}

/**
 * React component for uploading and parsing FGD files.
 */
function FGDParser({ onParsed }) {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) {
      setFileName('');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const result = parseFGD(text);
        if (onParsed) onParsed(result);
      } catch (err) {
        setError('Failed to parse FGD file.');
        setFileName('');
      }
    };
    reader.onerror = () => {
      setError('Failed to read file.');
      setFileName('');
    };
    reader.readAsText(file, 'utf-8');

    // Reset input so the same file can be selected again if needed
    e.target.value = null;
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <input type="file" id="file-upload-input" accept=".fgd,.txt" onChange={handleFileChange} style={{ display: 'none' }} />
      <label htmlFor="file-upload-input" className="file-upload-label">
        Choose FGD File
      </label>
      <span style={{ marginLeft: 10, color: '#ccc', fontStyle: 'italic' }}>
        {fileName || 'No file chosen'}
      </span>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default FGDParser;
export { parseFGD };