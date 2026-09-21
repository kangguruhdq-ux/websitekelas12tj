/**
 * Client-side image optimizer using HTML5 Canvas.
 * Automatically resizes large phone camera photos (e.g. 5MB-15MB)
 * down to ~60KB-120KB (max 1000px, 0.82 quality) before uploading.
 * This guarantees lightning-fast uploads and prevents serverless payload limit errors.
 */

export async function optimizeImageForUpload(
  file: File,
  maxDimension: number = 1000,
  quality: number = 0.82
): Promise<File> {
  // If not an image or SVG/GIF (which shouldn't be flattened to canvas), return original
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  // If already very small (< 150KB), no need to compress
  if (file.size < 150 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate scaling ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Smooth image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compressed blob is somehow larger or failed, return original
              resolve(file);
              return;
            }

            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const optimizedFile = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
