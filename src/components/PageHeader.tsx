import React from "react";

interface PageHeaderProps {
  title: string;
  description: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <>
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
      <div className="mt-1 text-sm text-slate-300">{description}</div>
    </>
  );
};

export default PageHeader;
