// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import https from 'https';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<NextApiResponse<Data>> {
  return new Promise((resolve, reject) => {
    https.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd',
      resp => {
        resp.on('data', d => {
          res.status(200).json(d);
          resolve(d);
        });
        resp.on('error', err => {
          reject(err);
        });
      }
    );
  });
}
