"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/lib/auth";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category: "material" | "machine" | "worker";
  rating: number;
  modelName?: string;
  application?: string;
  features?: string;
  weight?: string;
  brand?: string;
  phone?: string;
  chat?:string;
  profession?: string;
};

export default function ConsumerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [workerFilter, setWorkerFilter] = useState("all");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<{
    material: Product[];
    machine: Product[];
    worker: Product[];
  }>({
    material: [],
    machine: [],
    worker: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priceFilter, setPriceFilter] = useState<"lowToHigh" | "highToLow" | "default">("default");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");



  useEffect(() => {
    if (!user) {
      router.push("/consumer/login");
    }
  }, [user, router]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/products");
      const data = await response.json();
      setAllProducts(data);

      setDisplayedProducts({
        material: data.filter((p: Product) => p.category === "material"),
        machine: data.filter((p: Product) => p.category === "machine"),
        worker: data.filter((p: Product) => p.category === "worker"),
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useCallback(
    (category: "material" | "machine" | "worker") => {
      let filtered = displayedProducts[category].filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      if (priceFilter === "lowToHigh") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (priceFilter === "highToLow") {
        filtered.sort((a, b) => b.price - a.price);
      }
  
      if (category === "worker" && workerFilter !== "all") {
        filtered = filtered.filter((product) => product.profession === workerFilter);
      }
  
      if (ratingFilter !== "all") {
        filtered = filtered.filter((product) => product.rating >= ratingFilter);
      }
  
      return filtered;
    },
    [displayedProducts, searchTerm, priceFilter, ratingFilter, workerFilter] // ✅ Added `workerFilter`
  );
  
  
  const toggleWorkerSelection = (worker: Product) => {
    setSelectedWorkers((prev) => {
      const isAlreadySelected = prev.some((w) => w.id === worker.id);
      if (isAlreadySelected) {
        return prev.filter((w) => w.id !== worker.id); // ✅ Remove if already selected
      }
      return [...prev, worker]; // ✅ Add new selection
    });
  };

  const handleCompare = () => {
    console.log("Selected Workers:", selectedWorkers); // ✅ Debugging Log
    console.log("Selected Workers Count:", selectedWorkers.length);
  
    if (selectedWorkers.length >= 2) {
      localStorage.setItem("selectedWorkers", JSON.stringify(selectedWorkers));
  
      // ✅ Log the stored data to verify
      console.log("Stored Workers in localStorage:", localStorage.getItem("selectedWorkers"));
  
      router.push("/consumer/compare");
    } else {
      alert("Please select at least 2 vendors to compare.");
    }
  }; 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user && (
        <motion.div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <motion.h1 className="text-2xl font-bold text-foreground">
              Consumer Dashboard
            </motion.h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                )}
              </Button>
              <Button onClick={logout}>Logout</Button>
            </div>
          </div>

          {/* 🔹 Filters Section */}
          <div className="flex gap-4 mb-6">
            {/* Price Filter */}
              <Select onValueChange={(value) => setPriceFilter(value as "lowToHigh" | "highToLow" | "default")}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by Price" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">All Prices</SelectItem>
                        <SelectItem value="lowToHigh">Low to High</SelectItem>
                        <SelectItem value="highToLow">High to Low</SelectItem>
                    </SelectContent>
              </Select>

           {/* Rating Filter */}
              <Select onValueChange={(value) => setRatingFilter(value === "all" ? "all" : Number(value))}>
                    <SelectTrigger className="w-[180px]">
                       <SelectValue placeholder="Filter by Rating" />
                    </SelectTrigger>
                    <SelectContent>
                          <SelectItem value="all">All Ratings</SelectItem>
                          <SelectItem value="4">4+ Stars</SelectItem>
                          <SelectItem value="3">3+ Stars</SelectItem>
                    </SelectContent>
              </Select>
          </div>


          <Tabs defaultValue="materials">
            <TabsList>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="machines">Machines</TabsTrigger>
              <TabsTrigger value="worker">Professional Workers</TabsTrigger>
            </TabsList>

            {/* ✅ Materials */}
            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts("material").map((material) => (
                      <motion.div
                        key={material.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedProduct(material)}
                      >
                        <CardContent className="p-4">
                          <img src={material.image} alt={material.name} className="w-full h-40 object-cover mb-2 rounded-md" />
                          <h3 className="font-bold">{material.name}</h3>
                          <p>₹{material.price}</p>
                          <p>Rating: {material.rating} stars</p>
                        </CardContent>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* ✅ Machines */}
            <TabsContent value="machines">
              <Card>
                <CardHeader>
                  <CardTitle>Machines</CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts("machine").map((machine) => (
                      <motion.div key={machine.id} className="cursor-pointer" onClick={() => setSelectedProduct(machine)}>
                        <CardContent className="p-4">
                          <img src={machine.image || "/placeholder.svg"} alt={machine.name} className="w-full h-40 object-cover mb-2 rounded-md" />
                          <h3 className="font-bold">{machine.name}</h3>
                          <p>₹{machine.price}</p>
                          <p>Rating: {machine.rating.toFixed(1)} stars</p>
                        </CardContent>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ✅ Professional Workers (With Comparison & Checkboxes) */}
            <TabsContent value="worker">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Workers</CardTitle>
                </CardHeader>
            {/* Rating Filter */}
            <Select onValueChange={(value) => setWorkerFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                       <SelectValue placeholder="Filter by Profession" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Professions</SelectItem>
                      <SelectItem value="Interior designer">Interior designer</SelectItem>
                      <SelectItem value="Architect">Architect</SelectItem>
                      <SelectItem value="Painter">Painter</SelectItem>
                      <SelectItem value="Plumber">Plumber </SelectItem>
                      <SelectItem value="Electrician">Electrician</SelectItem>
                      <SelectItem value="Carpenter">Carpenter</SelectItem>
                      <SelectItem value="Civil engineers">Civil engineers</SelectItem>
                      <SelectItem value="Labour">Labour </SelectItem>
                          
                    </SelectContent>
              </Select>    
                <CardContent>
              
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filteredProducts("worker").map((worker) => (
                      <motion.div key={worker.id} className="cursor-pointer" onClick={() => setSelectedProduct(worker)}>
                        <input
                          type="checkbox"
                          checked={selectedWorkers.some((w) => w.id === worker.id)}
                          onChange={() => toggleWorkerSelection(worker)}
                        />
                        <CardContent className="p-4">
                          <img src={worker.image} alt={worker.name} className="w-full h-40 object-cover mb-2 rounded-md" />
                          <h3 className="font-bold">{worker.name}</h3>
                          <p>₹{worker.price}</p>
                        </CardContent>
                      </motion.div>
                    ))}
                  </motion.div>
            
                  <Button onClick={handleCompare} disabled={selectedWorkers.length < 2} className="mt-4">
                    Compare Selected Workers
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* ✅ Product Popup (All Details) */}
          {selectedProduct && (
            <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedProduct.name}</DialogTitle>
                </DialogHeader>
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-60 object-cover rounded-md" />
                <DialogDescription>
                  <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
                  <p><strong>Rating:</strong> {selectedProduct.rating} stars</p>
                  <p><strong>Description:</strong> {selectedProduct.description}</p>
                  <p><strong>ModelName:</strong> {selectedProduct.modelName}</p>
                  <p><strong>Application:</strong> {selectedProduct.application}</p>
                  <p><strong>Features:</strong> {selectedProduct.features}</p>
                  <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                </DialogDescription>
                 {/* 🔹 Add Call & Chat Buttons */}
          <div className="flex gap-4 mt-4">
            <Button asChild>
              <a href={`tel:${selectedProduct.phone?.phone}`} target="_blank">
                📞 Call Now
              </a>
            </Button>

            <Button 
                 onClick={() => window.open(`https://wa.me/${selectedProduct?.phone?.phone}`, "_blank")}
                >
                  💬 Chat Now
            </Button>
          </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>
      )}
    </>
  );
}