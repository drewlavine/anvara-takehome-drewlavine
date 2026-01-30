import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam, validateAdSlotsFields } from '../utils/helpers.js';
import { AuthRequest, requireAuth } from '../auth.js';

const router: IRouter = Router();

// GET /api/ad-slots/marketplace - Public endpoint for marketplace (no auth required)
// Returns all available ad slots for browsing by sponsors or unauthenticated users
router.get('/marketplace', async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const adSlots = await prisma.adSlot.findMany({
      where: {
        isAvailable: true, // Only show available slots in marketplace
        ...(type && {
          type: type as string as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST',
        }),
      },
      include: {
        publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
        _count: { select: { placements: true } },
      },
      orderBy: { basePrice: 'desc' },
    });

    res.json(adSlots);
  } catch (error) {
    console.error('Error fetching marketplace ad slots:', error);
    res.status(500).json({ error: 'Failed to fetch ad slots' });
  }
});

// GET /api/ad-slots/marketplace/:id - Public endpoint to get single ad slot details
router.get('/marketplace/:id', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: {
        publisher: { select: { id: true, name: true, website: true, category: true, monthlyViews: true } },
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    res.json(adSlot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    res.status(500).json({ error: 'Failed to fetch ad slot' });
  }
});

// GET /api/ad-slots - List available ad slots (requires auth, filtered by publisher)
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { type, available } = req.query;
    const user = req.user;
    if (!user || !user.publisherId) {
      res.status(401).json({ error: 'Unauthorized: Only publishers can access ad slots' });
      return;
    }

    const adSlots = await prisma.adSlot.findMany({
      where: {
        ...(user.publisherId && { publisherId: getParam(user.publisherId) }),
        ...(type && {
          type: type as string as 'DISPLAY' | 'VIDEO' | 'NATIVE' | 'NEWSLETTER' | 'PODCAST',
        }),
        ...(available === 'true' && { isAvailable: true }),
      },
      include: {
        publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
        _count: { select: { placements: true } },
      },
      orderBy: { basePrice: 'desc' },
    });

    res.json(adSlots);
  } catch (error) {
    console.error('Error fetching ad slots:', error);
    res.status(500).json({ error: 'Failed to fetch ad slots' });
  }
});

// GET /api/ad-slots/:id - Get single ad slot with details
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const user = req.user;
    if (!user || !user.publisherId) {
      res.status(401).json({ error: 'Unauthorized: Only publishers can access ad slots' });
      return;
    }

    const adSlot = await prisma.adSlot.findUnique({
      where: { id, publisherId: user.publisherId },
      include: {
        publisher: true,
        placements: {
          include: {
            campaign: { select: { id: true, name: true, status: true } },
          },
        },
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    res.json(adSlot);
  } catch (error) {
    console.error('Error fetching ad slot:', error);
    res.status(500).json({ error: 'Failed to fetch ad slot' });
  }
});

// POST /api/ad-slots - Create new ad slot
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, type, basePrice, publisherId } = req.body;

    console.log('validating error');
    const postValidationError = validateAdSlotsFields(req.body);
    console.log('post validation error:', postValidationError);
    if (postValidationError) {
      res.status(400).json({ error: postValidationError });
      return;
    }

    const user = req.user;
    if (!user || !user.publisherId) {
      res.status(401).json({ error: 'Unauthorized: Only publishers can create ad slots' });
      return;
    }

    if (publisherId !== user.publisherId) {
      res.status(403).json({ error: 'Forbidden: Cannot create ad slot for another publisher' });
      return;
    }

    const adSlot = await prisma.adSlot.create({
      data: {
        name,
        description,
        type,
        basePrice,
        publisherId,
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(adSlot);
  } catch (error) {
    console.error('Error creating ad slot:', error);
    res.status(500).json({ error: 'Failed to create ad slot' });
  }
});

