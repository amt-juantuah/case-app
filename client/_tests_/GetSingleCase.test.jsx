import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CaseViewPage from "@/app/cases/[id]/page";
import { getCaseById, updateCaseStatus, updateCasePriority, deleteCase } from "@/services/api";
import { useRouter, useParams } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock API and toast
jest.mock("@/services/api");
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("ViewSingleCase", () => {
  const mockCase = {
    id: "1",
    title: "Test Case",
    description: "This is a test case",
    status: "OPEN",
    priority: "LOW",
    dueDate: "2099-12-31T12:00:00.000Z",
  };

  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: "1" });
    useRouter.mockReturnValue({ push: pushMock });
  });

  it("renders loading initially", () => {
    getCaseById.mockReturnValue(new Promise(() => {})); // never resolves
    render(<CaseViewPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders error if API fails", async () => {
    getCaseById.mockRejectedValue(new Error("Network error"));
    render(<CaseViewPage />);
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });

  it("renders case details", async () => {
    getCaseById.mockResolvedValue({ success: true, data: mockCase });
    render(<CaseViewPage />);
    await waitFor(() => screen.getByText("Test Case"));

    expect(screen.getByText("Test Case")).toBeInTheDocument();
    expect(screen.getByText("This is a test case")).toBeInTheDocument();
    expect(screen.getByText("OPEN")).toBeInTheDocument();
    expect(screen.getByText("LOW")).toBeInTheDocument();
  });

  it("updates case via edit modal", async () => {
    getCaseById.mockResolvedValue({ success: true, data: mockCase });
    updateCaseStatus.mockResolvedValue({ success: true, message: "Updated" });
    updateCasePriority.mockResolvedValue({ success: true, message: "Updated" });

    render(<CaseViewPage />);
    await waitFor(() => screen.getByText("Test Case"));

    // Open edit modal
    const editButton = screen.getByRole("button", { name: /edit case/i });
    userEvent.click(editButton);

    // Wait for modal to render
    

    // Change status and priority
    const statusSelect = await waitFor(() => screen.getByLabelText(/status/i));
    const prioritySelect = screen.getByLabelText(/priority/i);

    userEvent.selectOptions(statusSelect, "IN_PROGRESS");
    userEvent.selectOptions(prioritySelect, "HIGH");

    // Submit update
    const updateButton = screen.getByRole("button", { name: /update case/i });
    userEvent.click(updateButton);

    await waitFor(() => {
      expect(updateCaseStatus).toHaveBeenCalledWith("1", "IN_PROGRESS");
      expect(updateCasePriority).toHaveBeenCalledWith("1", "HIGH");
    });
  });

  it("deletes case successfully", async () => {
    getCaseById.mockResolvedValue({ success: true, data: mockCase });
    deleteCase.mockResolvedValue({ success: true, message: "Deleted" });

    render(<CaseViewPage />);
    await waitFor(() => screen.getByText("Test Case"));

    const deleteButton = screen.getByRole("button", { name: /delete case/i });
    userEvent.click(deleteButton);

    const confirmDelete = await screen.findByRole("button", { name: /confirm delete/i });
    userEvent.click(confirmDelete);

    await waitFor(() => {
      expect(deleteCase).toHaveBeenCalledWith("1");
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });
});
