'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function HomeClient() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    q: '',
    lieu: '',
    categorie: '',
    prixMin: '',
    prixMax: '',
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log('➡️ Calling API at', process.env.NEXT_PUBLIC_API_URL);
    api.get('/listings')
      .then(res => console.log('✅ Listings:', res.data))
      .catch(err => console.error('❌ Error:', err));
  }, []);
  

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const query = searchParams.toString();
        const res = await api.get(`/listings${query ? '?' + query : ''}`);
        console.log('Résultat fetch:', res);
        setListings(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchListings();
  }, [searchParams]);

  const handleFilter = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    router.push(`/?${params.toString()}`);
  };

  console.log('baseURL:', process.env.NEXT_PUBLIC_API_URL);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">Filtrer les annonces</h1>
        <form onSubmit={handleFilter} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <input type="text" placeholder="Recherche" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} className="p-2 border rounded" />
          <select value={filters.lieu} onChange={(e) => setFilters({ ...filters, lieu: e.target.value })} className="p-2 border rounded">
            <option value="">Lieu</option>
            <option value="paris">Paris</option>
            <option value="lyon">Lyon</option>
            <option value="marseille">Marseille</option>
          </select>
          <select value={filters.categorie} onChange={(e) => setFilters({ ...filters, categorie: e.target.value })} className="p-2 border rounded">
            <option value="">Catégorie</option>
            <option value="meubles">Meubles</option>
            <option value="électronique">Électronique</option>
            <option value="vêtements">Vêtements</option>
          </select>
          <input type="number" placeholder="Prix min" value={filters.prixMin} onChange={(e) => setFilters({ ...filters, prixMin: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Prix max" value={filters.prixMax} onChange={(e) => setFilters({ ...filters, prixMax: e.target.value })} className="p-2 border rounded" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Appliquer les filtres
          </button>
        </form>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-6">Annonces disponibles</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="border p-4 rounded shadow bg-white">
              {listing.image && (
                <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover rounded mb-2" />
              )}
              <h2 className="text-lg font-semibold">{listing.title}</h2>
              <p className="text-sm text-gray-600">{listing.description}</p>
              <p className="mt-2 font-bold">{listing.price} €</p>
              <p className="text-xs text-gray-500">Par : {listing.user.email}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
