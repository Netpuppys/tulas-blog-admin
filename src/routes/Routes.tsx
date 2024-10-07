import SinglePost from "@/components/shared/SinglePost";
import DashboardLayout from "@/layouts/DashboardLayout";
import ChangePassword from "@/pages/Auth/ChangePassword";
import Login from "@/pages/Auth/Login";
import AllPosts from "@/pages/Dashboard/AllPosts";
import Categories from "@/pages/Dashboard/Categories";
import CategoryPosts from "@/pages/Dashboard/CategoryPosts";
import CreatePost from "@/pages/Dashboard/CreatePost";
import EditPost from "@/pages/Dashboard/EditPost";
import Tiptap from "@/pages/Dashboard/Tiptap";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

export default function AppContainer() {
  const isTokenAvailable = localStorage.getItem("crm_blog_token");

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="*"
          element={
            isTokenAvailable ? (
              <Navigate to="/dashboard/all-posts" />
            ) : (
              <Login />
            )
          }
        />
        {isTokenAvailable ? (
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="all-posts" element={<AllPosts />} />
            <Route path="posts/:slug" element={<SinglePost />} />
            <Route path="create-post" element={<CreatePost />} />
            <Route path="posts/:slug/edit" element={<EditPost />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:categoryId" element={<CategoryPosts />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="tiptap" element={<Tiptap />} />

            <Route path="*" element={<Navigate to="/dashboard/all-posts" />} />
          </Route>
        ) : (
          <>
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </>
    )
  );

  return <RouterProvider router={router} />;
}
