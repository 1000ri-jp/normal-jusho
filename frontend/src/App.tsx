import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { UseCases } from './components/UseCases';
import { Usage } from './components/Usage';
import { Footer } from './components/Footer';
import { ApiDocs } from './components/ApiDocs';
import { Status } from './components/Status';
import './index.css';

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <Features />
        <UseCases />
        <Usage />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<ApiDocs />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
