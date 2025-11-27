import { Link, Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { useCodeStore } from "./store/codeStore";
import { useEffect } from "react";
import { HomeIcon, CreditCardIcon, StarIcon, BanknotesIcon } from "@heroicons/react/24/outline";

function App() {
  const loadCommonCodes = useCodeStore((store) => store.loadCommonCodes);
  const location = useLocation();

  useEffect(() => {
    loadCommonCodes();
  }, [loadCommonCodes]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <HomeIcon className="w-5 h-5" /> },
    { path: "/transactions", label: "거래 내역", icon: <CreditCardIcon className="w-5 h-5" /> },
    { path: "/merchants", label: "가맹점 목록", icon: <StarIcon className="w-5 h-5" /> },
    { path: "/settlements", label: "정산 내역", icon: <BanknotesIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400">PG Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">결제/가맹점 관리 시스템</p>
        </div>
        <nav className="flex-1 flex flex-col mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-2.5 rounded-md mx-3 my-1 text-sm font-medium transition-all ${
                location.pathname === item.path
                  ? "bg-blue-600 text-white shadow"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        <footer className="text-xs text-gray-500 text-center py-4 border-t border-gray-800">
          © 2025 PG Dashboard
        </footer>
      </aside>
      <main className="flex-1 px-4 py-2 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
