import React, { useState, useEffect } from 'react'; // Import useEffect
import './App.css';
import FileUpload from './components/FileUpload';
import VisualizerOptions from './components/VisualizerOptions';
import { parseFGD } from './components/fgd_parser';
import { writeDetailsToCSV } from './components/csv_writer';
import { searchEntities } from './components/utils'; // Assuming searcher.js is where searchEntities is

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [classType, setClassType] = useState('All');
  const [solidEntities, setSolidEntities] = useState([]);
  const [pointEntities, setPointEntities] = useState([]);
  const [baseEntities, setBaseEntities] = useState([]);
  const [csvUrl, setCsvUrl] = useState(null);

  // New state for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSolidEntities, setFilteredSolidEntities] = useState([]);
  const [filteredPointEntities, setFilteredPointEntities] = useState([]);
  const [filteredBaseEntities, setFilteredBaseEntities] = useState([]);

  // Use a ref to store the original parsed entities to search against
  // This prevents re-parsing the file every time the search term changes
  const [originalSolidEntities, setOriginalSolidEntities] = useState([]);
  const [originalPointEntities, setOriginalPointEntities] = useState([]);
  const [originalBaseEntities, setOriginalBaseEntities] = useState([]);

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

      // Set initial displayed entities based on classType
      setSolidEntities(classType === 'All' || classType === 'Solid' ? solid : []);
      setPointEntities(classType === 'All' || classType === 'Point' ? point : []);
      setBaseEntities(classType === 'All' || classType === 'Base' ? base : []);

      // Clear search term and filtered results on new visualization
      setSearchTerm('');
      setFilteredSolidEntities([]);
      setFilteredPointEntities([]);
      setFilteredBaseEntities([]);
      setCsvUrl(null); // Reset CSV link on new visualize
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


  const handleCreateCSV = () => {
    // Combine filtered entities for CSV if search is active, otherwise original/class-filtered
    let data = [];
    let fieldnames = ['Entity', 'Description'];

    const entitiesToExport = searchTerm ?
      [...filteredSolidEntities, ...filteredPointEntities, ...filteredBaseEntities] :
      [...solidEntities, ...pointEntities, ...baseEntities]; // Use the currently displayed entities

    if (entitiesToExport.length > 0) {
      data = entitiesToExport.map(e => {
        const [entity, ...desc] = e.split(' : ');
        return { Entity: entity, Description: desc.join(' : ') };
      });
    }

    if (data.length === 0) {
      alert('No entities to export. Please visualize data first or adjust filters/search.');
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