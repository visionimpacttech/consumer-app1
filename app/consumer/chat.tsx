"use client";
import { useSearchParams } from "next/navigation";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId");

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Chat with Vendor {vendorId}</h1>
      <p>Chat feature coming soon...</p>
    </div>
  );
}
