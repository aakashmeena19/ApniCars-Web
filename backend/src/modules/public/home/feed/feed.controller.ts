import { Request, Response } from 'express';
import { sendSuccess } from '@/core/utils/sendResponse';
import { getPublicHomeFeed } from './feed.service';

export async function getHomeFeed(_req: Request, res: Response) {
  const feed = await getPublicHomeFeed();
  return sendSuccess(res, feed, 'Homepage feed fetched successfully');
}
