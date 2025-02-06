"use client";
import PageLayout from "@/components/page-layout";

const ShippingInfoPage = () => {
  return (
    <PageLayout
      title="Shipping Information"
      description="Learn about our shipping options, rates, and delivery times."
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Shipping Options</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Standard Shipping:</strong> 3-5 business days
            </li>
            <li>
              <strong>Express Shipping:</strong> 1-2 business days
            </li>
            <li>
              <strong>Same-Day Delivery:</strong> Available in select areas for
              orders placed before 2 PM
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Shipping Rates</h2>
          <p>
            Shipping rates are calculated based on your location and the weight
            of your order. You can view the exact shipping cost at checkout
            before completing your purchase.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Free Shipping</h2>
          <p>
            Enjoy free standard shipping on orders over $50. Some restrictions
            may apply to oversized or heavy items.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Tracking Your Order</h2>
          <p>
            Once your order ships, you&apos;ll receive a confirmation email with
            a tracking number. You can use this number to track your package on
            our website or the carrier&apos;s site.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default ShippingInfoPage;
