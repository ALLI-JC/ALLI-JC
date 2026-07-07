// components/site/Gallery.tsx
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, ZoomIn, Loader2, CheckCircle, Shield, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

interface GalleryImage {
  id: string
  title: string
  description: string
  image_url: string
  thumbnail_url: string | null
  category: string
  order: number
  featured: boolean
  created_at: string
}

const categories = [
  { id: 'all', label: 'Tous', icon: '📷' },
  { id: 'vitres', label: 'Vitres', icon: '🪟' },
  { id: 'exterieur', label: 'Extérieur', icon: '🏠' },
  { id: 'jardin', label: 'Jardin', icon: '🌿' },
  { id: 'interieur', label: 'Intérieur', icon: '🏡' },
  { id: 'bricolage', label: 'Bricolage', icon: '🔧' },
  { id: 'professionnel', label: 'Professionnel', icon: '🏢' },
  { id: 'general', label: 'Général', icon: '📷' },
];

const categoryMentions: Record<string, string> = {
  all: 'Photos réelles de toutes nos interventions',
  vitres: 'Nettoyage sans traces, résultat garanti',
  exterieur: 'Façades et extérieurs remis à neuf',
  jardin: 'Espaces verts entretenus par des pros',
  interieur: 'Propreté et soin du détail assurés',
  bricolage: 'Petits travaux, grand résultat',
  professionnel: 'Locaux commerciaux traités avec discrétion',
  general: 'Savoir-faire polyvalent à votre service',
};

