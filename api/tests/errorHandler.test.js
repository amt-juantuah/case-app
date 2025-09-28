/**
 * Unit Test:
 * For the Error handling middleware
 */

const errorHandler = require('../middleware/errorHandler');
const { messages } = require('../constants');

describe('errorHandler middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: { id: '123' } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        process.env.NODE_ENV = 'test';
    });

    it('should handle a 500 error', () => {
        const error = new Error('Internal server error');
        error.status = 500;

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: messages.internal_server_error ,message: messages.internal_server_error });
    });

    it('should handle a custom error message', () => {
        const error = new Error('Test error');

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Test error', message: 'Test error' });
    });
})