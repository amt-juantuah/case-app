"use client";
import toast from "react-hot-toast";
import { createCase } from "@/services/api";
import { messages } from "@/constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { caseSchema } from "@/validation/caseSchema";

export default function CreateCaseForm({ onSuccess, onClose }) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: "",
      description: "",
      status: messages.open,
      priority: messages.low,
      dueDate: "",
    }
  })

  const onSubmit = async (data) => {

    try {
      const res = await createCase(data);
      if (res.success) {
        toast.success(res.message);
        onSuccess(res.data);
        onClose();
        reset();
      } else {
        toast.error(res.message || messages.failed_to_load_cases);
      }
    } catch (err) {
      toast.error(err.message || messages.failed_to_load_cases);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        {/* Case Title */}
        <label className="block text-sm font-medium mb-1">
          Case Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("title")}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        {/* Case Description */}
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register("description")}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        {errors.description && (
          <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        {/* Case Status */}
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          {...register("status")}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      <div>
        {/* Case Priority */}
        <label className="block text-sm font-medium mb-1">Priority</label>
        <select
          {...register("priority")}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div>
        {/* Case Due Date */}
        <label className="block text-sm font-medium mb-1">Due Date</label>
        <input
          type="datetime-local"
          // required
          {...register("dueDate")}
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        {errors.dueDate && (
          <p className="text-red-500 mt-1 text-sm">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          {isSubmitting ? "Creating..." : "Create Case"}
        </button>
      </div>
    </form>
  );
}
