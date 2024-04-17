import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (firts: Error | null, acceptFile: string) => void,
) => {
  const fileExtension = file.mimetype.split('/').at(1);
  const fileName = `${uuid()}.${fileExtension}`;

  callback(null, fileName);
};
