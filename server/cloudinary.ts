import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

let isCloudinaryConfigured = false;
let configuredCloudName: string | null = null;

/**
 * Lazy initialization of Cloudinary SDK
 */
export function initCloudinary(): typeof cloudinary | null {
  if (isCloudinaryConfigured) {
    return cloudinary;
  }

  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudinaryUrl) {
    try {
      cloudinary.config({
        cloudinary_url: cloudinaryUrl,
        secure: true,
      });
      // Extract cloud name from URL for diagnostic display if possible
      const match = cloudinaryUrl.match(/@([a-zA-Z0-9_-]+)/);
      configuredCloudName = match ? match[1] : 'configured-via-url';
      isCloudinaryConfigured = true;
      console.log(`[Cloudinary] Configured via CLOUDINARY_URL (${configuredCloudName})`);
      return cloudinary;
    } catch (err) {
      console.warn('[Cloudinary] Failed to configure from CLOUDINARY_URL:', err);
    }
  }

  if (cloudName && apiKey && apiSecret) {
    try {
      cloudinary.config({
        cloud_name: cloudName.trim(),
        api_key: apiKey.trim(),
        api_secret: apiSecret.trim(),
        secure: true,
      });
      configuredCloudName = cloudName.trim();
      isCloudinaryConfigured = true;
      console.log(`[Cloudinary] Configured with Cloud Name: ${configuredCloudName}`);
      return cloudinary;
    } catch (err) {
      console.warn('[Cloudinary] Failed to configure with API keys:', err);
    }
  }

  return null;
}

export function getCloudinaryStatus() {
  const instance = initCloudinary();
  return {
    configured: !!instance,
    cloudName: configuredCloudName,
    provider: instance ? 'cloudinary' : 'local_storage',
  };
}

export interface UploadResult {
  success: boolean;
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  provider: 'cloudinary' | 'local_storage';
  warning?: string;
  error?: string;
}

/**
 * Uploads an image (data URI / base64 or remote URL) to Cloudinary or returns optimized payload.
 */
export async function uploadImage(
  imageData: string,
  options?: { folder?: string; tags?: string[] }
): Promise<UploadResult> {
  if (!imageData || typeof imageData !== 'string') {
    throw new Error('No image data provided for upload');
  }

  const client = initCloudinary();

  if (client) {
    try {
      const folderName = options?.folder || 'blogflow_posts';
      const uploadResponse: UploadApiResponse = await client.uploader.upload(imageData, {
        folder: folderName,
        resource_type: 'image',
        tags: options?.tags || ['blogflow', 'blog_cover'],
        transformation: [
          { quality: 'auto:good', fetch_format: 'auto' },
        ],
      });

      return {
        success: true,
        url: uploadResponse.secure_url || uploadResponse.url,
        publicId: uploadResponse.public_id,
        format: uploadResponse.format,
        width: uploadResponse.width,
        height: uploadResponse.height,
        bytes: uploadResponse.bytes,
        provider: 'cloudinary',
      };
    } catch (error: any) {
      console.error('[Cloudinary Upload Error]', error);
      throw new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`);
    }
  }

  // Fallback if Cloudinary is not yet configured in environment variables:
  // We return the image data directly (e.g. data URI) so the app works seamlessly in preview
  return {
    success: true,
    url: imageData,
    provider: 'local_storage',
    warning:
      'Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) not detected in environment. Image stored in local post record.',
  };
}