// Variants Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const imageCardVariant = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const lightboxVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const lightboxImageVariant = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.96, y: -12, transition: { duration: 0.2 } },
};

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('gallery')
        .select('*')
        .order('order', { ascending: true });
      if (fetchError) throw fetchError;
      setImages(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Impossible de charger les images');
    } finally {
      setLoading(false);
    }
  }

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter(img => img.category === selectedCategory);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (filteredImages.length === 0) return;
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'ArrowRight') navigateImage('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex, filteredImages]);

  const featuredImages = images.filter(img => img.featured).slice(0, 4);

  return (
    <>
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50" id="sec-gallery">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* En-tête */}
          <motion.div
            className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} custom={0}>
              <div className="inline-flex items-center gap-2 bg-[#79DBDC]/10 rounded-full px-4 py-1.5 mb-4">
                <Camera size={14} className="text-[#79DBDC]" />
                <span className="text-xs font-medium text-[#79DBDC] uppercase tracking-wider">
                  Notre travail
                </span>
              </div>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              custom={1}
              className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Galerie de nos réalisations
            </motion.h2>

            <motion.p variants={fadeInUp} custom={2} className="text-gray-500 mb-6">
              Découvrez la qualité de nos prestations à travers nos réalisations
            </motion.p>

            {/* Mention div du titre */}
            <motion.div
              variants={fadeInUp}
              custom={3}
              className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm text-sm text-gray-500"
            >
              <span className="flex items-center gap-1.5">
                <Camera size={14} className="text-[#79DBDC]" />
                Photos réelles
              </span>
              <span className="w-px h-4 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-[#79DBDC]" />
                Résultats garantis
              </span>
              <span className="w-px h-4 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-[#79DBDC]" />
                Matériel professionnel
              </span>
              <span className="w-px h-4 bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <Star size={14} className="text-[#79DBDC]" />
                Clients satisfaits
              </span>
            </motion.div>
          </motion.div>

          {/* Images en vedette */}
          {featuredImages.length > 0 && (
            <motion.div
              className="mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} custom={0} className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">✨ À la une</h3>
                <span className="text-xs text-gray-400">Nos meilleures réalisations</span>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredImages.map((image, i) => (
                  <motion.div
                    key={image.id}
                    variants={fadeInUp}
                    custom={i + 1}
                    onClick={() => openLightbox(image, filteredImages.findIndex(img => img.id === image.id))}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 aspect-square group"
                  >
                    <img
                      src={image.thumbnail_url || image.image_url}
                      alt={image.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-xs font-medium">{image.title}</p>
                      </div>
                    </div>
                    {image.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Une
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Filtres catégories */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            {categories.map((cat) => {
              const count = cat.id === 'all' ? images.length : images.filter(img => img.category === cat.id).length;
              const isActive = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#79DBDC] to-[#5BBFC0] text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {count > 0 && !isActive && (
                    <span className="text-xs opacity-70">({count})</span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Mention div catégorie — animée au changement */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-start justify-center gap-1.5 px-4 py-2.5 mb-8 rounded-xl bg-[#79DBDC]/8 border border-[#79DBDC]/20 max-w-sm mx-auto"
            >
              <Shield size={13} className="text-[#5BBFC0] flex-shrink-0 mt-0.5" />
              <span className="text-xs text-[#3a9a9b] font-medium text-center leading-snug">
                {categoryMentions[selectedCategory] ?? 'Photos réelles de nos interventions'}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Grille des images */}
          {loading ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 size={40} className="animate-spin text-[#79DBDC] mb-4" />
              <p className="text-gray-400">Chargement des images...</p>
            </motion.div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400">{error}</p>
              <button onClick={fetchImages} className="mt-4 text-[#79DBDC] hover:underline">
                Réessayer
              </button>
            </div>
          ) : filteredImages.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Camera size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400">Aucune image dans cette catégorie</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    variants={imageCardVariant}
                    onClick={() => openLightbox(image, index)}
                    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative overflow-hidden rounded-xl cursor-pointer bg-gray-100 aspect-square"
                  >
                    <img
                      src={image.thumbnail_url || image.image_url}
                      alt={image.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />

                    {/* Overlay au hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white text-sm font-semibold">{image.title}</h3>
                        {image.description && (
                          <p className="text-white/70 text-xs mt-1 line-clamp-2">{image.description}</p>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          <CheckCircle size={10} className="text-[#79DBDC] flex-shrink-0" />
                          <span className="text-white/60 text-xs">
                            {categoryMentions[image.category] ?? 'Intervention professionnelle'}
                          </span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <ZoomIn size={16} className="text-white" />
                      </div>
                    </div>

                    {image.featured && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                        À la une
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Mention div globale bas de section */}
          <motion.div
            className="flex items-center justify-center gap-3 mt-10 px-6 py-4 border border-gray-100 rounded-2xl bg-gray-50/60 text-sm text-gray-500 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle size={16} className="text-[#79DBDC] flex-shrink-0" />
            <span>
              Toutes les photos présentées sont issues de vraies interventions réalisées par notre équipe.
            </span>
          </motion.div>

        </div>
      </section>

      {/* Lightbox modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center"
            variants={lightboxVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeLightbox}
          >
            {/* Bouton fermeture */}
            <motion.button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={22} className="text-white" />
            </motion.button>

            {/* Navigation précédent */}
            {filteredImages.length > 1 && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                className="absolute left-4 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={22} className="text-white" />
              </motion.button>
            )}

            {/* Image avec transition au changement */}
            <div
              className="max-w-[90vw] max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage.id}
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg"
                  variants={lightboxImageVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
              </AnimatePresence>

              {/* Légende */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-center">
                  <h3 className="text-white text-lg font-semibold">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-white/70 text-sm mt-1">{selectedImage.description}</p>
                  )}
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Shield size={12} className="text-[#79DBDC]" />
                    <span className="text-white/50 text-xs">
                      {categoryMentions[selectedImage.category] ?? 'Intervention professionnelle'}
                    </span>
                  </div>
                  {selectedImage.category && (
                    <p className="text-white/30 text-xs mt-2">
                      Catégorie : {categories.find(c => c.id === selectedImage.category)?.label}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Navigation suivant */}
            {filteredImages.length > 1 && (
              <motion.button
                onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                className="absolute right-4 z-10 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={22} className="text-white" />
              </motion.button>
            )}

            {/* Compteur */}
            {filteredImages.length > 1 && (
              <motion.div
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/50 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentIndex + 1} / {filteredImages.length}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}