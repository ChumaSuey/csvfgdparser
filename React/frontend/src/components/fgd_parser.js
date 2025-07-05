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

  // Regex patterns (ported from Python)
  const entityRe = /^@(\w+Class).*?=\s*([^\s:]+)\s*:\s*"([^"]+)"/i;
  // Improved baseclass regex: matches with or without base(...) and with or without description
  const baseRe = /^@(?:BaseClass|baseclass)(?:\s+\w+\([^)]+\))*\s*=\s*([^\s:]+)(?:\s*:\s*"([^"]*)")?/i;

  const lines = text.split(/\r?\n/);
  let block = [];

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
        const [, entityName, description] = baseMatch;
        const entry = `${entityName || 'UnnamedBase'} : ${description || ''}`;
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
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const result = parseFGD(text);
        if (onParsed) onParsed(result);
      } catch (err) {
        setError('Failed to parse FGD file.');
      }
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsText(file, 'utf-8');
  };

  return (
    <div>
      <input type="file" accept=".fgd,.txt" onChange={handleFileChange} />
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default FGDParser;
export { parseFGD };