'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export default function RootLayout({ children }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(search)}`);
  };

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 text-gray-900`}
      >
        <Toaster position="top-right" />
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow gap-4 flex-wrap">
          {/* Logo + Accueil */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              SafeMarket
            </Link>
            <Link href="/ajouter" className="text-sm hover:underline">
              Ajouter une annonce
            </Link>
            {isAuth && (
  <Link href="/mes-annonces" className="text-sm hover:underline">
    Mes annonces
  </Link>
)}
          </div>

          {/* Barre de recherche */}
          <form onSubmit={handleSearchSubmit} className="flex-grow max-w-xl mx-auto w-full">
            <input
              type="text"
              placeholder="Rechercher un produit, lieu, catégorie..."
              className="w-full border px-4 py-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Déconnexion */}
          <div>
            {isAuth && (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                Se déconnecter
              </button>
            )}
          </div>
        </header>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
