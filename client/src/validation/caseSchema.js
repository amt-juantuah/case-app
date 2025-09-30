import { z } from "zod";

export const caseSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().optional(),
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    dueDate: z
        .string()
        .nonempty("Due date is required")
        .refine(
            (val) => {
                const date = new Date(val);
                return !isNaN(date) && date >= new Date();
            },
            {
                message: "Due date must be a valid date and cannot be in the past",
            }
        ),
});
