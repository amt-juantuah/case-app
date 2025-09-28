/**
 * A list of: 
 * valid constants
 * messages object
 */

export const validStatuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

export const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];

export const messages = {
    "status_invalid": "Invalid status. Must be one of: OPEN, IN_PROGRESS, CLOSED",
    "priority_invalid": "Invalid priority. Must be one of: LOW, MEDIUM, HIGH",
    "title_dueDate_required": "Title and due date are required",
    "case_status_updated": "Case status updated successfully",
    "case_priority_updated": "Case priority updated successfully",
    "case_not_found": "Case not found",
    "case_found": "Case found successfully",
    "case_created": "Case created successfully",
    "case_deleted": "Case deleted successfully",
    "case_updated": "Case updated successfully",
    "case_started": "Case started successfully",
    "case_closed": "Case closed successfully",
}