import CreateProduct from "../views/UserViews/Product/CreateProduct";
import Dashboard from "../views/UserViews/Dashboard/Dashboard";
import Profile from "../views/UserViews/Profile/Profile";
import Settings from "../views/UserViews/Settings/Settings";
import Logout from "../views/UserViews/Logout/Logout";
import Wallet from "../views/UserViews/Wallet/Wallet";
import CreateShop from "../views/UserViews/Shop/CreateShop";
import Shops from "../views/UserViews/Shops/Shops";
import EditShop from "../views/UserViews/Shop/EditShop";
import ShopView from "../views/UserViews/Shop/ShopView";
import Products from "../views/UserViews/Products/Products";
import ProductView from "../views/UserViews/Product/ProductView";



var mainRoutes = [
  {
    path: "/user/logout",
    component: Logout
  },
  {
    path: "/user/@:user/dashboard",
    dynamic: true,
    component: Dashboard
  },
  {
    path: "/user/@:user/profile",
    dynamic: true,
    component: Profile
  },
  {
    path: "/user/@:user/add",
    dynamic: true,
    component: CreateProduct
  },
  {
    path: "/user/@:user/settings",
    dynamic: true,
    component: Settings
  },
  {
    path: "/user/@:user/wallet",
    dynamic: true,
    component: Wallet
  },
  {
    path: "/user/shop/@:user/create",
    dynamic: true,
    component: CreateShop
  },
  {
    path: "/user/products/:status/",
    dynamic: true,
    component: Products
  },
  {
    path: "/user/@:user/:product_id/",
    dynamic: true,
    component: ProductView
  },
  {
    path: "/user/shop/:shop_id",
    dynamic: true,
    component: ShopView
  },
  {
    path: "/user/@:user/shops",
    dynamic: true,
    component: Shops
  },
  {
    path: "/user/@:user/:shopid/edit",
    dynamic: true,
    component: EditShop
  },
  { 
    redirect: true, 
    path: "/user/@:user", 
    pathTo: "/user/@:user/dashboard", 
    name: "Home" 
  },
  { redirect: true, path: "/", pathTo: "/home", name: "Home" }


];
export default mainRoutes;
