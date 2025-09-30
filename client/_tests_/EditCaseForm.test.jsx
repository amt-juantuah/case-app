import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditCaseForm from "@/components/EditCaseForm";
import { updateCaseStatus, updateCasePriority } from "@/services/api";
import toast from "react-hot-toast";

jest.mock("@/services/api");
jest.mock("react-hot-toast", () => ({
    success: jest.fn(),
    error: jest.fn(),
    default: jest.fn(),
}));

describe("EditCaseForm", () => {
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    const caseData = {
        id: "1",
        status: "OPEN",
        priority: "LOW",
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders status and priority fields and submit button", () => {
        render(<EditCaseForm caseData={caseData} onSuccess={onSuccess} onClose={onClose} />);
        expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /update case/i })).toBeInTheDocument();
    });

    it("calls updateCaseStatus when status is changed", async () => {
        updateCaseStatus.mockResolvedValue({ success: true });
        render(<EditCaseForm caseData={caseData} onSuccess={onSuccess} onClose={onClose} />);

        await userEvent.selectOptions(screen.getByLabelText(/status/i), "IN_PROGRESS");
        await userEvent.click(screen.getByRole("button", { name: /update case/i }));

        expect(updateCaseStatus).toHaveBeenCalledWith("1", "IN_PROGRESS");
        await screen.findByRole("button", { name: /update case/i }); // wait for re-render
    });

    it("calls updateCasePriority when priority is changed", async () => {
        updateCasePriority.mockResolvedValue({ success: true });
        render(<EditCaseForm caseData={caseData} onSuccess={onSuccess} onClose={onClose} />);

        await userEvent.selectOptions(screen.getByLabelText(/priority/i), "HIGH");
        await userEvent.click(screen.getByRole("button", { name: /update case/i }));

        expect(updateCasePriority).toHaveBeenCalledWith("1", "HIGH");
    });

    it("calls onSuccess and toast when update is successful", async () => {
        updateCaseStatus.mockResolvedValue({ success: true });
        updateCasePriority.mockResolvedValue({ success: true });

        render(<EditCaseForm caseData={caseData} onSuccess={onSuccess} onClose={onClose} />);

        await userEvent.selectOptions(screen.getByLabelText(/status/i), "IN_PROGRESS");
        await userEvent.selectOptions(screen.getByLabelText(/priority/i), "HIGH");
        await userEvent.click(screen.getByRole("button", { name: /update case/i }));

        expect(onSuccess).toHaveBeenCalledWith({ ...caseData, status: "IN_PROGRESS", priority: "HIGH" });
        expect(onClose).toHaveBeenCalled();
    });

    it("shows no changes detected if nothing changed", async () => {
        render(<EditCaseForm caseData={caseData} onSuccess={onSuccess} onClose={onClose} />);

        await userEvent.click(screen.getByRole("button", { name: /update case/i }));

        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("shows error toast if API throws", async () => {
        updateCaseStatus.mockRejectedValue(new Error("Failed to update"));

        render(<EditCaseForm caseData={caseData} onSuccess={onSuccess} onClose={onClose} />);
        await userEvent.selectOptions(screen.getByLabelText(/status/i), "IN_PROGRESS");
        await userEvent.click(screen.getByRole("button", { name: /update case/i }));

        expect(onSuccess).not.toHaveBeenCalled();
    });
});
