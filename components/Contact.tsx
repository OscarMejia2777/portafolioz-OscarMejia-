
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="pt-32">
      <div className="max-w-[960px] mx-auto px-6 mb-32">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter">Get in Touch</h2>
          <p className="text-slate-400 text-xl max-w-xl mx-auto">
            Have a project in mind? Let's build something amazing together. I'm currently open to new opportunities.
          </p>
        </div>

        <form className="max-w-2xl mx-auto space-y-10" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative group">
              <input 
                type="text" 
                placeholder=" "
                className="peer w-full bg-transparent border-0 border-b-2 border-white/10 py-4 focus:ring-0 focus:border-primary transition-all text-white placeholder-transparent"
              />
              <label className="absolute left-0 top-4 text-slate-500 transition-all pointer-events-none origin-left peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75">
                Your Name
              </label>
            </div>
            <div className="relative group">
              <input 
                type="email" 
                placeholder=" "
                className="peer w-full bg-transparent border-0 border-b-2 border-white/10 py-4 focus:ring-0 focus:border-primary transition-all text-white placeholder-transparent"
              />
              <label className="absolute left-0 top-4 text-slate-500 transition-all pointer-events-none origin-left peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75">
                Email Address
              </label>
            </div>
          </div>
          
          <div className="relative group">
            <textarea 
              rows={4}
              placeholder=" "
              className="peer w-full bg-transparent border-0 border-b-2 border-white/10 py-4 focus:ring-0 focus:border-primary transition-all text-white placeholder-transparent resize-none"
            ></textarea>
            <label className="absolute left-0 top-4 text-slate-500 transition-all pointer-events-none origin-left peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary peer-[:not(:placeholder-shown)]:-translate-y-6 peer-[:not(:placeholder-shown)]:scale-75">
              Tell me about your project...
            </label>
          </div>

          <div className="flex justify-center">
            <button className="bg-primary text-[#101c22] px-12 py-5 rounded-2xl font-black text-xl hover:shadow-[0_0_30px_rgba(43,173,238,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3">
              Send Message
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </form>

        <div className="mt-24 text-center">
           <p className="text-slate-500 mb-2 font-medium">Or email directly at</p>
           <a href="mailto:hello@devportfolio.com" className="text-2xl font-bold text-primary hover:underline underline-offset-8">hello@devportfolio.com</a>
        </div>
      </div>

      {/* Hero Footer */}
      <footer className="bg-[#0c1418] border-t border-white/5 pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-16 opacity-10 select-none">
             LET'S WORK TOGETHER
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-24">
            {['account_circle', 'terminal', 'share'].map((icon, i) => (
              <a key={i} href="#" className="flex items-center justify-center size-16 rounded-full bg-[#1c2327] border border-white/10 text-slate-400 hover:bg-primary hover:text-[#101c22] transition-all transform hover:-translate-y-2">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
              </a>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-16">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded flex items-center justify-center text-[10px] font-black text-[#101c22]">DP</div>
              <span className="text-slate-500 text-sm">© 2024 DevPortfolio. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-1 text-slate-500 text-sm">
              Built with <span className="material-symbols-outlined text-sm text-red-500">favorite</span> by <span className="text-white font-bold ml-1">John Dev</span>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Privacy</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors text-sm font-medium">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
