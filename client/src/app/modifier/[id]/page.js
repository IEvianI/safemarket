'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../lib/api';

export default function ModifierAnnonce() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchAnnonce = async () => {
      try {
        const res = await api.get(`/listings/${params.id}`);
        const { title, description, price, location, category, image } = res.data;
        setForm({ title, description, price, location, category, image });
      } catch (err) {
        console.error(err);
        router.replace('/mes-annonces');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnonce();
  }, [params.id, router]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log('URL image Cloudinary:', data.url);
      setForm((prev) => ({ ...prev, image: data.url }));
    } catch (err) {
      alert("Erreur lors de l'upload de l'image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/listings/${params.id}`, {
        ...form,
        price: parseFloat(form.price),
        image: form.image ?? '',
      });
      router.push('/mes-annonces');
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la modification');
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Modifier l’annonce</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded"
        />
        {form.image && (
          <img
            src={form.image}
            alt="Aperçu"
            className="w-full h-48 object-cover rounded"
          />
        )}
        <input
          type="text"
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Prix"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Lieu"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
