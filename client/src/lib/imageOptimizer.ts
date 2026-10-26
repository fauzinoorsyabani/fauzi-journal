/**
 * High-performance client-side image compression and WebP conversion.
 * Converts heavy camera/phone photos (PNG, JPEG, etc.) into lightweight WebP
 * before upload, saving bandwidth and storage while maintaining high visual quality.
 */

export type CompressionResult = {
  dataBase64: string;
  blob: Blob;
  filename: string;
  contentType: "image/webp";
  originalSizeBytes: number;
  compressedSizeBytes: number;
  compressionRatio: number;
};

export type CompressionOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.0 to 1.0 (default 0.82)
};

export async function convertToWebP(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memuat elemen gambar untuk konversi"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) {
          reject(new Error("Canvas context tidak tersedia"));
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Gagal mengonversi gambar ke WebP"));
              return;
            }

            const base64Reader = new FileReader();
            base64Reader.onloadend = () => {
              const fullDataUrl = String(base64Reader.result);
              const dataBase64 = fullDataUrl.includes(",")
                ? fullDataUrl.split(",")[1]
                : fullDataUrl;

              // Generate .webp filename
              const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");
              const filename = `${baseName}.webp`;

              const originalSizeBytes = file.size;
              const compressedSizeBytes = blob.size;
              const compressionRatio = Math.round(
                ((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100
              );

              resolve({
                dataBase64,
                blob,
                filename,
                contentType: "image/webp",
                originalSizeBytes,
                compressedSizeBytes,
                compressionRatio: Math.max(0, compressionRatio),
              });
            };
            base64Reader.readAsDataURL(blob);
          },
          "image/webp",
          quality
        );
      };

      img.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
}

/** Formats byte sizes into human readable strings (e.g., 2.4 MB, 180 KB) */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
