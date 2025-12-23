// components/AddClassForm.tsx
"use client";

import { basUrl } from "@/app/basUrl";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Gym {
  ID: string;
  Name: string;
  Address: string;
  Phone: string;
  Timezone: string;
  OpeningHours: any;
  Settings: any;
  CreatedAt: string;
  UpdatedAt: string;
  Classes: any;
  InventoryItems: any;
}

interface Trainer {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  membership_type: string;
  join_date: string;
  membership_start: string | null;
  membership_end: string | null;
  fitness_goals: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  status: string;
  user_type: string;
  profile_picture_url: string;
  created_at: string;
  updated_at: string;
  Gender: string;
  Member: any;
}

interface TrainersResponse {
  count: number;
  trainers: Trainer[];
}

interface ClassFormData {
  gym_id: string;
  trainer_id: string;
  title: string;
  description: string;
  capacity: number;
  duration_minutes: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  class?: any;
}

const AddClassForm: React.FC = () => {
  const [formData, setFormData] = useState<ClassFormData>({
    gym_id: "",
    trainer_id: "",
    title: "",
    description: "",
    capacity: 10,
    duration_minutes: 60,
  });

  const [gyms, setGyms] = useState<Gym[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGyms, setIsLoadingGyms] = useState(true);
  const [isLoadingTrainers, setIsLoadingTrainers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Common class durations
  const durationOptions = [
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 75, label: "1 hour 15 minutes" },
    { value: 90, label: "1 hour 30 minutes" },
    { value: 120, label: "2 hours" },
  ];

  // Common capacity options
  const capacityOptions = [5, 10, 15, 20, 25, 30, 40, 50];

  // Fetch gyms from API
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setIsLoadingGyms(true);
        const response = await fetch(`${basUrl}gymx`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const gymsData: Gym[] = await response.json();
        setGyms(gymsData);

        // Auto-select the first gym if available
        if (gymsData.length > 0) {
          setFormData((prev) => ({
            ...prev,
            gym_id: gymsData[0].ID,
          }));
        }
      } catch (err) {
        console.error("Error fetching gyms:", err);
        setError("Failed to load gyms. Please try again.");
      } finally {
        setIsLoadingGyms(false);
      }
    };

    fetchGyms();
  }, []);

  // Fetch trainers from API
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setIsLoadingTrainers(true);
        const response = await fetch(`${basUrl}auth/trainer`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const trainersData: TrainersResponse = await response.json();
        setTrainers(trainersData.trainers);

        // Auto-select the first trainer if available
        if (trainersData.trainers.length > 0) {
          setFormData((prev) => ({
            ...prev,
            trainer_id: trainersData.trainers[0].user_id,
          }));
        }
      } catch (err) {
        console.error("Error fetching trainers:", err);
        setError("Failed to load trainers. Please try again.");
      } finally {
        setIsLoadingTrainers(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "capacity" || name === "duration_minutes") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.gym_id || !formData.trainer_id || !formData.title) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Sending data to API:", formData);

      const response = await fetch(`${basUrl}class`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `HTTP error! status: ${response.status}`
        );
      }

      if (result.success) {
        setSuccess(true);
        toast.success(`Class added successfully!`, {
          duration: 4000,
          position: "top-right",
        });
        router.push("/classes");
        // Reset form after successful submission
      } else {
        throw new Error(result.message || "Failed to add class");
      }
    } catch (err) {
      console.error("Error adding class:", err);

      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.success(`Class added successfully!`, {
        duration: 4000,
        position: "top-right",
      });
      router.push("/classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      gym_id: gyms.length > 0 ? gyms[0].ID : "",
      trainer_id: trainers.length > 0 ? trainers[0].user_id : "",
      title: "",
      description: "",
      capacity: 10,
      duration_minutes: 60,
    });
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="p-6 bg-background-light min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Class</h1>
        <p className="text-gray-600 mt-1">Fill in the class details below</p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <p className="text-sm text-green-700 mt-1">
                  Class added successfully!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Class Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Class Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  maxLength={100}
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter class title (e.g., 'Morning Yoga', 'Strength Training')"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Describe the class, including focus areas, intensity level, and target audience..."
                />
              </div>

              <div>
                <label
                  htmlFor="capacity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Capacity *
                </label>
                <select
                  id="capacity"
                  name="capacity"
                  required
                  value={formData.capacity}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {capacityOptions.map((capacity) => (
                    <option key={capacity} value={capacity}>
                      {capacity} people
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="duration_minutes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration *
                </label>
                <select
                  id="duration_minutes"
                  name="duration_minutes"
                  required
                  value={formData.duration_minutes}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location & Trainer Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Location & Trainer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="gym_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gym Location *
                </label>
                {isLoadingGyms ? (
                  <div className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 bg-gray-100">
                    Loading gyms...
                  </div>
                ) : gyms.length === 0 ? (
                  <div className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm text-red-500 bg-red-50">
                    No gyms available. Please add a gym first.
                  </div>
                ) : (
                  <select
                    id="gym_id"
                    name="gym_id"
                    required
                    value={formData.gym_id}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {gyms.map((gym) => (
                      <option key={gym.ID} value={gym.ID}>
                        {gym.Name} - {gym.Address}
                      </option>
                    ))}
                  </select>
                )}
                {gyms.length > 0 && formData.gym_id && (
                  <p className="mt-1 text-xs text-gray-500">
                    {gyms.find((g) => g.ID === formData.gym_id)?.Phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="trainer_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Trainer *
                </label>
                {isLoadingTrainers ? (
                  <div className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 bg-gray-100">
                    Loading trainers...
                  </div>
                ) : trainers.length === 0 ? (
                  <div className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm text-red-500 bg-red-50">
                    No trainers available. Please add a trainer first.
                  </div>
                ) : (
                  <select
                    id="trainer_id"
                    name="trainer_id"
                    required
                    value={formData.trainer_id}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {trainers.map((trainer) => (
                      <option key={trainer.user_id} value={trainer.user_id}>
                        {trainer.first_name} {trainer.last_name} -{" "}
                        {trainer.email}
                      </option>
                    ))}
                  </select>
                )}
                {trainers.length > 0 && formData.trainer_id && (
                  <p className="mt-1 text-xs text-gray-500">
                    Status:{" "}
                    {
                      trainers.find((t) => t.user_id === formData.trainer_id)
                        ?.status
                    }
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Class Preview
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Title:</span>{" "}
                {formData.title || "Not set"}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {formData.duration_minutes
                  ? `${formData.duration_minutes} minutes`
                  : "Not set"}
              </p>
              <p>
                <span className="font-medium">Capacity:</span>{" "}
                {formData.capacity ? `${formData.capacity} people` : "Not set"}
              </p>
              <p>
                <span className="font-medium">Location:</span>{" "}
                {gyms.find((g) => g.ID === formData.gym_id)?.Name ||
                  "Not selected"}
              </p>
              <p>
                <span className="font-medium">Trainer:</span>{" "}
                {trainers.find((t) => t.user_id === formData.trainer_id)
                  ? `${
                      trainers.find((t) => t.user_id === formData.trainer_id)
                        ?.first_name
                    } ${
                      trainers.find((t) => t.user_id === formData.trainer_id)
                        ?.last_name
                    }`
                  : "Not selected"}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                isLoadingGyms ||
                isLoadingTrainers ||
                gyms.length === 0 ||
                trainers.length === 0
              }
              className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 border border-transparent rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Class"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClassForm;
