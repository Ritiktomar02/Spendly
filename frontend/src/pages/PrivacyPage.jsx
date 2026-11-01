// Privacy Policy page — static legal content, linked from the Footer
const sections = [
  {
    title: "1. Data We Collect",
    body: [
      "When you create an account, we collect your name, email address, and a securely hashed version of your password.",
      "When you use Spendly, we store the expense details you choose to enter, such as amounts, categories, dates, and descriptions.",
    ],
  },
  {
    title: "2. How We Use Your Data",
    body: [
      "We use your information only to provide and improve the service: to sign you in, save and display your expenses, and generate summaries of your spending.",
      "We do not sell your personal data, and we do not use your expense data for advertising.",
    ],
  },
  {
    title: "3. Data Storage",
    body: [
      "Your account and expense data are stored in a secure database. We keep your data for as long as your account is active, or as needed to provide the service.",
      "If you delete your account, we will delete your personal data within a reasonable period, except where we are required to keep it by law.",
    ],
  },
  {
    title: "4. Third-Party Services",
    body: [
      "We may rely on trusted third-party providers, such as hosting and database services, to run Spendly. These providers process data only on our behalf and are not permitted to use it for their own purposes.",
      "Spendly does not connect to your bank accounts or share your expense data with financial institutions.",
    ],
  },
  {
    title: "5. Data Security",
    body: [
      "We use reasonable technical measures to protect your data, including password hashing and authenticated access to your account.",
      "However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "6. Your Rights",
    body: [
      "You can access and update the expense data in your account at any time. You may also request a copy of your personal data or ask us to delete your account and associated data.",
      "To make any of these requests, please contact us using the details below.",
    ],
  },
  {
    title: "7. Changes to Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the \"Last updated\" date at the top of this page. Continued use of Spendly after changes are posted means you accept the updated policy.",
    ],
  },
  {
    title: "8. Contact Us",
    body: [
      "If you have any questions about this Privacy Policy or how your data is handled, please contact us at support@spendly.app.",
    ],
  },
];

function PrivacyPage() {
  return (
    <section className="py-20 px-8">
      <div className="max-w-[760px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-block bg-accent-light text-accent text-[0.75rem] font-semibold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full mb-6">
            Legal
          </div>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-[1.1] tracking-[-0.02em] text-ink mb-3">
            Privacy Policy
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

export default PrivacyPage;
