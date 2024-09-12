const {
    getBookingByUserId,
    saveBookingDetails,
    deleteBooking
  } = require('../controllers/bookingController');
  
  const Booking = require('../models/bookingModel');
  const TripPlan = require('../models/tripPlanModel');
  
  jest.mock('../models/bookingModel');
  jest.mock('../models/tripPlanModel');
  
  describe('Booking Controller', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
        user: { _id: 'user123' },
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
  
    describe('getBookingByUserId', () => {
      it('should return bookings for a user', async () => {
        const mockBookings = [
          { _id: 'booking1', tripName: 'Trip 1' },
          { _id: 'booking2', tripName: 'Trip 2' }
        ];
        
        Booking.find.mockReturnValue({
          select: jest.fn().mockResolvedValue(mockBookings)
        });
  
        await getBookingByUserId(req, res);
  
        expect(Booking.find).toHaveBeenCalledWith({ user_id: 'user123' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockBookings);
      });
    });
  
    describe('saveBookingDetails', () => {
      it('should save a new booking and update TripPlan', async () => {
        const mockBooking = {
          tripName: 'New Trip',
          member: 2
        };
        const mockPayment = {
          method: 'credit card',
          amount: 1000
        };
        req.body = {
          booking: mockBooking,
          payment: mockPayment,
          adventureCanvas_id: 'canvas123',
          date_id: 'date123'
        };
  
        const mockTripPlan = {
          dates: {
            id: jest.fn().mockReturnValue({
              currBooking: 5
            })
          },
          save: jest.fn()
        };
  
        TripPlan.findOne.mockResolvedValue(mockTripPlan);
        Booking.create.mockResolvedValue({ _id: 'newBooking123', ...mockBooking, payment: mockPayment });
  
        await saveBookingDetails(req, res);
  
        expect(TripPlan.findOne).toHaveBeenCalledWith({ adventureCanvas_id: 'canvas123' });
        expect(mockTripPlan.dates.id).toHaveBeenCalledWith('date123');
        expect(mockTripPlan.save).toHaveBeenCalled();
        expect(Booking.create).toHaveBeenCalledWith({
          ...mockBooking,
          payment: mockPayment,
          adventureCanvas_id: 'canvas123',
          user_id: 'user123'
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'The booking was made successfully' });
      });
  
      it('should return 404 if TripPlan is not found', async () => {
        req.body = {
          booking: {},
          payment: {},
          adventureCanvas_id: 'nonexistent',
          date_id: 'date123'
        };
  
        TripPlan.findOne.mockResolvedValue(null);
  
        await saveBookingDetails(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'TripPlan not found' });
      });
  
      it('should return 404 if date is not found in TripPlan', async () => {
        req.body = {
          booking: {},
          payment: {},
          adventureCanvas_id: 'canvas123',
          date_id: 'nonexistent'
        };
  
        const mockTripPlan = {
          dates: {
            id: jest.fn().mockReturnValue(null)
          }
        };
  
        TripPlan.findOne.mockResolvedValue(mockTripPlan);
  
        await saveBookingDetails(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Date not found' });
      });
    });
  
    describe('deleteBooking', () => {
      it('should delete a booking and update TripPlan', async () => {
        req.body = {
          currBooking: {
            _id: 'booking123',
            adventureCanvas_id: 'canvas123',
            date_id: 'date123',
            member: 2
          }
        };
  
        const mockTripPlan = {
          dates: {
            id: jest.fn().mockReturnValue({
              currBooking: 5
            })
          },
          save: jest.fn()
        };
  
        TripPlan.findOne.mockResolvedValue(mockTripPlan);
        Booking.findByIdAndDelete.mockResolvedValue({ _id: 'booking123' });
  
        await deleteBooking(req, res);
  
        expect(TripPlan.findOne).toHaveBeenCalledWith({ adventureCanvas_id: 'canvas123' });
        expect(mockTripPlan.dates.id).toHaveBeenCalledWith('date123');
        expect(mockTripPlan.save).toHaveBeenCalled();
        expect(Booking.findByIdAndDelete).toHaveBeenCalledWith('booking123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Booking deleted successfully' });
      });
  
      it('should return 404 if TripPlan is not found', async () => {
        req.body = {
          currBooking: {
            adventureCanvas_id: 'nonexistent',
            date_id: 'date123'
          }
        };
  
        TripPlan.findOne.mockResolvedValue(null);
  
        await deleteBooking(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'TripPlan not found' });
      });
  
      it('should return 404 if date is not found in TripPlan', async () => {
        req.body = {
          currBooking: {
            adventureCanvas_id: 'canvas123',
            date_id: 'nonexistent'
          }
        };
  
        const mockTripPlan = {
          dates: {
            id: jest.fn().mockReturnValue(null)
          }
        };
  
        TripPlan.findOne.mockResolvedValue(mockTripPlan);
  
        await deleteBooking(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Date not found' });
      });
  
      it('should return 404 if Booking is not found', async () => {
        req.body = {
          currBooking: {
            _id: 'nonexistent',
            adventureCanvas_id: 'canvas123',
            date_id: 'date123'
          }
        };
  
        const mockTripPlan = {
          dates: {
            id: jest.fn().mockReturnValue({
              currBooking: 5
            })
          },
          save: jest.fn()
        };
  
        TripPlan.findOne.mockResolvedValue(mockTripPlan);
        Booking.findByIdAndDelete.mockResolvedValue(null);
  
        await deleteBooking(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Booking not found' });
      });
    });
  });