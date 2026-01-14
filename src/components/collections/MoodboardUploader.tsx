import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { nanoid } from 'nanoid';
import { MoodboardImage } from '../../types';
import { processImageFile } from '../../utils/imageUtils';
import toast from 'react-hot-toast';
import styles from './MoodboardUploader.module.css';

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
				toast.success(
					`${processedImages.length} image(s) uploaded successfully`
				);
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : 'Failed to upload images'
				);
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
		<div className={styles.uploader}>
			{/* Upload Area */}
			{images.length < maxImages && (
				<div
					{...getRootProps()}
					className={`${styles.dropzone} ${
						isDragActive ? styles.dropzoneActive : ''
					} ${uploading ? styles.dropzoneDisabled : ''}`}
				>
					<input {...getInputProps()} />
					<div className={styles.dropzoneContent}>
						<svg
							className={styles.icon}
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
							<p className={styles.dropzoneText}>Processing images...</p>
						) : (
							<>
								<p className={styles.dropzoneText}>
									{isDragActive ? 'Drop images here' : 'Drag & drop images'}
								</p>
								<p className={styles.dropzoneHint}>
									or click to browse • JPEG, PNG, WebP • Max {maxImages} images
								</p>
							</>
						)}
					</div>
				</div>
			)}

			{/* Image Grid */}
			{images.length > 0 && (
				<div className={styles.gallery}>
					{images.map((image) => (
						<div key={image.id} className={styles.imageContainer}>
							<img src={image.thumbnail} alt="Moodboard" className={styles.image} />
							<button
								onClick={() => removeImage(image.id)}
								className={styles.removeButton}
								aria-label="Remove image"
							>
								<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				<p className={styles.count}>
					{images.length} of {maxImages} images uploaded
				</p>
			)}
		</div>
	);
};

export default MoodboardUploader;
