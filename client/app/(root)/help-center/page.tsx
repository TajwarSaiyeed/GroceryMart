"use client";
import Link from "next/link";
import PageLayout from "@/components/page-layout";

const HelpCenterPage = () => {
  const faqCategories = [
    { name: "Orders & Delivery", slug: "orders-delivery" },
    { name: "Returns & Refunds", slug: "returns-refunds" },
    { name: "Product Information", slug: "product-info" },
    { name: "Account & Payment", slug: "account-payment" },
  ];

  return (
    <PageLayout
      title="Help Center"
      description="Find answers to common questions and get support."
    >
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {faqCategories.map((category, index) => (
              <Link
                key={index}
                href={`/help-center/${category.slug}`}
                className="border p-4 rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">
                  Find answers about {category.name.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="mb-4">
            Can&apos;t find what you&apos;re looking for? Our customer support
            team is here to help.
          </p>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> support@grocerymart.com
            </p>
            <p>
              <strong>Phone:</strong> 1-800-GROCERY
            </p>
            <p>
              <strong>Hours:</strong> Monday - Friday, 9am - 6pm EST
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default HelpCenterPage;
