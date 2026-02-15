import React from 'react';
import { useDevice } from '../context/DeviceContext.jsx';

export default function Footer() {
  const { isMobile } = useDevice();

  // On mobile, footer is replaced by MobileNavBar
  if (isMobile) return null;

  return (
    <footer className="bg-[#fff6f4] border-t border-[#ffd6d2] mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff5e5b] to-[#ff7a77] flex items-center justify-center text-white font-semibold text-xs">
              A
            </div>
            <span className="font-semibold text-sm text-[#1a1a1a]">
              <span className="text-[#ff5e5b]">ABiz</span>
            </span>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-xs font-medium text-muted mb-0.5">Contact</p>
            <a
              href="mailto:teambizai@gmail.com"
              className="text-xs text-[#ff5e5b] hover:underline"
            >
              teambizai@gmail.com
            </a>
          </div>
        </div>
        <div className="border-t border-[#ffd6d2] mt-4 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted">
          <p>© 2026 BizAI · Naga Shiva D, Kaushal Reddy S, Ranjith Raja B, Shivani R</p>
          <p>Ethical news · Transparent sources · Go Green</p>
        </div>
      </div>
    </footer>
  );
}
