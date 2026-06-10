import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'Recipe Home',
  description: 'Discover delicious recipes for every occasion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen bg-amber-50">{children}</body>
    </html>
  );
}
