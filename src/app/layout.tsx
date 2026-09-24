import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ClassDataProvider } from '@/context/ClassDataContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientWidgets from '@/components/ClientWidgets';
import { getCMSData } from '@/lib/storage';

export const metadata: Metadata = {
  title: 'XII TJ — Angkatan 27 | Teknik Komputer dan Jaringan',
  description: 'Portal resmi XII TJ (Teknik Komputer dan Jaringan) Angkatan 27. Wadah kebersamaan, persaudaraan, dan showcase karya teknologi siswa.',
  keywords: ['XII TJ', 'Angkatan 27', 'Teknik Komputer dan Jaringan', 'XII TKJ', 'Portal Kelas', 'Project TKJ'],
  authors: [{ name: 'Keluarga Besar XII TJ Angkatan 27' }],
  openGraph: {
    title: 'XII TJ — Angkatan 27 | Teknik Komputer dan Jaringan',
    description: 'Portal resmi XII TJ (Teknik Komputer dan Jaringan) Angkatan 27. Wadah kebersamaan, persaudaraan, dan showcase karya teknologi siswa.',
    url: 'https://tkj-class.vercel.app',
    siteName: 'XII TJ Angkatan 27 Portal',
    locale: 'id_ID',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getCMSData(true);

  return (
    <html lang="id" className="dark theme-gold scroll-smooth" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-body)' }}>
        <ThemeProvider>
          <ClassDataProvider initialData={initialData}>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            {/* Global Interactive Client Widgets (deferred with ssr: false) */}
            <ClientWidgets />
          </ClassDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
