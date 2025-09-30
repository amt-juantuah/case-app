// _tests_/DashboardPage.test.jsx
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "@/app/page";
import { getAllCases, createCase, deleteCase } from "@/services/api";
import toast from "react-hot-toast";
import { messages } from "@/constants";
// import { act } from "react";
import { within } from "@testing-library/react";

jest.mock("@/services/api");
jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),
}));

describe("DashboardPage", () => {
    const mockCases = [
        { id: "1", title: "Case 1", description: "Desc 1", status: messages.open, priority: messages.low, dueDate: "2099-12-31T12:00" },
        { id: "2", title: "Case 2", description: "Desc 2", status: messages.in_progress, priority: messages.high, dueDate: "2099-12-30T12:00" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders loading state initially", async () => {
        getAllCases.mockResolvedValue({ success: true, data: [] });
        render(<DashboardPage />);
        expect(screen.getByText(/loading cases/i)).toBeInTheDocument();
    });

    it("renders cases after fetch", async () => {
        getAllCases.mockResolvedValue({ success: true, data: mockCases });
        render(<DashboardPage />);
        await waitFor(() => {
            expect(screen.getByText("Case 1")).toBeInTheDocument();
            expect(screen.getByText("Case 2")).toBeInTheDocument();
        });
    });

    it("shows error message if API fails", async () => {
        getAllCases.mockRejectedValue(new Error("API error"));
        render(<DashboardPage />);
        await waitFor(() => {
            expect(screen.getByText(/api error/i)).toBeInTheDocument();
        });
    });

    it("opens create case modal when 'Create Case Task' button is clicked", async () => {
        getAllCases.mockResolvedValue({ success: true, data: [] });
        render(<DashboardPage />);
        await waitFor(() => screen.getByText(/create case task/i));
        userEvent.click(screen.getByText(/create case task/i));
        expect(screen.getByText(/create/i)).toBeInTheDocument();
    });

    it("deletes a case successfully", async () => {
        getAllCases.mockResolvedValue({ success: true, data: mockCases });
        deleteCase.mockResolvedValue({ success: true, message: "Deleted" });

        render(<DashboardPage />);

        // Wait for cases to render
        await waitFor(() => expect(screen.getByText("Case 1")).toBeInTheDocument());

        // Open delete modal
        const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
        await userEvent.click(deleteButtons[0]);

        // Confirm delete
        //const confirmButton = await screen.findByRole("button", { name: /delete/i });
        const modal = await screen.findByRole("dialog"); // assuming your Modal has role="dialog"
        const confirmButton = within(modal).getByRole("button", { name: /delete/i });
        await userEvent.click(confirmButton);

        // Wait for API call
        await waitFor(() => {
            expect(deleteCase).toHaveBeenCalledWith("1");
        });

        // Optionally check that case is removed from DOM
        await waitFor(() => {
            expect(screen.queryByText("Case 1")).not.toBeInTheDocument();
        });
    });


    it("sorts cases by column header", async () => {
        getAllCases.mockResolvedValue({ success: true, data: mockCases });
        render(<DashboardPage />);
        await waitFor(() => screen.getByText("Case 1"));

        const titleHeader = screen.getByText(/^title$/i);
        fireEvent.click(titleHeader); // Ascending
        fireEvent.click(titleHeader); // Descending
    });
});
