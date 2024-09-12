  const {
    getUnpublishedAdventureCanvas,
    publishTrip,
    getExecutionUnconfirmedTripPlan,
    updateConfirmedDate,
    getAllTourOperators,
    deleteTrip
  } = require('../controllers/manageTripsController');
  
  const AdventureCanvas = require('../models/adventureCanvasModel');
  const TripPlan = require('../models/tripPlanModel');
  const Forum = require('../models/forumModel');
  const User = require('../models/userModel');
  
  jest.mock('../models/adventureCanvasModel');
  jest.mock('../models/tripPlanModel');
  jest.mock('../models/forumModel');
  jest.mock('../models/userModel');
  
  describe('Tour Operator Controller', () => {
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
  
    describe('getUnpublishedAdventureCanvas', () => {
      it('should return unpublished adventure canvases', async () => {
        const mockCanvases = [
          { _id: 'canvas1', tripName: 'Trip 1', isPublished: false },
          { _id: 'canvas2', tripName: 'Trip 2', isPublished: false }
        ];
  
        AdventureCanvas.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockCanvases)
        });
  
        await getUnpublishedAdventureCanvas(req, res);
  
        expect(AdventureCanvas.find).toHaveBeenCalledWith({ isPublished: false });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCanvases);
      });
  
      it('should return 404 if no unpublished canvases are found', async () => {
        AdventureCanvas.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue([])
        });
  
        await getUnpublishedAdventureCanvas(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'There are no trips waiting to be published.' });
      });
    });
  
    describe('publishTrip', () => {
      it('should publish a trip', async () => {
        req.body = {
          adventureCanvas_id: 'canvas123',
          assignTourOperator: 'operator@example.com'
        };
  
        const mockUpdatedCanvas = {
          _id: 'canvas123',
          isPublished: true,
          assignTourOperator: 'operator@example.com'
        };
  
        AdventureCanvas.findOneAndUpdate.mockResolvedValue(mockUpdatedCanvas);
  
        await publishTrip(req, res);
  
        expect(AdventureCanvas.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: 'canvas123' },
          { isPublished: true, assignTourOperator: 'operator@example.com' },
          { new: true }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Trip published successfully' });
      });
  
      it('should return 400 if adventure canvas is not found', async () => {
        req.body = {
          adventureCanvas_id: 'nonexistent',
          assignTourOperator: 'operator@example.com'
        };
  
        AdventureCanvas.findOneAndUpdate.mockResolvedValue(null);
  
        await publishTrip(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Adventure canvas not found' });
      });
    });
  
    describe('getExecutionUnconfirmedTripPlan', () => {
        it('should return unconfirmed trip plans', async () => {
            const mockPublishedCanvases = [
              { _id: 'canvas1', tripName: 'Trip 1', isPublished: true },
              { _id: 'canvas2', tripName: 'Trip 2', isPublished: true }
            ];
        
            const mockUnconfirmedTripPlans = [
              { 
                _id: 'plan1', 
                adventureCanvas_id: {
                  equals: jest.fn(id => id === 'canvas1'),
                  toString: () => 'canvas1'
                }, 
                dates: [{ executionConfirmed: false }] 
              }
            ];
        
            AdventureCanvas.find.mockResolvedValue(mockPublishedCanvases);
            TripPlan.find.mockResolvedValue(mockUnconfirmedTripPlans);
        
            await getExecutionUnconfirmedTripPlan(req, res);
        
            expect(AdventureCanvas.find).toHaveBeenCalledWith({ isPublished: true });
            expect(TripPlan.find).toHaveBeenCalledWith({
              adventureCanvas_id: { $in: expect.any(Array) },
              dates: { $elemMatch: { executionConfirmed: false } }
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([mockPublishedCanvases[0]]);
          });
  
      it('should return 404 if no unconfirmed trip plans are found', async () => {
        AdventureCanvas.find.mockResolvedValue([]);
        TripPlan.find.mockResolvedValue([]);
  
        await getExecutionUnconfirmedTripPlan(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'No published unconfirmed trip plans found' });
      });
    });
  
    describe('updateConfirmedDate', () => {
      it('should update execution confirmed status of a date', async () => {
        req.body = {
          trip_id: 'trip123',
          date_id: 'date123'
        };
  
        const mockTripPlan = {
          _id: 'trip123',
          dates: {
            id: jest.fn().mockReturnValue({
              _id: 'date123',
              executionConfirmed: false
            })
          },
          save: jest.fn()
        };
  
        TripPlan.findById.mockResolvedValue(mockTripPlan);
  
        await updateConfirmedDate(req, res);
  
        expect(TripPlan.findById).toHaveBeenCalledWith({ _id: 'trip123' });
        expect(mockTripPlan.dates.id).toHaveBeenCalledWith('date123');
        expect(mockTripPlan.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
          _id: 'date123',
          executionConfirmed: true
        }));
      });
  
      it('should return 404 if trip plan is not found', async () => {
        req.body = {
          trip_id: 'nonexistent',
          date_id: 'date123'
        };
  
        TripPlan.findById.mockResolvedValue(null);
  
        await updateConfirmedDate(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'TripPlan not found' });
      });
    });
  
    describe('getAllTourOperators', () => {
      it('should return all tour operators', async () => {
        const mockTourOperators = [
          { username: 'Operator1', email: 'op1@example.com', photo: 'photo1.jpg' },
          { username: 'Operator2', email: 'op2@example.com', photo: 'photo2.jpg' }
        ];
  
        User.find.mockReturnValue({
          select: jest.fn().mockResolvedValue(mockTourOperators)
        });
  
        await getAllTourOperators(req, res);
  
        expect(User.find).toHaveBeenCalledWith({ userType: 'tourOperator' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockTourOperators);
      });
  
      it('should return 404 if no tour operators are found', async () => {
        User.find.mockReturnValue({
          select: jest.fn().mockResolvedValue(null)
        });
  
        await getAllTourOperators(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'There are no tour operators users' });
      });
    });
  
    describe('deleteTrip', () => {
      it('should delete a trip and associated data', async () => {
        req.body = {
          adventureCanvas_id: 'canvas123'
        };
  
        Forum.findOneAndDelete.mockResolvedValue({ _id: 'forum123' });
        TripPlan.findOneAndDelete.mockResolvedValue({ _id: 'plan123' });
        AdventureCanvas.findOneAndDelete.mockResolvedValue({ _id: 'canvas123' });
  
        await deleteTrip(req, res);
  
        expect(Forum.findOneAndDelete).toHaveBeenCalledWith({ adventureCanvas_id: 'canvas123' });
        expect(TripPlan.findOneAndDelete).toHaveBeenCalledWith({ adventureCanvas_id: 'canvas123' });
        expect(AdventureCanvas.findOneAndDelete).toHaveBeenCalledWith({ _id: 'canvas123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Trip deleted successfully' });
      });
  
      it('should return 404 if any associated data is not found', async () => {
        req.body = {
          adventureCanvas_id: 'nonexistent'
        };
  
        Forum.findOneAndDelete.mockResolvedValue(null);
  
        await deleteTrip(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Somthing went worng...' });
      });
    });
  });