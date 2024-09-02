import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Eye,
  PlusCircle,
  ArrowUpDown,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getPublic, postPublic, delPublic } from "@/utils/authUtils";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image_uri: string;
  description: string | null;
  parent_id: string;
  level: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryStack, setCategoryStack] = useState<string[]>([]);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image_uri: "",
  });
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  useEffect(() => {
    fetchCategories(currentParentId);
  }, [currentParentId]);

  const fetchCategories = async (parentId: string | null) => {
    try {
      const url = parentId
        ? `/category/children-of-parent/${parentId}`
        : `/category/level/1`;
      const response = await getPublic<Category[]>(url);
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setCategoryStack((prevStack) => [...prevStack, currentParentId || ""]);
    setCurrentParentId(categoryId);
  };

  const handleBackClick = () => {
    const newStack = [...categoryStack];
    const previousParentId = newStack.pop();
    setCategoryStack(newStack);
    setCurrentParentId(previousParentId || null);
  };

  const handleOptionClick = async (
    e: React.MouseEvent,
    category: Category,
    optionNumber: number
  ) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setDialogOpen(optionNumber);

    if (optionNumber === 3) {
      try {
        const response = await getPublic<Category[]>(
          `/category/children-of-parent/${category._id}`
        );
        setChildCategories(response);
      } catch (error) {
        console.error("Error fetching child categories:", error);
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!selectedCategory) return;
    try {
      await postPublic(`/category/create`, {
        ...newCategory,
        level: selectedCategory.level + 1,
        parent_id: selectedCategory._id,
      });
      setDialogOpen(null);
      fetchCategories(currentParentId);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleInsertCategory = async () => {
    if (!selectedCategory) return;
    try {
      await postPublic("/category/insert", {
        ...newCategory,
        level: selectedCategory.level + 1,
        parent_id: selectedCategory._id,
        children_id: selectedChildId,
      });
      setDialogOpen(null);
      fetchCategories(currentParentId);
    } catch (error) {
      console.error("Error inserting category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await delPublic(`/category/${selectedCategory._id}`);
      setDialogOpen(null);
      fetchCategories(currentParentId);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      {currentParentId && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackClick}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Parent Category
        </motion.button>
      )}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {categories.map((category) => (
          <motion.div
            key={category._id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Card
              className="overflow-hidden cursor-pointer relative h-full flex flex-col bg-background_secondary"
              onClick={() => handleCategoryClick(category._id)}
            >
              <CardHeader className="p-0">
                <img
                  src={category.image_uri}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg font-semibold mb-2">
                  {category.name}
                </CardTitle>
                {category.description && (
                  <p className="text-sm text-gray-6000">
                    {category.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                  <ChevronRight className="w-4 h-4 mr-1" />
                  View Subcategories
                </button>
                <div className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionClick(e, category, 1);
                          }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background">
                        <div className="flex flex-col space-y-2 ">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                            onClick={(e) => handleOptionClick(e, category, 1)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                            onClick={(e) => handleOptionClick(e, category, 2)}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                            onClick={(e) => handleOptionClick(e, category, 3)}
                          >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            Insert
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                            onClick={(e) => handleOptionClick(e, category, 4)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Dialog 1: View Category Info */}
      <Dialog open={dialogOpen === 1} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Category Information</DialogTitle>
            <DialogDescription>
              View details of the selected category.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <div className="mt-4">
              <img
                src={selectedCategory.image_uri}
                alt={selectedCategory.name}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <h2 className="text-xl font-bold mb-2">
                {selectedCategory.name}
              </h2>
              <p className="text-gray-600 mb-2">
                {selectedCategory.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>
                  <strong>ID:</strong> {selectedCategory._id}
                </p>
                <p>
                  <strong>Slug:</strong> {selectedCategory.slug}
                </p>
                <p>
                  <strong>Level:</strong> {selectedCategory.level}
                </p>
                <p>
                  <strong>Parent ID:</strong> {selectedCategory.parent_id}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Create New Category */}
      <Dialog open={dialogOpen === 2} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Enter details for the new category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={newCategory.description || ""}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
            />
            <Input
              placeholder="Image URI"
              value={newCategory.image_uri}
              onChange={(e) =>
                setNewCategory({ ...newCategory, image_uri: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateCategory}>Create New Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog 3: Insert New Category */}
      <Dialog open={dialogOpen === 3} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Insert New Category</DialogTitle>
            <DialogDescription>
              Enter details and select a position for the new category.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={newCategory.description || ""}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
            />
            <Input
              placeholder="Image URI"
              value={newCategory.image_uri}
              onChange={(e) =>
                setNewCategory({ ...newCategory, image_uri: e.target.value })
              }
            />
            <Select onValueChange={(value) => setSelectedChildId(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select child category" />
              </SelectTrigger>
              <SelectContent>
                {childCategories.map((child) => (
                  <SelectItem key={child._id} value={child._id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleInsertCategory}>Insert New Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog 4: Delete Category Confirmation */}
      <Dialog open={dialogOpen === 4} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesPage;
