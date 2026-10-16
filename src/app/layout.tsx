import type { Metadata } from 'next';
import { JetBrains_Mono, Roboto } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const roboto = Roboto({subsets:['latin'],variable:'--font-sans'});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Amonite | The 3D Studio for Minimalist Interior Decor',
  description:
    'Procedural 3D studio for bespoke minimalist vases, ribbed planters, and ceramic decor. Instant watertight STL export for clay 3D printing, resin, and continuous vase mode.',
  keywords: [
    '3d vase studio',
    'ceramic 3d printing',
    'vase mode cad',
    'clay shrinkage calculator',
    'minimalist interior decor',
    'parametric planter',
    'watertight stl',
  ],
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
      className={cn("dark", "h-full", "antialiased", jetbrainsMono.variable, "font-sans", roboto.variable)}
    >
      <body className="min-h-full flex flex-col bg-[#08090b] text-slate-200">
        {children}
      </body>
    </html>
  );
}
