import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {isNil, isNotNil} from 'ramda';
import {isNilOrEmpty} from 'ramda-adjunct';
import {randomUUID} from 'crypto';
import {User, userDB} from '../database/users';
import {validateCredentialsFromBody} from '../validators/validateCredentialsFromBody';
import {signAccessToken} from '../utils/signAccessToken';
import {signRefreshToken} from '../utils/signRefreshToken';
import {hashPassword} from '../utils/hashPassword';
import {comparePassword} from '../utils/comparePassword';

const userRoutes = express.Router();

userRoutes.post('/api/register', (req: Request, res: Response) => {
  const {password, username} = validateCredentialsFromBody(req, res);
  const hashedPassword = hashPassword(password);

  userDB.findOne({username}, (err: Error | null, user: User) => {
    if (isNotNil(err)) return res.status(500).json({error: 'Internal server error'});
    if (isNotNil(user)) return res.status(400).json({error: 'Username is already taken'});

    const newUser: User = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      username,
      password: hashedPassword,
    };

    userDB.insert(newUser);

    const accessToken = signAccessToken(newUser.id, username);
    const refreshToken = signRefreshToken(newUser.id, username);

    res.status(201).json({accessToken, refreshToken});
  });
});

userRoutes.post('/api/login', (req: Request, res: Response) => {
  const {password, username} = validateCredentialsFromBody(req, res);

  // Correct: query by an object, not by a function
  userDB.findOne({username}, async (err: Error | null, user: User | null) => {
    console.log('user', user, 'err', err);
    if (isNotNil(err)) {
      return res.status(500).json({error: 'Internal server error'});
    }

    // User not found
    if (isNil(user)) {
      return res.status(401).json({error: 'Invalid credentials'});
    }

    try {
      // Compare the password using bcrypt
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({error: 'Invalid credentials'});
      }

      // Generate tokens
      const accessToken = signAccessToken(user.id, username);
      const refreshToken = signRefreshToken(user.id, username);

      return res.status(200).json({accessToken, refreshToken});
    } catch (e) {
      console.error('Password comparison failed:', e);
      return res.status(500).json({error: 'Internal server error'});
    }
  });
});

userRoutes.post('/api/refresh-token', (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;

  if (isNilOrEmpty(refreshToken)) {
    return res.status(400).json({error: "Refresh token can't be empty"});
  }

  jwt.verify(refreshToken, process.env.REFRESH_KEY, (err: any, user: any) => {
    if (err) return res.status(401).json({error: 'Invalid refresh token'});

    const accessToken = signAccessToken(user.userId, user.username);

    return res.json({accessToken});
  });
});

export default userRoutes;
