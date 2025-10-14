import React from 'react';

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <p>© {new Date().getFullYear()} CRAG GLOBAL. All rights reserved.</p>
    </footer>
  );
}

export default Footer;