import React from "react";

interface PageHeaderProps {
  title: string;
  description: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <>
      <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </>
  );
};

export default PageHeader;
