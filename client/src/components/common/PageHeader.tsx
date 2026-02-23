import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

const PageHeader = ({ title, subtitle, action }: PageHeaderProps) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
      )}
    </div>
    {action}
  </div>
);

export default PageHeader;
