'use client';

import React, { useState } from 'react';
import { Sparkles, X, Mail, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Mechanical Engineer');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Simulate direct queueing to amoniteadmin@gmail.com
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-[#0d0f13] border border-[#232733] rounded-2xl shadow-2xl p-6 font-mono text-slate-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight">
              Amonite Pro Early Access
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Reserve your spot for cloud workspace sync, parametric CAM toolpaths, and generative CAD pipelines. Queue directed to{' '}
              <span className="text-cyan-400 font-semibold">amoniteadmin@gmail.com</span>.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-bold mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@aerospace.io"
                    className="w-full pl-9 pr-3 py-2 bg-[#14171f] border border-[#272d3b] rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-bold mb-1.5">
                  Engineering Domain
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14171f] border border-[#272d3b] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Mechanical Engineer">Mechanical / Industrial Engineer</option>
                  <option value="3D Printing & CAM">Additive Manufacturing & CAM Specialist</option>
                  <option value="Robotics Developer">Robotics & Mechatronics Designer</option>
                  <option value="Architect / Maker">Architect / Digital Fabricator</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero spam guarantee. 100% private developer preview.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 mt-4"
              >
                <span>Request Early Access</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">You&apos;re on the list!</h4>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              We have recorded your email <span className="text-cyan-400">{email}</span>. The Amonite core engineering team will contact you once developer slots open.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2 rounded-lg bg-[#161a22] hover:bg-[#202531] border border-[#272d3b] text-xs font-semibold text-white transition-colors"
            >
              Back to Studio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
