"use client";

import { useEffect, useState } from "react";
import { getAllCases, createCase, deleteCase } from "../services/api";
import { messages } from "@/constants";
import Modal from "../components/Modal";
import CreateCaseForm from "@/components/CreateCaseForm";
import EditCaseForm from "@/components/EditCaseForm";
import DeleteCaseConfirm from "@/components/DeleteCaseConfirm";
import toast from "react-hot-toast";
import {
  Layers,
  FolderOpen,
  Loader,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Pencil,
  Trash2,
} from "lucide-react";
import ErrorPage from "@/components/ErrorPage";

export default function DashboardPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorStack, setErrorStack] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    status: messages.open,
    priority: messages.low,
    dueDate: "",
  })
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, caseId: null });
  const [confirmCreateModal, setConfirmCreateModal] = useState({ isOpen: false });
  const [editCase, setEditCase] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  // Fetch cases from backend
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await getAllCases();

        if (response.success) {
          setCases(response.data);
        } else {
          setError(response.message || messages.failed_to_load_cases);
        }
      } catch (err) {
        setError(err.message || messages.failed_to_load_cases);
        setErrorStack(err)
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);


  // Compute summary stats
  const totalCases = cases.length;
  const openCases = cases.filter(c => c.status === messages.open).length;
  const inProgressCases = cases.filter(c => c.status === messages.in_progress).length;
  const closedCases = cases.filter(c => c.status === messages.closed).length;


  // Compute priority stats
  const lowPriority = cases.filter(c => c.priority === messages.low).length;
  const mediumPriority = cases.filter(c => c.priority === messages.medium).length;
  const highPriority = cases.filter(c => c.priority === messages.high).length;


  // Stat tiles/cards
  const tiles = [
    { label: "Total", value: totalCases, key: "ALL", icon: Layers },
    { label: "Open", value: openCases, key: messages.open, icon: FolderOpen },
    { label: "In Progress", value: inProgressCases, key: messages.in_progress, icon: Loader },
    { label: "Closed", value: closedCases, key: messages.closed, icon: CheckCircle2 },
    { label: "Low Priority", value: lowPriority, key: messages.low, icon: ArrowDown },
    { label: "Medium Priority", value: mediumPriority, key: messages.medium, icon: ArrowRight },
    { label: "High Priority", value: highPriority, key: messages.high, icon: ArrowUp },
  ];


  // Handle  creating a case with modal form submission
  const handleCreateCase = async () => {
    setSubmitting(true);
    try {
      const response = await createCase(newCase);

      if (response.success) {
        setCases(prev => [...prev, response.data]);
        setNewCase({
          title: "",
          description: "",
          status: messages.open,
          priority: messages.low,
          dueDate: "",
        });
        setIsModalOpen(false);
        toast.success(response.message);
      } else {
        setError(response.message || messages.failed_to_load_cases);
        toast.error(response.message || messages.failed_to_load_cases);
      }
    } catch (err) {
      setError(err.message || messages.failed_to_load_cases);
      toast.error(err.message || messages.failed_to_load_cases);
    }
  }

  // Delete a case
  const handleDelete = async (id) => {
    // After client confirms deletion, send request to backend
    try {
      const response = await deleteCase(id);

      if (response.success) {
        toast.success(response.message);
        setCases(cases.filter(c => c.id !== id));
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteModal({ isOpen: false, caseId: null });
    }
  };

  // Sort cases based on selected key and direction
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle sorting
  const sortedCases = [...cases].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Handle filtering
  const filteredCases =
    filter === null
      ? sortedCases
      : filter === "ALL"
        ? sortedCases
        : sortedCases.filter(
          (c) => c.status.toUpperCase() === filter || c.priority.toUpperCase() === filter
        );



  // Edit Modal
  const openEditModal = (c) => {
    setEditCase({
      ...c
      // id: c.id,
      // status: c.status,
      // priority: c.priority
    })
    setIsEditModalOpen(true);
  };


  if (loading) {
    return <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
      <p className="text-center mt-10">Loading cases...</p>
    </div>;
  }
  if (error) {
    return <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <ErrorPage 
        statusCode={errorStack.status} 
        message={errorStack.response?.statusText} 
        detail={process.env.NODE_ENV == 'development' && errorStack.response?.data.message || ""}
      />
    </div>;
  }

  return (
    <>
      <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Case Dashboard</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Create Case Task
          </button>
        </div>

        {/* Stats Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.key}
                onClick={() => setFilter(tile.key)}
                className={`cursor-pointer rounded-xl shadow-md p-5 flex flex-col justify-between transition-transform transform hover:scale-105 hover:shadow-lg ${filter === tile.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-6 h-6" />
                  <p className="text-sm font-medium">{tile.label}</p>
                </div>
                <p className="mt-4 text-3xl font-bold">{tile.value}</p>
              </div>
            );
          })}
        </div>


        {/* Cases Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded">
            <thead>
              <tr className="text-left border-b border-gray-700">
                {["title", "description", "status", "priority", "dueDate"].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 cursor-pointer hover:text-blue-400"
                    onClick={() => handleSort(col)}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    {sortConfig.key === col &&
                      (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                  </th>
                ))}
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map(c => (
                <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    <a
                      href={`/cases/${c.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {c.title}
                    </a>
                  </td>
                  <td className="px-4 py-2 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{c.description || "-"}</td>
                  <td className="px-4 py-2">{c.status}</td>
                  <td className="px-4 py-2">{c.priority}</td>
                  <td className="px-4 py-2">{new Date(c.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      aria-label="delete"
                      onClick={() => setDeleteModal({ isOpen: true, caseId: c.id })}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                    <Modal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, caseId: null })}>
                      <DeleteCaseConfirm
                        onDelete={() => handleDelete(deleteModal.caseId)}
                        onCancel={() => setDeleteModal({ isOpen: false, caseId: null })}
                      />
                    </Modal>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <EditCaseForm
          caseData={editCase}
          onSuccess={(updated) =>
            setCases(prev => prev.map(c => c.id === updated.id ? updated : c))
          }
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false) }}
      >
        <CreateCaseForm
          onSuccess={(newCase) => setCases(prev => [...prev, newCase])}
          onClose={() => setIsModalOpen(false)}
        />

        <Modal
          isOpen={confirmCreateModal.isOpen}
          onClose={() => setConfirmCreateModal({ isOpen: false })}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Confirm Case Creation</h2>
            <p className="mb-6">Are you sure you want to create this case?</p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                onClick={() => setConfirmCreateModal({ isOpen: false })}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                onClick={handleCreateCase}
              >
                Create
              </button>
            </div>
          </div>
        </Modal>
      </Modal>
    </>
  );
}
