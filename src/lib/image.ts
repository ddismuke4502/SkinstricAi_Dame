const BASE64_PREFIX_PATTERN = /^data:image\/[a-zA-Z]+;base64,/;

export type ImageConversionResult = {
  base64: string;
  dataUrl: string;
};

export function stripBase64Prefix(dataUrl: string): string {
  return dataUrl.replace(BASE64_PREFIX_PATTERN, "");
}

export function isValidImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isValidImageFile(file)) {
      reject(new Error("Please upload a valid image file."));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read this image file."));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error("Something went wrong while reading the image."));
    };

    reader.readAsDataURL(file);
  });
}

export async function fileToBase64(file: File): Promise<ImageConversionResult> {
  const dataUrl = await fileToDataUrl(file);

  return {
    dataUrl,
    base64: stripBase64Prefix(dataUrl),
  };
}

export function canvasToBase64(
  canvas: HTMLCanvasElement,
  imageType = "image/jpeg",
  quality = 0.92
): ImageConversionResult {
  const dataUrl = canvas.toDataURL(imageType, quality);

  return {
    dataUrl,
    base64: stripBase64Prefix(dataUrl),
  };
}