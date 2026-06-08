"use client";

import { motion } from "framer-motion";
import { Shield, Database, Eye, Lock, UserCheck, Bell, Mail, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const LAST_UPDATED = "June 8, 2026";

const sections = [
  {
    icon: Eye,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    title: "1. Information We Collect",
    content: `Observation Ready AI is designed with privacy first. We do not operate servers, user accounts, or external databases. Here is what the App processes:

What the App stores locally on your device:
• Lesson plans you create and save
• IPDP responses you write or generate
• Custom standards and questions you upload
• App preferences and session data

What the App does NOT collect:
• Your name, email address, or personal identifiers
• Student names, grades, or any student data
• Login credentials (there are no accounts)
• Payment or financial information
• Device identifiers or usage analytics sent to us

All data you enter into Observation Ready AI is stored exclusively in your browser's localStorage — on your device, never transmitted to our servers.`,
  },
  {
    icon: Database,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "2. How We Use Your Information",
    content: `Because all data remains on your device, there is no server-side processing of your personal content.

The App uses your locally stored data solely to:
• Display and populate your lesson plans and IPDP responses
• Pre-fill form fields for convenience when you return
• Generate PDF exports of your own content
• Provide AI suggestions based on the subject, grade, and standards you enter in-session

AI Suggestions: When you request AI-generated suggestions, the App sends anonymized context (grade level, subject area, and topic) to a local API route on the same server as the App. No personally identifiable information is included in these requests. No suggestion data is logged or retained after the response is returned.`,
  },
  {
    icon: Shield,
    color: "text-violet-600",
    bg: "bg-violet-50",
    title: "3. FERPA Compliance",
    content: `The Family Educational Rights and Privacy Act (FERPA) protects the privacy of student education records.

Observation Ready AI is designed to be FERPA-friendly:
• The App does not ask you to enter student names, ID numbers, or identifiable student information
• No student data is transmitted to any server
• All locally stored data is under your control and on your device only

We strongly recommend that you:
• Do not enter student names, IDs, or personally identifiable student information into any field
• Use general descriptors (e.g., "struggling readers," "ELL students") rather than identifiable student details
• Follow your district's policies regarding digital tools and student data privacy

Educators are responsible for ensuring their use of the App complies with applicable FERPA requirements and district policies.`,
  },
  {
    icon: Lock,
    color: "text-rose-600",
    bg: "bg-rose-50",
    title: "4. Data Security",
    content: `Your data lives in your browser's localStorage, which is:
• Isolated to your specific browser and device
• Not accessible to other websites or applications
• Cleared automatically if you clear your browser data

Security recommendations:
• Do not use the App on shared or public computers where browser data may persist
• Regularly clear your browser's site data if you work on a shared device
• Use a secure, updated browser for best data hygiene

We do not offer cloud backup of your App data. If you clear your browser data, your saved plans and responses will be permanently deleted from that device. We recommend using the PDF export feature to save important work offline.`,
  },
  {
    icon: UserCheck,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "5. Your Rights and Control",
    content: `You have full control over your data at all times:

Right to Access: All your data is already accessible to you directly in the App — it lives on your own device.

Right to Delete: You can delete individual saved plans, IPDP sessions, standards, and questions from within the App. To delete all App data, you can clear your browser's site data for this App's domain in your browser settings.

Right to Export: Use the PDF export feature to download your content before deletion.

No Account Deletion Needed: Because there are no user accounts, there is nothing to "delete" on our end. Your data is entirely within your control.

If you believe any feature of the App processes data contrary to this Privacy Policy, please contact us using the information in Section 9.`,
  },
  {
    icon: Globe,
    color: "text-sky-600",
    bg: "bg-sky-50",
    title: "6. Third-Party Services",
    content: `Observation Ready AI does not currently integrate with any third-party data processors, analytics services, advertising networks, or tracking tools.

The App does not:
• Use Google Analytics, Mixpanel, or similar usage tracking
• Embed social media pixels or trackers
• Serve advertising or sponsored content
• Share data with third-party AI providers for suggestion generation

If this changes in a future version, this Privacy Policy will be updated and users will be notified. We are committed to maintaining a lightweight, privacy-first tool for educators.`,
  },
  {
    icon: Bell,
    color: "text-orange-600",
    bg: "bg-orange-50",
    title: "7. Children's Privacy (COPPA)",
    content: `The Children's Online Privacy Protection Act (COPPA) restricts the collection of personal information from children under 13.

Observation Ready AI is intended for use by adult educators and school professionals. It is not directed at students or children.

The App does not:
• Knowingly collect personal information from children under 13
• Allow children to create accounts or submit data

If you are a teacher using this App in a classroom setting, please ensure students are not entering personal information into the App. The App is a teacher-facing planning tool, not a student-facing application.`,
  },
  {
    icon: Globe,
    color: "text-teal-600",
    bg: "bg-teal-50",
    title: "8. Changes to This Privacy Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in the App's functionality or applicable laws. When we make material changes, we will update the "Last Updated" date at the top of this page.

Continued use of the App after changes to this Privacy Policy constitutes your acceptance of the revised policy.

We encourage you to review this Privacy Policy periodically. Because all data is stored locally on your device, policy changes do not retroactively affect data already on your device.`,
  },
  {
    icon: Mail,
    color: "text-pink-600",
    bg: "bg-pink-50",
    title: "9. Contact Us",
    content: `If you have questions, concerns, or requests related to this Privacy Policy or the privacy practices of Observation Ready AI, please contact us:

Observation Ready AI
Jacksonville, Florida, USA

For privacy-related inquiries, please include "Privacy Policy" in the subject line of your communication.

We will respond to privacy inquiries within 30 days of receipt. Because we do not maintain user accounts or server-side data, we may not be able to assist with data requests beyond what is accessible to you directly in the App.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="text-slate-500 text-sm">Observation Ready AI — Last Updated: {LAST_UPDATED}</p>
          </div>
        </div>
        <Separator />
      </motion.div>

      {/* Privacy-first banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"
      >
        <div className="flex gap-3 items-start">
          <Shield className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-800 mb-1">Your Data Stays on Your Device</p>
            <p className="text-emerald-700 text-sm leading-relaxed">
              Observation Ready AI stores all lesson plans, IPDP responses, and standards exclusively in your browser&apos;s
              localStorage — on your device only. We do not have servers that receive, store, or process your content.
              No personal information is transmitted to us when you use the App.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-5">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 * i }}
          >
            <Card className="border border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-base font-semibold text-slate-800">
                  <span className={`w-8 h-8 rounded-lg ${section.bg} flex items-center justify-center flex-shrink-0`}>
                    <section.icon className={`h-4 w-4 ${section.color}`} />
                  </span>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center"
      >
        <p className="text-slate-500 text-sm">
          This privacy policy applies to the Observation Ready AI web application.
          For related policies, please review our{" "}
          <a href="/terms" className="text-indigo-600 hover:underline font-medium">Terms of Use</a>.
        </p>
      </motion.div>
    </div>
  );
}
