"use client";
import Link from "next/link";
import PageLayout from "@/components/page-layout";

const SitemapPage = () => {
  const sitemapLinks = [
    { title: "Home", href: "/" },
    { title: "Products", href: "/products" },
    { title: "Weekly Deals", href: "/weekly-deals" },
    { title: "About Us", href: "/about" },
    { title: "Careers", href: "/careers" },
    { title: "Blog", href: "/blog" },
    { title: "Help Center", href: "/help-center" },
    { title: "Returns", href: "/returns" },
    { title: "Shipping Info", href: "/shipping-info" },
    { title: "Gift Cards", href: "/gift-cards" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Accessibility", href: "/accessibility" },
  ];

  return (
    <PageLayout
      title="Sitemap"
      description="A comprehensive list of all pages on our website."
    >
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {sitemapLinks.map((link, index) => (
          <Link key={index} href={link.href} className="hover:underline">
            {link.title}
          </Link>
        ))}
      </div>
    </PageLayout>
  );
};

export default SitemapPage;
