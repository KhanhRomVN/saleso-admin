import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image, Filter, ArrowUpDown, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";

const ratios = [
  { value: "16:9", label: "16:9" },
  { value: "19:6", label: "19:6" },
  { value: "1:2", label: "1:2" },
  { value: "4:12", label: "4:12" },
  { value: "8:1", label: "8:1" },
  { value: "1:1", label: "1:1" },
  { value: "16:5", label: "16:5" },
  { value: "4:3", label: "4:3" },
];

const types = [
  { value: "category", label: "Category" },
  { value: "banner", label: "Banner" },
  { value: "card", label: "Card" },
];

const statuses = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "expired", label: "Expired" },
];

const GalleryPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    ratio: "",
    status: "",
    keyword: "",
  });
  const [sortOptions, setSortOptions] = useState({
    field: "created_at",
    order: "desc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    fetchImages();
  }, [filters, sortOptions, pagination.page]);

  const fetchImages = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/gallery/filter",
        {
          ...filters,
          sortField: sortOptions.field,
          sortOrder: sortOptions.order,
          page: pagination.page,
          limit: pagination.limit,
        }
      );
      setImages(response.data.images);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleRatioSelect = (ratio: string) => {
    setSelectedRatio(ratio);
    setIsCreateDialogOpen(false);
    setIsUploadDialogOpen(true);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (field: string) => {
    setSortOptions((prev) => ({
      field,
      order: prev.field === field && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Image className="mr-2 h-4 w-4" />
              Create Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Ratio</DialogTitle>
            </DialogHeader>
            <motion.div
              className="grid grid-cols-4 gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {ratios.map((ratio) => (
                <Button
                  key={ratio.value}
                  onClick={() => handleRatioSelect(ratio.value)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  {ratio.label}
                </Button>
              ))}
            </motion.div>
          </DialogContent>
        </Dialog>

        <Button onClick={() => fetchImages()} className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <Select onValueChange={(value) => handleFilterChange("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange("ratio", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Ratio" />
          </SelectTrigger>
          <SelectContent>
            {ratios.map((ratio) => (
              <SelectItem key={ratio.value} value={ratio.value}>
                {ratio.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search by keyword"
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image._id} className="overflow-hidden">
            <CardHeader className="p-2">
              <CardTitle className="text-sm font-medium">
                {image.type}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <img
                src={image.image_uri}
                alt={image.path}
                className="w-full h-40 object-cover"
              />
            </CardContent>
            <CardFooter className="p-2 flex flex-col items-start text-xs">
              <div className="flex justify-between w-full mb-1">
                <span>Ratio: {image.ratio}</span>
                <span
                  className={`px-2 py-1 rounded ${
                    image.status === "ongoing"
                      ? "bg-green-200 text-green-800"
                      : image.status === "upcoming"
                      ? "bg-blue-200 text-blue-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {image.status}
                </span>
              </div>
              <span className="truncate w-full mb-1" title={image.path}>
                Path: {image.path}
              </span>
              <div className="flex justify-between w-full">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(image.startDate).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(image.endDate).toLocaleDateString()}
                </span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.max(1, prev.page - 1),
            }))
          }
          disabled={pagination.page === 1}
        >
          Previous
        </Button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <Button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: Math.min(prev.totalPages, prev.page + 1),
            }))
          }
          disabled={pagination.page === pagination.totalPages}
        >
          Next
        </Button>
      </div>

      <ImageUploader
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        selectedRatio={selectedRatio}
        onImageUploaded={fetchImages}
      />
    </div>
  );
};

export default GalleryPage;
