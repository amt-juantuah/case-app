/**
 * Unit Test:
 * For testing ValidateUuidParam middleware
 */

const validateUuidParam = require('../middleware/validateUuidParam');

describe("validateUuidParam middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = { params: { id: "" } };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it("should call next() when valid UUID format is provided", () => {
        req.params.id = "123e4567-e89b-12d3-a456-426655440000";
        validateUuidParam(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it("should return 400 status and message when invalid UUID format is provided", () => {
        req.params.id = "invalid-uuid";
        validateUuidParam(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid UUID format' });
    });
})