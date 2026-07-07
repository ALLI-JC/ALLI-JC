// types/gallery.ts
export interface GalleryImage {
  id: string
  title: string
  description: string | null
  image_url: string
  thumbnail_url: string | null
  category: 'vitres' | 'exterieur' | 'jardin' | 'interieur' | 'bricolage' | 'professionnel' | 'general'
  order: number
  featured: boolean
  created_at: string
  updated_at: string | null
}

export interface GalleryFormData {
  title: string
  description: string
  category: GalleryImage['category']
  featured: boolean
}