import MainLayout from "../layouts/MainLayout";
// import UserLayout from "../layouts/UserLayout/UserLayout";
import LoginLayout from "../layouts/LoginLayout";
import ProfileLayout from "../layouts/ProfileLayout";
import UsersView from "../views/UsersView/UsersView";

var indexRoutes = [
    {
        path: "/user/login",
        name: "User",
        component: LoginLayout
    },
    {
        path: "/profile/@:name",
        name: "Profile",
        component: ProfileLayout
    },

    // {
    //     path: "/user",
    //     name: "User",
    //     component: UserLayout
    // },
    { 
        path: "/", 
        name: "Home", 
        component: MainLayout 
    }
];

export default indexRoutes;