import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import { MoodboardImage } from '../../types';
import { processImageFile } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

interface MoodboardUploaderProps {
  images: MoodboardImage[];
  onImagesChange: (images: MoodboardImage[]) => void;
  maxImages?: number;
}

const MoodboardUploader: React.FC<MoodboardUploaderProps> = ({
  images,
  onImagesChange,
  maxImages = 15,
}) => {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (images.length >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      const remainingSlots = maxImages - images.length;
      const filesToProcess = acceptedFiles.slice(0, remainingSlots);

      if (filesToProcess.length < acceptedFiles.length) {
        toast.error(`Only ${remainingSlots} more images can be added`);
      }

      setUploading(true);

      try {
        const processedImages = await Promise.all(
          filesToProcess.map(async (file) => {
            const { url, thumbnail } = await processImageFile(file);
            return {
              id: nanoid(),
              url,
              thumbnail,
              uploadedAt: new Date().toISOString(),
            };
          })
        );

        onImagesChange([...images, ...processedImages]);
        toast.success(`${processedImages.length} image(s) uploaded successfully`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to upload images');
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: true,
    disabled: uploading || images.length >= maxImages,
  });

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-minimal p-12 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragActive
                ? 'border-stone-900 bg-stone-100'
                : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-12 h-12 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {uploading ? (
              <p className="text-body text-stone-600">Processing images...</p>
            ) : (
              <>
                <p className="text-body-large text-stone-900">
                  {isDragActive ? 'Drop images here' : 'Drag & drop images'}
                </p>
                <p className="text-body-small text-stone-500">
                  or click to browse • JPEG, PNG, WebP • Max {maxImages} images
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-minimal overflow-hidden bg-stone-100"
            >
              <img
                src={image.thumbnail}
                alt="Moodboard"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(image.id)}
                className="absolute top-2 right-2 w-8 h-8 bg-stone-900/80 hover:bg-stone-900 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                aria-label="Remove image"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-body-small text-stone-500 mt-4">
          {images.length} of {maxImages} images uploaded
        </p>
      )}
    </div>
  );
};

export default MoodboardUploader;
