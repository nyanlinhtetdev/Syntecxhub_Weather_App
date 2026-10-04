import { createBrowserRouter, RouterProvider } from "react-router";
import Homepage from "./pages/Homepage";
import WeatherDetails, { WeatherLoader } from "./pages/WeatherDetails";
import { WeatherError } from "./errors/WeatherError";
import { NotFound } from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";

function App(){
  const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Homepage />    
        },
        {
          path: "weather/:city/:cityId",
          element: <WeatherDetails />,
          loader: WeatherLoader,
          errorElement: <WeatherError />
        },
        {
          path: "*",
          element: <NotFound />,
        }
      ]
    }
  ]);

  return(
    <RouterProvider router={router} />
  );
}

export default App