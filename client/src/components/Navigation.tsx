import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { TaskDialog } from "./TaskDialog";

const navItems = [
  { href: "/", label: "All Tasks" },
  { href: "/priority/1", label: "Low Priority" },
  { href: "/priority/2", label: "Medium Priority" },
  { href: "/priority/3", label: "High Priority" },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg shadow-indigo-100/20 border border-indigo-100/20">
      <nav className="flex space-x-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location === item.href
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
      <TaskDialog />
    </div>
  );
}
