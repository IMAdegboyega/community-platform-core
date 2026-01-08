import {
  House,
  LayoutPanelLeft,
  Bell,
  Mail,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";

export const navItems = [
  {
    name: "Home",
    icon: House,
    url: "/",
  },
  {
    name: "Frames",
    icon: LayoutPanelLeft,
    url: "/frames",
  },
  {
    name: "Notification",
    icon: Bell,
    url: "/Notification",
  },
  {
    name: "Messages",
    icon: Mail,
    url: "/messages",
  },
  {
    name: "Wallet",
    icon: Wallet,
    url: "/wallet",
  },
  {
    name: "Settings",
    icon: Settings,
    url: "/settings",
  },
  {
    name: "Logout",
    icon: LogOut,
    url: "/signin",
  },
];
