"use client"; // Ensure this is a Client Component

import { useEffect, useState } from "react";

const CompareVendors = () => {
  const [vendors, setVendors] = useState<any[]>([]); // Added type safety

  useEffect(() => {
    if (typeof window !== "undefined") {
      const selectedVendors = JSON.parse(localStorage.getItem("selectedVendors") || "[]");
      setVendors(selectedVendors);
    }
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Compare Vendors</h2>
      {vendors.length < 2 ? (
        <p className="text-red-500">Please select at least 2 vendors to compare.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Feature</th>
              {vendors.map((vendor) => (
                <th key={vendor.id} className="border border-gray-300 p-2">{vendor.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">Rating</td>
              {vendors.map((vendor) => (
                <td key={vendor.id} className="border border-gray-300 p-2">{vendor.rating} ⭐</td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">Price</td>
              {vendors.map((vendor) => (
                <td key={vendor.id} className="border border-gray-300 p-2">₹{vendor.price}</td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-bold">Location</td>
              {vendors.map((vendor) => (
                <td key={vendor.id} className="border border-gray-300 p-2">{vendor.location}</td>
              ))}
            </tr>
          </tbody>
        </table>
      )}
      <button
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Back
      </button>
    </div>
  );
};

export default CompareVendors;
