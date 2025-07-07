import React from 'react';
import { writeDetailsToCSV } from './csv_writer';

function CSVDownloader({ data, fieldnames, filename = 'entities.csv' }) {
  const handleDownloadCSV = () => {
    if (!data || data.length === 0) {
      alert('No entities to export. Please visualize data first or adjust filters/search.');
      return;
    }
    const csvString = writeDetailsToCSV(data, fieldnames);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownloadCSV}>
      Download CSV
    </button>
  );
}

export default CSVDownloader;