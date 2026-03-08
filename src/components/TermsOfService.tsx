export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-5 sm:p-8 bg-card rounded-3xl border border-border animate-[fadeIn_0.4s_ease]">
      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
        📜 Terms and Conditions
      </h2>
      <p className="text-xs text-muted-foreground mb-8">Last updated: March 3, 2026</p>

      <Section title="1. Acceptance of Terms">
        <p>By accessing and using Tactic9, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
      </Section>

      <Section title="2. Description of Service">
        <p>Tactic9 is a free, browser-based strategy game played on a 9×9 grid where the objective is to connect five marks in a row. The service is provided "as is" without warranties of any kind.</p>
      </Section>

      <Section title="3. User Conduct">
        <p>When using Tactic9, you agree to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Use the service only for lawful purposes</li>
          <li>Not attempt to exploit, hack, or disrupt the service</li>
          <li>Not use automated tools or bots to interact with the game</li>
          <li>Not submit false or misleading information through the Contact Us form</li>
          <li>Respect other users when playing in multiplayer mode</li>
        </ul>
      </Section>

      <Section title="4. Intellectual Property">
        <p>All content, design, code, graphics, and branding associated with Tactic9 are the intellectual property of Tactic9 Games. You may not reproduce, distribute, or create derivative works without prior written permission.</p>
      </Section>

      <Section title="5. Game Data">
        <p>Game statistics and preferences are stored locally on your device. We are not responsible for loss of local data due to browser clearing, device changes, or other factors beyond our control.</p>
      </Section>

      <Section title="6. Availability">
        <p>We strive to keep Tactic9 available at all times but do not guarantee uninterrupted access. We may temporarily suspend the service for maintenance, updates, or improvements without prior notice.</p>
      </Section>

      <Section title="7. Limitation of Liability">
        <p>Tactic9 is provided for entertainment purposes. To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
      </Section>

      <Section title="8. Modifications">
        <p>We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance of the new terms.</p>
      </Section>

      <Section title="9. Governing Law">
        <p>These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved through appropriate legal channels.</p>
      </Section>

      <Section title="10. Contact">
        <p>For questions about these Terms of Service, please reach out via our <strong>Contact Us</strong> page.</p>
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
