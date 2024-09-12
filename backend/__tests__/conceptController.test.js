const {
    getConcepts,
    postConcept,
    deleteConcept,
    updateLikeToConcept
  } = require('../controllers/conceptController');
  
  const Concept = require('../models/conceptModel');
  
  jest.mock('../models/conceptModel');
  
  describe('Concept Controller', () => {
    let req, res;
  
    beforeEach(() => {
      req = {
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
  
    describe('getConcepts', () => {
      it('should return all concepts sorted by updatedAt in descending order', async () => {
        const mockConcepts = [
          { _id: 'concept1', tripName: 'Trip 1', updatedAt: new Date('2023-07-02') },
          { _id: 'concept2', tripName: 'Trip 2', updatedAt: new Date('2023-07-01') }
        ];
        
        Concept.find.mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockConcepts)
        });
  
        await getConcepts(req, res);
  
        expect(Concept.find).toHaveBeenCalledWith({});
        expect(Concept.find().sort).toHaveBeenCalledWith({updatedAt: -1});
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockConcepts);
      });
    });
  
    describe('postConcept', () => {
      it('should create a new concept', async () => {
        const mockConcept = {
          tripName: 'New Trip',
          description: 'A fantastic new trip',
          duration: 5
        };
        req.body = {
          concept: mockConcept
        };
  
        const mockCreatedConcept = {
          _id: 'newConcept123',
          ...mockConcept,
          likes: []
        };
  
        Concept.create.mockResolvedValue(mockCreatedConcept);
  
        await postConcept(req, res);
  
        expect(Concept.create).toHaveBeenCalledWith({ ...mockConcept, likes: [] });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          newConcept: mockCreatedConcept,
          msg: 'The concept was made successfully'
        });
      });
  
      it('should return 404 if concept creation fails', async () => {
        req.body = {
          concept: {}
        };
  
        Concept.create.mockResolvedValue(null);
  
        await postConcept(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong...' });
      });
    });
  
    describe('updateLikeToConcept', () => {
      it('should add a like to a concept', async () => {
        req.body = {
          concept_id: 'concept123',
          email: 'user@example.com',
          likeStatus: 'like'
        };
  
        const mockUpdatedConcept = {
          _id: 'concept123',
          likes: ['user@example.com']
        };
  
        Concept.findOneAndUpdate.mockResolvedValue(mockUpdatedConcept);
  
        await updateLikeToConcept(req, res);
  
        expect(Concept.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: 'concept123' },
          { $push: { likes: 'user@example.com' } },
          { new: true, timestamps: false }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUpdatedConcept.likes);
      });
  
      it('should remove a like from a concept', async () => {
        req.body = {
          concept_id: 'concept123',
          email: 'user@example.com',
          likeStatus: 'unlike'
        };
  
        const mockUpdatedConcept = {
          _id: 'concept123',
          likes: []
        };
  
        Concept.findOneAndUpdate.mockResolvedValue(mockUpdatedConcept);
  
        await updateLikeToConcept(req, res);
  
        expect(Concept.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: 'concept123' },
          { $pull: { likes: 'user@example.com' } },
          { new: true, timestamps: false }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUpdatedConcept.likes);
      });
    });
  
    describe('deleteConcept', () => {
      it('should delete a concept', async () => {
        req.body = {
          concept_id: 'concept123'
        };
  
        const mockDeletedConcept = {
          _id: 'concept123',
          tripName: 'Deleted Trip'
        };
  
        Concept.findByIdAndDelete.mockResolvedValue(mockDeletedConcept);
  
        await deleteConcept(req, res);
  
        expect(Concept.findByIdAndDelete).toHaveBeenCalledWith('concept123');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Concept deleted successfully' });
      });
  
      it('should return 404 if concept is not found', async () => {
        req.body = {
          concept_id: 'nonexistent'
        };
  
        Concept.findByIdAndDelete.mockResolvedValue(null);
  
        await deleteConcept(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Concept not found' });
      });
    });
  });