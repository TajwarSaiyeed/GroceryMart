"use client";
import PageLayout from "@/components/page-layout";

const TermsOfServicePage = () => {
  return (
    <PageLayout
      title="Terms of Service"
      description="Please read these terms carefully before using our services."
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using GroceryMart&apos;s services, you agree to be
            bound by these Terms of Service.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Use of Services</h2>
          <p>
            You agree to use our services only for lawful purposes and in
            accordance with these Terms.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
          <p>
            You are responsible for safeguarding the password that you use to
            access the service and for any activities or actions under your
            password.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the
            service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default TermsOfServicePage;
