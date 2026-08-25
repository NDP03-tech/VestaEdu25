import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ExplanationEditor = ({ value, onChange }) => {
  const [content, setContent] = useState(value || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setContent(value || '');
  }, [value]);

  const handleEditorChange = (newValue) => {
    setContent(newValue);
    onChange(newValue);
  };

  return (
    <div className="explanation-editor">
      {isEditing ? (
        <Editor
          apiKey="n37usgxk136y7jbgbd22rrry2ki2agrdp3zzkfg8gc0adi22"
          value={content}
          init={{
            height: 200,
            menubar: false,
            plugins: ['link', 'lists', 'image', 'paste'],
            toolbar: 'bold italic underline | bullist numlist | link image',
            branding: false,
            images_upload_handler: (blobInfo, success, failure) => {
              const reader = new FileReader();
              reader.onload = () => success(reader.result);
              reader.onerror = () => failure('Failed to read file');
              reader.readAsDataURL(blobInfo.blob());
            },
          }}
          onEditorChange={handleEditorChange}
        />
      ) : (
        <div
          className="explanation-container border border-secondary p-2 rounded"
          onClick={() => setIsEditing(true)}
          style={{ cursor: 'pointer', minHeight: '120px' }}
          dangerouslySetInnerHTML={{ __html: content || '<i>Click to add explanation...</i>' }}
        />
      )}
    </div>
  );
};

export default ExplanationEditor;
