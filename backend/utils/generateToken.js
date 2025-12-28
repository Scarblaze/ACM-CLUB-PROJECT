import jwt from 'jsonwebtoken';

const generateToken = (res, id, role) => {
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
     secure: true, 
    sameSite: 'none',
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;