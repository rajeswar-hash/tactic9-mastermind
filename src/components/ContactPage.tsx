import { useState } from 'react';

const issueTypes = [
  'Bug Report',
  'Feature Request',
  'Gameplay Issue',
  'Account Problem',
  'Feedback & Suggestions',
  'Other',
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', issue: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        📧 Contact Us
      </h2>
      <p className="text-muted-foreground mb-6 text-sm sm:text-base">
        Have a bug to report, a feature idea, gameplay issue, or just want to share feedback? We're here to help — reach out about anything!
      </p>

      {sent ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
          <p className="text-muted-foreground mb-4">Thanks for reaching out. We'll get back to you as soon as possible.</p>
          <button
            onClick={() => { setSent(false); setForm({ name: '', email: '', issue: '', subject: '', message: '' }); }}
            className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:-translate-y-0.5 transition-transform"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-semibold text-foreground text-sm">Your Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="John Doe"
                className="w-full p-3 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block mb-1.5 font-semibold text-foreground text-sm">Email Address *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="john@example.com"
                className="w-full p-3 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-semibold text-foreground text-sm">Issue Type *</label>
            <select
              required
              value={form.issue}
              onChange={e => update('issue', e.target.value)}
              className="w-full p-3 bg-background border-2 border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-colors text-sm"
            >
              <option value="" disabled>Select an issue type...</option>
              {issueTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1.5 font-semibold text-foreground text-sm">Subject *</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={e => update('subject', e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full p-3 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block mb-1.5 font-semibold text-foreground text-sm">Message *</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={e => update('message', e.target.value)}
              placeholder="Describe your issue or feedback in detail..."
              className="w-full p-3 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-y text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform text-sm sm:text-base"
          >
            📩 Send Message
          </button>
        </form>
      )}
    </div>
  );
}
