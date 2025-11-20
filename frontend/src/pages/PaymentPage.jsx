import React, { useState, useEffect } from "react";

const PaymentPage = () => {
  const razorpayKey = "rzp_test_RhiwED0mePypIR"; 

  // Get current user from localStorage
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
    if (!user || !user.email) {
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
      prefill: {
        name: user.name || "Demo User",
        email: user.email,
        contact: user.contact || "9999999999",
      },
      theme: { color: "#2563eb" }, // blue accent
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-950 rounded-2xl p-10 shadow-xl text-center border-2 border-dashed border-white/20 dark:border-gray-300 hover:border-blue-400/40 dark:hover:border-blue-400/50 transition-all duration-300 group">
      <h2 className="text-2xl text-white dark:text-gray-900 font-bold mb-2">Upgrade to Pro</h2>
      <p className="text-gray-400 dark:text-gray-600 mb-6">
        Unlock all advanced features with{" "}
        <span className="font-bold text-blue-500">Pro plan</span>!
        <br />{" "}
        <span className="font-bold text-blue-600 text-lg tracking-wide">
          ₹699
        </span>{" "}
        / year
      </p>
      <button
        onClick={handlePayment}
        className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-700 hover:via-blue-500 hover:to-blue-500 text-white px-8 py-3 rounded-xl transition-all duration-300 inline-flex items-center gap-2 font-semibold shadow-lg hover:scale-105 focus:outline-none"
        disabled={!user}
      >
        Pay & Upgrade
      </button>
      <div className="mt-4">
            <button
                onClick={() => window.location = "/dashboard"}
                className=" text-blue-500 hover:text-blue-600 transition-all duration-200 font-light text-sm"
            >
                ← Return to Dashboard
            </button>
        </div>
      {!user?.email && (
        <div className="mt-4 text-xs text-red-500">
          Login required to upgrade.
        </div>
      )}
      <div className="mt-10 text-xs text-gray-500 dark:text-gray-400">
        Transactions are in demo mode. Use test card/UPI/QR from{" "}
        <a
          className="underline text-blue-500"
          href="https://razorpay.com/docs/payments/payment-gateway/test-card-upi-details/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Razorpay demo docs
        </a>
        .
      </div>
    </div>
  );
};

export default PaymentPage;
