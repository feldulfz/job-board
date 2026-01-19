// import { prismaClient } from './lib/prisma.js';
import { PrismaClient } from '../src/generated/prisma/client.js'
import { prismaClient } from '../src/lib/prisma.js';

import { Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { boolean, z } from "zod";

const JWT_SECRET = "your-secret-key"; // In production, always use environment variable

export interface Context {
    prisma: PrismaClient;
    auth: {
        user: { id: string; isAdmin: boolean } | null;
        login: (args: { id: string; isAdmin: boolean }) => void;
        logout: () => void; 
    };
}

const parseToken = (token: string) => {
  const parsedToken = token ? jwt.verify(token, JWT_SECRET) : null;
  if (!parsedToken) {
    return null;
  }

  const payload = z
    .object({
      id: z.string(),
      isAdmin: z.boolean(),
    })
    .safeParse(parsedToken);

  return payload.success ? payload.data : null;
};

const prisma = prismaClient;

const createContext = async ({ req, res }: { req: Request; res: Response }): Promise<Context> => {
  const token = req.cookies?.token;
  const user = parseToken(token);

  return {
    // prisma: new PrismaClient(),
    prisma,
    auth: {
      user,
      login: (args: { id: string; isAdmin: boolean }) => {
        const token = jwt.sign(args, JWT_SECRET);
        res.cookie("token", token, {
          domain: "localhost",
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        });
      },
      logout: () => {
        res.clearCookie("token");
      },
    },
  };
};

export default createContext;