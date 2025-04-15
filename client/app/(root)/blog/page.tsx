"use client";
import PageLayout from "@/components/page-layout";
import Link from "next/link";

const BlogPage = () => {
  const blogPosts = [
    {
      title: "10 Easy Meal Prep Ideas for Busy Weeknights",
      date: "2023-05-15",
      slug: "meal-prep-ideas",
    },
    {
      title: "The Benefits of Eating Seasonal Produce",
      date: "2023-05-10",
      slug: "seasonal-produce-benefits",
    },
    {
      title: "How to Read Nutrition Labels Like a Pro",
      date: "2023-05-05",
      slug: "reading-nutrition-labels",
    },
    {
      title: "Budget-Friendly Grocery Shopping Tips",
      date: "2023-04-30",
      slug: "budget-grocery-tips",
    },
  ];

  return (
    <PageLayout
      title="GroceryMart Blog"
      description="Discover recipes, nutrition tips, and grocery shopping advice."
    >
      <div className="space-y-8">
        {blogPosts.map((post, index) => (
          <article key={index} className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-3">
              {new Date(post.date).toLocaleDateString()}
            </p>
            <p className="mb-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:underline"
            >
              Read More →
            </Link>
          </article>
        ))}
      </div>
    </PageLayout>
  );
};

export default BlogPage;
