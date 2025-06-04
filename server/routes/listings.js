const express = require('express');
const prisma = require('../prisma/client');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'safemarket',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });


// Middleware d’authentification
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// Schéma de validation
const listingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.string().min(1),
  location: z.string().min(1),
  image: z.string().url().optional().nullable(), // ✅ AJOUTER ICI
});

// Créer une annonce
router.post('/', auth, async (req, res) => {
  try {
    const data = listingSchema.parse(req.body);
    const listing = await prisma.listing.create({
      data: {
        ...data,
        userId: req.user.userId,
      },
    });
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lire toutes les annonces
router.get('/', async (req, res) => {
  const listings = await prisma.listing.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(listings);
});

router.get('/me', auth, async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du chargement des annonces.' });
  }
});

// Lire une annonce
router.get('/:id', async (req, res) => {
  const listing = await prisma.listing.findUnique({
    where: { id: req.params.id },
    include: { user: { select: { email: true } } },
  });
  if (!listing) return res.status(404).json({ error: 'Annonce non trouvée' });
  res.json(listing);
});

// Modifier une annonce (propriétaire uniquement)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const existing = await prisma.listing.findUnique({
      where: { id: req.params.id },
    });

    if (!existing || existing.userId !== req.user.userId) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const data = listingSchema.partial().parse(req.body);

    // Si un fichier image est envoyé, on récupère l'URL
    if (req.file && req.file.path) {
      data.image = req.file.path;
    }

    const updated = await prisma.listing.update({
      where: { id: req.params.id },
      data,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});


// Supprimer une annonce
router.delete('/:id', auth, async (req, res) => {
  const existing = await prisma.listing.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.userId !== req.user.userId)
    return res.status(403).json({ error: 'Non autorisé' });

  await prisma.listing.delete({ where: { id: req.params.id } });
  res.json({ message: 'Annonce supprimée' });
});


module.exports = router;
