"use client";

import { useEffect, useState } from "react";
import { getAllCases, createCase } from "../services/api";
import { messages } from "@/constants";
import CreateCaseModal from "../components/CreateCaseModal";
import toast from "react-hot-toast";
import {
  Layers,
  FolderOpen,
  Loader,
  CheckCircle2,
  ArrowDown,
  ArrowRight,
  ArrowUp,
} from "lucide-react";

export default function DashboardPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    title: "",
    description: "",
    status: messages.open,
    priority: messages.low,
    dueDate: "",
  })
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState(null);


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

  // Handle filter change with stat tile clicks
  const displayedCases =
    filter === null
      ? cases
      : filter === "ALL"
        ? cases
        : cases.filter(
          (c) => c.status.toUpperCase() === filter || c.priority.toUpperCase() === filter
        );

  const tiles = [
    { label: "Total", value: totalCases, key: "ALL", icon: Layers },
    { label: "Open", value: openCases, key: messages.open, icon: FolderOpen },
    { label: "In Progress", value: inProgressCases, key: messages.in_progress, icon: Loader },
    { label: "Closed", value: closedCases, key: messages.closed, icon: CheckCircle2 },
    { label: "Low Priority", value: lowPriority, key: messages.low, icon: ArrowDown },
    { label: "Medium Priority", value: mediumPriority, key: messages.medium, icon: ArrowRight },
    { label: "High Priority", value: highPriority, key: messages.high, icon: ArrowUp },
  ];

  // Handle modal form submission
  const handleCreateCase = async (e) => {
    e.preventDefault();
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
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <p className="text-center mt-10">Loading cases...</p>
    </div>;
  }
  if (error) {
    return <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <p className="text-center mt-10 text-red-500">Loading cases...</p>
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
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedCases.map(c => (
                <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2">{c.title}</td>
                  <td className="px-4 py-2">{c.description || "-"}</td>
                  <td className="px-4 py-2">{c.status}</td>
                  <td className="px-4 py-2">{c.priority}</td>
                  <td className="px-4 py-2">{new Date(c.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateCaseModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false) }}
      >

        {/* Case Creation Form */}
        <form onSubmit={handleCreateCase} className="space-y-4">

          {/* ----- Case Title ----- */}
          <div className="relative group">
            <label className="block text-sm font-medium mb-1">
              Case Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newCase.title}
              onChange={e => setNewCase({ ...newCase, title: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* ----- Case Description ----- */}
          <div>
            <label className="block text-sm font-medium mb-1">Case Description</label>
            <textarea
              value={newCase.description}
              onChange={e => setNewCase({ ...newCase, description: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* ----- Case Status ----- */}
          <div className="relative group">
            <label className="block text-sm font-medium mb-1">
              Case Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={newCase.status}
              onChange={e => setNewCase({ ...newCase, status: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          {/* ----- Case Priority ----- */}
          <div>
            <label className="block text-sm font-medium mb-1">Case Priority</label>
            <select
              required
              value={newCase.priority}
              onChange={e => setNewCase({ ...newCase, priority: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>


          {/* ----- Case Due Date ----- */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Case Due Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              required
              value={newCase.dueDate}
              onChange={e => setNewCase({ ...newCase, dueDate: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>

          <span className="absolute left-full ml-2 top-0 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
            This field is required
          </span>

          {/* ----- Submit Button ----- */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </CreateCaseModal>
    </>
  );
}
