import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HeroSection, MarqueeSection, AboutSection, ServicesSection, ProjectsSection, ContactSection } from './components/Sections';
import PricingSection from './components/PricingSection';
import Admin from './pages/Admin';

function MainApp() {
  return (
    <main className="min-h-screen bg-[#0C0C0C] overflow-x-clip">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <PricingSection />
      <ProjectsSection />
      <ContactSection />
      <footer className="bg-[#0C0C0C] px-6 py-10 text-center opacity-40 text-[10px] uppercase tracking-[0.3em] font-medium border-t border-[#D7E2EA]/5">
        &copy; {new Date().getFullYear()} SAMIUL &mdash; 3D CREATOR & WEB DEVELOPER
      </footer>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin" element={<Admin />} />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

