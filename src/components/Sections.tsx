import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Instagram, Twitter, MessageSquare, Send, MapPin, ExternalLink } from 'lucide-react';
import FadeIn from './FadeIn';
import Magnet from './Magnet';
import { ContactButton, LiveProjectButton } from './Buttons';
import AnimatedText from './AnimatedText';
import { subscribeCollection, subscribeDocument } from '../services/dataService';
import { Project, Service, SiteSettings } from '../types';

// --- Constants (Fallback/Initial) ---

const MARQUEE_IMAGES = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const SERVICES = [
  { id: "01", name: "Web Design", description: "Clean, modern, and conversion-focused website designs crafted to reflect your brand identity. We focus on user experience, layout, and visual hierarchy to ensure your visitors stay engaged and take action." },
  { id: "02", name: "Web Development", description: "High-performance, scalable websites built with clean code and modern technologies. From business sites to custom solutions, we develop platforms that are fast, secure, and ready to grow with your business." },
  { id: "03", name: "Branding", description: "Building strong and memorable brand identities—from logo design to complete brand systems—that clearly communicate your vision and make your business stand out in a competitive market." },
  { id: "04", name: "3D & Visual Design", description: "Creation of high-quality 3D visuals, product mockups, and creative assets that enhance your brand presentation and give your business a premium, modern look." },
  { id: "05", name: "Motion Design", description: "Engaging animations and motion graphics that bring your brand and content to life, helping you capture attention and communicate your message more effectively." },
  { id: "06", name: "Website Growth, SEO & Security", description: "We don’t just build websites—we help them grow. Our service includes search engine optimization (SEO) to increase visibility, performance optimization, and advanced website security to keep your platform safe, stable, and reliable at all times." },
];

const PROJECTS = [
  {
    id: "01",
    name: "Nextlevel Studio",
    category: "Client",
    images: {
      col1_1: "https://i.imgur.com/67VMLgO.png",
      col1_2: "https://i.imgur.com/u2Gs2Rl.png",
      col2: "https://i.imgur.com/8XRZ94X.png"
    }
  },
  {
    id: "02",
    name: "Aura Brand Identity",
    category: "Personal",
    images: {
      col1_1: "https://i.imgur.com/COOaUgE.png",
      col1_2: "https://i.imgur.com/RHDS0h7.png",
      col2: "https://i.imgur.com/CvNFgTI.png"
    }
  },
  {
    id: "03",
    name: "Solaris Digital",
    category: "Client",
    images: {
      col1_1: "https://i.imgur.com/33KdQBI.png",
      col1_2: "https://i.imgur.com/rI8rzm0.png",
      col2: "https://i.imgur.com/eSGkTSp.png"
    }
  }
];

// --- Sections ---

export function HeroSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsub = subscribeDocument<SiteSettings>('settings', 'global', setSettings);
    return () => unsub();
  }, []);

  return (
    <section className="relative h-screen w-full flex flex-col overflow-x-clip px-6 md:px-10">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} as="nav" className="flex justify-between items-center py-6 md:py-8 z-50">
        {[
          { name: "About", href: "#about" },
          { name: "Projects", href: "#projects" },
          { name: "Contact", href: "#contact" }
        ].map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-sm md:text-lg lg:text-[1.4rem] font-medium uppercase tracking-wider text-[#D7E2EA] hover:opacity-70 transition-opacity duration-200"
          >
            {link.name}
          </a>
        ))}
      </FadeIn>

      {/* Hero Heading */}
      <div className="flex-1 flex flex-col justify-start pt-20 sm:pt-0 sm:justify-center relative z-10">
        <div className="overflow-hidden w-full text-center sm:text-left">
          <FadeIn delay={0.15} y={40} as="h1" className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[13vw] sm:text-[13vw] md:text-[14vw] lg:text-[14.5vw] mt-6 sm:mt-4 md:-mt-10">
            {settings?.heroText || "Hi, i'm samiul"}
          </FadeIn>
        </div>
      </div>

      {/* Portrait */}
      <div className="absolute left-1/2 -translate-x-1/2 z-20 w-[280px] sm:w-[440px] md:w-[560px] lg:w-[680px] bottom-20 sm:bottom-0 sm:top-auto sm:translate-y-0">
        <FadeIn delay={0.6} y={30}>
          <Magnet padding={150} strength={3}>
            {/* Shadow Glow behind character */}
            <div className="absolute inset-0 bg-black/40 blur-[100px] rounded-full scale-75 -z-10 translate-y-10" />
            <img
              src="https://i.imgur.com/bd70B1j.png"
              alt="Portrait"
              className="w-full h-auto pointer-events-none drop-shadow-[0_45px_100px_rgba(0,0,0,0.8)] relative"
            />
          </Magnet>
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 relative z-30">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]" style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}>
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

