"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { createCase } from "@/services/api";
import { messages } from "@/constants";

export default function CreateCaseForm({ onSuccess, onClose }) {
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    status: messages.open,
    priority: messages.low,
    dueDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createCase(newCase);
      if (res.success) {
        toast.success(res.message);
        onSuccess(res.data);
        onClose();
      } else {
        toast.error(res.message || messages.failed_to_load_cases);
      }
    } catch (err) {
      toast.error(err.message || messages.failed_to_load_cases);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Case Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          value={newCase.title}
          onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={newCase.description}
          onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={newCase.status}
          onChange={(e) => setNewCase({ ...newCase, status: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Priority</label>
        <select
          value={newCase.priority}
          onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          type="datetime-local"
          required
          value={newCase.dueDate}
          onChange={(e) => setNewCase({ ...newCase, dueDate: e.target.value })}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          {submitting ? "Creating..." : "Create Case"}
        </button>
      </div>
    </form>
  );
}
