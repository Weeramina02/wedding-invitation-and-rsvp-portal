import React, { useState } from 'react';
import { MapPin, Compass, Car, Map as MapIcon, ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';
import { trackEvent } from '../utils/analytics';

export default function LocationMap({ bgClass }: { bgClass?: string; key?: React.Key }) {
  const { config, language, t } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  const addressQuery = config.addressQuery || '';
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(addressQuery)}`;

  if (!config.sections?.location) return null;

  return (
    <section id="location" className={`py-24 ${bgClass || 'bg-brand-cream'} relative overflow-hidden linen-texture border-t border-[#E5E2D9]`}>
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Map Preview on the Left */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, x: -30 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 h-[380px] md:h-[450px] w-full bg-white p-3 rounded-3xl shadow-md border border-[#E5E2D9] overflow-hidden order-1 lg:order-1"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden relative bg-[#FAF9F6] flex flex-col justify-center items-center">
            {showMap ? (
              <iframe
                title="Venue Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-90 contrast-105 hover:grayscale-0 transition-all duration-700"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-r from-brand-cream-dark/40 to-brand-cream-dark/10 select-none">
                {/* Visual coordinate backdrop pattern to feel designed */}
                <div className="absolute inset-4 border border-dashed border-brand-accent/20 rounded-xl pointer-events-none" />
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center text-brand-gold mb-4 relative animate-pulse">
                  <MapPin className="w-6 h-6 stroke-1.5" />
                </div>
                <h3 className="font-serif text-xl text-brand-primary mb-1">
                  {t('location.interactiveMap', 'Interactive Map')}
                </h3>
                <p className="font-sans text-[11px] uppercase tracking-wider text-brand-primary/60 max-w-xs mb-6 leading-relaxed">
                  {t('location.clickToLoad', 'Click below to load the interactive venue map on this page')}
                </p>
                <motion.button
                  onClick={() => { setShowMap(true); trackEvent('load_interactive_map', 'navigation', addressQuery); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-full bg-brand-primary text-white font-sans text-xs uppercase tracking-widest font-semibold shadow-md hover:bg-brand-accent transition-colors duration-300 cursor-pointer focus:outline-none"
                >
                  {t('location.showMapBtn', 'View Map')}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Text detail block on the Right */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5 space-y-6 text-center lg:text-left order-2 lg:order-2"
        >
          <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-brand-accent font-bold block animate-fade-in">
            {config.sectionConfigs?.location?.title?.[language] || t('location.label', 'The Location')}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-primary font-light tracking-wide leading-tight">
            {config.sectionConfigs?.location?.subtitle?.[language] || t('location.title', 'Amora Lagoon, Katunayake')}
          </h2>
          <div className="h-[1px] w-16 bg-[#E5E2D9] mx-auto lg:mx-0 opacity-80" />
          
          <p className="font-body text-base text-brand-primary/80 leading-relaxed">
            {config.venueDescription?.[language] || ''}
          </p>

          <div className="space-y-4 pt-4 text-left max-w-md mx-auto lg:mx-0">
            <motion.div 
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-accent flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-wider text-brand-primary font-bold">
                  {t('location.addressLabel', 'Address')}
                </p>
                <p className="font-body text-sm text-brand-primary/80 mt-0.5">
                  {config.venueLocation?.[language] || ''}
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-accent flex-shrink-0">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-wider text-brand-primary font-bold">
                  {t('location.pinLabel', 'The Venue Location')}
                </p>
                <p className="font-body text-sm text-brand-primary/80 mt-0.5">
                  {t('location.byCarText', 'Secure parking is provided inside the premises.')}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <motion.a
               href={googleMapsUrl}
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.04 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => trackEvent('open_google_maps', 'navigation', addressQuery)}
               className="inline-flex items-center justify-center gap-2 border border-[#E5E2D9] hover:border-brand-accent bg-white text-brand-primary px-6 py-2.5 rounded-full font-sans text-[11px] uppercase tracking-widest font-bold transition-all shadow-sm cursor-pointer"
            >
              <MapIcon className="w-3.5 h-3.5 text-brand-accent" />
              <span>Google Maps</span>
              <ArrowUpRight className="w-3" />
            </motion.a>

            <motion.a
               href={appleMapsUrl}
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.04 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => trackEvent('open_apple_maps', 'navigation', addressQuery)}
               className="inline-flex items-center justify-center gap-2 border border-[#E5E2D9] hover:border-brand-accent bg-white text-[#4A4A4A] px-6 py-2.5 rounded-full font-sans text-[11px] uppercase tracking-widest font-bold transition-all shadow-sm cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-brand-accent" />
              <span>Apple Maps</span>
              <ArrowUpRight className="w-3" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
