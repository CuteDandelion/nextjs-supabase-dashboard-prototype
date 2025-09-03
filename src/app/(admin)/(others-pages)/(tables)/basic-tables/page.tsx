import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOneNew";
import { createClient } from '@/utils/supabase/server';
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function BasicTables() {
  const supabase = await createClient();
  const { data: threats, error } = await supabase
          .from('threats')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(100);
  
  if (error) {
      console.error('Error fetching threats:', error);
      return <div>Error loading threats</div>;
  }
  return (
    <div>
      <PageBreadcrumb pageTitle="" />
      <div className="space-y-6">
        <ComponentCard title="Basic Threats Table">
          <BasicTableOne initialThreats={threats} />
        </ComponentCard>
      </div>
    </div>
  );
}
