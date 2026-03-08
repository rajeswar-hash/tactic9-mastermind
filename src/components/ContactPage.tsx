import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SupportChat from './SupportChat';

const issueTypes = [
  'Bug Report',
  'Feature Request',
  'Gameplay Issue',
  'UI/Design Feedback',
  'Performance Problem',
  'Accessibility Concern',
  'General Feedback',
  'Partnership Inquiry',
  'Other',
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', issue: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: form,
      });

      if (error) throw error;

      setSent(true);
      toast.success('Message sent successfully!');
    } catch (err) {
      console.error('Failed to send:', err);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setSending(false);
    }
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
          <p className="text-muted-foreground mb-6">Thanks for reaching out. We've received your message and will review it as soon as possible.</p>
          <button
            onClick={() => { setSent(false); setForm({ name: '', email: '', issue: '', subject: '', message: '' }); }}
            className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:-translate-y-0.5 transition-transform"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <QuickHelp emoji="🐛" title="Bug Report" description="Found something broken? Let us know with details." />
            <QuickHelp emoji="💡" title="Feature Request" description="Have an idea to improve the game? We'd love to hear it!" />
            <QuickHelp emoji="💬" title="General Feedback" description="Share your thoughts, suggestions, or just say hello." />
          </div>

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
                rows={6}
                value={form.message}
                onChange={e => update('message', e.target.value)}
                placeholder="Describe your issue or feedback in detail. For bug reports, please include steps to reproduce the problem..."
                className="w-full p-3 bg-background border-2 border-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-colors resize-y text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? '📨 Sending...' : '📩 Send Message'}
            </button>

            <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
              By submitting this form, you agree to our Terms & Conditions and Privacy Policy. We typically respond within 24-48 hours.
            </p>
          </form>
        </>
      )}
    </div>
  );
}

function QuickHelp({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-3 bg-background rounded-xl border border-border text-center">
      <div className="text-xl mb-1">{emoji}</div>
      <h4 className="font-bold text-foreground text-xs mb-0.5">{title}</h4>
      <p className="text-[10px] sm:text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
