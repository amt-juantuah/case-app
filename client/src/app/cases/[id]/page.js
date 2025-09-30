"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    getCaseById,
    deleteCase,
    updateCaseStatus,
    updateCasePriority
} from "@/services/api";
import { messages } from "@/constants";
import Link from "next/link";
import toast from "react-hot-toast";
import { Loader, Pencil, Trash2 } from "lucide-react";
import CaseModal from "@/components/Modal"; // renamed for clarity

export default function CaseViewPage() {
    const params = useParams();
    const { id } = params;
    const router = useRouter();

    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [editFields, setEditFields] = useState({
        status: messages.open,
        priority: messages.low
    });

    // Fetch case data
    useEffect(() => {
        const fetchCase = async () => {
            try {
                const response = await getCaseById(id);
                if (response.success) {
                    setCaseData(response.data);
                    setEditFields({
                        status: response.data.status,
                        priority: response.data.priority
                    });
                } else {
                    setError(response.message || messages.failed_to_load_cases);
                }
            } catch (err) {
                setError(err.message || messages.failed_to_load_cases);
            } finally {
                setLoading(false);
            }
        };
        fetchCase();
    }, [id]);

    // Badge colors
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "OPEN": return "bg-green-600";
            case "IN_PROGRESS": return "bg-yellow-500";
            case "CLOSED": return "bg-red-600";
            default: return "bg-gray-500";
        }
    };

    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case "LOW": return "bg-green-600";
            case "MEDIUM": return "bg-yellow-500";
            case "HIGH": return "bg-red-600";
            default: return "bg-gray-500";
        }
    };

    // Open edit modal
    const openEditModal = () => {
        setEditFields({
            status: caseData.status,
            priority: caseData.priority
        });
        setIsEditModalOpen(true);
    };

    // Handle case update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let updated = false;

            if (editFields.status !== caseData.status) {
                const res = await updateCaseStatus(id, editFields.status);
                if (!res.success) throw new Error(res.message);
                updated = true;
            }

            if (editFields.priority !== caseData.priority) {
                const res = await updateCasePriority(id, editFields.priority);
                if (!res.success) throw new Error(res.message);
                updated = true;
            }

            if (updated) {
                setCaseData(prev => ({ ...prev, ...editFields }));
                toast.success(messages.case_updated);
            } else {
                toast(messages.no_changes_detected);
            }

            setIsEditModalOpen(false);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle case delete
    const handleDelete = async () => {
        setSubmitting(true);
        try {
            const response = await deleteCase(id);
            if (response.success) {
                toast.success(response.message);
                router.push("/");
            } else {
                toast.error(response.message);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <Loader className="w-12 h-12 text-blue-400 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="text-center mt-10 text-red-500 bg-gray-900 min-h-screen flex flex-col items-center justify-center">
            <p>{error}</p>
            <Link href="/" className="text-blue-400 underline mt-4">Go Back</Link>
        </div>
    );

    if (!caseData) return (
        <div className="text-center mt-10 text-white bg-gray-900 min-h-screen flex flex-col items-center justify-center">
            <p>Case not found</p>
            <Link href="/" className="text-blue-400 underline mt-4">Go Back</Link>
        </div>
    );

    return (
        <div className="container mx-auto p-6 bg-gray-900 text-white flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Case Details</h1>
                <Link href="/" className="text-blue-400 hover:underline">Back</Link>
            </div>

            <div className="max-w-6xl min-w-full mx-auto bg-gray-800 p-6 rounded-lg shadow-md min-h-[70vh]">
                {/* Title + Actions */}
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold break-words">{caseData.title}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={openEditModal}
                            className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
                            aria-label="Edit Case"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            disabled={submitting}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                            aria-label="Delete Case"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-6">
                    {/* Left Sidebar (sticky) */}
                    <div className="w-1/4 flex flex-col gap-4 sticky top-6 self-start">
                        <div>
                            <span className="font-semibold">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded ${getStatusBadgeColor(caseData.status)}`}>
                                {caseData.status}
                            </span>
                        </div>

                        <div>
                            <span className="font-semibold">Priority:</span>
                            <span className={`ml-2 px-2 py-1 rounded ${getPriorityBadgeColor(caseData.priority)}`}>
                                {caseData.priority}
                            </span>
                        </div>

                        <div>
                            <span className="font-semibold">Due Date:</span>
                            <p className="mt-1">{new Date(caseData.dueDate).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Right Description */}
                    <div className="w-3/4 flex flex-col">
                        <span className="font-semibold">Description:</span>
                        <div className="mt-2 flex-1 overflow-auto p-4 bg-gray-700 rounded">
                            {caseData.description || "-"}
                        </div>
                    </div>
                </div>
            </div>


            {/* Edit Modal */}
            <CaseModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Case"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Status <span className="text-red-500">*</span></label>
                        <select
                            value={editFields.status}
                            onChange={e => setEditFields({ ...editFields, status: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            required
                        >
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Priority <span className="text-red-500">*</span></label>
                        <select
                            value={editFields.priority}
                            onChange={e => setEditFields({ ...editFields, priority: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 text-white"
                            required
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
            </CaseModal>

            {/* Delete Confirmation Modal */}
            <CaseModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
            >
                <p>Are you sure you want to delete this case?</p>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={submitting}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        {submitting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </CaseModal>
        </div>
    );
}
