// src/pages/api/getResponses.ts
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT * FROM user_responses');
      res.status(200).json({ data: rows });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
