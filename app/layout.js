import { Space_Grotesk, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'Unnaidee',
  description: 'ของดีจาก Shopee ที่คัดมาให้แล้ว',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="bg-bg text-ink font-body">{children}</body>
    </html>
  );
}
