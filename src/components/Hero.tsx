import React, { useState, useEffect } from 'react';
import Monogram from './Monogram';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { motion } from 'motion/react';
import { getOptimizedImageProps } from '../imageUtils';

export default function Hero() {
  const { config, language, groom, bride, weddingDateFormatted, venueName, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const heroImages = config.heroImages || [];

  useEffect(() => {
    if (heroImages.length > 0) {
      const firstImage = heroImages[0];
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      const opt = getOptimizedImageProps(firstImage, 1600, 1080);
      link.href = opt.src;
      if (opt.srcSet) {
        link.setAttribute('imagesrcset', opt.srcSet);
        link.setAttribute('imagesizes', '100vw');
      }
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [heroImages]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const scrollToNextSection = () => {
    const sections = config.sections;
    const targetId = sections?.story ? 'story-intro' : sections?.countdown ? 'countdown' : 'timeline';
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
      {heroImages.map((imgUrl, index) => {
        const opt = getOptimizedImageProps(imgUrl, 1600, 1080);
        return (
          <div
            key={imgUrl}
            className={`absolute inset-0 w-full h-full transition-all duration-[2000ms] ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-105 z-0' : 'opacity-0 scale-100 z-0'
            }`}
          >
            <img
              src={opt.src}
              srcSet={opt.srcSet}
              sizes="100vw"
              width={opt.width}
              height={opt.height}
              alt="Beautiful Wedding Moments"
              className="w-full h-full object-cover select-none"
              loading={index === 0 ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
            />
          </div>
        );
      })}

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-brand-primary/45 via-brand-primary/25 to-brand-cream" />

      <div className="absolute inset-x-4 inset-y-4 md:inset-x-8 md:inset-y-8 z-10 pointer-events-none rounded" />
      <div className="absolute inset-x-6 inset-y-6 md:inset-x-10 md:inset-y-10 z-10 pointer-events-none rounded" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 text-center max-w-2xl mx-4 px-6 py-8 md:px-12 md:py-12 flex flex-col items-center backdrop-blur-md bg-brand-cream/90 rounded-2xl shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <Monogram size={130} className="mb-5" />
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, letterSpacing: "0.1em" }}
          animate={{ opacity: 1, letterSpacing: "0.3em" }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-sans text-xs md:text-sm uppercase text-brand-gold font-medium mb-3 select-none"
        >
          {t('hero.saveDate', 'Save the Date')}
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          className="font-serif text-4xl md:text-6xl text-brand-primary tracking-normal mb-2 leading-tight"
        >
          {bride} <span className="text-brand-accent font-light font-sans text-xl md:text-3xl align-middle mx-1">{t('common.and', 'and')}</span> {groom}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.9 }}
          className="font-serif italic text-lg md:text-xl text-brand-accent mb-5"
        >
          {t('common.areGettingMarried', 'Are Getting Married')}
        </motion.p>

        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="h-[2px] bg-brand-gold/60 mb-5" 
        />

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="font-sans text-xs md:text-sm tracking-[0.25em] text-brand-primary/80 uppercase font-medium"
        >
          {weddingDateFormatted} • {venueName}
        </motion.p>
      </motion.div>

      <motion.button
        onClick={scrollToNextSection}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        whileHover={{ y: 3 }}
        className="absolute bottom-16 z-20 flex flex-col items-center text-brand-primary/75 hover:text-brand-accent transition-colors duration-300 group cursor-pointer focus:outline-none"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] font-semibold mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
          {t('hero.storyScroll', 'Our Story')}
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce text-brand-gold" />
      </motion.button>
    </section>
  );
}
