import React, { useState, useEffect } from "react";

const PaymentPage = () => {
  const razorpayKey = "rzp_test_RhiwED0mePypIR";

  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handlePayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay script not loaded!");
      return;
    }

    if (!user?.email) {
      alert("You must be logged in to upgrade!");
      return;
    }

    const options = {
      key: razorpayKey,
      amount: 69900,
      currency: "INR",
      name: "StudyMate",
      description: "Upgrade to Pro plan",
      image: "/logo.png",
      handler: function () {
        localStorage.setItem(`isPro_${user.email}`, "true");
        window.location = "/dashboard";
      },
      modal: {
        ondismiss: function () {
          console.log("Payment popup closed");
        },
      },
      prefill: {
        name: user.name || "Demo User",
        email: user.email,
        contact: user.contact || "",
      },
      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl p-10 shadow-xl text-center border border-gray-200 dark:border-gray-700 transition-all duration-300">
        
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Upgrade to Pro
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Unlock all advanced features with{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            Pro plan
          </span>
          !
          <br />
          <span className="font-bold text-blue-700 dark:text-blue-300 text-lg tracking-wide">
            ₹699
          </span>{" "}
          / year
        </p>

        <button
          onClick={handlePayment}
          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 font-semibold shadow-lg hover:scale-105 disabled:opacity-50"
          disabled={!user}
        >
          Pay & Upgrade
        </button>

        <div className="mt-4">
          <button
            onClick={() => (window.location = "/dashboard")}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm transition-all duration-200"
          >
            ← Return to Dashboard
          </button>
        </div>

        {!user?.email && (
          <div className="mt-4 text-xs text-red-500">
            Login required to upgrade.
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500 dark:text-gray-400">
          Transactions are in demo mode. Use test card/UPI from{" "}
          <a
            className="underline text-blue-600 dark:text-blue-400"
            href="https://razorpay.com/docs/payments/payment-gateway/test-card-upi-details/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Razorpay demo docs
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;