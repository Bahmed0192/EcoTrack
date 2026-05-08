import { motion } from "motion/react";
import { useState } from "react";

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: [
        "Basic carbon tracking",
        "Daily score calculation",
        "Community challenges",
        "Mobile app access",
        "Weekly reports",
      ],
      color: "#10B981",
      popular: false,
    },
    {
      name: "Pro",
      price: annual ? 99 : 12,
      description: "For serious eco-warriors",
      features: [
        "Everything in Free",
        "AI-powered recommendations",
        "Advanced analytics",
        "Goal setting & tracking",
        "Priority support",
        "Custom challenges",
        "API access",
      ],
      color: "#3B82F6",
      popular: true,
    },
    {
      name: "Enterprise",
      price: null,
      description: "For organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "Custom integrations",
        "Dedicated support",
        "SLA guarantee",
        "White-label options",
        "Advanced security",
      ],
      color: "#10B981",
      popular: false,
    },
  ];

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Simple, <span className="text-[#10B981]">Transparent</span> Pricing
          </h1>
          <p className="text-white/60 mt-6 max-w-3xl mx-auto text-lg">
            Choose the plan that fits your sustainability journey. All plans include core features.
          </p>

          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${!annual ? 'text-white' : 'text-white/60'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-14 h-7 rounded-full bg-white/10 border border-white/20 transition-all duration-300"
            >
              <motion.div
                animate={{ x: annual ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-[#10B981]"
              />
            </button>
            <span className={`text-sm ${annual ? 'text-white' : 'text-white/60'}`}>
              Annual <span className="text-[#10B981]">(Save 17%)</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative backdrop-blur-[24px] bg-white/5 border rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 ${
                plan.popular ? 'border-[#10B981] scale-105' : 'border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#10B981] text-[#050505] px-4 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="mb-2" style={{ fontSize: '28px', fontWeight: 700 }}>
                  {plan.name}
                </h3>
                <p className="text-white/60 text-sm mb-6">{plan.description}</p>

                <div className="flex items-end gap-2 mb-2">
                  {plan.price !== null ? (
                    <>
                      <span style={{ fontSize: '48px', fontWeight: 700, color: plan.color }}>
                        ${plan.price}
                      </span>
                      <span className="text-white/60 text-sm mb-3">
                        /{annual ? 'year' : 'month'}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '48px', fontWeight: 700, color: plan.color }}>
                      Custom
                    </span>
                  )}
                </div>
              </div>

              <button
                className={`w-full py-3 rounded-xl mb-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[#10B981] text-[#050505] hover:scale-105'
                    : 'bg-white/10 border border-white/20 hover:bg-white/20'
                }`}
              >
                {plan.price !== null ? 'Get Started' : 'Contact Sales'}
              </button>

              <div className="space-y-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="flex-shrink-0 mt-0.5"
                    >
                      <circle cx="10" cy="10" r="10" fill={plan.color} opacity="0.2" />
                      <path
                        d="M6 10L9 13L14 7"
                        stroke={plan.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24"
        >
          <h2 className="text-center mb-12" style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 700 }}>
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "Can I switch plans anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.",
              },
              {
                q: "Is there a free trial?",
                a: "The Free plan is available forever. Pro plan includes a 14-day free trial, no credit card required.",
              },
              {
                q: "How is my data protected?",
                a: "We use bank-level encryption and comply with GDPR, CCPA, and SOC 2 Type II standards.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="backdrop-blur-[24px] bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <h4 className="mb-3" style={{ fontSize: '18px', fontWeight: 600 }}>
                  {faq.q}
                </h4>
                <p className="text-white/60 text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
