import { PrismaClient } from '@prisma/client';
import Case from '../models/Case.js';

const prisma = new PrismaClient();

/**
 * Service class to handle CRUD 
 * operations on cases
 */
class CaseService {

    async createCase(caseData) {
        // Instantiate Case object (data holder only)
        const caseObj = new Case(caseData);

        // Save to DB
        const saved = await prisma.case.create({
            data: {
                title: caseObj.title,
                description: caseObj.description,
                status: caseObj.status,
                priority: caseObj.priority,
                closedAt: caseObj.closedAt,
            },
        });

        return new Case(saved); // hydrate DB object as Case
    }

    async getAllCases() {
        const cases = await prisma.case.findMany({ orderBy: { openedAt: 'desc' } });
        return cases.map(c => new Case(c));
    }

    async getCaseById(id) {
        const found = await prisma.case.findUnique({ where: { id } });
        return found ? new Case(found) : null;
    }

    async updateCase(id, caseData) {
        const updated = await prisma.case.update({
            where: { id },
            data: caseData, // caseData should match Case fields
        });
        return new Case(updated);
    }

    async startCase(id) {
        const updated = await prisma.case.update({
            where: { id },
            data: { status: 'IN_PROGRESS' },
        });
        return new Case(updated);
    }

    async closeCase(id) {
        const updated = await prisma.case.update({
            where: { id },
            data: { status: 'CLOSED', dueDate: new Date() },
        });
        return new Case(updated);
    }

    async deleteCase(id) {
        return await prisma.case.delete({ where: { id } });
    }
}

export default CaseService();
