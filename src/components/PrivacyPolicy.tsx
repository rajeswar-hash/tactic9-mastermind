export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        🔒 Privacy Policy
      </h2>
      <p className="text-xs text-muted-foreground mb-8">Last updated: March 3, 2026</p>

      <Section title="1. Introduction">
        <p>Welcome to Tactic9. This Privacy Policy explains how we handle information when you use our browser-based strategy game. By using Tactic9, you agree to the practices described in this policy.</p>
      </Section>

      <Section title="2. Information We Collect">
        <p>Tactic9 is a browser-based game. We do <strong>not</strong> collect personal data unless you voluntarily submit it through our Contact Us form. Information you may provide includes:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Name and email address (via Contact Us form)</li>
          <li>Subject and message content</li>
          <li>Issue type or category selection</li>
        </ul>
      </Section>

      <Section title="3. Information We Do Not Collect">
        <p>We do <strong>not</strong> collect:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>IP addresses or geolocation data</li>
          <li>Device identifiers or fingerprints</li>
          <li>Browsing history or activity across other websites</li>
          <li>Payment or financial information</li>
          <li>Social media profiles or account data</li>
        </ul>
      </Section>

      <Section title="4. Local Storage">
        <p>We use your browser's local storage to save game statistics (wins, losses, draws) and user preferences (such as sound settings). This data:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Stays entirely on your device</li>
          <li>Is never transmitted to our servers</li>
          <li>Can be cleared at any time via your browser settings or the in-game reset button</li>
          <li>Is not accessible by any third party</li>
        </ul>
      </Section>

      <Section title="5. Cookies">
        <p>Tactic9 does not use tracking cookies, advertising cookies, or analytics cookies. We may use essential cookies strictly required for basic site functionality. No third-party cookies are set.</p>
      </Section>

      <Section title="6. Third-Party Services">
        <p>We use the following third-party services:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Google Fonts</strong> — To load the Outfit typeface. Google may collect anonymized usage data as described in their <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>.</li>
          <li><strong>Resend</strong> — To deliver contact form submissions to our team via email. Resend processes the name, email, and message you submit. See their <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a>.</li>
        </ul>
        <p className="mt-2">We do not use any third-party analytics, advertising, or tracking services.</p>
      </Section>

      <Section title="7. Data Security">
        <p>We take reasonable technical and organizational measures to protect any information you provide. Since game data is stored locally on your device, you maintain full control. Contact form submissions are transmitted securely to our team via a backend email service (Resend) and are not shared with other third parties.</p>
      </Section>

      <Section title="8. Data Retention">
        <p>Game statistics are stored locally on your device for as long as you choose to keep them. Contact form data is retained only as long as necessary to address your inquiry and is deleted within 90 days unless a longer retention period is required by law.</p>
      </Section>

      <Section title="9. Children's Privacy">
        <p>Tactic9 is suitable for all ages and is designed to be family-friendly. We do not knowingly collect personal information from children under 13 (or under 16 in the EU/EEA). If you believe a child has provided us with personal information, please contact us immediately so we can delete it.</p>
      </Section>

      <Section title="10. Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Access any personal data we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Object to or restrict processing of your data</li>
          <li>Withdraw consent at any time</li>
          <li>Lodge a complaint with a data protection authority</li>
        </ul>
        <p className="mt-2">You can clear your local game statistics at any time using the reset button in the game.</p>
      </Section>

      <Section title="11. International Users">
        <p>Tactic9 is accessible worldwide. By using Tactic9, you understand that any voluntarily submitted data may be processed in accordance with this policy regardless of your location. We comply with applicable data protection laws including GDPR and CCPA where relevant.</p>
      </Section>

      <Section title="12. Changes to This Policy">
        <p>We may update this Privacy Policy from time to time. Changes will be reflected on this page with an updated revision date. We encourage you to review this policy periodically. Continued use of Tactic9 after changes constitutes acceptance of the updated policy.</p>
      </Section>

      <Section title="13. Contact">
        <p>If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out via our <strong>Contact Us</strong> page.</p>
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
