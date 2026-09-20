import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadEditForm } from "@/components/admin/LeadEditForm";
import { getLeadById } from "@/lib/leads";

export const metadata: Metadata = { title: "Edit Lead", robots: { index: false } };

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await getLeadById(Number(id));
  if (!lead) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-navy">Edit lead</h1>
      <p className="mt-1 text-sm text-charcoal/55">
        Correct the details this lead came in with. The status and archive state stay unchanged here.
      </p>
      <div className="mt-6">
        <LeadEditForm lead={lead} />
      </div>
    </div>
  );
}
