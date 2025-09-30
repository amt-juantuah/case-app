import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteCaseConfirm from "@/components/DeleteCaseConfirm";

describe("DeleteCaseConfirm", () => {
  const onDelete = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the confirmation title and message", () => {
    render(<DeleteCaseConfirm onDelete={onDelete} onCancel={onCancel} />);

    expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure you want to delete this case/i)).toBeInTheDocument();
  });

  it("renders Cancel and Delete buttons", () => {
    render(<DeleteCaseConfirm onDelete={onDelete} onCancel={onCancel} />);

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("calls onCancel when Cancel button is clicked", async () => {
    render(<DeleteCaseConfirm onDelete={onDelete} onCancel={onCancel} />);
    
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when Delete button is clicked", async () => {
    render(<DeleteCaseConfirm onDelete={onDelete} onCancel={onCancel} />);
    
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
