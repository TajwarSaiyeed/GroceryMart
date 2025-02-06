"use client";
import PageLayout from "@/components/page-layout";

const AccessibilityPage = () => {
  return (
    <PageLayout
      title="Accessibility Statement"
      description="Our commitment to making GroceryMart accessible to all users."
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Our Commitment</h2>
          <p>
            GroceryMart is committed to ensuring digital accessibility for
            people with disabilities. We are continually improving the user
            experience for everyone, and applying the relevant accessibility
            standards.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Conformance Status</h2>
          <p>
            The Web Content Accessibility Guidelines (WCAG) defines requirements
            for designers and developers to improve accessibility for people
            with disabilities. It defines three levels of conformance: Level A,
            Level AA, and Level AAA. GroceryMart is partially conformant with
            WCAG 2.1 level AA.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Feedback</h2>
          <p>
            We welcome your feedback on the accessibility of GroceryMart. Please
            let us know if you encounter accessibility barriers on our website.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default AccessibilityPage;
