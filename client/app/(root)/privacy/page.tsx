"use client";
import PageLayout from "@/components/page-layout";

const PrivacyPolicyPage = () => {
  return (
    <PageLayout
      title="Privacy Policy"
      description="Learn how we collect, use, and protect your personal information."
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, to process your transactions, and to communicate with
            you.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Information Sharing and Disclosure
          </h2>
          <p>
            We do not share your personal information with third parties except
            as described in this policy.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Security</h2>
          <p>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse, unauthorized access, disclosure,
            alteration, and destruction.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicyPage;
