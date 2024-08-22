import React, { useCallback, useState, useEffect } from "react";
import {
  Calendar,
  Image as ImageIcon,
  Ratio,
  FolderOpen,
  Activity,
  Clock,
  XCircle,
  ChevronRight,
  Save,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="overflow-hidden  shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-0 relative ">
            <motion.img
              src={image.image_uri}
              alt={image.path}
              className="w-full h-56 object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <AnimatePresence>
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button variant="secondary" size="sm" className="group">
                  View Image
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </AnimatePresence>
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
          <CardFooter className="p-4 flex flex-col items-start space-y-2  bg-background_secondary">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center w-full text-sm">
                    <Ratio className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="font-medium">{image.ratio}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Aspect ratio of the image</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center w-full text-sm">
                    <FolderOpen className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <span className="truncate font-medium" title={image.path}>
                      {image.path}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>File path: {image.path}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
    </>
  );
};

export default GalleryCard;
