import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import Dashboard from "../pages/Dashboard"
import Transactions from "../pages/Transactions"
import Merchants from "../pages/Merchants"
import Settlements from "../pages/Settlements"
import MerchantDetailsPage from "../pages/MerchantDetails"


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {path:"", element:<Dashboard/>},
      {path:"transactions", element: <Transactions/>},
      {path:"merchants", element: <Merchants/>},
      {path:"merchants/:mchtCode", element: <MerchantDetailsPage/>},
      {path:"settlements", element: <Settlements/>},
    ],
  },
]);