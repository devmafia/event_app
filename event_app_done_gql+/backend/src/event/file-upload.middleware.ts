import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';
import { resolve, posix } from 'path';
import * as fs from 'fs';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = resolve(__dirname, '..', 'assets');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
  }
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueName = `${file.originalname}`;
    callback(null, uniqueName);
  },
});

const upload = multer({ storage });

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  use(req: MulterRequest, res: Response, next: NextFunction) {
    upload.single('image')(req, res, (err) => {
      if (err) {
        return res.status(500).send({ error: 'File upload failed' });
      }
      if (req.file) {
        req.body.image = posix.join('/assets', req.file.filename);
      }
      next();
    });
  }
}
