const {
    getForumContent,
    addMsg,
    updateLikeDislike
  } = require('../controllers/forumController');
  
  const Forum = require('../models/forumModel');
  const User = require('../models/userModel');
  
  jest.mock('../models/forumModel');
  jest.mock('../models/userModel');
  
  // Mock the io object
  global.io = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn()
  };
  
  describe('Forum Controller', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        params: {},
        body: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getForumContent', () => {
      it('should return forum content with commenter details', async () => {
        req.params.adventureCanvas_id = 'canvas123';
  
        const mockForum = {
          _id: 'forum123',
          adventureCanvas_id: 'canvas123',
          comments: [
            { email: 'user1@example.com', message: 'Hello', likes: [], dislikes: [], toObject: () => ({ email: 'user1@example.com', message: 'Hello', likes: [], dislikes: [] }) },
            { email: 'user2@example.com', message: 'Hi', likes: [], dislikes: [], toObject: () => ({ email: 'user2@example.com', message: 'Hi', likes: [], dislikes: [] }) }
          ],
          toObject: () => ({
            _id: 'forum123',
            adventureCanvas_id: 'canvas123',
            comments: [
              { email: 'user1@example.com', message: 'Hello', likes: [], dislikes: [] },
              { email: 'user2@example.com', message: 'Hi', likes: [], dislikes: [] }
            ]
          })
        };
  
        Forum.findOne.mockResolvedValue(mockForum);
  
        User.findOne.mockImplementation((query) => {
          const users = {
            'user1@example.com': { username: 'User1', photo: 'photo1.jpg', userType: 'traveler' },
            'user2@example.com': { username: 'User2', photo: 'photo2.jpg', userType: 'guide' }
          };
          return Promise.resolve(users[query.email]);
        });
  
        await getForumContent(req, res);
  
        expect(Forum.findOne).toHaveBeenCalledWith({ adventureCanvas_id: 'canvas123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          _id: 'forum123',
          adventureCanvas_id: 'canvas123',
          comments: expect.arrayContaining([
            expect.objectContaining({
              email: 'user1@example.com',
              message: 'Hello',
              username: 'User1',
              photo: 'photo1.jpg',
              userType: 'traveler'
            }),
            expect.objectContaining({
              email: 'user2@example.com',
              message: 'Hi',
              username: 'User2',
              photo: 'photo2.jpg',
              userType: 'guide'
            })
          ])
        }));
      });
  
      it('should return 404 if forum is not found', async () => {
        req.params.adventureCanvas_id = 'nonexistent';
  
        Forum.findOne.mockResolvedValue(null);
  
        await getForumContent(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Forum not found' });
      });
    });
  
    describe('addMsg', () => {
      it('should add a new message to the forum', async () => {
        req.params.id = 'forum123';
        req.body = {
          email: 'user@example.com',
          message: 'New message'
        };
  
        const mockForum = {
          _id: 'forum123',
          comments: [
            { email: 'user@example.com', message: 'New message', likes: [], dislikes: [], toObject: () => ({ email: 'user@example.com', message: 'New message', likes: [], dislikes: [] }) }
          ]
        };
  
        Forum.findOneAndUpdate.mockResolvedValue(mockForum);
  
        User.findOne.mockResolvedValue({
          email: 'user@example.com',
          username: 'User',
          photo: 'user.jpg',
          userType: 'traveler'
        });
  
        await addMsg(req, res);
  
        expect(Forum.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: 'forum123' },
          { $push: { comments: expect.any(Object) } },
          { new: true, timestamps: false }
        );
        expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
        expect(global.io.to).toHaveBeenCalledWith('forum123');
        expect(global.io.emit).toHaveBeenCalledWith('msg-recieve', expect.any(Object));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          email: 'user@example.com',
          message: 'New message',
          username: 'User',
          photo: 'user.jpg',
          userType: 'traveler'
        }));
      });
    });
  
    describe('updateLikeDislike', () => {
      it('should update likes for a comment', async () => {
        req.params = { forumId: 'forum123', commentId: 'comment123' };
        req.body = { email: 'user@example.com', action: 'like' };
  
        const mockForum = {
          comments: {
            id: jest.fn().mockReturnValue({
              likes: [],
              dislikes: ['user@example.com'],
              toObject: () => ({ likes: ['user@example.com'], dislikes: [] })
            })
          },
          save: jest.fn()
        };
  
        Forum.findById.mockResolvedValue(mockForum);
  
        await updateLikeDislike(req, res);
  
        expect(Forum.findById).toHaveBeenCalledWith('forum123');
        expect(mockForum.save).toHaveBeenCalled();
        expect(global.io.to).toHaveBeenCalledWith('forum123');
        expect(global.io.emit).toHaveBeenCalledWith('comment-updated', expect.any(Object));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          likes: ['user@example.com'],
          dislikes: []
        }));
      });
  
      it('should update dislikes for a comment', async () => {
        req.params = { forumId: 'forum123', commentId: 'comment123' };
        req.body = { email: 'user@example.com', action: 'dislike' };
  
        const mockForum = {
          comments: {
            id: jest.fn().mockReturnValue({
              likes: ['user@example.com'],
              dislikes: [],
              toObject: () => ({ likes: [], dislikes: ['user@example.com'] })
            })
          },
          save: jest.fn()
        };
  
        Forum.findById.mockResolvedValue(mockForum);
  
        await updateLikeDislike(req, res);
  
        expect(Forum.findById).toHaveBeenCalledWith('forum123');
        expect(mockForum.save).toHaveBeenCalled();
        expect(global.io.to).toHaveBeenCalledWith('forum123');
        expect(global.io.emit).toHaveBeenCalledWith('comment-updated', expect.any(Object));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          likes: [],
          dislikes: ['user@example.com']
        }));
      });
    });
  });