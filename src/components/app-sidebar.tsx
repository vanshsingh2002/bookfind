import {
  BookOpen,
  Plus,
  ShoppingCartIcon,
  LogOut,
  Home,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

interface User {
  name: string;
  email: string;
  role: "Owner" | "Seeker";
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const navItems = [
    {
      title: "Home",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Logout",
      url: "/login",
      icon: LogOut,
    },
    {
      title: "Cart",
      url: "/checkout",
      icon: ShoppingCartIcon,
    },
  ];

  if (user?.role === "Owner") {
    navItems.push({
      title: "Add Book",
      url: "/add-book",
      icon: Plus,
    });
    navItems.push({
      title: "Book Listings",
      url: "/book-listings",
      icon: BookOpen,
    });
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
