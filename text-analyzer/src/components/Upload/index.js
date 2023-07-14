import { FileUploader } from "react-drag-drop-files";

import "./Upload.css";

const fileTypes = ["txt"];

function Upload({ handleChange }) {
  return (
    <div className="upload">
      <FileUploader
        label="Upload or drop text file right here to start analyzing"
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
    </div>
  );
}

export default Upload;
