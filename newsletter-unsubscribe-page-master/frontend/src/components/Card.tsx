import { useState } from "react";
import VikiVibeLogo from "../assets/viki_vibe.png";
import VikiAiLogo from "../assets/viki_ai.png";
import type { Status } from "../types";

interface CardProps {
  loading: Status;
  setLoading: (loading: Status) => void;
}

const Card = ({ loading, setLoading }: CardProps) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUnsubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setLoading("loading");

    try {
      const response = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoading("loaded");
        setMessage(data.message);
      } else {
        setLoading("initial");
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setLoading("initial");
      setMessage("Server error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#d4f7ff] w-[600px] rounded-lg shadow-xl">
      <div className="flex flex-col justify-center items-center gap-4 divide-y divide-[#004aad]">
        <img src={VikiAiLogo} alt="Viki AI Logo" width={100} />
        <div className="w-[95%] flex flex-col justify-center items-center gap-4 p-4">
          {loading === "initial" ? (
            <>
              <p className="text-[#004aad]">
                Are you sure you want to stop receiving emails from us?
              </p>
              <p className="text-[#004aad]">
                If you want to change your mail preferences, click here.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded mb-1 text-gray-700"
                disabled={isSubmitting}
              />
              <button
                type="button"
                className="m-2 px-4 py-1 text-[#004aad] bg-white rounded-full font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50"
                onClick={handleUnsubscribe}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Unsubscribing..." : "Unsubscribe"}
              </button>
              {message && <p className="text-sm text-red-600">{message}</p>}
            </>
          ) : (
            <>
              <div className="flex flex-col justify-center items-center">
                <p className="text-[#004aad]">Thanks for your feedback!</p>
                <p className="text-[#004aad]">
                  You have <b>unsubscribed</b> from our organization.
                </p>
              </div>
              <p className="m-2 text-[#004aad] text-center">
                {message ||
                  "Your email address is permanently removed from our mailing lists. You will not receive any further emails from us."}
              </p>
            </>
          )}
        </div>
      </div>
      <img
        src={VikiVibeLogo}
        alt="Viki Vibe Logo"
        width={150}
        className="m-auto p-5"
      />
    </div>
  );
};

export default Card;
