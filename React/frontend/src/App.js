import React, { useState, useEffect } from 'react'; // Import useEffect
import './App.css';
import VisualizerOptions from './components/VisualizerOptions';
import CSVDownloader from './components/csv_downloader';
import FGDParser from './components/fgd_parser'; // Correct: FGDParser is the default export
import { searchEntities } from './components/utils';
import BaseEntity from './components/BaseEntity'; // Import the new component

function App() {
  const [classType, setClassType] = useState('All');
  const [parserKey, setParserKey] = useState(Date.now()); // For resetting the FGDParser component

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

  // Callback for when the FGDParser component has parsed a file
  const handleParsedData = ({ solid, point, base }) => {
    clearDataState(); // Clear previous data before setting new data
    // Store original parsed entities
    setOriginalSolidEntities(solid);
    setOriginalPointEntities(point);
    setOriginalBaseEntities(base);
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
    if (typeof e === 'string') {
      const [entity, ...desc] = e.split(' : ');
      return { Entity: entity, Description: desc.join(' : '), Properties: '' };
    } else { // It's a base entity object
      return {
        Entity: e.name,
        Description: e.description,
        Properties: e.properties.join('; ') // Join properties with a semicolon
      };
    }
  });
  const csvFieldnames = ['Entity', 'Description', 'Properties'];

  // Full reset for the application state
  const handleReset = () => {
    setClassType('All');
    clearDataState();
    setParserKey(Date.now()); // Reset the FGDParser component by changing its key
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>FGD Entity Viewer</h1>
        {/* The FGDParser component now handles file selection and parsing */}
        <FGDParser key={parserKey} onParsed={handleParsedData} />
        <VisualizerOptions value={classType} onChange={setClassType} />
        <div style={{ margin: '20px 0' }}>
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
                {filteredBaseEntities.map((entity, index) => (
                  <BaseEntity key={`${entity.name}-${index}`} entity={entity} />
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