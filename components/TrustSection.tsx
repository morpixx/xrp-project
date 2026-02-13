import React from 'react';
import { ShieldCheck, Eye, LockKeyhole } from 'lucide-react';

const TrustSection: React.FC = () => {
  return (
    <section className="py-20 border-y border-white/5 bg-black/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Non-Custodial by Design</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We prioritize security above all else. The protocol is built on XRPL's native escrow functionality. We never have access to your private keys.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <LockKeyhole className="w-8 h-8 text-primary" />,
              title: "Smart Escrows",
              desc: "Funds are locked directly on the XRP Ledger via time-bound escrows. No intermediary wallets."
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-accent" />,
              title: "Self-Custody",
              desc: "You retain full control. Connect your Xumm or other XRPL wallets directly. Your keys, your crypto."
            },
            {
              icon: <Eye className="w-8 h-8 text-warning" />,
              title: "Fully Transparent",
              desc: "All locking, unlocking, and reward distribution transactions are verifiable on-chain in real-time."
            }
          ].map((item, idx) => (
            <div key={idx} className="glass p-8 rounded-xl hover:bg-white/5 transition-colors duration-300">
              <div className="mb-6 bg-white/5 w-16 h-16 rounded-full flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;