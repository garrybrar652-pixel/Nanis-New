import { useState } from 'react';
import { useEditor } from '../../shared/EditorContext';
import { Image } from '@usewaypoint/block-image';
import { Upload } from 'lucide-react';

export default function ImageBlockEditor({ style, props: blockProps, blockId }) {
  const { setDocument } = useEditor();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file) => {
    setIsUploading(true);
    
    try {
      // TODO: Replace with your actual upload logic
      const formData = new FormData();
      formData.append('image', file);
      
      // Example upload (replace with your API)
      // const response = await axios.post('/api/upload', formData);
      // const imageUrl = response.data. url;
      
      // For now, use a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?. result;
        
        setDocument({
          [blockId]:  {
            type: 'Image',
            data: {
              style,
              props: {
                ...blockProps,
                url: imageUrl,
              },
            },
          },
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  if (! blockProps?.url) {
    return (
      <div className="p-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Upload an image</p>
        <label className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer">
          Choose File
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    );
  }

  return (
    <div className="relative group">
      <Image style={style} props={blockProps} />
      
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
        <label className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-gray-900 rounded-lg cursor-pointer hover:bg-gray-100">
          Change Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
      
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
}