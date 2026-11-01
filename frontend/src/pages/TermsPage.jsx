// Terms and Conditions page — static legal content, linked from the Footer
const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By creating an account or using Spendly, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the service.",
    ],
  },
  {
    title: "2. Use of Service",
    body: [
      "Spendly is a personal expense-tracking tool intended for individual, non-commercial use. You agree to use the service only for lawful purposes and in a way that does not interfere with other users or the operation of the service.",
      "You are responsible for keeping your login credentials secure and for all activity that occurs under your account.",
    ],
  },
  {
    title: "3. User Data",
    body: [
      "You retain ownership of the expense data you enter into Spendly. We store this data solely to provide the service to you and do not sell it to third parties.",
      "We take reasonable measures to protect your data, but no method of transmission or storage is completely secure. For more details, please refer to our Privacy Policy.",
    ],
  },
  {
    title: "4. Financial Information",
    body: [
      "Spendly is a record-keeping tool only. It does not connect to your bank, process payments, or move money on your behalf.",
      "Any summaries, totals, or insights shown in the app are based solely on the information you enter and are provided for informational purposes. They do not constitute financial, tax, or investment advice.",
    ],
  },
  {
    title: "5. Limitations of Liability",
    body: [
      "Spendly is provided on an \"as is\" and \"as available\" basis without warranties of any kind. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages, including loss of data or financial loss, arising from your use of the service.",
    ],
  },
  {
    title: "6. Changes to Terms",
    body: [
      "We may update these Terms and Conditions from time to time. When we do, we will revise the \"Last updated\" date at the top of this page. Continued use of Spendly after changes are posted means you accept the updated terms.",
    ],
  },
  {
    title: "7. Termination",
    body: [
      "You may stop using Spendly and request deletion of your account at any time. We may suspend or terminate access to the service if you violate these terms or misuse the service.",
    ],
  },
  {
    title: "8. Contact",
    body: [
      "If you have any questions about these Terms and Conditions, please contact us at support@spendly.app.",
    ],
  },
];

function TermsPage() {
  return (
    <section className="py-20 px-8">
      <div className="max-w-[760px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-block bg-accent-light text-accent text-[0.75rem] font-semibold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full mb-6">
            Legal
          </div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] text-ink mb-3">
            Terms and Conditions
          </h1>
          <p className="text-[0.9rem] text-ink-muted">Last updated: November 1, 2026</p>
        </div>

        {/* Content card */}
        <div className="bg-paper-card border border-border rounded-md p-8 md:p-10">
          {sections.map((section) => (
            <div key={section.title} className="mb-8 last:mb-0">
              <h2 className="font-display text-[1.3rem] text-ink mb-3">{section.title}</h2>
              {section.body.map((paragraph, i) => (
                <p key={i} className="text-[0.95rem] text-ink-muted leading-[1.7] mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default TermsPage;
