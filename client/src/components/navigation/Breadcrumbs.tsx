// src/components/navigation/Breadcrumbs.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs: React.FC = () => {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-[#2b2653]/70">
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="hover:text-[#7371fc]">
            Dashboard
          </Link>
        </li>
        {parts.map((p, idx) => {
          const to = "/" + parts.slice(0, idx + 1).join("/");
          const isLast = idx === parts.length - 1;
          return (
            <li key={to} className="flex items-center gap-1">
              <span className="text-[#2b2653]/40">/</span>
              {isLast ? (
                <span className="capitalize">{decodeURIComponent(p)}</span>
              ) : (
                <Link to={to} className="capitalize hover:text-[#7371fc]">
                  {decodeURIComponent(p)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
