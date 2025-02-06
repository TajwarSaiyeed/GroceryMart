"use client";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/page-layout";

const GiftCardsPage = () => {
  return (
    <PageLayout
      title="Gift Cards"
      description="Give the gift of choice with GroceryMart gift cards."
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            GroceryMart Gift Cards
          </h2>
          <p>
            Our gift cards are perfect for any occasion. They can be used for
            in-store purchases or online shopping, giving your loved ones the
            flexibility to choose exactly what they want.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Choose your gift card amount (from $10 to $500)</li>
            <li>Select a design or upload your own image</li>
            <li>Add a personal message</li>
            <li>Choose between a physical card or an e-gift card</li>
            <li>Complete your purchase</li>
          </ol>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">Purchase a Gift Card</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button>Buy Physical Gift Card</Button>
            <Button variant="outline">Send E-Gift Card</Button>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Check Gift Card Balance
          </h2>
          <p>
            To check your gift card balance, please enter your gift card number
            below:
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Gift Card Number"
              className="border p-2 rounded flex-grow"
            />
            <Button>Check Balance</Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default GiftCardsPage;
