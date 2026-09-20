import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ClassDataProvider } from '@/context/ClassDataContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InteractivePetBot from '@/components/InteractivePetBot';
import TerminalModal from '@/components/TerminalModal';
import { getCMSData } from '@/lib/storage';

export const metadata: Metadata = {
  title: 'XII TKJ — Teknik Komputer dan Jaringan',
  description: 'Portal resmi kelas XII Teknik Komputer dan Jaringan. Class of 2026/2027.',
  keywords: ['XII TKJ', 'Teknik Komputer dan Jaringan', 'Portal Kelas', 'Class Portal', 'Sekolah'],
  authors: [{ name: 'Keluarga Besar XII TKJ' }],
  openGraph: {
    title: 'XII TKJ — Teknik Komputer dan Jaringan',
    description: 'Portal resmi kelas XII Teknik Komputer dan Jaringan. Class of 2026/2027.',
    url: 'https://tkj-class.vercel.app',
    siteName: 'XII TKJ Class Portal',
    locale: 'id_ID',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getCMSData();

  return (
    <html lang="id" className="dark scroll-smooth" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#161512] text-[#161512] dark:text-[#d8d6c6] transition-colors duration-300">
        <ThemeProvider>
          <ClassDataProvider initialData={initialData}>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            {/* Global Interactive Elements */}
            <InteractivePetBot />
            <TerminalModal />
          </ClassDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
