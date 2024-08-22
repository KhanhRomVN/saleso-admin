import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Image } from "lucide-react";
import { motion } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";

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

const GalleryPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const handleRatioSelect = (ratio: string) => {
    setSelectedRatio(ratio);
    setIsCreateDialogOpen(false);
    setIsUploadDialogOpen(true);
  };

  return (
    <div className="p-4">
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

      <ImageUploader
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        selectedRatio={selectedRatio}
      />
    </div>
  );
};

export default GalleryPage;
