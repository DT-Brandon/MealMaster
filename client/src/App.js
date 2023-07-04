import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/Home";
import { Navigate } from "react-router";
import Profile from "./pages/profile/Profile";
import { userContext } from "./userContext";
import { useContext } from "react";
import Add from "./pages/add/add";
import Recipe from "./pages/recipe/Recipe";
import Search from "./pages/search/Search";

function App() {
  const { userInfo } = useContext(userContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/profile",
      element: userInfo ? <Profile /> : <Navigate to="/" />,
    },
    {
      path: "/add",
      element: userInfo ? <Add /> : <Navigate to="/" />,
    },
    {
      path: "/recipe/:recipeId",
      element: <Recipe userInfo={userInfo} />,
    },
    {
      path: "/search",
      element: <Search />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
