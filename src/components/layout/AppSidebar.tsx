import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, PlusCircle, Settings, LogOut } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/orders/create", label: "Create Order", icon: PlusCircle },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg dashboard-gradient flex items-center justify-center">
          <Settings className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">
            Dashboard Builder
          </h1>
          <p className="text-[11px] text-sidebar-foreground">Order Analytics</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`sidebar-nav-item ${
                isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
        <p className="text-[11px] text-sidebar-foreground mt-2">
          Phase 1 · Local Storage
        </p>
      </div>
    </aside>
  );
}
