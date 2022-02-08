// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
): void {
  const { query } = req;

  const params = { ...query };

  delete params.path;

  res.redirect(
    307,
    `${process.env.API_URL}/api/${
      query?.path instanceof Array ? query.path.join('/') : query.path
    }${
      Object.keys(params).length
        ? `?${Object.keys(params)
            .map(key => `${key}=${params[key]}`)
            .join('&')}`
        : ''
    }`
  );
}
