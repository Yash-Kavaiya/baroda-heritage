import Navbar from "./components/UI/Navbar";
import Footer from "./components/Website/Footer";
import PlacesGridSection from "./components/Website/PlacesGridSection";

export default function App() {
  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <PlacesGridSection />
      </main>
      <Footer />
    </div>
  );
}
