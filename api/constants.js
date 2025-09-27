/**
 * A list of: 
 * valid constants
 * messages object
 */

export const validStatuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export const validPriorities = ['LOW', 'NORMAL', 'HIGH'];

export const messages = {
    "status_invalid": "Invalid status. Must be one of: OPEN, IN_PROGRESS, CLOSED",
    "priority_invalid": "Invalid priority. Must be one of: LOW, NORMAL, HIGH",
    "title_dueDate_required": "Title and due date are required"
}