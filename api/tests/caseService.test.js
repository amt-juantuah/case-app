/**
 * Test:
 * On functions in CaseService.js
 */
const { PrismaClient } = require('@prisma/client');
const Case = require('../models/case');

// Mock Prisma Client
var mockCreate = jest.fn();
var mockDelete = jest.fn();
var mockUpdate = jest.fn();
var mockFindUnique = jest.fn();
var mockFindMany = jest.fn();

jest.mock('@prisma/client', () => {
    
    return {
        PrismaClient: jest.fn().mockImplementation(() => ({
            case: {
                create: mockCreate,
                delete: mockDelete,
                update: mockUpdate,
                findUnique: mockFindUnique,
                findMany: mockFindMany
            },
        })),
    }
})

const CaseService = require('../services/caseService');


describe('CaseService unit tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new case', async () => {
        const caseData = {
            title: 'Test Case',
            description: 'Test case description',
            status: 'OPEN',
            priority: 'LOW',
            dueDate: new Date(),
        };

        mockCreate.mockResolvedValue(caseData); // simulate Prisma DB response


        const createdCase = await CaseService.createCase(caseData);

        expect(createdCase).toBeInstanceOf(Case);
        expect(mockCreate).toHaveBeenCalledWith({
            data: caseData
        });
        expect(createdCase.title).toBe(caseData.title);
    });

    it('should return all cases', async () => {
        const casesData = [
            {
                id: 1,
                title: 'Case 1',
                description: 'Case 1 description',
                status: 'OPEN',
                priority: 'LOW',
                dueDate: new Date(),
            },
            {
                id: 2,
                title: 'Case 2',
                description: 'Case 2 description',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                dueDate: new Date(),
            },
        ];

        mockFindMany.mockResolvedValue(casesData); // simulate Prisma DB response


        const cases = await CaseService.getAllCases();

        expect(cases).toBeInstanceOf(Array);
        expect(cases.length).toBe(casesData.length);
        expect(cases).toEqual(casesData);
        expect(mockFindMany).toHaveBeenCalled();
        expect(cases[0]).toBeInstanceOf(Case);
    });

    it('should find a case by ID', async () => {
        const caseData = {
            id: 1,
            title: 'Test Case',
            description: 'Test case description',
            status: 'OPEN',
            priority: 'LOW',
            dueDate: new Date(),
        };

        mockFindUnique.mockResolvedValue(caseData); // simulate Prisma DB response


        const foundCase = await CaseService.getCaseById(caseData.id);

        expect(foundCase).toBeInstanceOf(Case);
        expect(mockFindUnique).toHaveBeenCalledWith({
            where: { id: caseData.id }
        });
        expect(foundCase.title).toBe(caseData.title);
    });

    it('should update a case by ID', async () => {
        const caseData = {
            id: 1,
            title: 'Updated Test Case',
            description: 'Updated Test case description',
            status: 'OPEN',
            priority: 'LOW',
            dueDate: new Date(),
        };

        mockUpdate.mockResolvedValue(caseData); // simulate Prisma DB response


        const updatedCase = await CaseService.updateCase(caseData.id, caseData);

        expect(updatedCase).toBeInstanceOf(Case);
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: caseData.id },
            data: caseData
        });
        expect(updatedCase.title).toBe(caseData.title);
    });

    it('should delete a case by ID', async () => {
        const caseData = {
            id: 1,
        };

        mockDelete.mockResolvedValue(true); // simulate Prisma DB response


        const deleted = await CaseService.deleteCase(caseData.id);

        expect(deleted).toBe(true);
        expect(mockDelete).toHaveBeenCalledWith({
            where: { id: caseData.id }
        });
    });

    it('should start a case by ID', async () => {
        const caseData = {
            id: 1,
            status: 'IN_PROGRESS',
        };

        mockUpdate.mockResolvedValue(caseData); // simulate Prisma DB response


        const startedCase = await CaseService.startCase(caseData.id);

        expect(startedCase).toBeInstanceOf(Case);
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: caseData.id },
            data: { status: 'IN_PROGRESS' }
        });
        expect(startedCase.status).toBe('IN_PROGRESS');
    });

    it('should close a case by ID', async () => {
        const caseData = {
            id: 1,
            status: 'CLOSED',
        };

        mockUpdate.mockResolvedValue(caseData); // simulate Prisma DB response


        const closedCase = await CaseService.closeCase(caseData.id);

        expect(closedCase).toBeInstanceOf(Case);
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: caseData.id },
            data: { status: 'CLOSED', dueDate: new Date() }
        });
        expect(closedCase.status).toBe('CLOSED');
    });

    it('should return null when case not found', async () => {
        mockFindUnique.mockResolvedValue(null); // simulate Prisma DB response


        const foundCase = await CaseService.getCaseById(1);

        expect(foundCase).toBe(null);
        expect(mockFindUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        });
    });
})

