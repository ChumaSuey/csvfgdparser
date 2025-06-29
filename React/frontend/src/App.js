import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import VisualizerOptions from './components/VisualizerOptions';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [classType, setClassType] = useState('All');
  const [solidEntities, setSolidEntities] = useState([]);
  const [pointEntities, setPointEntities] = useState([]);
  const [baseEntities, setBaseEntities] = useState([]);
  const [csvUrl, setCsvUrl] = useState(null);

  const handleVisualize = async () => {
    if (!selectedFile) {
      alert('Please select an FGD file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('classType', classType);

    try {
      const response = await axios.post('http://localhost:5000/api/visualize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSolidEntities(response.data.solid || []);
      setPointEntities(response.data.point || []);
      setBaseEntities(response.data.base || []);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleCreateCSV = async () => {
    if (!selectedFile) {
      alert('Please select an FGD file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('classType', classType);

    try {
      const response = await axios.post('http://localhost:5000/api/create-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setCsvUrl(url);
    } catch (error) {
      alert('Error: ' + error.message);
    }
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
