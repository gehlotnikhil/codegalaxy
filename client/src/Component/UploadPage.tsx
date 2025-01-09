import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CLOUD_NAME = 'diqpelkm9'; // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = 'my_present';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      const uploadedImageUrl = response.data.secure_url;

      // Store the uploaded image URL in localStorage
      localStorage.setItem('uploadedImageUrl', uploadedImageUrl);

      // Navigate to the display page
      navigate('/display');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Image upload failed. Please try again.');
    }
  };

  return (
    
    <div>
      <img src="https://res.cloudinary.com/diqpelkm9/image/upload/v1736351495/srfyhdzipml06vxkhm8v.png" height={"100px"} width={"100px"} alt="Hello............." />
      <h1>Upload Image</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) setFile(e.target.files[0]);
        }}
      />
      <button onClick={handleUpload}>Upload</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UploadPage;
