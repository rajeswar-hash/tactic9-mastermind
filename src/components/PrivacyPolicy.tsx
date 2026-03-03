export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
        🔒 Privacy Policy
      </h2>
      <p className="text-xs text-muted-foreground mb-6">Last updated: March 3, 2026</p>

      <Section title="1. Information We Collect">
        <p>Tactic9 is a browser-based game. We do <strong>not</strong> collect personal data unless you voluntarily submit it through our Contact Us form. Information you may provide includes:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Name and email address (via Contact Us form)</li>
          <li>Message content and issue type</li>
        </ul>
      </Section>

      <Section title="2. Local Storage">
        <p>We use your browser's local storage to save game statistics (wins, losses, draws). This data stays on your device and is never transmitted to our servers.</p>
      </Section>

      <Section title="3. Cookies">
        <p>Tactic9 does not use tracking cookies. We may use essential cookies for basic site functionality only.</p>
      </Section>

      <Section title="4. Third-Party Services">
        <p>We use Google Fonts to load the Outfit typeface. Google may collect anonymized usage data as described in their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>.</p>
      </Section>

      <Section title="5. Data Security">
        <p>We take reasonable measures to protect any information you provide. Since game data is stored locally on your device, you have full control over it and can clear it at any time via your browser settings or the in-game reset button.</p>
      </Section>

      <Section title="6. Children's Privacy">
        <p>Tactic9 is suitable for all ages. We do not knowingly collect personal information from children under 13. If you believe a child has provided us personal information, please contact us.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>You may request deletion of any personal data submitted through our Contact Us form. You can clear your local game statistics at any time using the reset button in the game.</p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated revision date.</p>
      </Section>

      <Section title="9. Contact">
        <p>If you have questions about this Privacy Policy, please reach out via our <strong>Contact Us</strong> page.</p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">{title}</h3>
      <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
