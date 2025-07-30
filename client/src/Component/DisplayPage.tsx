import React, { useState, useEffect } from 'react';
import axios from 'axios';
const CLOUDINARY_FETCH_URL = `https://api.cloudinary.com/v1_1/diqpelkm9/resources/image`;

const DisplayPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const specificPublicId = 'srfyhdzipml06vxkhm8v'; // Replace with the desired image's public_id

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Replace `YOUR_API_KEY` and `YOUR_API_SECRET` with actual values
        const apiKey = '698453345786883';
        const apiSecret = 'd0ZpZTeDM06flAihfoSq8FJe99Q';

        const encodedAuth = btoa(`${apiKey}:${apiSecret}`);

        // Fetch the specific image details
        const response = await axios.get(`${CLOUDINARY_FETCH_URL}/${specificPublicId}`, {
          headers: {
            Authorization: `Basic ${encodedAuth}`,
          },
        });

        // Extract the URL of the specific image
        const imageUrl = response.data.secure_url;
        setImage(imageUrl);
      } catch (error) {
        console.error('Error fetching the image:', error);
        setError('Failed to fetch the image. Please try again.');
      }
    };

    fetchImage();
  }, [specificPublicId]);

  return (
    <div>
      <h1>Specific Image</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image ? (
        <img
          src={image}
          alt="Specific uploaded"
          style={{ width: '300px', height: '300px', objectFit: 'cover' }}
        />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default DisplayPage;
