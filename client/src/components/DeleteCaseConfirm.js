"use client";

export default function DeleteCaseConfirm({ onDelete, onCancel }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl text-black font-bold mb-4">Confirm Delete</h2>
      <p className="text-black mb-6">Are you sure you want to delete this case?</p>
      <div className="flex justify-end gap-3">
        <button
          className="bg-white text-black border border-black hover:bg-gray-600 py-2 px-4"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-black hover:bg-white hover:text-black text-lg text-white py-2 px-4 outline border border-black transition-all"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
