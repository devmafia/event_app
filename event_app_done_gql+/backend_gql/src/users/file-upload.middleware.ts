// file-upload.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    cb(null, path.join(__dirname, '../assets/'));
  },
  filename: (req: Request, file: any, cb: any) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

@Injectable()
export class FileUploadMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    upload.single('file')(req, res, (err: any) => {
      if (err) {
        res.status(400).send({ message: 'File upload failed', error: err });
      } else {
        next();
      }
    });
  }
}
