import { Request } from 'express';

export const getAuthorizationToken = (req: Request) => {
  const token = req.headers['authorization']?.split(' ')[1];
  return token;
};
