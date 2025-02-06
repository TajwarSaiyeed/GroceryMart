"use client";
import PageLayout from "@/components/page-layout";

const AboutPage = () => {
  return (
    <PageLayout
      title="About Us"
      description="Learn about GroceryMart's mission, values, and commitment to quality."
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Story</h2>
          <p>
            GroceryMart was founded in 2010 with a simple mission: to provide
            fresh, high-quality groceries at affordable prices. Since then,
            we&apos;ve grown from a single store to a nationwide chain, but our
            commitment to quality and customer satisfaction remains unchanged.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Quality: We source only the best products for our customers.
            </li>
            <li>
              Affordability: We believe everyone deserves access to fresh,
              healthy food.
            </li>
            <li>
              Sustainability: We&apos;re committed to reducing our environmental
              impact.
            </li>
            <li>
              Community: We support local farmers and give back to our
              communities.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Team</h2>
          <p>
            Our dedicated team of employees is the heart of GroceryMart. From
            our store associates to our management team, everyone is committed
            to providing you with the best shopping experience possible.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default AboutPage;
