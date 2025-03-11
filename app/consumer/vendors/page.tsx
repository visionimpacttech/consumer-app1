"use client";


import { useState } from "react";
import { Button } from "@/components/ui/button";


const vendors = [
  { id: 1, name: "Vendor A", rating: 4.5, price: 5000, location: "Delhi" },
  { id: 2, name: "Vendor B", rating: 4.2, price: 5500, location: "Mumbai" },
  { id: 3, name: "Vendor C", rating: 3.9, price: 4800, location: "Bangalore" },
];

export default function VendorsPage() {
  const [selectedVendors, setSelectedVendors] = useState([]);

  const handleSelectVendor = (vendor) => {
    if (selectedVendors.includes(vendor)) {
      setSelectedVendors(selectedVendors.filter((v) => v !== vendor));
    } else if (selectedVendors.length < 3) {
      setSelectedVendors([...selectedVendors, vendor]);
    } else {
      alert("You can only compare up to 3 vendors.");
    }
  };
  const handleCompare = () => {
    localStorage.setItem("selectedVendors", JSON.stringify(selectedVendors));
    window.location.href = "/consumer/compare";
  };

  return (
    <div>
      <h2>Vendors</h2>
      {vendors.map((vendor) => (
        <div key={vendor.id} className="vendor-card">
          <input
            type="checkbox"
            onChange={() => handleSelectVendor(vendor)}
            checked={selectedVendors.includes(vendor)}
          />
          <h3>{vendor.name}</h3>
          <p>Rating: {vendor.rating} ⭐</p>
          <p>Price: ₹{vendor.price}</p>
          <p>Location: {vendor.location}</p>
        </div>
      ))}
      <Button onClick={handleCompare} disabled={selectedVendors.length < 2}>
        Compare Selected Vendors
      </Button>

    </div>
  );
}
