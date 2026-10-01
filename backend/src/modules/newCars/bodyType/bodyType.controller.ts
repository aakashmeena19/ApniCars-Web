// src/modules/newCars/bodyType/bodyType.controller.ts
import { Request, Response } from 'express';
import { ApiError } from '@/core/errors/ApiError';
import { sendSuccess, sendPaginated } from '@/core/utils/sendResponse';
import { buildPublicPath, deleteUploadedFile } from '@/core/utils/fileStorage.util';
import { getClientIp } from '@/core/utils/getClientIp';
import * as bodyTypeService from './bodyType.service';
import {
  bodyTypeListQuerySchema,
  bodyTypeIdParamSchema,
  createBodyTypeSchema,
  updateBodyTypeSchema,
} from './bodyType.validation';

export async function getBodyTypes(req: Request, res: Response) {
  const query = bodyTypeListQuerySchema.parse(req.query);
  const result = await bodyTypeService.listBodyTypes(query);
  return sendPaginated(res, result.items, result.pagination, 'Body types fetched successfully');
}

// GET /body-types/options — lightweight, unpaginated {id, name} list
// for dropdowns.
export async function getBodyTypeOptions(_req: Request, res: Response) {
  const options = await bodyTypeService.listBodyTypeOptions();
  return sendSuccess(res, options, 'Body type options fetched successfully');
}

export async function getBodyTypeById(req: Request, res: Response) {
  const { id } = bodyTypeIdParamSchema.parse(req.params);
  const bodyType = await bodyTypeService.getBodyTypeById(id);
  return sendSuccess(res, bodyType, 'Body type fetched successfully');
}

export async function createBodyType(req: Request, res: Response) {
  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const files = req.files as Record<string, Express.Multer.File[]> | undefined;
  const icon = files?.icon?.[0];
  const upcomingImage = files?.upcomingImage?.[0];

  if (!icon) {
    throw ApiError.badRequest('Icon is required (expected field name "icon")');
  }
  if (!upcomingImage) {
    await deleteUploadedFile(buildPublicPath('bodytypes', icon.filename));
    throw ApiError.badRequest('Upcoming image is required (expected field name "upcomingImage")');
  }

  try {
    const input = createBodyTypeSchema.parse(req.body);
    const bodyType = await bodyTypeService.createBodyType(
      input,
      req.auth.id,
      icon.filename,
      upcomingImage.filename,
      getClientIp(req),
    );
    return sendSuccess(res, bodyType, 'Body type created successfully', 201);
  } catch (err) {
    await Promise.all([
      deleteUploadedFile(buildPublicPath('bodytypes', icon.filename)),
      deleteUploadedFile(buildPublicPath('bodytypes', upcomingImage.filename)),
    ]);
    throw err;
  }
}

export async function updateBodyType(req: Request, res: Response) {
  const { id } = bodyTypeIdParamSchema.parse(req.params);
  const input = updateBodyTypeSchema.parse(req.body);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const bodyType = await bodyTypeService.updateBodyType(id, input, req.auth.id, getClientIp(req));
  return sendSuccess(res, bodyType, 'Body type updated successfully');
}

export async function uploadBodyTypeIcon(req: Request, res: Response) {
  const { id } = bodyTypeIdParamSchema.parse(req.params);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }
  if (!req.file) {
    throw ApiError.badRequest('No icon file received (expected field name "icon")');
  }

  const bodyType = await bodyTypeService.uploadBodyTypeIcon(id, req.file.filename, req.auth.id, getClientIp(req));
  return sendSuccess(res, bodyType, 'Body type icon updated successfully');
}

export async function uploadBodyTypeUpcomingImage(req: Request, res: Response) {
  const { id } = bodyTypeIdParamSchema.parse(req.params);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }
  if (!req.file) {
    throw ApiError.badRequest('No upcoming image received (expected field name "upcomingImage")');
  }

  const bodyType = await bodyTypeService.uploadBodyTypeUpcomingImage(
    id,
    req.file.filename,
    req.auth.id,
    getClientIp(req),
  );
  return sendSuccess(res, bodyType, 'Body type upcoming image updated successfully');
}

export async function deleteBodyType(req: Request, res: Response) {
  const { id } = bodyTypeIdParamSchema.parse(req.params);

  if (!req.auth) {
    throw ApiError.unauthorized();
  }

  const result = await bodyTypeService.deleteBodyType(id, req.auth.id, getClientIp(req));
  return sendSuccess(res, null, result.message);
}