// POST /api/ad-slots/:id/book - Book an ad slot (simplified booking flow)
// This marks the slot as unavailable and creates a simple booking record
router.post('/:id/book', async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    const { sponsorId, message } = req.body;

    if (!sponsorId) {
      res.status(400).json({ error: 'sponsorId is required' });
      return;
    }

    // Check if slot exists and is available
    const adSlot = await prisma.adSlot.findUnique({
      where: { id },
      include: { publisher: true },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (!adSlot.isAvailable) {
      res.status(400).json({ error: 'Ad slot is no longer available' });
      return;
    }

    // Mark slot as unavailable
    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: false },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    // In a real app, you'd create a Placement record here
    // For now, we just mark it as booked
    console.log(`Ad slot ${id} booked by sponsor ${sponsorId}. Message: ${message || 'None'}`);

    res.json({
      success: true,
      message: 'Ad slot booked successfully!',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error booking ad slot:', error);
    res.status(500).json({ error: 'Failed to book ad slot' });
  }
});

// POST /api/ad-slots/:id/unbook - Reset ad slot to available (for testing)
router.post('/:id/unbook', async (req: Request, res: Response) => {
  try {
    // After looking through all of the code, I came to the conclusion that a string[] will never be passed, so I chose to do an inline type assertion
    const { id } = req.params as { id: string };

    const updatedSlot = await prisma.adSlot.update({
      where: { id },
      data: { isAvailable: true },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Ad slot is now available again',
      adSlot: updatedSlot,
    });
  } catch (error) {
    console.error('Error unbooking ad slot:', error);
    res.status(500).json({ error: 'Failed to unbook ad slot' });
  }
});

// PUT /api/ad-slots/:id - Update ad slot details
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const user = req.user;
    if (!user || !user.publisherId) {
      res.status(401).json({ error: 'Unauthorized: Only publishers can update ad slots' });
      return;
    }

    // Check if ad slot exists and belongs to publisher
    const adSlot = await prisma.adSlot.findFirst({
      where: {
        id,
        publisher: { userId: req.user!.id }, // Ownership check
      },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    if (adSlot.publisherId !== user.publisherId) {
      res.status(403).json({ error: 'Forbidden: Cannot update ad slot for another publisher' });
      return;
    }

    const putValidationError = validateAdSlotsFields(req.body);
    if (putValidationError) {
      return res.status(400).json({ error: putValidationError });
    }

    const {
      name,
      description,
      type,
      position,
      width,
      height,
      basePrice,
      cpmFloor,
      isAvailable,
      publisher,
      placements,
    } = req.body;

    const updatedAdSlot = await prisma.adSlot.update({
      where: { id },
      data: {
        id,
        name,
        description,
        type,
        position,
        width,
        height,
        basePrice,
        cpmFloor,
        isAvailable,
        publisher: publisher,
        placements,
      },
      include: {
        publisher: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Ad slot updated successfully!',
      adSlot: updatedAdSlot,
    });
  } catch (error) {
    console.error('Error updating ad slot:', error);
    res.status(500).json({ error: 'Failed to update ad slot' });
  }
});

// DELETE /api/ad-slots/:id - Delete a campaign
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const user = req.user;
    if (!user || !user.publisherId) {
      res.status(401).json({ error: 'Unauthorized: Only publishers can access ad slots' });
      return;
    }

    const adSlot = await prisma.adSlot.findFirst({
      where: {
        id,
        publisher: { userId: req.user!.id }, // Ownership check
      },
    });

    console.log('adSlot to delete:', adSlot);

    if (!adSlot) {
      // Returns 404 for both "not found" and "not owned"
      return res.status(404).json({ error: 'Ad slot not found' });
    }

    console.log('adSlot publisherId:', adSlot.publisherId, 'user publisherId:', user.publisherId);
    if (adSlot.publisherId !== user.publisherId) {
      res.status(403).json({ error: 'Forbidden: Cannot delete ad slot for another publisher' });
      return;
    }

    await prisma.adSlot.delete({
      where: { id },
    });
    res.status(204).json({ message: 'Ad slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting ad slot:', error);
    res.status(500).json({ error: 'Failed to delete ad slot' });
  }
});

export default router;
