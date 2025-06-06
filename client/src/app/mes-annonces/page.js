'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function MesAnnoncesPage() {
  const router = useRouter();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/listings/${selectedId}`);
      setAnnonces((prev) => prev.filter((a) => a.id !== selectedId));
      toast.success('Annonce supprimée ✅');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la suppression');
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchUserListings = async () => {
      try {
        const res = await api.get('/listings/me');
        setAnnonces(res.data);
      } catch (err) {
        console.error(err);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [router]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes annonces</h1>
      {annonces.length === 0 ? (
        <p className="text-gray-600">Aucune annonce pour le moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {annonces.map((listing) => (
            <div key={listing.id} className="border p-4 rounded shadow bg-white space-y-2">
              {listing.image && (
  <img
    src={listing.image}
    alt={listing.title}
    className="w-full h-48 object-cover rounded mb-2"
  />
)}
              <h2 className="text-lg font-semibold">{listing.title}</h2>
              <p className="text-sm text-gray-600">{listing.description}</p>
              <p className="mt-2 font-bold">{listing.price} €</p>
              <p className="text-xs text-gray-500">
                Publié le {new Date(listing.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/modifier/${listing.id}`)}
                  className="text-sm px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => {
                    setSelectedId(listing.id);
                    setShowConfirm(true);
                  }}
                  className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Modal de confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">Souhaitez-vous vraiment supprimer cette annonce ?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
