import React, { useState, useEffect } from 'react'; // Import useEffect
import './App.css';
import VisualizerOptions from './components/VisualizerOptions';
import CSVDownloader from './components/csv_downloader';
import { parseFGD } from './components/fgd_parser';
import { searchEntities } from './components/utils'; // Assuming searcher.js is where searchEntities is

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [classType, setClassType] = useState('All');
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // For resetting the file input

  // New state for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSolidEntities, setFilteredSolidEntities] = useState([]);
  const [filteredPointEntities, setFilteredPointEntities] = useState([]);
  const [filteredBaseEntities, setFilteredBaseEntities] = useState([]);

  const [originalSolidEntities, setOriginalSolidEntities] = useState([]);
  const [originalPointEntities, setOriginalPointEntities] = useState([]);
  const [originalBaseEntities, setOriginalBaseEntities] = useState([]);

  // Helper to clear all entity and search data
  const clearDataState = () => {
    setOriginalSolidEntities([]);
    setOriginalPointEntities([]);
    setOriginalBaseEntities([]);
    setFilteredSolidEntities([]);
    setFilteredPointEntities([]);
    setFilteredBaseEntities([]);
    setSearchTerm('');
  };

  // Clears old data when a new file is selected, preventing confusion
  const handleFileSelection = (file) => {
    if (file) {
      setSelectedFile(file);
      clearDataState();
    }
  };

  const handleVisualize = () => {
    if (!selectedFile) {
      alert('Please select an FGD file first.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { solid, point, base } = parseFGD(text);

      // Store original parsed entities
      setOriginalSolidEntities(solid);
      setOriginalPointEntities(point);
      setOriginalBaseEntities(base);

      // The useEffect will now populate the filtered entities based on the new original data
    };
    reader.onerror = () => alert('Failed to read file.');
    reader.readAsText(selectedFile, 'utf-8');
  };

  // Effect to handle filtering when entities or classType or searchTerm changes
  useEffect(() => {
    const applyFiltersAndSearch = () => {
      let currentSolid = originalSolidEntities;
      let currentPoint = originalPointEntities;
      let currentBase = originalBaseEntities;

      // Apply class type filter first
      if (classType !== 'All') {
        currentSolid = classType === 'Solid' ? originalSolidEntities : [];
        currentPoint = classType === 'Point' ? originalPointEntities : [];
        currentBase = classType === 'Base' ? originalBaseEntities : [];
      }

      // Apply search filter if search term exists
      if (searchTerm) {
        const { solid, point, base } = searchEntities(searchTerm, currentSolid, currentPoint, currentBase);
        setFilteredSolidEntities(solid);
        setFilteredPointEntities(point);
        setFilteredBaseEntities(base);
      } else {
        // If no search term, display the currently class-filtered entities
        setFilteredSolidEntities(currentSolid);
        setFilteredPointEntities(currentPoint);
        setFilteredBaseEntities(currentBase);
      }
    };

    applyFiltersAndSearch();
  }, [searchTerm, classType, originalSolidEntities, originalPointEntities, originalBaseEntities]);

  // Prepare data for CSV export based on the current filtered view
  const entitiesToExport = [...filteredSolidEntities, ...filteredPointEntities, ...filteredBaseEntities];
  const dataForCSV = entitiesToExport.map(e => {
    const [entity, ...desc] = e.split(' : ');
    return { Entity: entity, Description: desc.join(' : ') };
  });
  const csvFieldnames = ['Entity', 'Description'];

  // Full reset for the application state
  const handleReset = () => {
    setSelectedFile(null);
    setClassType('All');
    clearDataState();
    setFileInputKey(Date.now()); // Reset the file input component by changing its key
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>FGD Entity Viewer</h1>
        <div style={{ margin: '20px 0' }}>
          {/* We hide the default file input and use a styled label to trigger it. */}
          <input
            type="file"
            id="file-upload-input"
            key={fileInputKey}
            onChange={(e) => handleFileSelection(e.target.files[0])}
            style={{ display: 'none' }}
            accept=".fgd"
          />
          <label htmlFor="file-upload-input" className="file-upload-label">
            Choose FGD File
          </label>
          <span style={{ marginLeft: 10, color: '#ccc', fontStyle: 'italic' }}>
            {selectedFile ? selectedFile.name : 'No file chosen'}
          </span>
        </div>
        <VisualizerOptions value={classType} onChange={setClassType} />
        <div style={{ margin: '20px 0' }}>
          <button onClick={handleVisualize} style={{ marginRight: 10 }}>
            Visualize Data
          </button>
          <CSVDownloader
            data={dataForCSV}
            fieldnames={csvFieldnames}
            filename="entities.csv"
          />
          <button onClick={handleReset} style={{ marginLeft: 10 }}>
            Reset
          </button>
        </div>

        {/* Search Input Field */}
        <div style={{ margin: '20px 0', width: '100%', maxWidth: 600 }}>
          <input
            type="text"
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #555',
              background: '#333',
              color: '#fff',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ marginTop: 30, width: '100%', maxWidth: 600 }}>
          <p>
            <strong>Note:</strong> The Entity counter is an approximation.
          </p>
          {/* Display Filtered Solid Entities */}
          {filteredSolidEntities.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: 'auto', background: '#222', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 20 }}>
              <h3>Solid Entities ({filteredSolidEntities.length})</h3>
              <ul>
                {filteredSolidEntities.map((entity, idx) => (
                  <li key={idx}>{entity}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Display Filtered Point Entities */}
          {filteredPointEntities.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: 'auto', background: '#223', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 20 }}>
              <h3>Point Entities ({filteredPointEntities.length})</h3>
              <ul>
                {filteredPointEntities.map((entity, idx) => (
                  <li key={idx}>{entity}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Display Filtered Base Entities */}
          {filteredBaseEntities.length > 0 && (
            <div style={{ maxHeight: 200, overflowY: 'auto', background: '#224', color: '#fff', padding: 10, borderRadius: 8 }}>
              <h3>Base Entities ({filteredBaseEntities.length})</h3>
              <ul>
                {filteredBaseEntities.map((entity, idx) => (
                  <li key={idx}>{entity}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Message when no entities match search/filter */}
          {(searchTerm && filteredSolidEntities.length === 0 && filteredPointEntities.length === 0 && filteredBaseEntities.length === 0) && (
            <p style={{ color: '#aaa' }}>No entities match your search criteria.</p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;