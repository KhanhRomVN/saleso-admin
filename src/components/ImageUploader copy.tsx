import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cropper, { Area } from "react-easy-crop";
import {
  handleImageSelect,
  cropImageFile,
  handleUploadCroppedImage,
} from "@/utils/imageUtils";
import {
  Upload,
  Crop,
  SkipForward,
  Check,
  X,
  Calendar,
  Type,
  Folder,
  Image as ImageIcon,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface ImageUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRatio: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  isOpen,
  onClose,
  selectedRatio,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [type, setType] = useState("");
  const [path, setPath] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleImageSelect(
      event,
      (files) => {
        if (files.length > 0) {
          setSelectedImage(files[0]);
          setIsCropDialogOpen(true);
        }
      },
      () => setIsCropDialogOpen(true)
    );
    toast.success("Image selected successfully", {
      icon: <Check className="h-4 w-4 text-green-500" />,
    });
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCropImage = async () => {
    if (croppedAreaPixels && selectedImage) {
      const croppedImage = await cropImageFile(
        croppedAreaPixels,
        URL.createObjectURL(selectedImage)
      );
      if (croppedImage) {
        const imageUrl = await handleUploadCroppedImage(croppedImage);
        if (imageUrl) {
          setImageUri(imageUrl);
          setIsCropDialogOpen(false);
          toast.success("Image cropped and uploaded successfully", {
            icon: <Check className="h-4 w-4 text-green-500" />,
          });
        }
      }
    }
  };

  const handleSkipCrop = () => {
    setIsCropDialogOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8080/gallery", {
        image_uri: imageUri,
        type,
        path,
        ratio: selectedRatio,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      });
      console.log("Image uploaded successfully:", response.data);
      toast.success("Image uploaded successfully", {
        icon: <Check className="h-4 w-4 text-green-500" />,
      });
      onClose();
      // Reset form fields
      setImageUri("");
      setType("");
      setPath("");
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image", {
        icon: <X className="h-4 w-4 text-red-500" />,
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600">
              <ImageIcon className="mr-2 h-5 w-5" />
              Upload Image
            </DialogTitle>
          </DialogHeader>
          {/* Rest of the component remains the same */}
        </DialogContent>
      </Dialog>

      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {/* Crop dialog content remains the same */}
        </DialogContent>
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default ImageUploader;