export function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const offset = (window.scrollY - top + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const row1 = [...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11), ...MARQUEE_IMAGES.slice(0, 11)];
  const row2 = [...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11), ...MARQUEE_IMAGES.slice(11)];

  return (
    <section ref={sectionRef} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden select-none">
      <div className="flex flex-col gap-3">
        {/* Row 1 */}
        <div 
          className="flex gap-3 whitespace-nowrap"
          style={{ 
            transform: `translateX(${scrollOffset - 200}px)`,
            willChange: 'transform'
          }}
        >
          {row1.map((src, i) => (
            <img 
              key={i} 
              src={src} 
              alt="" 
              loading="lazy"
              className="w-[300px] md:w-[420px] h-[190px] md:h-[270px] rounded-2xl object-cover shrink-0" 
            />
          ))}
        </div>
        {/* Row 2 */}
        <div 
          className="flex gap-3 whitespace-nowrap"
          style={{ 
            transform: `translateX(${- (scrollOffset - 200)}px)`,
            willChange: 'transform'
          }}
        >
          {row2.map((src, i) => (
            <img 
              key={i} 
              src={src} 
              alt="" 
              loading="lazy"
              className="w-[300px] md:w-[420px] h-[190px] md:h-[270px] rounded-2xl object-cover shrink-0" 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsub = subscribeDocument<SiteSettings>('settings', 'global', setSettings);
    return () => unsub();
  }, []);

  const defaultAboutText = "We are a results-driven web development team focused on helping businesses grow through powerful digital experiences. Our approach combines strategic thinking, modern design, and clean development to build websites that don’t just look impressive—but actually perform.\n\nWe specialize in website design and development tailored to each brand’s identity, ensuring a strong online presence that builds trust and drives engagement. From sleek landing pages to fully functional business platforms, every project is crafted with precision, usability, and scalability in mind.\n\nBeyond just building websites, we help businesses establish and shape their brand in the digital space. Whether you're launching something new or upgrading an existing presence, we work to create a foundation that supports long-term growth and visibility.\n\nOur goal is simple: to turn ideas into impactful digital products that elevate your business and help you stand out in a competitive market.";

  const paragraphs = (settings?.aboutText || defaultAboutText).split('\n\n');

  return (
    <section id="about" className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20 overflow-hidden">
      {/* Decorative 3D images */}
      <FadeIn delay={0.1} x={-80} duration={0.9} className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-0">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" className="w-[120px] sm:w-[160px] md:w-[210px]" alt="moon" />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-0">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" className="w-[100px] sm:w-[140px] md:w-[180px]" alt="obj1" />
      </FadeIn>
      <FadeIn delay={0.15} x={80} duration={0.9} className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-0">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" className="w-[120px] sm:w-[160px] md:w-[210px]" alt="lego" />
      </FadeIn>
      <FadeIn delay={0.3} x={80} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-0">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" className="w-[130px] sm:w-[170px] md:w-[220px]" alt="obj2" />
      </FadeIn>

      <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 z-10 w-full max-w-[900px]">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-8 md:gap-10">
          {paragraphs.map((p, i) => (
            <div key={i}>
              <AnimatedText 
                text={p}
                className="text-[#D7E2EA] font-medium leading-relaxed text-center text-sm sm:text-base md:text-lg lg:text-xl opacity-80"
              />
            </div>
          ))}
        </div>

        <FadeIn delay={0} y={40} className="mt-6 sm:mt-8">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const unsub = subscribeCollection<Service>('services', (data) => {
      setServices(data.sort((a, b) => a.order - b.order));
    });
    return () => unsub();
  }, []);

  const displayServices = services.length > 0 ? services : SERVICES;

  return (
    <section id="service" className="bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Services
        </h2>

        <div className="w-full flex flex-col">
          {displayServices.map((service, i) => (
            <FadeIn delay={i * 0.1} key={service.id} className="border-t border-[rgba(12, 12, 12, 0.15)] last:border-b py-8 sm:py-10 md:py-12">
              <div className="flex flex-col md:flex-row gap-6 md:gap-16 items-start md:items-center">
                <motion.span 
                  initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
                  whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 100, 
                    damping: 10,
                    delay: i * 0.1 + 0.3 
                  }}
                  className="font-black text-[#0C0C0C] leading-none shrink-0 md:mr-4" 
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 120px)' }}
                >
                  {service.id}
                </motion.span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium uppercase text-[#0C0C0C]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                    {service.name}
                  </h3>
                  <p className="font-light text-[#0C0C0C] opacity-60 leading-relaxed max-w-2xl" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index, totalCards, progress }: { project: any, index: number, totalCards: number, progress: any }) {
  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  
  // Scoped useScroll is hard here because we want global page progress
  // But we can simplify by just using index based scaling or separate scroll tracks
  // The request says "sticky-stacking project cards that scale down as you scroll past them"
  
  return (
    <div 
      className="sticky top-24 md:top-32 min-h-[60vh] md:h-[85vh] w-full"
      style={{ top: `${index * 28 + 96}px` }}
    >
      <motion.div 
        className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 h-full flex flex-col shadow-2xl transition-colors duration-500 hover:border-[#D7E2EA]/80 overflow-hidden group"
        initial={{ scale: 1 }}
        whileHover={{ 
          scale: targetScale + 0.02,
          y: -15,
          boxShadow: "0 60px 120px -20px rgba(0,0,0,0.8)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ scale: targetScale }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span className="font-black text-[#D7E2EA] leading-none" style={{ fontSize: 'clamp(2.5rem, 8vw, 120px)' }}>
              {project.id}
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest opacity-60 mb-1">{project.category}</span>
              <h3 className="font-medium uppercase text-[#D7E2EA]" style={{ fontSize: 'clamp(1.2rem, 3vw, 2.5rem)' }}>
                {project.name}
              </h3>
            </div>
          </div>
          <LiveProjectButton href={project.liveLink} />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-[40%_60%] gap-5 sm:gap-6 md:gap-8 overflow-hidden min-h-0">
          <div className="flex flex-col gap-5 sm:gap-6 md:gap-8 h-full overflow-hidden">
            <div className="rounded-[2rem] overflow-hidden shrink-0 shadow-lg shadow-black/20" style={{ height: 'clamp(140px, 18vw, 240px)' }}>
              <motion.img 
                src={project.images.col1_1} 
                alt="" 
                className="w-full h-full object-cover object-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              />
            </div>
            <div className="rounded-[2rem] overflow-hidden flex-1 shadow-lg shadow-black/20" style={{ minHeight: 'clamp(180px, 22vw, 360px)' }}>
              <motion.img 
                src={project.images.col1_2} 
                alt="" 
                className="w-full h-full object-cover object-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              />
            </div>
          </div>
          <div className="h-full rounded-[2rem] overflow-hidden shadow-lg shadow-black/20" style={{ minHeight: 'clamp(280px, 40vw, 100%)' }}>
            <motion.img 
              src={project.images.col2} 
              alt="" 
              className="w-full h-full object-cover object-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ProjectsSection() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    const unsub = subscribeCollection<Project>('projects', (data) => {
      setProjects(data.sort((a, b) => a.order - b.order));
    });
    return () => unsub();
  }, []);

  const displayProjects = projects.length > 0 ? projects : PROJECTS;
  const filteredProjects = displayProjects.filter(p => filter === 'All' || p.category === filter);

  return (
    <section id="projects" className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-30 pb-32">
      <div className="px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 flex flex-col items-center">
        <h2 className="hero-heading font-black uppercase text-center mb-8" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
          Project
        </h2>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-16 sm:mb-20 md:mb-28">
          {['All', 'Client', 'Personal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full border-2 text-xs sm:text-sm uppercase tracking-widest transition-all duration-300 ${
                filter === cat 
                ? 'bg-[#D7E2EA] text-[#0C0C0C] border-[#D7E2EA]' 
                : 'border-[#D7E2EA]/20 text-[#D7E2EA] hover:border-[#D7E2EA]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div ref={containerRef} className="w-full flex flex-col gap-10 md:gap-20">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={`${project.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard 
                  project={project} 
                  index={i} 
                  totalCards={filteredProjects.length}
                  progress={scrollYProgress}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const unsub = subscribeDocument<SiteSettings>('settings', 'global', setSettings);
    return () => unsub();
  }, []);

  const contactData = settings || {
    email: "hamimsamiul7@gmail.com",
    phone1: "+880 1724948188",
    phone2: "+880 1767046073",
    whatsapp: "https://wa.me/message/2WOVEZQU6ARTP1"
  };

  return (
    <section id="contact" className="relative min-h-screen bg-[#0C0C0C] flex flex-col justify-center px-6 md:px-10 py-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#7721B1]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#B600A8]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        
        {/* Left Side: Info & Visual */}
        <div className="flex flex-col gap-14 relative">
          <FadeIn delay={0.1} y={30}>
            <div className="flex flex-col gap-5">
              <span className="text-[#D7E2EA] font-bold uppercase tracking-[0.4em] text-[10px] sm:text-xs opacity-60">Project Inquiry</span>
              <h2 className="hero-heading font-black uppercase text-5xl sm:text-7xl md:text-8xl leading-[0.9] tracking-tighter">
                Let&apos;s build<br />Together.
              </h2>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-10 text-[#D7E2EA]">
            <FadeIn delay={0.2} y={20}>
              <a href={`mailto:${contactData.email}`} className="flex items-center gap-7 group cursor-pointer w-fit">
                <div className="w-16 h-16 rounded-2xl border border-[#D7E2EA]/10 flex items-center justify-center bg-[#D7E2EA]/5 group-hover:bg-[#D7E2EA]/10 group-hover:border-[#D7E2EA]/30 transition-all duration-500 group-hover:scale-105 shadow-lg shadow-black/20">
                  <Mail size={26} className="text-[#D7E2EA]/80 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase opacity-40 font-bold tracking-[0.2em]">Email</span>
                  <span className="text-xl font-medium tracking-tight group-hover:translate-x-1 transition-transform duration-500">{contactData.email}</span>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.3} y={20}>
              <div className="flex items-start gap-7 w-fit">
                <div className="w-16 h-16 rounded-2xl border border-[#D7E2EA]/10 flex items-center justify-center bg-[#D7E2EA]/5 shadow-lg shadow-black/20">
                  <Phone size={26} className="text-[#D7E2EA]/80" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase opacity-40 font-bold tracking-[0.2em]">Phone / WhatsApp</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-medium tracking-tight">{contactData.phone1}</span>
                    <span className="text-xl font-medium tracking-tight">{contactData.phone2}</span>
                  </div>
                </div>
              </div>
            </FadeIn>

            <div className="flex flex-wrap gap-5 pt-4">
              {[
                { icon: Twitter, href: contactData.twitter || "https://x.com/weborix5", label: "X" },
                { icon: Instagram, href: contactData.instagram || "https://www.instagram.com/samiul_web_orix/", label: "Instagram" },
                { icon: MessageSquare, href: contactData.whatsapp || "https://wa.me/message/2WOVEZQU6ARTP1", label: "WhatsApp" }
              ].map((social, i) => (
                <FadeIn key={social.label} delay={0.4 + (i * 0.1)} y={10}>
                  <a 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-14 h-14 rounded-full border border-[#D7E2EA]/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all duration-500 hover:-translate-y-2 shadow-xl shadow-black/40"
                  >
                    <social.icon size={22} />
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Visual character background integration */}
          <div className="absolute -bottom-40 -left-40 opacity-[0.07] pointer-events-none scale-150 -rotate-12 select-none z-[-1]">
             <img src="https://i.imgur.com/bd70B1j.png" alt="" className="w-[800px] grayscale brightness-150" />
          </div>
        </div>

        {/* Right Side: Glass CTA Card */}
        <FadeIn delay={0.3} x={40} className="relative group">
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#7721B1] to-[#B600A8] rounded-[48px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-1000" />
          
          <div className="relative bg-[#1A1A1A]/40 backdrop-blur-2xl border border-[#D7E2EA]/10 p-10 sm:p-16 rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] flex flex-col items-center text-center overflow-hidden">
            {/* Inner highlights */}
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
            
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#D7E2EA]/5 border border-white/[0.05] flex items-center justify-center mb-8 sm:mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-inner">
               <MessageSquare size={40} className="text-[#D7E2EA]/90" />
            </div>

            <h3 className="text-2xl sm:text-5xl font-black text-white uppercase leading-[1.05] mb-6 sm:mb-8 tracking-tighter">
              Elevating ideas.<br />let&apos;s build<br />extraordinary.
            </h3>
            
            <p className="text-[#D7E2EA]/40 text-xs sm:text-base leading-relaxed max-w-[280px] mb-10 sm:mb-12 font-medium">
              Ready to take your business to the next level? reach out via WhatsApp for a quick chat about your project.
            </p>

            <motion.a
              href={contactData.whatsapp || "https://wa.me/message/2WOVEZQU6ARTP1"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-3 transition-all shadow-[0_15px_30px_rgba(255,255,255,0.15)] hover:shadow-[0_25px_50px_rgba(255,255,255,0.25)]"
            >
              Chat on WhatsApp
              <MessageSquare size={20} fill="currentColor" strokeWidth={0} />
            </motion.a>

            <a 
              href={`mailto:${contactData.email}`} 
              className="mt-10 text-[10px] uppercase font-black tracking-[0.4em] text-[#D7E2EA] opacity-20 hover:opacity-100 hover:text-white transition-all duration-500 scale-90 hover:scale-100"
            >
              Or send an email instead
            </a>

            {/* Decorative glass corner highlights */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 blur-2xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-[#7721B1]/10 blur-2xl rounded-full" />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
