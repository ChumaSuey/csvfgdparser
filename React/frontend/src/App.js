import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import VisualizerOptions from './components/VisualizerOptions';
import { parseFGD } from './components/fgd_parser';
import { writeDetailsToCSV } from './components/csv_writer';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [classType, setClassType] = useState('All');
  const [solidEntities, setSolidEntities] = useState([]);
  const [pointEntities, setPointEntities] = useState([]);
  const [baseEntities, setBaseEntities] = useState([]);
  const [csvUrl, setCsvUrl] = useState(null);

  const handleVisualize = () => {
    if (!selectedFile) {
      alert('Please select an FGD file first.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { solid, point, base } = parseFGD(text);

      // Filter by classType if needed
      setSolidEntities(classType === 'All' || classType === 'Solid' ? solid : []);
      setPointEntities(classType === 'All' || classType === 'Point' ? point : []);
      setBaseEntities(classType === 'All' || classType === 'Base' ? base : []);
      setCsvUrl(null); // Reset CSV link on new visualize
    };
    reader.onerror = () => alert('Failed to read file.');
    reader.readAsText(selectedFile, 'utf-8');
  };

  const handleCreateCSV = () => {
    // Combine all entities for CSV
    let data = [];
    let fieldnames = ['Entity', 'Description'];
    if (solidEntities.length > 0) {
      data = data.concat(solidEntities.map(e => {
        const [entity, ...desc] = e.split(' : ');
        return { Entity: entity, Description: desc.join(' : ') };
      }));
    }
    if (pointEntities.length > 0) {
      data = data.concat(pointEntities.map(e => {
        const [entity, ...desc] = e.split(' : ');
        return { Entity: entity, Description: desc.join(' : ') };
      }));
    }
    if (baseEntities.length > 0) {
      data = data.concat(baseEntities.map(e => {
        const [entity, ...desc] = e.split(' : ');
        return { Entity: entity, Description: desc.join(' : ') };
      }));
    }
    if (data.length === 0) {
      alert('No entities to export. Please visualize data first.');
      return;
    }
    const csvString = writeDetailsToCSV(data, fieldnames);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    setCsvUrl(url);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>FGD Entity Viewer</h1>
        <div style={{ margin: '20px 0' }}>
          <FileUpload onFileSelected={setSelectedFile} />
          {selectedFile && (
            <div style={{ marginTop: 10, color: '#ccc' }}>
              Selected file: <strong>{selectedFile.name}</strong>
            </div>
          )}
        </div>
        <VisualizerOptions value={classType} onChange={setClassType} />
        <div style={{ margin: '20px 0' }}>
          <button onClick={handleVisualize} style={{ marginRight: 10 }}>
            Visualize Data
          </button>
          <button onClick={handleCreateCSV}>
            Create CSV
          </button>
        </div>
        <div style={{ marginTop: 30, width: '100%', maxWidth: 600 }}>
          <p>
            <strong>Note:</strong> The Entity counter is an approximation.
          </p>
          {/* Solid Entities */}
          {solidEntities.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: 'auto', background: '#222', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 20 }}>
              <h3>Solid Entities ({solidEntities.length})</h3>
              <ul>
                {solidEntities.map((entity, idx) => (
                  <li key={idx}>{entity}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Point Entities */}
          {pointEntities.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: 'auto', background: '#223', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 20 }}>
              <h3>Point Entities ({pointEntities.length})</h3>
              <ul>
                {pointEntities.map((entity, idx) => (
                  <li key={idx}>{entity}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Base Entities */}
          {baseEntities.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: 'auto', background: '#224', color: '#fff', padding: 10, borderRadius: 8 }}>
              <h3>Base Entities ({baseEntities.length})</h3>
              <ul>
                {baseEntities.map((entity, idx) => (
                  <li key={idx}>{entity}</li>
                ))}
              </ul>
            </div>
          )}
          {/* CSV download link */}
          {csvUrl && (
            <div style={{ marginTop: 20 }}>
              <a href={csvUrl} download="entities.csv">Download CSV</a>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
