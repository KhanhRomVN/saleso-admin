// GalleryPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image, Filter, RefreshCw } from "lucide-react";
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
import GalleryCard from "@/components/GalleryCard";
import { postPublic } from "@/utils/authUtils";

const ratios = [
  { value: "16:9", label: "16:9" },
  { value: "19:6", label: "19:6" },
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

interface GalleryImage {
  _id: string;
  type: string;
  image_uri: string;
  path: string;
  ratio: string;
  status: "ongoing" | "upcoming" | "expired";
  startDate: string;
  endDate: string;
}

const GalleryPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filters, setFilters] = useState({
    type: "",
    ratio: "",
    status: "",
    keyword: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchImages = useCallback(async () => {
    try {
      const response = await postPublic<{
        images: GalleryImage[];
        totalPages: number;
      }>("/gallery/filter", {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setImages(response.images);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages, filters, pagination.page]);

  const handleRatioSelect = (ratio: string) => {
    setSelectedRatio(ratio);
    setIsCreateDialogOpen(false);
    setIsUploadDialogOpen(true);
  };

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      ratio: "",
      status: "",
      keyword: "",
    });
    setPagination((prev) => ({
      ...prev,
      page: 1,
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
        <div className="flex gap-2">
          <Button onClick={resetFilters} className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <Button onClick={fetchImages} className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        {["type", "ratio", "status"].map((filterType) => (
          <Select
            key={filterType}
            onValueChange={(value) => handleFilterChange(filterType, value)}
          >
            <SelectTrigger className="bg-background_secondary">
              <SelectValue placeholder={`Select ${filterType}`} />
            </SelectTrigger>
            <SelectContent className="bg-background_secondary">
              {(filterType === "type"
                ? types
                : filterType === "ratio"
                ? ratios
                : statuses
              ).map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <Input
          placeholder="Search by keyword"
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          className="bg-background_secondary"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <GalleryCard key={index} image={image} />
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
      />
    </div>
  );
};

export default GalleryPage;
