import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, ChevronsRight, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image_uri: string | null;
  description: string | null;
  parent_id: string | null;
  level: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    fetchCategories(currentLevel);
  }, [currentLevel]);

  const fetchCategories = async (level: number) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/category/level/${level}`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchChildCategories = async (parentId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/category/children-of-parent/${parentId}`
      );
      setCategories(response.data);
      setCurrentLevel(currentLevel + 1);
    } catch (error) {
      console.error("Error fetching child categories:", error);
    }
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    fetchChildCategories(category._id);
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    try {
      await axios.put(
        `http://localhost:8080/category/${selectedCategory._id}`,
        newCategory
      );
      fetchCategories(currentLevel);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await axios.delete(
        `http://localhost:8080/category/${selectedCategory._id}`
      );
      setSelectedCategory(null);
      fetchCategories(currentLevel);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleCreateCategory = async () => {
    if (!selectedCategory) return "CC";
    try {
      console.log({
        ...newCategory,
        parent_id: selectedCategory._id,
        level: selectedCategory.level + 1,
      });

      // await axios.post("http://localhost:8080/category/create", {
      //   ...newCategory,
      //   parent_id: selectedCategory._id,
      //   level: selectedCategory.level + 1,
      // });
      // setNewCategory({});
      // fetchChildCategories(selectedCategory._id);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleInsertCategory = async () => {
    if (!selectedCategory) return;
    try {
      console.log({
        ...newCategory,
        parent_id: selectedCategory._id,
        level: selectedCategory.level + 1,
      });

      // await axios.post("http://localhost:8080/category/insert", {
      //   ...newCategory,
      //   parent_id: selectedCategory._id,
      //   level: selectedCategory.level + 1,
      // });
      // setNewCategory({});
      // fetchChildCategories(selectedCategory._id);
    } catch (error) {
      console.error("Error inserting category:", error);
    }
  };

  const handleGoBack = () => {
    if (currentLevel > 1) {
      setCurrentLevel(currentLevel - 1);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories Management</h1>
      {currentLevel > 1 && (
        <Button onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      )}
      <div className="grid grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="p-4 border rounded cursor-pointer group relative bg-background_secondary"
          >
            <h2
              className="font-semibold"
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </h2>
            <p
              className="text-sm text-gray-500"
              onClick={() => handleCategoryClick(category)}
            >
              {category.description}
            </p>
            <div className="absolute top-0 right-0 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Update Category */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Input
                      value={newCategory.name || ""}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      placeholder="Name"
                    />
                    <Input
                      value={newCategory.image_uri || ""}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          image_uri: e.target.value,
                        })
                      }
                      placeholder="Image URI"
                    />
                    <Textarea
                      value={newCategory.description || ""}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                    />
                    <Button onClick={handleUpdateCategory}>Update</Button>
                  </div>
                </DialogContent>
              </Dialog>
              {/* Delete Category */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                  </DialogHeader>
                  <p>Are you sure you want to delete this category?</p>
                  <Button variant="destructive" onClick={handleDeleteCategory}>
                    Delete
                  </Button>
                </DialogContent>
              </Dialog>
              {/* Create New Category */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Input
                      value={newCategory.name || ""}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      placeholder="Name"
                    />
                    <Input
                      value={newCategory.image_uri || ""}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          image_uri: e.target.value,
                        })
                      }
                      placeholder="Image URI"
                    />
                    <Textarea
                      value={newCategory.description || ""}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                    />
                    <Button onClick={handleCreateCategory}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>
              {/* Insert Category */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Insert Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Input
                      value={newCategory.name || ""}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      placeholder="Name"
                    />
                    <Input
                      value={newCategory.image_uri || ""}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          image_uri: e.target.value,
                        })
                      }
                      placeholder="Image URI"
                    />
                    <Textarea
                      value={newCategory.description || ""}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description"
                    />
                    <Select
                      onValueChange={(value) =>
                        setNewCategory({ ...newCategory, children_id: value })
                      }
                    >
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
                    <Button onClick={handleInsertCategory}>Insert</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
