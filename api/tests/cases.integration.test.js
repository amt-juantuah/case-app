/**
 * Integration Tests:
 * For testing the Express API endpoints
 */

const request = require('supertest');
const app = require('../app');
const CaseService = require('../services/caseService.js');
const { v4: uuidv4 } = require('uuid');

// Mock the CaseService for testing to avoid making actual database calls
jest.mock('../services/caseService.js');

describe('Cases API Integration', () => {
    let testCaseId;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('POST /cases should create a new case', async () => {
        const caseData = {
            title: 'Test Case',
            description: 'Test case description',
            status: 'OPEN',
            priority: 'LOW',
            dueDate: new Date(),
        };

        CaseService.createCase.mockResolvedValue({...caseData, id: uuidv4() });

        const response = await request(app)
           .post('/cases')
           .send(caseData);

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('title', caseData.title);
        expect(response.body.data).toHaveProperty('description', caseData.description);
        expect(response.body.data).toHaveProperty('status', caseData.status);
        expect(response.body.data).toHaveProperty('priority', caseData.priority);

        testCaseId = response.body.data.id;
    });

    it('GET /cases/:id should retrieve a case by ID', async () => {
        const caseData = {
            id: testCaseId,
            title: 'Test Case',
            description: 'Test case description',
            status: 'OPEN',
            priority: 'LOW',
            dueDate: new Date(),
        };

        CaseService.getCaseById.mockResolvedValue(caseData);

        const response = await request(app)
           .get(`/cases/${testCaseId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id', testCaseId);
        expect(response.body.data).toHaveProperty('title', caseData.title);
        expect(response.body.data).toHaveProperty('description', caseData.description);
        expect(response.body.data).toHaveProperty('status', caseData.status);
    });

    it('PATCH /cases/:id/status should update a case status', async () => {
        const caseData = {
            id: testCaseId,
            title: 'Test Case',
            description: 'Test case description',
            status: 'OPEN',
            priority: 'LOW',
            dueDate: new Date(),
        };
        const newStatus = 'IN_PROGRESS';

        CaseService.updateCase.mockResolvedValue({...caseData, status: newStatus });

        const response = await request(app)
           .patch(`/cases/${testCaseId}/status`)
           .send({ status: newStatus });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id', testCaseId);
        expect(response.body.data).toHaveProperty('title', caseData.title);
        expect(response.body.data).toHaveProperty('description', caseData.description);
        expect(response.body.data).toHaveProperty('status', newStatus);
    });

    it('PATCH /cases/:id/priority should update a case priority', async () => {
        const caseData = {
            id: testCaseId,
            title: 'Test Case',
            description: 'Test case description',
            status: 'OPEN',
            priority: 'LOW',
            dueDate: new Date(),
        };
        const newPriority = 'HIGH';

        CaseService.updateCase.mockResolvedValue({...caseData, priority: newPriority });

        const response = await request(app)
           .patch(`/cases/${testCaseId}/priority`)
           .send({ priority: newPriority });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id', testCaseId);
        expect(response.body.data).toHaveProperty('title', caseData.title);
        expect(response.body.data).toHaveProperty('description', caseData.description);
    });

    it('DELETE /cases/:id should delete a case by ID', async () => {
        const caseData = {
            id: testCaseId,
            title: 'Test Case',
            description: 'Test case description',
            status: 'OPEN',
            priority: 'LOW',
            dueDate: new Date(),
        };

        CaseService.deleteCase.mockResolvedValue(true);

        const response = await request(app)
           .delete(`/cases/${testCaseId}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Case deleted successfully');
    });

    it('GET /cases should retrieve all cases', async () => {
        const caseData = [
            {
                id: 1,
                title: 'Test Case 1',
                description: 'Test case 1 description',
                status: 'OPEN',
                priority: 'LOW',
                dueDate: new Date(),
            },
            {
                id: 2,
                title: 'Test Case 2',
                description: 'Test case 2 description',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                dueDate: new Date(),
            },
        ];

        CaseService.getAllCases.mockResolvedValue(caseData);

        const response = await request(app)
           .get('/cases');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBe(caseData.length);
    });

    it('GET /cases/:id should return 404 status and message when case is not found', async () => {
        const id = uuidv4(); // random UUID
        CaseService.getCaseById.mockResolvedValue(null);

        const response = await request(app)
           .get(`/cases/${id}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Case not found');
    });

    it('PATCH /cases/:id/status should return 400 status and message when invalid status is provided', async () => {
        const id = uuidv4();
        const invalidStatus = 'INVALID_STATUS';

        const response = await request(app)
           .patch(`/cases/${id}/status`)
           .send({ status: invalidStatus });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid status. Must be one of: OPEN, IN_PROGRESS, CLOSED');
    })

    it('PATCH /cases/:id/priority should return 400 status and message when invalid priority is provided', async () => {
        const id = uuidv4();
        const invalidPriority = 'INVALID_PRIORITY';

        const response = await request(app)
           .patch(`/cases/${id}/priority`)
           .send({ priority: invalidPriority });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid priority. Must be one of: LOW, MEDIUM, HIGH');
    })

    it('DELETE /cases/:id should return 404 status and message when case is not found', async () => {
        const id = uuidv4(); // random UUID

        const response = await request(app)
           .delete(`/cases/${id}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Case not found');
    });
} );