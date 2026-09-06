import React, { useState, useEffect } from 'react';
import AudioPlayer from './components/AudioPlayer';
import GoogleAnalytics from './components/GoogleAnalytics';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Countdown from './components/Countdown';
import VideoPreview from './components/VideoPreview';
import SaveTheDate from './components/SaveTheDate';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import LocationMap from './components/LocationMap';
import MemoryShare from './components/MemoryShare';
import Guestbook from './components/Guestbook';
import RsvpForm from './components/RsvpForm';
import { useLanguage } from './LanguageContext';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { config, language, setLanguage, groom, bride, weddingDate, venueName, t, isTransitioning } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = config.sections || {};
  const multilingualEnabled = config.multilingual?.enabled;

  // Build the list of active nav links dynamically from active config.yaml section configs matching current ordering
  const navLinks: Array<{ label: string; id: string }> = [];

  if (sections.story && config.sectionConfigs?.story?.showInNavBar !== false) {
    navLinks.push({ label: t('nav.story', 'Our Story'), id: 'story-intro' });
  }

  (config.sectionOrder || []).forEach((sectionName) => {
    const name = sectionName.toLowerCase();
    if (name === 'savethedate' && sections.saveTheDate && config.sectionConfigs?.savethedate?.showInNavBar !== false) {
      navLinks.push({ label: t('nav.calendar', 'Calendar'), id: 'calendar' });
    } else if (name === 'timeline' && sections.timeline && config.sectionConfigs?.timeline?.showInNavBar !== false) {
      navLinks.push({ label: t('nav.timeline', 'Timeline'), id: 'timeline' });
    } else if (name === 'gallery' && sections.gallery && config.sectionConfigs?.gallery?.showInNavBar !== false) {
      navLinks.push({ label: t('nav.gallery', 'Gallery'), id: 'gallery' });
    } else if (name === 'location' && sections.location && config.sectionConfigs?.location?.showInNavBar !== false) {
      navLinks.push({ label: t('nav.location', 'Location'), id: 'location' });
    } else if (name === 'memoryshare' && sections.memoryShare && config.sectionConfigs?.memoryshare?.showInNavBar !== false) {
      navLinks.push({ label: config.sectionConfigs?.memoryshare?.title?.[language] || t('memoryShare.label', 'Share Memory'), id: 'memories' });
    } else if (name === 'guestbook' && sections.guestbook && config.sectionConfigs?.guestbook?.showInNavBar !== false) {
      navLinks.push({ label: config.sectionConfigs?.guestbook?.title?.[language] || t('nav.guestbook', 'Guestbook'), id: 'guestbook' });
    }
  });

  const hasRsvpLink = sections.rsvpForm && config.sectionConfigs?.rsvpform?.showInNavBar !== false;

  return (
    <div className="min-h-screen text-brand-primary relative linen-texture selection:bg-brand-accent/20 selection:text-brand-accent">
      
      <AudioPlayer />
      <GoogleAnalytics />

      {/* Elegant Floating Bottom Status Bar */}
      <div className="fixed bottom-6 left-6 z-40 bg-brand-primary/95 backdrop-blur-md text-white border border-[#E5E2D9]/25 px-4 py-2.5 rounded-full text-[10px] sm:text-xs font-sans tracking-widest shadow-xl flex items-center gap-3 animate-fade-in">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-serif select-none hidden sm:inline text-brand-gold font-bold">
          {groom} &amp; {bride} • 2026 {language === 'am' ? 'መስከረም' : 'Sept'} 20
        </span>
        {multilingualEnabled && (
          <>
            <div className="h-3 w-[1px] bg-[#E5E2D9]/25 hidden sm:block" />
            <div className="flex items-center gap-2">
              {(config.multilingual?.languages || []).map((langObj: any, index: number) => (
                <React.Fragment key={langObj.code}>
                  {index > 0 && <span className="text-gray-600">/</span>}
                  <button 
                    onClick={() => setLanguage(langObj.code)} 
                    className={`transition-all font-bold cursor-pointer ${language === langObj.code ? 'text-brand-gold scale-105' : 'text-gray-400 hover:text-white'}`}
                  >
                    {langObj.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sticky Top Header with Responsive Navigation links */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 border-b ${
          scrolled
            ? 'bg-brand-cream/95 backdrop-blur-md border-brand-gold/15 shadow-md py-4'
            : 'bg-transparent border-transparent py-6 text-brand-cream'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`font-serif text-2xl tracking-widest font-bold transition-colors duration-300 focus:outline-none cursor-pointer ${
              scrolled ? 'text-brand-primary' : 'text-brand-cream'
            }`}
          >
            {config.monagramInitials || 'A&K'}
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`font-sans text-[10px] uppercase tracking-[0.25em] font-bold transition-all duration-300 hover:text-brand-gold focus:outline-none cursor-pointer relative after:absolute after:bottom-[-4px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-brand-gold after:transition-all hover:after:w-full ${
                  scrolled ? 'text-brand-primary/80' : 'text-brand-cream/80'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            {multilingualEnabled && (
              <div className="flex items-center gap-1.5 border-r border-[#E5E2D9]/30 pr-5">
                {(config.multilingual?.languages || []).map((langObj: any, index: number) => (
                  <React.Fragment key={langObj.code}>
                    {index > 0 && (
                      <span className={scrolled ? 'text-brand-primary/30 text-[10px]' : 'text-brand-cream/30 text-[10px]'}>|</span>
                    )}
                    <button
                      onClick={() => setLanguage(langObj.code)}
                      className={`font-sans text-[10px] tracking-widest font-bold transition-all cursor-pointer ${
                        language === langObj.code 
                          ? 'text-brand-gold underline decoration-brand-gold underline-offset-4' 
                          : scrolled ? 'text-brand-primary/50 hover:text-brand-primary' : 'text-brand-cream/50 hover:text-brand-cream'
                      }`}
                    >
                      {langObj.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}

            {hasRsvpLink && (
              <button
                onClick={() => handleNavClick('rsvp')}
                className={`px-6 py-2.5 rounded-full font-sans text-[10px] uppercase tracking-widest font-bold transition-all duration-300 shadow-sm hover:shadow active:scale-98 cursor-pointer ${
                  scrolled
                    ? 'bg-brand-primary text-brand-cream hover:bg-brand-accent'
                    : 'bg-brand-cream text-brand-primary hover:bg-brand-gold hover:text-brand-primary'
                }`}
              >
                {t('nav.rsvp', 'RSVP')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            {multilingualEnabled && (
              <button
                onClick={() => {
                  const langs = (config.multilingual?.languages || []);
                  const currentIdx = langs.findIndex((l: any) => l.code === language);
                  const nextIdx = (currentIdx + 1) % langs.length;
                  if (langs[nextIdx]) {
                    setLanguage(langs[nextIdx].code);
                  }
                }}
                className={`font-sans text-[10px] tracking-widest font-bold border border-current rounded-full px-2.5 py-1 ${
                  scrolled ? 'text-brand-primary' : 'text-brand-cream'
                }`}
              >
                {(() => {
                  const langs = (config.multilingual?.languages || []);
                  const currentIdx = langs.findIndex((l: any) => l.code === language);
                  const nextIdx = (currentIdx + 1) % langs.length;
                  return langs[nextIdx]?.label || 'LANG';
                })()}
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className={`w-6 h-6 ${scrolled ? 'text-brand-primary' : 'text-brand-cream'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? 'text-brand-primary' : 'text-brand-cream'}`} />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 px-8 bg-brand-cream border-b border-brand-gold/15 shadow-xl animate-fade-in text-center flex flex-col gap-5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="font-sans text-xs uppercase tracking-widest font-bold text-brand-primary/80 hover:text-brand-accent focus:outline-none py-1 block cursor-pointer"
              >
                {link.label}
              </button>
            ))}

            {hasRsvpLink && (
              <div className="pt-4 border-t border-brand-primary/5">
                <button
                  onClick={() => handleNavClick('rsvp')}
                  className="w-full bg-brand-primary text-brand-cream hover:bg-brand-accent py-3.5 rounded-full font-sans text-xs uppercase tracking-widest font-bold transition-colors shadow-md cursor-pointer"
                >
                  {t('nav.rsvpQuick', 'RSVP Now')}
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <main>
        <Hero />
        <Intro />
        {(() => {
          const activeSections = (config.sectionOrder || []).filter((sectionName) => {
            const name = sectionName.toLowerCase();
            switch (name) {
              case 'countdown':
                return !!config.sections?.countdown;
              case 'videopreview':
                return !!(config.sections?.videoPreview && config.youtubeVideoId);
              case 'gallery':
                return !!config.sections?.gallery;
              case 'timeline':
                return !!config.sections?.timeline;
              case 'savethedate':
                return !!config.sections?.saveTheDate;
              case 'location':
                return !!config.sections?.location;
              case 'memoryshare':
                return !!config.sections?.memoryShare;
              case 'guestbook':
                return !!config.sections?.guestbook;
              case 'rsvpform':
                return !!config.sections?.rsvpForm;
              default:
                return false;
            }
          });

          return activeSections.map((sectionName, index) => {
            const name = sectionName.toLowerCase();
            const bgClass = index % 2 === 0 ? 'bg-brand-cream-dark' : 'bg-brand-cream';

            switch (name) {
              case 'countdown':
                return <Countdown key="countdown" bgClass={bgClass} />;
              case 'videopreview':
                return <VideoPreview key="videopreview" bgClass={bgClass} />;
              case 'gallery':
                return <Gallery key="gallery" bgClass={bgClass} />;
              case 'timeline':
                return <Timeline key="timeline" bgClass={bgClass} />;
              case 'savethedate':
                return <SaveTheDate key="savethedate" bgClass={bgClass} />;
              case 'location':
                return <LocationMap key="location" bgClass={bgClass} />;
              case 'memoryshare':
                return <MemoryShare key="memoryshare" bgClass={bgClass} />;
              case 'guestbook':
                return <Guestbook key="guestbook" bgClass={bgClass} />;
              case 'rsvpform':
                return <RsvpForm key="rsvpform" bgClass={bgClass} />;
              default:
                return null;
            }
          });
        })()}
      </main>

      <footer className="bg-brand-primary text-brand-cream/80 border-t border-brand-gold/15 py-16 px-6 text-center space-y-6">
        <Heart className="w-8 h-8 text-brand-gold mx-auto animate-pulse" />
        
        <h2 className="font-serif text-3xl text-brand-cream tracking-normal font-light">
          {groom} <span className="font-sans text-[#E5E2D9] text-base align-middle font-light">{t('common.and', 'and')}</span> {bride}
        </h2>
        
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-brand-gold font-bold">
          {weddingDate} • {venueName}
        </p>

        <div className="h-[1px] w-24 bg-brand-gold/20 mx-auto" />

        <p className="font-body text-xs text-brand-cream/60 max-w-sm mx-auto leading-relaxed">
          {language === 'am'
            ? 'በደስታችን ቀን መገኘታችሁ ትልቅ ክብር አለው። የቃል ኪዳን ስነ-ስርዓታችን በጋራ እናከብር ዘንድ በፍቅር ተጋብዘዋል።'
            : 'Designed with love. We cannot wait to celebrate our eternal union with all of our beloved friends and family. Thank you for being a part of our story!'
          }
        </p>
        
        <p className="font-sans text-[10px] uppercase tracking-wider text-brand-cream/45 pt-4">
          <a
            href="https://github.com/TadiosAbebe/wedding-invitation-and-rsvp-portal"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-gold transition-colors duration-200 underline decoration-brand-gold/30 underline-offset-4"
          >
            {language === 'am' 
              ? 'ይህ ሲስተም ነፃ እና ክፍት ምንጭ ነው - በGitHub ያግኙት' 
              : 'Open Source & Reusable — View on GitHub'
            }
          </a>
        </p>
      </footer>

      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-brand-cream flex flex-col items-center justify-center pointer-events-auto select-none"
          >
            <div className="absolute inset-0 linen-texture opacity-40 pointer-events-none" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="text-center space-y-4 px-6 relative z-10"
            >
              <div className="relative flex justify-center">
                {/* Micro-sparkle circles in gold */}
                <span className="absolute -top-1 -left-1 w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
                <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 rounded-full bg-brand-accent animate-ping delay-300" />
                <div className="w-12 h-12 rounded-full border border-brand-gold/30 flex items-center justify-center animate-spin duration-3000">
                  <Heart className="w-5 h-5 text-brand-accent animate-pulse" />
                </div>
              </div>
              <p className="font-serif text-lg text-brand-primary tracking-widest italic antialiased">
                {config.monagramInitials || 'A&K'}
              </p>
              <div className="h-[1px] w-12 bg-brand-gold/30 mx-auto" stroke-width="0.5" />
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-brand-primary/60 font-bold animate-pulse">
                {language === 'am' ? 'Translating page...' : 'የቋንቋ ልውውጥ በማድረግ ላይ...'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
