import React, { useRef } from 'react';

function FileUpload({ onFileSelected }) {
  const fileInput = useRef();

    const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
        onFileSelected(e.target.files[0]);
        e.target.value = ''; // Reset input so same file can be selected again
    }
    };

  return (
    <div>
      <label>Select FGD File: </label>
      <input
        type="file"
        accept=".fgd"
        ref={fileInput}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default FileUpload;