import { AwsUploader } from 'services/AwsUploader';
import formidable from 'formidable';
import fs from 'fs';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

function getImageFile(path: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
): void {
  const FOLDER = './formidable';

  const form = new formidable.IncomingForm({
    uploadDir: FOLDER,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    const { img } = files;

    const { newFilename } = img as formidable.File;

    const PATH_TO_FILE = `${FOLDER}/${newFilename}`;

    getImageFile(PATH_TO_FILE)
      .then(data => {
        return AwsUploader.uploadToBucketBEOnly(data);
      })
      .then(response => {
        const { Key } = response;

        res.status(200).json(Key);
      })
      .catch(awsErr => {
        res.status(500).json(awsErr);
      })
      .finally(() => {
        fs.unlink(PATH_TO_FILE, () => 0);
      });
  });
}
