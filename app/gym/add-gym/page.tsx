// components/AddGymForm.tsx
"use client";

import { basUrl } from "@/app/basUrl";
import React, { useState } from "react";

interface OpeningHours {
  open: string;
  close: string;
}

interface GymFormData {
  name: string;
  address: string;
  phone: string;
  timezone: string;
  opening_hours: {
    monday: OpeningHours;
    tuesday: OpeningHours;
    wednesday: OpeningHours;
    thursday: OpeningHours;
    friday: OpeningHours;
    saturday: OpeningHours;
    sunday: OpeningHours;
  };
  settings: {
    max_capacity: number;
    features: string[];
  };
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  gym?: any;
}

const AddGymForm: React.FC = () => {
  const [formData, setFormData] = useState<GymFormData>({
    name: "",
    address: "",
    phone: "",
    timezone: "GMT",
    opening_hours: {
      monday: { open: "06:00", close: "22:00" },
      tuesday: { open: "06:00", close: "22:00" },
      wednesday: { open: "06:00", close: "22:00" },
      thursday: { open: "06:00", close: "22:00" },
      friday: { open: "06:00", close: "22:00" },
      saturday: { open: "08:00", close: "20:00" },
      sunday: { open: "08:00", close: "18:00" },
    },
    settings: {
      max_capacity: 100,
      features: [],
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  // Timezone options
  const timezoneOptions = [
    "GMT",
    "EST",
    "PST",
    "CST",
    "MST",
    "CET",
    "EET",
    "AEST",
    "JST",
    "IST",
  ];

  // Common features
  const commonFeatures = [
    "yoga studio",
    "steam room",
    "sauna",
    "free weights",
    "cardio machines",
    "pool",
    "basketball court",
    "personal training",
    "group classes",
    "locker rooms",
    "showers",
    "parking",
    "wifi",
    "childcare",
    "smoothie bar",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("opening_hours.")) {
      const [_, day, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        opening_hours: {
          ...prev.opening_hours,
          [day]: {
            ...prev.opening_hours[day as keyof typeof prev.opening_hours],
            [field]: value,
          },
        },
      }));
    } else if (name === "max_capacity") {
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          max_capacity: parseInt(value) || 0,
        },
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

  const handleAddFeature = (feature: string) => {
    if (feature && !formData.settings.features.includes(feature)) {
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          features: [...prev.settings.features, feature],
        },
      }));
    }
    setNewFeature("");
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        features: prev.settings.features.filter(
          (feature) => feature !== featureToRemove
        ),
      },
    }));
  };

  const handleAddCustomFeature = () => {
    if (
      newFeature.trim() &&
      !formData.settings.features.includes(newFeature.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          features: [...prev.settings.features, newFeature.trim()],
        },
      }));
      setNewFeature("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log("Sending data to API:", formData);

      const response = await fetch(`${basUrl}gymx`, {
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
        alert("Gym added successfully!");

        // Reset form after successful submission
        setFormData({
          name: "",
          address: "",
          phone: "",
          timezone: "GMT",
          opening_hours: {
            monday: { open: "06:00", close: "22:00" },
            tuesday: { open: "06:00", close: "22:00" },
            wednesday: { open: "06:00", close: "22:00" },
            thursday: { open: "06:00", close: "22:00" },
            friday: { open: "06:00", close: "22:00" },
            saturday: { open: "08:00", close: "20:00" },
            sunday: { open: "08:00", close: "18:00" },
          },
          settings: {
            max_capacity: 100,
            features: [],
          },
        });
      } else {
        throw new Error(result.message || "Failed to add gym");
      }
    } catch (err) {
      console.error("Error adding gym:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      name: "",
      address: "",
      phone: "",
      timezone: "GMT",
      opening_hours: {
        monday: { open: "06:00", close: "22:00" },
        tuesday: { open: "06:00", close: "22:00" },
        wednesday: { open: "06:00", close: "22:00" },
        thursday: { open: "06:00", close: "22:00" },
        friday: { open: "06:00", close: "22:00" },
        saturday: { open: "08:00", close: "20:00" },
        sunday: { open: "08:00", close: "18:00" },
      },
      settings: {
        max_capacity: 100,
        features: [],
      },
    });
    setError(null);
    setSuccess(false);
    setNewFeature("");
  };

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <div className="p-6 bg-background-light min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Gym</h1>
        <p className="text-gray-600 mt-1">Fill in the gym details below</p>

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
                  Gym added successfully!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gym Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  maxLength={100}
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter gym name"
                />
              </div>

              <div>
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Timezone *
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  required
                  value={formData.timezone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {timezoneOptions.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  maxLength={200}
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter full address"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  maxLength={20}
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="max_capacity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Maximum Capacity *
                </label>
                <input
                  type="number"
                  id="max_capacity"
                  name="max_capacity"
                  required
                  min="1"
                  max="1000"
                  value={formData.settings.max_capacity}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter maximum capacity"
                />
              </div>
            </div>
          </div>

          {/* Opening Hours Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Opening Hours
            </h2>
            <div className="space-y-4">
              {days.map((day) => (
                <div
                  key={day.key}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                >
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {day.label}
                    </label>
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Open Time
                    </label>
                    <input
                      type="time"
                      name={`opening_hours.${day.key}.open`}
                      value={
                        formData.opening_hours[
                          day.key as keyof typeof formData.opening_hours
                        ].open
                      }
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-sm text-gray-700 mb-1">
                      Close Time
                    </label>
                    <input
                      type="time"
                      name={`opening_hours.${day.key}.close`}
                      value={
                        formData.opening_hours[
                          day.key as keyof typeof formData.opening_hours
                        ].close
                      }
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          opening_hours: {
                            ...prev.opening_hours,
                            [day.key]: { open: "", close: "" },
                          },
                        }));
                      }}
                      disabled={isLoading}
                      className="w-full text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Gym Features
            </h2>
            <div className="space-y-4">
              {/* Selected Features */}
              {formData.settings.features.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Features ({formData.settings.features.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.settings.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(feature)}
                          disabled={isLoading}
                          className="text-primary hover:text-primary/70"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Common Features
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonFeatures.map((feature) => (
                    <button
                      type="button"
                      key={feature}
                      onClick={() => handleAddFeature(feature)}
                      disabled={
                        isLoading ||
                        formData.settings.features.includes(feature)
                      }
                      className={`px-3 py-1 rounded-full text-sm border ${
                        formData.settings.features.includes(feature)
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      } disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Feature Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Custom Feature
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    disabled={isLoading}
                    placeholder="Enter custom feature"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomFeature}
                    disabled={isLoading || !newFeature.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
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
                "Add Gym"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGymForm;
