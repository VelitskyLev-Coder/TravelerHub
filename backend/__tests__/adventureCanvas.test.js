const {
  getadventureCanvas,
  createNewTrip,
  getTripPlanByAdventureCanvasId,
  getAdventureCanvasById,
  getTourOperatorTrips
} = require('../controllers/adventureCanvasController');

const AdventureCanvas = require('../models/adventureCanvasModel');
const TripPlan = require('../models/tripPlanModel');
const Forum = require('../models/forumModel');
const User = require('../models/userModel');

jest.mock('../models/adventureCanvasModel');
jest.mock('../models/tripPlanModel');
jest.mock('../models/forumModel');
jest.mock('../models/userModel');
jest.mock('node-fetch');
jest.mock('form-data');

describe('Adventure Canvas Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      files: []
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Setup mock to reflect chaining
    AdventureCanvas.find.mockReturnThis(); // Ensures that 'find' can chain 'sort'
    AdventureCanvas.sort = jest.fn().mockResolvedValue([
      {
        _id: '1',
        images: ['image1.jpg', 'image2.jpg'],
        tripName: 'Adventure 1',
        duration: 5,
        description: 'Exciting adventure',
        cost: 1000,
        isPublished: true,
        assignTourOperator: 'op1@example.com',
        toObject: function() { return this; }
      },
      {
        _id: '2',
        images: ['image3.jpg', 'image4.jpg'],
        tripName: 'Adventure 2',
        duration: 7,
        description: 'Thrilling experience',
        cost: 1500,
        isPublished: true,
        assignTourOperator: 'op2@example.com',
        toObject: function() { return this; }
      }
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getadventureCanvas', () => {
    it('should return all published adventure canvases with tour operator details', async () => {
      // Adjust User.findOne to directly use query.email to search mockUsers
      const mockUsers = {
        'op1@example.com': { email: 'op1@example.com', username: 'Operator1', photo: 'photo1.jpg' },
        'op2@example.com': { email: 'op2@example.com', username: 'Operator2', photo: 'photo2.jpg' }
      };
      
      User.findOne.mockImplementation(({ email }) =>
        Promise.resolve(mockUsers[email])
      );

      await getadventureCanvas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          _id: '1',
          tripName: 'Adventure 1',
          assignTourOperator: {
            username: 'Operator1',
            email: 'op1@example.com',
            photo: 'photo1.jpg'
          }
        }),
        expect.objectContaining({
          _id: '2',
          tripName: 'Adventure 2',
          assignTourOperator: {
            username: 'Operator2',
            email: 'op2@example.com',
            photo: 'photo2.jpg'
          }
        })
      ]));
    });

    it('should return 404 if no adventure canvases are found', async () => {
      // Ensure the 'sort' mock resolves to an empty array
      AdventureCanvas.sort.mockResolvedValue([]);

      await getadventureCanvas(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No adventure canvases found' });
    });
  });

  describe('createNewTrip', () => {
    it('should create a new trip with adventure canvas, trip plan, and forum', async () => {
      const mockAdventureCanvas = {
        tripName: 'New Adventure',
        duration: 6,
        description: 'Exciting new trip',
        cost: 1200,
        isPublished: false,
        assignTourOperator: 'op@example.com'
      };
      const mockTripPlan = {
        dates: [{ starting: '2023-07-01', ending: '2023-07-07', limitBooking: 10 }],
        scheduled: [{ location: 'Beach', day: 1, description: 'Relax on the beach' }],
        travelGuide: 'Experienced guide'
      };
      req.body = {
        adventureCanvas: JSON.stringify(mockAdventureCanvas),
        tripPlan: JSON.stringify(mockTripPlan)
      };
      req.files = [{ buffer: Buffer.from('image'), originalname: 'test.jpg' }];

      const mockImgurResponse = { data: { link: 'https://imgur.com/test.jpg' } };
      require('node-fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockImgurResponse)
      });

      AdventureCanvas.create.mockResolvedValue({ _id: 'canvas123', ...mockAdventureCanvas });
      TripPlan.create.mockResolvedValue({ _id: 'plan123', ...mockTripPlan });
      Forum.create.mockResolvedValue({ _id: 'forum123', comments: [] });

      await createNewTrip(req, res);

      expect(AdventureCanvas.create).toHaveBeenCalledWith({
        ...mockAdventureCanvas,
        images: ['https://imgur.com/test.jpg']
      });
      expect(TripPlan.create).toHaveBeenCalledWith({
        ...mockTripPlan,
        adventureCanvas_id: 'canvas123'
      });
      expect(Forum.create).toHaveBeenCalledWith({
        comments: [],
        adventureCanvas_id: 'canvas123'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'The trip has been created successfully' });
    });
  });

  describe('getTripPlanByAdventureCanvasId', () => {
    it('should return a trip plan for a given adventure canvas id', async () => {
      const mockTripPlan = {
        _id: 'plan123',
        dates: [{ starting: '2023-07-01', ending: '2023-07-07', limitBooking: 10 }],
        scheduled: [{ location: 'Beach', day: 1, description: 'Relax on the beach' }],
        travelGuide: 'Experienced guide',
        adventureCanvas_id: 'canvas123'
      };
      req.params.adventureCanvas_id = 'canvas123';
      TripPlan.findOne.mockResolvedValue(mockTripPlan);

      await getTripPlanByAdventureCanvasId(req, res);

      expect(TripPlan.findOne).toHaveBeenCalledWith({ adventureCanvas_id: 'canvas123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTripPlan);
    });

    it('should return 404 if trip plan is not found', async () => {
      req.params.adventureCanvas_id = 'nonexistent';
      TripPlan.findOne.mockResolvedValue(null);

      await getTripPlanByAdventureCanvasId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Trip plan not found' });
    });
  });

  describe('getAdventureCanvasById', () => {
   
    it('should return an adventure canvas with tour operator details', async () => {
      const mockCanvas = {
        _id: 'canvas123',
        images: ['image1.jpg', 'image2.jpg'],
        tripName: 'Adventure',
        duration: 5,
        description: 'Exciting adventure',
        cost: 1000,
        isPublished: true,
        assignTourOperator: 'op@example.com',
        toObject: function() { return this; }
      };
      const mockOperator = {
        email: 'op@example.com',
        username: 'Operator',
        photo: 'photo.jpg',
        userType: 'tourOperator'
      };
      req.params.adventureCanvas_id = 'canvas123';
      AdventureCanvas.findOne.mockResolvedValue(mockCanvas);
      User.findOne.mockResolvedValue(mockOperator);
     
      await getAdventureCanvasById(req, res);
      console.log(res.json.mock.calls);
      expect(AdventureCanvas.findOne).toHaveBeenCalledWith({ _id: 'canvas123' });
      expect(User.findOne).toHaveBeenCalledWith({ email: 'op@example.com' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        ...mockCanvas,
        assignTourOperator: {
          email: 'op@example.com',
          username: 'Operator',
          photo: 'photo.jpg'
        }
      });
    });

    it('should return 404 if adventure canvas is not found', async () => {
      req.params.adventureCanvas_id = 'nonexistent';
      AdventureCanvas.findOne.mockResolvedValue(null);

      await getAdventureCanvasById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Adventure canvas not found' });
    });
  });

  describe('getTourOperatorTrips', () => {
    it('should return all trips for a tour operator', async () => {
        // Localized mock setup for this specific test
        const mockFindSort = {
            sort: jest.fn().mockResolvedValue([
                {
                    _id: 'canvas1',
                    images: ['image1.jpg', 'image2.jpg'],
                    tripName: 'Adventure 1',
                    duration: 5,
                    description: 'Exciting adventure',
                    cost: 1000,
                    isPublished: true,
                    assignTourOperator: 'op@example.com',
                    toObject: function() { return this; }
                },
                {
                    _id: 'canvas2',
                    images: ['image3.jpg', 'image4.jpg'],
                    tripName: 'Adventure 2',
                    duration: 7,
                    description: 'Thrilling experience',
                    cost: 1500,
                    isPublished: true,
                    assignTourOperator: 'op@example.com',
                    toObject: function() { return this; }
                }
            ])
        };
        
        AdventureCanvas.find = jest.fn(() => mockFindSort); // Localized chaining mock

        const mockOperator = {
            email: 'op@example.com',
            username: 'Operator',
            photo: 'photo.jpg',
            userType: 'tourOperator'
        };
        req.params.email = 'op@example.com';
        User.findOne.mockResolvedValue(mockOperator);

        await getTourOperatorTrips(req, res);

        expect(AdventureCanvas.find).toHaveBeenCalledWith({ 'assignTourOperator': 'op@example.com' });
        expect(mockFindSort.sort).toHaveBeenCalledWith({updatedAt: -1}); // Ensure sort is called correctly
        expect(User.findOne).toHaveBeenCalledWith({ email: 'op@example.com' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({
                _id: 'canvas1',
                tripName: 'Adventure 1',
                assignTourOperator: {
                    email: 'op@example.com',
                    username: 'Operator',
                    photo: 'photo.jpg'
                }
            }),
            expect.objectContaining({
                _id: 'canvas2',
                tripName: 'Adventure 2',
                assignTourOperator: {
                    email: 'op@example.com',
                    username: 'Operator',
                    photo: 'photo.jpg'
                }
            })
        ]));
    });

    it('should return 404 if no trips are found for the tour operator', async () => {
      req.params.email = 'notrips@example.com';
      
      // Setup the mock within this test to handle chaining on an empty result
      const findMock = jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([])
      });
      AdventureCanvas.find = findMock;
  
      await getTourOperatorTrips(req, res);
  
      expect(findMock).toHaveBeenCalledWith({ 'assignTourOperator': 'notrips@example.com' });
      expect(findMock().sort).toHaveBeenCalledWith({ updatedAt: -1 });
      expect(res.status).toHaveBeenCalledWith(404); // TODO why 404???
      expect(res.json).toHaveBeenCalledWith({ error: 'No trip has been assigned to you yet.' });
  });
});
});