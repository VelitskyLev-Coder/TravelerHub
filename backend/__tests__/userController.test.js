const {
    loginUser,
    signupUser
  } = require('../controllers/userController');
  
  const User = require('../models/userModel');
  const jwt = require('jsonwebtoken');
  
  jest.mock('../models/userModel');
  jest.mock('jsonwebtoken');
  
  describe('User Authentication Controller', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      process.env.SECRET = 'testsecret';
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('loginUser', () => {
      it('should login a user successfully', async () => {
        req.body = {
          email: 'test@example.com',
          password: 'password123'
        };
  
        const mockUser = {
          _id: 'user123',
          email: 'test@example.com',
          username: 'testuser',
          photo: 'photo.jpg',
          userType: 'traveler'
        };
  
        User.login.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('mocktoken');
  
        await loginUser(req, res);
  
        expect(User.login).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(jwt.sign).toHaveBeenCalledWith({ _id: 'user123' }, 'testsecret', { expiresIn: '1d' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          email: 'test@example.com',
          token: 'mocktoken',
          username: 'testuser',
          photo: 'photo.jpg',
          userType: 'traveler'
        });
      });
  
      it('should return 400 if login fails', async () => {
        req.body = {
          email: 'test@example.com',
          password: 'wrongpassword'
        };
  
        User.login.mockRejectedValue(new Error('Invalid email or password'));
  
        await loginUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
      });
    });
  
    describe('signupUser', () => {
      it('should signup a traveler successfully', async () => {
        req.body = {
          email: 'newuser@example.com',
          username: 'newuser',
          password: 'password123',
          userType: 'traveler'
        };
  
        const mockUser = {
          _id: 'newuser123',
          email: 'newuser@example.com',
          username: 'newuser',
          photo: 'default.jpg',
          userType: 'traveler'
        };
  
        User.signup.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('mocktoken');
  
        await signupUser(req, res);
  
        expect(User.signup).toHaveBeenCalledWith('newuser@example.com', 'newuser', 'password123', 'traveler');
        expect(jwt.sign).toHaveBeenCalledWith({ _id: 'newuser123' }, 'testsecret', { expiresIn: '1d' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          token: 'mocktoken',
          username: 'newuser',
          photo: 'default.jpg',
          userType: 'traveler'
        });
      });
  
      it('should signup a tour operator successfully', async () => {
        req.body = {
          email: 'operator@example.com',
          username: 'operator',
          password: 'password123',
          userType: 'tourOperator'
        };
  
        const mockUser = {
          _id: 'operator123',
          email: 'operator@example.com',
          username: 'operator',
          photo: 'default.jpg',
          userType: 'tourOperator'
        };
  
        User.signup.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('mocktoken');
  
        await signupUser(req, res);
  
        expect(User.signup).toHaveBeenCalledWith('operator@example.com', 'operator', 'password123', 'tourOperator');
        expect(jwt.sign).toHaveBeenCalledWith({ _id: 'operator123' }, 'testsecret', { expiresIn: '1d' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith('Tour Operator Account Made Successfully');
      });
  
      it('should return 400 if signup fails', async () => {
        req.body = {
          email: 'existing@example.com',
          username: 'existinguser',
          password: 'password123',
          userType: 'traveler'
        };
  
        User.signup.mockRejectedValue(new Error('Email already in use'));
  
        await signupUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already in use' });
      });
    });
  });