"use client";
import PageLayout from "@/components/page-layout";

const ReturnsPage = () => {
  return (
    <PageLayout
      title="Returns Policy"
      description="Learn about our easy returns process and policy."
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Return Policy</h2>
          <p>
            At GroceryMart, we stand behind the quality of our products. If
            you&apos;re not satisfied with your purchase, we offer a hassle-free
            return process within 14 days of purchase.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">How to Return an Item</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Bring the item to any GroceryMart store with your receipt.</li>
            <li>
              Our staff will inspect the item to ensure it&apos;s in resalable
              condition.
            </li>
            <li>
              Once approved, we&apos;ll process your refund to the original
              payment method.
            </li>
            <li>
              For online orders, please contact our customer support for return
              shipping instructions.
            </li>
          </ol>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Exceptions</h2>
          <p>
            Please note that certain items cannot be returned due to health and
            safety regulations:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Opened food items</li>
            <li>Personal care products</li>
            <li>Clearance items marked as final sale</li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
};

export default ReturnsPage;
