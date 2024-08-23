import HomePage from "@/pages/HomePage";
import EmailPage from "./pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import GalleryPage from "./pages/GalleryPage";
import CategoriesPage from "./pages/CategoriesPage";

// Layout Component
import DefaultLayout from "@/layout/defaultLayout";

const publicRoutes = [
  {
    path: "/register",
    element: <EmailPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <DefaultLayout>
        <HomePage />
      </DefaultLayout>
    ),
  },
  {
    path: "/gallery",
    element: (
      <DefaultLayout>
        <GalleryPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/categories",
    element: (
      <DefaultLayout>
        <CategoriesPage />
      </DefaultLayout>
    ),
  },
];

export { publicRoutes };
