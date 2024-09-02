import React, { useState } from "react";
import {
  Calendar,
  Ratio,
  FolderOpen,
  Activity,
  Clock,
  XCircle,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { putPublic, delPublic } from "@/utils/authUtils";

interface ImageData {
  _id: string;
  type: string;
  image_uri: string;
  path: string;
  ratio: string;
  status: "ongoing" | "upcoming" | "expired";
  startDate: string;
  endDate: string;
}

interface GalleryCardProps {
  image: ImageData;
}

interface StatusConfig {
  [key: string]: {
    color: string;
    icon: React.ElementType;
  };
}

const statusConfig: StatusConfig = {
  ongoing: {
    color: "bg-green-500",
    icon: Activity,
  },
  upcoming: {
    color: "bg-blue-500",
    icon: Clock,
  },
  expired: {
    color: "bg-red-500",
    icon: XCircle,
  },
};

const GalleryCard: React.FC<GalleryCardProps> = ({ image }) => {
  const StatusIcon = statusConfig[image.status].icon;
  const [isEditing, setIsEditing] = useState(false);
  const [editedPath, setEditedPath] = useState(image.path);
  const [isViewImageDialogOpen, setIsViewImageDialogOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handlePathEdit = () => {
    setIsEditing(true);
  };

  const handlePathSave = async () => {
    try {
      await putPublic(`/gallery/${image._id}`, { path: editedPath });
      setIsEditing(false);
      toast.success("Path updated successfully");
    } catch (error) {
      console.error("Error updating path:", error);
      toast.error("Failed to update path");
    }
  };

  const handleDelete = async () => {
    try {
      await delPublic(`/gallery/${image._id}`);
      toast.success("Image deleted successfully");
      setIsDeleteDialogOpen(false);
      // You might want to trigger a re-fetch of the gallery images here
      // or remove the image from the local state if you're managing it in the parent component
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-0 relative">
            <motion.div
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              <motion.img
                src={image.image_uri}
                alt={image.path}
                className="w-full h-56 object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
              <AnimatePresence>
                {isHovering && (
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      className="group"
                      onClick={() => setIsViewImageDialogOpen(true)}
                    >
                      View
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="bg-red-500"
                    >
                      Delete
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <Badge
              className={`absolute top-2 right-2 ${
                statusConfig[image.status].color
              }`}
            >
              <StatusIcon className="w-4 h-4 mr-1" />
              {image.status}
            </Badge>
            <Badge variant="outline" className="absolute top-2 left-2">
              {image.type}
            </Badge>
          </CardContent>
          <CardFooter className="p-4 flex flex-col items-start space-y-2 bg-background_secondary">
            <div className="flex items-center w-full text-sm">
              <Ratio className="w-4 h-4 mr-2 text-gray-500" />
              <span className="font-medium">{image.ratio}</span>
            </div>
            <div className="flex items-center w-full text-sm">
              <FolderOpen className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
              {isEditing ? (
                <Input
                  value={editedPath}
                  onChange={(e) => setEditedPath(e.target.value)}
                  className="flex-grow"
                />
              ) : (
                <span
                  className="truncate font-medium cursor-pointer"
                  title={image.path}
                  onClick={handlePathEdit}
                >
                  {image.path}
                </span>
              )}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handlePathSave} size="sm">
                  Update Path
                </Button>
                <Button size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            )}
            <div className="flex justify-between w-full text-xs text-gray-500">
              {["startDate", "endDate"].map((dateType) => (
                <span key={dateType} className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(
                    image[dateType as keyof ImageData] as string
                  ).toLocaleDateString()}
                </span>
              ))}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* View Image Dialog */}
      <Dialog
        open={isViewImageDialogOpen}
        onOpenChange={setIsViewImageDialogOpen}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <img
            src={image.image_uri}
            alt={image.path}
            className="w-full h-auto object-contain"
          />
          <DialogFooter>
            <Button onClick={() => setIsViewImageDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex items-center space-x-2 text-yellow-500">
              <AlertTriangle />
              <span>Are you sure you want to delete this image?</span>
            </div>
            <p className="mt-2">This action cannot be undone.</p>
          </DialogDescription>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryCard;
