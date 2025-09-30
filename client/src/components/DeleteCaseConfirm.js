"use client";

export default function DeleteCaseConfirm({ onDelete, onCancel }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
      <p className="mb-6">Are you sure you want to delete this case?</p>
      <div className="flex justify-end gap-3">
        <button
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
