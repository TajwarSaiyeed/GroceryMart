"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { activateAccount } from "./actions/activate";

const ActivateAccount = () => {
  const router = useRouter();
  const params = useParams();
  const [activationStatus, setActivationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    const activate = async () => {
      if (typeof params.uid === "string" && typeof params.token === "string") {
        const result = await activateAccount(params.uid, params.token);
        
        if (result.success) {
          setActivationStatus("success");
        } else {
          setActivationStatus("error");
        }
      } else {
        setActivationStatus("error");
      }
    };

    activate();
  }, [params.uid, params.token]);

  const handleContinue = () => {
    router.push("/sign-in");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 text-center bg-white shadow-lg rounded-lg w-full max-w-md">
        <div className="flex justify-center items-center gap-2 mb-4">
          <ShoppingCart className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-green-600">GroceryMart</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
        {activationStatus === "loading" && <p>Activating your account...</p>}
        {activationStatus === "success" && (
          <>
            <p className="text-green-600 mb-4">
              Your account has been successfully activated!
            </p>
            <Button
              onClick={handleContinue}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue to Sign In
            </Button>
          </>
        )}
        {activationStatus === "error" && (
          <>
            <p className="text-red-600 mb-4">
              There was an error activating your account. The activation link
              may be invalid or expired.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-green-600 hover:bg-green-700"
            >
              Return to Home
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;
