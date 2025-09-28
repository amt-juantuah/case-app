/**
 * Unit Test:
 * For ValidateStatusAndPriority middleware
 */

const { validateStatusField, validatePriorityField } = require('../middleware/validateStatusAndPriority');
const { messages } = require('../constants');


describe('validateStatusAndPriority middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}};
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
    })

    // Validate Status Field
    describe('validateStatusField', () => {
        it('should call next() and attach status to req when status is valid', () => {
            req.body.status = 'open';
            validateStatusField(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should return 400 status and error message when status is invalid', () => {
            req.body.status = 'invalidStatus';
            validateStatusField(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: messages.status_invalid });
        });

        it('should not call next() when status is missing', () => {
            delete req.body.status;
            validateStatusField(req, res, next);

            expect(next).not.toHaveBeenCalled();
        });
    });

    // Validate Priority Field
    describe('validatePriorityField', () => {
        it('should call next() and attach priority to req when priority is valid', () => {
            req.body.priority = 'high';
            validatePriorityField(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should return 400 status and error message when priority is invalid', () => {
            req.body.priority = 'invalidPriority';
            validatePriorityField(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: messages.priority_invalid });
        });

        it('should not call next() when priority is missing', () => {
            delete req.body.priority;
            validatePriorityField(req, res, next);

            expect(next).not.toHaveBeenCalled();
        });
    });
})