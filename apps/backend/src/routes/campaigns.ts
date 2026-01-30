import { Router, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam, validateCampaignFields } from '../utils/helpers.js';
import { AuthRequest, requireAuth } from '../auth.js';

const router: IRouter = Router();

// GET /api/campaigns - List all campaigns
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    const user = req.user;
    if (!user || !user.sponsorId) {
      res.status(401).json({ error: 'Unauthorized: Only sponsors can access campaigns' });
      return;
    }

    const campaigns = await prisma.campaign.findMany({
      where: {
        ...(status && { status: status as string as 'ACTIVE' | 'PAUSED' | 'COMPLETED' }),
        ...(user.sponsorId && { sponsorId: getParam(user.sponsorId) }),
      },
      include: {
        sponsor: { select: { id: true, name: true, logo: true } },
        _count: { select: { creatives: true, placements: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!campaigns) {
      return res.status(404).json({ error: 'No campaigns found' });
    }

    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// GET /api/campaigns/:id - Get single campaign with details
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const user = req.user;
    if (!user || !user.sponsorId) {
      res.status(401).json({ error: 'Unauthorized: Only sponsors can access campaigns' });
      return;
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id, sponsorId: user.sponsorId },
      include: {
        sponsor: true,
        creatives: true,
        placements: {
          include: {
            adSlot: true,
            publisher: { select: { id: true, name: true, category: true } },
          },
        },
      },
    });

    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// POST /api/campaigns - Create new campaign
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      budget,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
      sponsorId,
    } = req.body;

    const postValidationError = validateCampaignFields(req.body);
    if (postValidationError) {
      res.status(400).json({ error: postValidationError });
      return;
    }

    const user = req.user;
    if (!user || !user.sponsorId) {
      res.status(401).json({ error: 'Unauthorized: Only sponsors can create campaigns' });
      return;
    }

    if (sponsorId !== user.sponsorId) {
      res.status(403).json({ error: 'Forbidden: Cannot create campaign for another sponsor' });
      return;
    }

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        targetCategories: targetCategories || [],
        targetRegions: targetRegions || [],
        sponsorId,
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// PUT /api/campaigns/:id - Update campaign details (name, budget, dates, status, etc.)
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const user = req.user;
    if (!user || !user.sponsorId) {
      res.status(401).json({ error: 'Unauthorized: Only sponsors can access campaigns' });
      return;
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        sponsor: { userId: req.user!.id }, // Ownership check
      },
    });

    if (!campaign) {
      // Returns 404 for both "not found" and "not owned"
      // This is correct - don't reveal if resource exists
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.sponsorId !== user.sponsorId) {
      res.status(403).json({ error: 'Forbidden: Cannot update campaign for another sponsor' });
      return;
    }

    const {
      name,
      description,
      budget,
      spent,
      cpmRate,
      cpcRate,
      startDate,
      endDate,
      targetCategories,
      targetRegions,
      status,
    } = req.body;

    const putValidationError = validateCampaignFields(req.body);
    if (putValidationError) {
      return res.status(400).json({ error: putValidationError });
    }

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        description,
        budget,
        cpmRate,
        cpcRate,
        spent,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        targetCategories: targetCategories || [],
        targetRegions: targetRegions || [],
        status,
      },
      include: {
        sponsor: { select: { id: true, name: true } },
      },
    });

    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// DELETE /api/campaigns/:id - Delete a campaign
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = getParam(req.params.id);

    const user = req.user;
    if (!user || !user.sponsorId) {
      res.status(401).json({ error: 'Unauthorized: Only sponsors can access campaigns' });
      return;
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        id,
        sponsor: { userId: req.user!.id }, // Ownership check
      },
    });

    if (!campaign) {
      // Returns 404 for both "not found" and "not owned"
      // This is correct - don't reveal if resource exists
      return res.status(404).json({ error: 'Campaign not found' });
    }

    if (campaign.sponsorId !== user.sponsorId) {
      res.status(403).json({ error: 'Forbidden: Cannot delete campaign for another sponsor' });
      return;
    }

    await prisma.campaign.delete({
      where: { id },
    });
    res.status(204).json('Campaign deleted successfully');
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

export default router;
