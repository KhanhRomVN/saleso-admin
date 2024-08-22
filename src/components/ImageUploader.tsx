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
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
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
      setSelectedImage as React.Dispatch<React.SetStateAction<File[]>>,
      setIsCropDialogOpen
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
    if (croppedAreaPixels && selectedImage.length > 0) {
      const croppedImage = await cropImageFile(
        croppedAreaPixels,
        URL.createObjectURL(selectedImage[0])
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
      <ToastContainer />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-blue-600">
              <ImageIcon className="mr-2 h-5 w-5" />
              Upload Image
            </DialogTitle>
          </DialogHeader>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {!imageUri && (
              <div className="bg-background w-full h-[100px] rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors duration-300">
                <Upload size={22} className="mb-2 text-blue-400" />
                <p className="text-xs text-gray-600">Drag photo here or</p>
                <label
                  htmlFor="file-upload"
                  className="text-blue-500 cursor-pointer hover:underline text-sm"
                >
                  upload here
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            )}

            <AnimatePresence>
              {imageUri && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-2 flex justify-center"
                >
                  <img
                    src={imageUri}
                    alt="Preview"
                    className="w-full h-auto rounded-md shadow-md"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Type size={20} className="text-gray-400" />
                <Input
                  placeholder="Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="flex-grow transition-all duration-200 focus:ring-2 focus:ring-blue-500 bg-background_secondary"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Folder size={20} className="text-gray-400" />
                <Input
                  placeholder="Path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  className="flex-grow transition-all duration-200 focus:ring-2 focus:ring-blue-500 bg-background_secondary"
                />
              </div>
            </div>
            <div className="flex justify-between space-x-4">
              <div className="w-1/2">
                <label className="mb-2 flex items-center text-sm font-medium text-gray-500">
                  <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-blue-500 bg-background_secondary"
                />
              </div>
              <div className="w-1/2">
                <label className="mb-2 flex items-center text-sm font-medium text-gray-500">
                  <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                  End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded transition-all duration-200 focus:ring-2 focus:ring-blue-500 bg-background_secondary"
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="mr-2 h-4 w-4" />
              Submit
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <Crop className="mr-2 h-5 w-5" />
              Crop Image
            </DialogTitle>
          </DialogHeader>
          <motion.div
            className="relative w-full h-64"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {selectedImage.length > 0 && (
              <Cropper
                image={URL.createObjectURL(selectedImage[0])}
                crop={crop}
                zoom={zoom}
                aspect={
                  Number(selectedRatio.split(":")[0]) /
                  Number(selectedRatio.split(":")[1])
                }
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </motion.div>
          <div className="flex justify-between mt-4">
            <Button
              onClick={handleSkipCrop}
              className="flex items-center bg-gray-500 hover:bg-gray-600 text-white"
            >
              <SkipForward size={18} className="mr-2" />
              Skip
            </Button>
            <Button
              onClick={handleCropImage}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white"
            >
              <Crop size={18} className="mr-2" />
              Crop and Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUploader;
