import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateCaseForm from "@/components/CreateCaseForm";
import { createCase } from "@/services/api";
import "@testing-library/jest-dom";

import toast from "react-hot-toast";

// Mock the API and toast
jest.mock("@/services/api");
jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),

}));

describe("CreateCaseForm", () => {
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the form fields and submit button", () => {
        render(<CreateCaseForm onSuccess={onSuccess} onClose={onClose} />);

        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /create case/i })).toBeInTheDocument();
    });

    it("shows validation errors when required fields are empty", async () => {
        render(<CreateCaseForm onSuccess={onSuccess} onClose={onClose} />);

        userEvent.click(screen.getByRole("button", { name: /create case/i }));

        await waitFor(() => {
            expect(screen.getByText(/Title must be at least 5 characters/i)).toBeInTheDocument();
            expect(screen.getByText(/Due date is required/i)).toBeInTheDocument();
        });
    });

    it("submits the form successfully and calls callbacks", async () => {
        createCase.mockResolvedValue({
            success: true,
            message: "Case created",
            data: { id: "1", title: "Test Case" },
        });

        render(<CreateCaseForm onSuccess={onSuccess} onClose={onClose} />);

        const futureDate = "2099-12-31T23:59";
        // Fill all required fields
        await userEvent.type(screen.getByLabelText(/case title/i), "Test Case");
        await userEvent.type(screen.getByLabelText(/due date/i), "2099-12-31T23:59");

        // Select dropdowns
        await userEvent.selectOptions(screen.getByLabelText(/status/i), "OPEN");
        await userEvent.selectOptions(screen.getByLabelText(/priority/i), "HIGH");

        // Submit
        await userEvent.click(screen.getByRole("button", { name: /create case/i }));

        // Verify submission
        await waitFor(() => {
            expect(createCase).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Test Case",
                    dueDate: futureDate,
                    status: "OPEN",
                    priority: "HIGH",
                })
            );
            expect(toast.success).toHaveBeenCalledWith("Case created");
            expect(onSuccess).toHaveBeenCalledWith({ id: "1", title: "Test Case" });
            expect(onClose).toHaveBeenCalled();
        });
    });



      it("handles API returning success: false", async () => {
        createCase.mockResolvedValue({
          success: false,
          message: "Failed to create",
        });

        render(<CreateCaseForm onSuccess={onSuccess} onClose={onClose} />);

        userEvent.type(screen.getByLabelText(/case title/i), "Test Case");
        userEvent.type(screen.getByLabelText(/due date/i), "2025-09-30T12:00");

        // Select dropdowns
        await userEvent.selectOptions(screen.getByLabelText(/status/i), "OPEN");
        await userEvent.selectOptions(screen.getByLabelText(/priority/i), "HIGH");
        
        userEvent.click(screen.getByRole("button", { name: /create case/i }));

        await waitFor(() => {
        //   expect(toast.error).toHaveBeenCalledWith("Failed to create case");
          expect(onSuccess).not.toHaveBeenCalled();
          expect(onClose).not.toHaveBeenCalled();
        });
      });

      it("handles API throwing an exception", async () => {
        createCase.mockRejectedValue(new Error("Network error"));

        render(<CreateCaseForm onSuccess={onSuccess} onClose={onClose} />);

        userEvent.type(screen.getByLabelText(/case title/i), "Test Case");
        userEvent.type(screen.getByLabelText(/due date/i), "2025-09-30T12:00");

        // Select dropdowns
        await userEvent.selectOptions(screen.getByLabelText(/status/i), "OPEN");
        await userEvent.selectOptions(screen.getByLabelText(/priority/i), "HIGH");
        
        userEvent.click(screen.getByRole("button", { name: /create case/i }));

        await waitFor(() => {
        //   expect(toast.error).toHaveBeenCalledWith("Network error");
          expect(onSuccess).not.toHaveBeenCalled();
          expect(onClose).not.toHaveBeenCalled();
        });
      });

      it("resets the form after successful submission", async () => {
        createCase.mockResolvedValue({
          success: true,
          message: "Created",
          data: { id: "1" },
        });

        render(<CreateCaseForm onSuccess={onSuccess} onClose={onClose} />);

        const titleInput = screen.getByLabelText(/case title/i);
        const dueDateInput = screen.getByLabelText(/due date/i);

        userEvent.type(titleInput, "Test Case");
        userEvent.type(dueDateInput, "2025-09-30T12:00");

        userEvent.click(screen.getByRole("button", { name: /create case/i }));

        await waitFor(() => {
          expect(titleInput.value).toBe("");
          expect(dueDateInput.value).toBe("");
        });
      });

      it("allows selecting different status and priority options", () => {
        render(<CreateCaseForm onSuccess={onSuccess} onClose={onClose} />);

        const statusSelect = screen.getByLabelText(/status/i);
        const prioritySelect = screen.getByLabelText(/priority/i);

        fireEvent.change(statusSelect, { target: { value: "IN_PROGRESS" } });
        fireEvent.change(prioritySelect, { target: { value: "HIGH" } });

        expect(statusSelect.value).toBe("IN_PROGRESS");
        expect(prioritySelect.value).toBe("HIGH");
      });
});
