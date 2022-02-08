import path from 'path';
import fs from 'fs';

const clearImage = (filename: string) => {
  const filePath = path.join(__dirname, '../', 'images/', filename);
  fs.unlink(filePath, (err) => console.log(err));
};

export default clearImage;
