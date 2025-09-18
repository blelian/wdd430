import '@/app/ui/global.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';  // keep this import

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Global metadata with title template
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',  // %s = page-specific title
    default: 'Acme Dashboard',         // fallback if page doesn't set a title
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
