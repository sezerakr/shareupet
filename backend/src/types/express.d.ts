import { Request } from 'express';
import { RequestUser } from '../src/common/interfaces/request-user.interface';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
