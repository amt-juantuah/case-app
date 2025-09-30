// _tests_/api.test.jsx
import api, * as apiService from "../src/services/api";

jest.mock("../src/services/api", () => {
  const original = jest.requireActual("../src/services/api");
  return {
    ...original,
    __esModule: true,
    default: {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    },
  };
});

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("API Service", () => {
  const mockCase = { 
    id: "1", 
    title: "Test Case", 
    description: "This is a test case", 
    status: "OPEN", 
    priority: "LOW", 
    dueDate: "2099-12-31T12:00:00.000Z" 
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getAllCases returns success", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: [mockCase] } });
    const res = await apiService.getAllCases();
    expect(res.success).toBe(true);
  });
});
