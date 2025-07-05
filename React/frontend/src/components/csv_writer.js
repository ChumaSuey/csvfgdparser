/**
 * Converts an array of objects to a CSV string.
 * @param {Array<Object>} data - Array of objects to convert.
 * @param {Array<string>} fieldnames - Array of field names (columns).
 * @returns {string} CSV string.
 */
export function writeDetailsToCSV(data, fieldnames) {
  const escape = (str) =>
    `"${String(str).replace(/"/g, '""')}"`;

  const header = fieldnames.map(escape).join(',');
  const rows = data.map(row =>
    fieldnames.map(field => escape(row[field] ?? '')).join(',')
  );
  return [header, ...rows].join('\r\n');
}


