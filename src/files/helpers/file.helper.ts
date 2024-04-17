export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (firts: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) return callback(new Error('File is empty'), false);
  const fileExtension = file.mimetype.split('/').at(1);

  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
  if (!validExtensions.includes(fileExtension)) {
    return callback(null, false);
  }

  callback(null, true);
};
