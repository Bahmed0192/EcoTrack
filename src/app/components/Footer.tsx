import { motion } from "motion/react";

export function Footer() {
  const footerLinks = {
    Product: ["Features", "Pricing", "API", "Enterprise"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Documentation", "Help Center", "Community", "Status"],
    Legal: ["Privacy", "Terms", "Security", "Compliance"],
  };

  return (
    <footer className="relative border-t border-white/10 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center">
                  <span className="text-sm">🌍</span>
                </div>
                <span style={{ fontSize: '20px', fontWeight: 700 }}>EcoTrack</span>
              </div>
              <p className="text-white/60 text-sm mb-6">
                Building a sustainable future, one action at a time.
              </p>
              <div className="flex gap-3">
                {["Twitter", "LinkedIn", "GitHub"].map((platform, index) => (
                  <motion.a
                    key={platform}
                    href="#"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-lg backdrop-blur-[24px] bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="text-xs text-white/60">{platform[0]}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="mb-4 text-white/80">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + categoryIndex * 0.1 + linkIndex * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href="#"
                      className="text-white/60 text-sm hover:text-[#10B981] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-white/60 text-sm">
            © 2026 EcoTrack. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <span>Powered by</span>
            <span className="text-[#10B981]">Bug&Error</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
