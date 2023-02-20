import MobileAppDetails from "@/components/MobileAppDetails";
import MobileAppCms from "@/components/MobileAppCms";

export default [
  {
    path: "/",
    component: MobileAppCms,
  },
  {
    path: "/editApp/:id",
    component: MobileAppDetails,
  },
];
