/**
 * Unit Test:
 * For testsing the ValidateCaseExists middleware
 */

const validateCaseExists = require('../middleware/validateCaseExists');
const { messages } = require('../constants');
const CaseService = require('../services/caseService.js');

jest.mock('../services/caseService.js'); // Mock the CaseService for testing

describe('validateCaseExists middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: { id: '123' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('should call next() and attach case to req when case is found', async () => {
        const mockCase = { id: '123', title: 'Test Case', description: 'Test case description' };
        
        CaseService.getCaseById.mockResolvedValue(mockCase);

        await validateCaseExists(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.case).toBe(mockCase);
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(CaseService.getCaseById).toHaveBeenCalledWith('123');
    });

    it('should return 404 status and message when case is not found', async () => {
        CaseService.getCaseById.mockResolvedValue(null);

        await validateCaseExists(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: messages.case_not_found });
        expect(CaseService.getCaseById).toHaveBeenCalledWith('123');
    });

    it('should call next(error) when CaseService throws an error', async () => {
        CaseService.getCaseById.mockRejectedValue(new Error('Test error'));

        await validateCaseExists(req, res, next);

        expect(next).toHaveBeenCalledWith(new Error('Test error'));
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
        expect(CaseService.getCaseById).toHaveBeenCalledWith('123');
    });
})