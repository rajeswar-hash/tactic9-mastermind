import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
        📧 Contact Us
      </h2>
      <p className="text-muted-foreground mb-6">Have feedback or questions? Drop us a message!</p>

      {sent ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
          <p className="text-muted-foreground">Thanks for reaching out. We'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Name" type="text" required />
          <FormField label="Email" type="email" required />
          <div>
            <label className="block mb-2 font-semibold text-foreground text-sm">Message</label>
            <textarea
              required
              rows={5}
              className="w-full p-3 bg-background border-2 border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-colors resize-y"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}

function FormField({ label, type, required }: { label: string; type: string; required?: boolean }) {
  return (
    <div>
      <label className="block mb-2 font-semibold text-foreground text-sm">{label}</label>
      <input
        type={type}
        required={required}
        className="w-full p-3 bg-background border-2 border-border rounded-xl text-foreground focus:border-primary focus:outline-none transition-colors"
      />
    </div>
  );
}
