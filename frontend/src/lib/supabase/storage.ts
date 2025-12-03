import { supabase } from './config';
import { Attachment } from '@/types/comments';

const STORAGE_BUCKET = 'attachments';

// File size limits (in bytes)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

/**
 * Upload an image file to Supabase Storage
 */
export const uploadImage = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<Attachment> => {
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      'Invalid image type. Allowed types: JPEG, PNG, GIF, WebP.'
    );
  }

  // Validate file size
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image size must be less than 5MB.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  // Upload file
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  // Simulate progress for UI feedback
  if (onProgress) {
    onProgress(100);
  }

  return {
    type: 'image',
    url: publicUrl,
    name: file.name,
    size: file.size,
  };
};

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<Attachment> => {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(
      'Invalid file type. Allowed types: PDF, Word, Excel, Text, CSV.'
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 10MB.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  // Upload file
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  // Simulate progress for UI feedback
  if (onProgress) {
    onProgress(100);
  }

  return {
    type: 'file',
    url: publicUrl,
    name: file.name,
    size: file.size,
  };
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  // Extract file path from URL
  const fileName = fileUrl.split(`${STORAGE_BUCKET}/`)[1];

  if (!fileName) {
    throw new Error('Invalid file URL');
  }

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove([fileName]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
