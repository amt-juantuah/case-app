
const Case = require('../models/case.js');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Service class to handle CRUD 
 * operations on cases
 */
class CaseService {

    // create and add a new case to the database
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
                dueDate: caseObj.dueDate,
            },
        });

        return new Case(saved); // hydrate DB object as Case
    }

    // get all cases from the database, sorted by openedAt in descending order
    async getAllCases() {
        const cases = await prisma.case.findMany({ orderBy: { createdDate: 'desc' } });
        return cases.map(c => new Case(c));
    }

    // get a case by its ID from the database
    async getCaseById(id) {
        const found = await prisma.case.findUnique({ where: { id } });
        return found ? new Case(found) : null;
    }

    // update a case by its ID in the database with new data
    async updateCase(id, caseData) {
        const updated = await prisma.case.update({
            where: { id },
            data: caseData, // caseData should match Case fields
        });
        return new Case(updated);
    }

    // start a case by its ID in the database
    async startCase(id) {
        const updated = await prisma.case.update({
            where: { id },
            data: { status: 'IN_PROGRESS' },
        });
        return new Case(updated);
    }

    // close a case by its ID in the database
    async closeCase(id) {
        const updated = await prisma.case.update({
            where: { id },
            data: { status: 'CLOSED', dueDate: new Date() },
        });
        return new Case(updated);
    }

    // delete a case by its ID from the database
    async deleteCase(id) {
        return await prisma.case.delete({ where: { id } });
    }
}

module.exports = new CaseService();
