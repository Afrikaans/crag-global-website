import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import CoreValues from './components/CoreValues';
import Mission from './components/Mission';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './styles.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Welcome />
        <CoreValues />
        <Mission />
        <Products />
        <Contact />
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
