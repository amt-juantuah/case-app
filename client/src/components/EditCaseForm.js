"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateCasePriority, updateCaseStatus } from "@/services/api";
import { messages } from "@/constants";

export default function EditCaseForm({ caseData, onSuccess, onClose }) {
  const [editCase, setEditCase] = useState({ ...caseData });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let updated = false;

      if (editCase.status !== caseData.status) {
        const res = await updateCaseStatus(editCase.id, editCase.status);
        if (!res.success) throw new Error(res.message);
        updated = true;
      }

      if (editCase.priority !== caseData.priority) {
        const res = await updateCasePriority(editCase.id, editCase.priority);
        if (!res.success) throw new Error(res.message);
        updated = true;
      }

      if (updated) {
        onSuccess(editCase);
        toast.success(messages.case_updated);
      } else {
        toast(messages.no_changes_detected);
      }
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="status" className="block text-sm text-gray-500 font-bold mb-1">Status</label>
        <select
          id="status"
          value={editCase.status}
          onChange={(e) => setEditCase({ ...editCase, status: e.target.value })}
          className="w-full p-2 bg-white text-black border border-black"
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm text-gray-500 font-bold mb-1">Priority</label>
        <select
          id="priority"
          value={editCase.priority}
          onChange={(e) => setEditCase({ ...editCase, priority: e.target.value })}
          className="w-full p-2 bg-white text-black border border-black"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          {submitting ? "Updating..." : "Update Case"}
        </button>
      </div>
    </form>
  );
}
