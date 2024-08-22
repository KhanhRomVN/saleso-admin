import React from "react";
import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface GalleryCardProps {
  image: {
    _id: string;
    type: string;
    image_uri: string;
    path: string;
    ratio: string;
    status: "ongoing" | "upcoming" | "expired";
    startDate: string;
    endDate: string;
  };
}

const statusStyles = {
  ongoing: "bg-green-200 text-green-800",
  upcoming: "bg-blue-200 text-blue-800",
  expired: "bg-red-200 text-red-800",
};

const GalleryCard: React.FC<GalleryCardProps> = ({ image }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-2">
        <CardTitle className="text-sm font-medium">{image.type}</CardTitle>
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
          <span className={`px-2 py-1 rounded ${statusStyles[image.status]}`}>
            {image.status}
          </span>
        </div>
        <span className="truncate w-full mb-1" title={image.path}>
          Path: {image.path}
        </span>
        <div className="flex justify-between w-full">
          {["startDate", "endDate"].map((dateType) => (
            <span key={dateType} className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(image[dateType]).toLocaleDateString()}
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

export default GalleryCard;
