const {
    updateUsername,
    updatePassword,
    updatePhoto,
    deletePhoto,
    deleteUserAccount
  } = require('../controllers/profileController');
  
  const User = require('../models/userModel');
  const Booking = require('../models/bookingModel');
  const bcrypt = require('bcrypt');
  const fetch = require('node-fetch');
  
  jest.mock('../models/userModel');
  jest.mock('../models/bookingModel');
  jest.mock('bcrypt');
  jest.mock('node-fetch');
  
  describe('User Profile Controller', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        user: { _id: 'user123' },
        body: {},
        file: null
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('updateUsername', () => {
      it('should update the username successfully', async () => {
        req.body = { username: 'newUsername' };
        User.findOneAndUpdate.mockResolvedValue({ _id: 'user123', username: 'newUsername' });
  
        await updateUsername(req, res);
  
        expect(User.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: 'user123' },
          { username: 'newUsername' },
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Update username successfully' });
      });
  
      it('should return 400 if user is not found', async () => {
        req.body = { username: 'newUsername' };
        User.findOneAndUpdate.mockResolvedValue(null);
  
        await updateUsername(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No such user' });
      });
    });
  
    describe('updatePassword', () => {
      it('should update the password successfully', async () => {
        req.body = { password: 'newPassword' };
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hashedPassword');
        User.findOneAndUpdate.mockResolvedValue({ _id: 'user123' });
  
        await updatePassword(req, res);
  
        expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
        expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 'salt');
        expect(User.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: 'user123' },
          { password: 'hashedPassword' },
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Update password successfully' });
      });
  
      it('should return 400 if user is not found', async () => {
        req.body = { password: 'newPassword' };
        bcrypt.genSalt.mockResolvedValue('salt');
        bcrypt.hash.mockResolvedValue('hashedPassword');
        User.findOneAndUpdate.mockResolvedValue(null);
  
        await updatePassword(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No such user' });
      });
    });
  
    describe('updatePhoto', () => {
      it('should update the profile photo successfully', async () => {
        req.file = { buffer: Buffer.from('test image') };
        fetch.mockResolvedValue({
          ok: true,
          json: () => Promise.resolve({ data: { link: 'https://imgur.com/newphoto.jpg' } })
        });
        User.findByIdAndUpdate.mockResolvedValue({ _id: 'user123', photo: 'https://imgur.com/newphoto.jpg' });
  
        await updatePhoto(req, res);
  
        expect(fetch).toHaveBeenCalled();
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
          'user123',
          { photo: 'https://imgur.com/newphoto.jpg' },
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          msg: 'Profile photo updated successfully',
          photo: 'https://imgur.com/newphoto.jpg'
        });
      });
  
      it('should return 400 if no file is provided', async () => {
        await updatePhoto(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'No file provided' });
      });
    });
  
    describe('deletePhoto', () => {
      it('should delete the profile photo successfully', async () => {
        User.findByIdAndUpdate.mockResolvedValue({
          _id: 'user123',
          photo: './images/user-blank-profile.png'
        });
  
        await deletePhoto(req, res);
  
        expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
          'user123',
          { photo: './images/user-blank-profile.png' },
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          msg: 'Profile photo deleted successfully',
          photo: './images/user-blank-profile.png'
        });
      });
  
      it('should return 404 if user is not found', async () => {
        User.findByIdAndUpdate.mockResolvedValue(null);
  
        await deletePhoto(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      });
    });
  
    describe('deleteUserAccount', () => {
      it('should delete the user account and associated bookings successfully', async () => {
        User.findOneAndDelete.mockResolvedValue({ _id: 'user123' });
        Booking.deleteMany.mockResolvedValue({});
  
        await deleteUserAccount(req, res);
  
        expect(User.findOneAndDelete).toHaveBeenCalledWith({ _id: 'user123' });
        expect(Booking.deleteMany).toHaveBeenCalledWith({ user_id: 'user123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'User account deleted successfully' });
      });
  
      it('should return 404 if user is not found', async () => {
        User.findOneAndDelete.mockResolvedValue(null);
  
        await deleteUserAccount(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      });
    });
  });