import HomeView from "../views/HomeView/HomeView";
import PostView from "../views/PostView/PostView";
import CreateView from "../views/CreateView/CreateView";
import LogoutView from "../views/LogoutView/LogoutView";
import UpdateView from "../views/UpdateView/UpdateView";
import MainSection from "../components/MainSection/MainSection";
import GroupChatView from "../views/GroupChatView/GroupChatView";
import UsersView from "../views/UsersView/UsersView";
import FollowersView from "../views/FollowersView/FollowersView";
import FollowingView from "../views/FollowingView/FollowingView";


var mainRoutes = [
  
  {
    path: "/roar",
    name: "Roar",
    icon: "fa fa-tachometer-alt",
    component: CreateView
  },
  {
    path: "/users",
    name: "Users",
    component: UsersView
  },
  {
    path: "/followers/@:username",
    name: "Followers",
    component: FollowersView
  },
  {
    path: "/following/@:username",
    name: "Following",
    component: FollowingView
  },
  {
    path: "/edit/@:user/:permlink",
    name: "Update",
    icon: "fa fa-tachometer-alt",
    component: UpdateView
  },
  {
    path: "/user/logout",
    name: "Logout",
    icon: "fa fa-tachometer-alt",
    component: LogoutView
  },
  {
    path: "/chat/:tag",
    name: "Chat",
    icon: "fa fa-tachometer-alt",
    component: GroupChatView
  },
  {
    path: "/post/:category/@:username/:permlink",
    name: "Dashboard",
    icon: "fa fa-tachometer-alt",
    component: PostView
  },
  {
    path: "/:type/:name",
    name: "Dashboard",
    icon: "fa fa-tachometer-alt",
    component: MainSection
  },
  {
    path: "/:type",
    name: "Dashboard",
    icon: "fa fa-tachometer-alt",
    component: HomeView
  },
  {
    path: "/trending",
    name: "Dashboard",
    icon: "fa fa-tachometer-alt",
    component: HomeView
  },

//   {
//     dynamic: true,
//     path: "/@:username",
//     component: Member
//   },
  { redirect: true, path: "/", pathTo: "/trending", name: "Home" }
];
export default mainRoutes;
