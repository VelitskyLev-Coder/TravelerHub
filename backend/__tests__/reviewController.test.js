const {
    addReview,
    getReviewByAdventureCanvasesId,
    getReviewByTourOperatorEmail
  } = require('../controllers/reviewController');
  
  const AdventureCanvas = require('../models/adventureCanvasModel');
  const Review = require('../models/reveiwModel');
  const User = require('../models/userModel');
  
  jest.mock('../models/adventureCanvasModel');
  jest.mock('../models/reveiwModel');
  jest.mock('../models/userModel');
  
  describe('Review Controller', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        body: {},
        params: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe('addReview', () => {
      it('should add a review successfully', async () => {
        req.body = {
          travelerEmail: 'traveler@example.com',
          rating: 5,
          content: 'Great trip!',
          adventureCanvas_id: 'canvas123'
        };
  
        AdventureCanvas.findOne.mockReturnValue({
          select: jest.fn().mockResolvedValue({ assignTourOperator: 'operator@example.com' })
        });
  
        Review.create.mockResolvedValue({
          travelerEmail: 'traveler@example.com',
          rating: 5,
          content: 'Great trip!',
          tourOperator_email: 'operator@example.com',
          adventureCanvas_id: 'canvas123'
        });
  
        await addReview(req, res);
  
        expect(AdventureCanvas.findOne).toHaveBeenCalledWith({ _id: 'canvas123' });
        expect(Review.create).toHaveBeenCalledWith({
          travelerEmail: 'traveler@example.com',
          rating: 5,
          content: 'Great trip!',
          tourOperator_email: 'operator@example.com',
          adventureCanvas_id: 'canvas123'
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'The review was sent successfully' });
      });
  
      it('should return 404 if tour operator is not found', async () => {
        req.body = {
          travelerEmail: 'traveler@example.com',
          rating: 5,
          content: 'Great trip!',
          adventureCanvas_id: 'nonexistent'
        };
  
        AdventureCanvas.findOne.mockReturnValue({
          select: jest.fn().mockResolvedValue(null)
        });
  
        await addReview(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Tour Operator was not found' });
      });
    });
  
    describe('getReviewByAdventureCanvasesId', () => {
      it('should return reviews with user details', async () => {
        req.params = { id: 'canvas123' };
  
        const mockReviews = [
          { 
            travelerEmail: 'traveler1@example.com',
            rating: 5,
            content: 'Great trip!',
            toObject: () => ({ 
              travelerEmail: 'traveler1@example.com',
              rating: 5,
              content: 'Great trip!'
            })
          },
          { 
            travelerEmail: 'traveler2@example.com',
            rating: 4,
            content: 'Good experience',
            toObject: () => ({ 
              travelerEmail: 'traveler2@example.com',
              rating: 4,
              content: 'Good experience'
            })
          }
        ];
  
        Review.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockReviews)
        });
  
        User.findOne.mockImplementation((query) => {
          const users = {
            'traveler1@example.com': { username: 'Traveler1', photo: 'photo1.jpg' },
            'traveler2@example.com': { username: 'Traveler2', photo: 'photo2.jpg' }
          };
          return Promise.resolve(users[query.email]);
        });
  
        await getReviewByAdventureCanvasesId(req, res);
  
        expect(Review.find).toHaveBeenCalledWith({ adventureCanvas_id: 'canvas123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
          expect.objectContaining({
            travelerEmail: 'traveler1@example.com',
            travelerName: 'Traveler1',
            travelerPhoto: 'photo1.jpg'
          }),
          expect.objectContaining({
            travelerEmail: 'traveler2@example.com',
            travelerName: 'Traveler2',
            travelerPhoto: 'photo2.jpg'
          })
        ]));
      });
  
      it('should return 404 if no reviews are found', async () => {
        req.params = { id: 'nonexistent' };
  
        Review.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue([])
        });
  
        await getReviewByAdventureCanvasesId(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No review yet.' });
      });
    });
  
    describe('getReviewByTourOperatorEmail', () => {
      it('should return reviews with user details', async () => {
        req.params = { email: 'operator@example.com' };
  
        const mockReviews = [
          { 
            travelerEmail: 'traveler1@example.com',
            rating: 5,
            content: 'Great trip!',
            toObject: () => ({ 
              travelerEmail: 'traveler1@example.com',
              rating: 5,
              content: 'Great trip!'
            })
          },
          { 
            travelerEmail: 'traveler2@example.com',
            rating: 4,
            content: 'Good experience',
            toObject: () => ({ 
              travelerEmail: 'traveler2@example.com',
              rating: 4,
              content: 'Good experience'
            })
          }
        ];
  
        Review.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockReviews)
        });
  
        User.findOne.mockImplementation((query) => {
          const users = {
            'traveler1@example.com': { username: 'Traveler1', photo: 'photo1.jpg' },
            'traveler2@example.com': { username: 'Traveler2', photo: 'photo2.jpg' }
          };
          return Promise.resolve(users[query.email]);
        });
  
        await getReviewByTourOperatorEmail(req, res);
  
        expect(Review.find).toHaveBeenCalledWith({ tourOperator_email: 'operator@example.com' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
          expect.objectContaining({
            travelerEmail: 'traveler1@example.com',
            travelerName: 'Traveler1',
            travelerPhoto: 'photo1.jpg'
          }),
          expect.objectContaining({
            travelerEmail: 'traveler2@example.com',
            travelerName: 'Traveler2',
            travelerPhoto: 'photo2.jpg'
          })
        ]));
      });
  
      it('should return 404 if no reviews are found', async () => {
        req.params = { email: 'nonexistent@example.com' };
  
        Review.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue([])
        });
  
        await getReviewByTourOperatorEmail(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No review yet.' });
      });
    });
  });