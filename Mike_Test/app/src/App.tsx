import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import PhilosophySection from './sections/PhilosophySection';
import ProgramsSection from './sections/ProgramsSection';
import ResultsSection from './sections/ResultsSection';
import AboutSection from './sections/AboutSection';
import ContactSection from './sections/ContactSection';

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content - Flowing sections */}
      <main className="relative">
        <HeroSection />
        <PhilosophySection />
        <ProgramsSection />
        <ResultsSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
