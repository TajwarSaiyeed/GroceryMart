"use client";
import Link from "next/link";
import PageLayout from "@/components/page-layout";

const CareersPage = () => {
  const jobOpenings = [
    { title: "Store Manager", location: "New York, NY" },
    { title: "Cashier", location: "Los Angeles, CA" },
    { title: "Produce Specialist", location: "Chicago, IL" },
    { title: "Delivery Driver", location: "Houston, TX" },
  ];

  return (
    <PageLayout
      title="Careers at GroceryMart"
      description="Join our team and grow your career in the grocery industry."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Why Work With Us?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Competitive salaries and benefits</li>
            <li>Opportunities for growth and advancement</li>
            <li>Employee discount on groceries</li>
            <li>Flexible scheduling options</li>
            <li>Commitment to diversity and inclusion</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Current Openings</h2>
          <div className="grid gap-4">
            {jobOpenings.map((job, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.location}</p>
                <Link
                  href="/careers/apply"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Apply Now →
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CareersPage;
