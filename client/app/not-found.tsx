import Link from "next/link";
import { ShoppingCart, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
          <h2 className="mb-4 text-3xl font-semibold text-gray-700">
            Page Not Found
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Oops! The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/products">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Link>
          </Button>
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          If you believe this is an error, please{" "}
          <Link
            href="/contact"
            className="font-medium text-blue-600 hover:underline"
          >
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
