import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Amonite CAD | Browser-Based CAD/CAM Micro-SaaS',
  description:
    'High-performance browser-based CAD/CAM workspace. Hardware-accelerated 3D WebGL viewport, parametric solids, client-side math, and instant STL/DXF parsing.',
  icons: {
    icon: '/logo-mark.svg',
    shortcut: '/logo-mark.svg',
    apple: '/logo-mark.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#08090b] text-slate-200">
        {children}
      </body>
    </html>
  );
}
