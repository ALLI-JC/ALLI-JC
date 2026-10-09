// Compression côté navigateur avant upload vers Supabase Storage.
// Objectif : réduire l'egress (les originaux de téléphone font 3-8 MB).

function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image illisible')) }
    img.src = url
  })
}

function drawToBlob(
  source: CanvasImageSource,
  srcWidth: number,
  srcHeight: number,
  maxSize: number,
  quality: number
): Promise<Blob> {
  const scale = Math.min(1, maxSize / Math.max(srcWidth, srcHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(srcWidth * scale)
  canvas.height = Math.round(srcHeight * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) return Promise.reject(new Error('Canvas indisponible'))
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Compression impossible'))),
      'image/webp',
      quality
    )
  })
}

// Retourne l'image principale (max 1920px) et une miniature (max 480px), en WebP
export async function compressImage(file: File): Promise<{ full: Blob; thumb: Blob }> {
  const img = await loadImage(file)
  const full = await drawToBlob(img, img.naturalWidth, img.naturalHeight, 1920, 0.82)
  const thumb = await drawToBlob(img, img.naturalWidth, img.naturalHeight, 480, 0.75)
  // Si la "compression" est plus lourde que l'original (déjà optimisé), on garde l'original
  return { full: full.size < file.size ? full : file, thumb }
}

// Capture une image de la vidéo pour servir de poster (miniature) dans les grilles
export function videoPoster(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.src = url
    video.onloadeddata = () => {
      video.currentTime = Math.min(1, (video.duration || 0) / 2)
    }
    video.onseeked = async () => {
      try {
        resolve(await drawToBlob(video, video.videoWidth, video.videoHeight, 480, 0.75))
      } catch (err) {
        reject(err)
      } finally {
        URL.revokeObjectURL(url)
      }
    }
    video.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Vidéo illisible')) }
  })
}
