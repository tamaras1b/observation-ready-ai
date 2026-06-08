"use client";

import { motion } from "framer-motion";
import { Shield, FileText, Zap, AlertCircle, CheckCircle, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const LAST_UPDATED = "June 8, 2026";

const sections = [
  {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "1. Acceptance of Terms",
    content: `By accessing or using Observation Ready AI ("the App"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the App.

These terms apply to all users of the App, including educators, administrators, and any other individuals who access the App for professional or personal use.`,
  },
  {
    icon: Zap,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    title: "2. Description of the App",
    content: `Observation Ready AI is an AI-powered educator toolkit designed to assist teachers with:
• Creating observation-ready lesson plans
• Drafting and organizing Individual Professional Development Plan (IPDP) responses
• Managing educational standards and custom questions

The App uses artificial intelligence to generate suggestions, templates, and guidance. All AI-generated content is intended as a starting point for professional use and must be reviewed, edited, and personalized by the user before submission or official use.`,
  },
  {
    icon: FileText,
    color: "text-violet-600",
    bg: "bg-violet-50",
    title: "3. Ownership of Your Content",
    content: `You retain full ownership of all content you create, upload, or export using the App, including:
• Lesson plans you build and save
• IPDP responses you write
• Standards and questions you upload to your library
• Any exported PDF documents

Observation Ready AI does not claim any intellectual property rights over your content. Your lesson plans and IPDP responses are yours.

AI-generated suggestions provided by the App are offered as editable starting points. Once you meaningfully edit, personalize, and save content, that resulting work reflects your professional authorship.`,
  },
  {
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    title: "4. AI Disclosure & Disclaimer",
    content: `Observation Ready AI uses artificial intelligence to generate lesson plan suggestions, IPDP response guidance, SMART goal templates, and differentiation strategies.

IMPORTANT — AI-Generated Content Notice:
• All AI-generated content is a suggested starting point only and does not constitute professional, legal, or pedagogical advice.
• You are solely responsible for reviewing, editing, and personalizing all AI-generated content to accurately reflect your professional practice before submitting it to any evaluator, administrator, or school district.
• Submitting AI-generated content as entirely your own work without review or personalization may conflict with your school or district's academic integrity or professional conduct policies. Always check your district's AI use guidelines.
• Observation Ready AI makes no guarantee that AI-generated suggestions are accurate, complete, appropriate for your specific context, or aligned with your district's evaluation criteria.`,
  },
  {
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-50",
    title: "5. Acceptable Use",
    content: `You agree to use the App only for lawful purposes and in accordance with these Terms. You agree not to:
• Upload content that infringes on the intellectual property rights of others
• Use the App to generate or distribute false, misleading, or fraudulent professional documentation
• Attempt to reverse-engineer, copy, or redistribute the App's code or design
• Use the App in any way that violates your school district's policies on AI use in professional documentation
• Share your saved plans or IPDP responses in a way that misrepresents another person's professional work

You are responsible for ensuring your use of the App complies with your employer's and school district's policies regarding the use of AI tools.`,
  },
  {
    icon: Scale,
    color: "text-rose-600",
    bg: "bg-rose-50",
    title: "6. Disclaimer of Warranties",
    content: `THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.

Observation Ready AI does not warrant that:
• The App will be uninterrupted, error-free, or completely secure
• AI-generated suggestions will be accurate, complete, or suitable for any particular evaluation framework
• The App will meet all of your professional requirements

Your use of the App and reliance on any AI-generated content is at your own risk. Observation Ready AI is not responsible for any professional, academic, or employment consequences arising from your use of the App.`,
  },
  {
    icon: Shield,
    color: "text-slate-600",
    bg: "bg-slate-50",
    title: "7. Limitation of Liability",
    content: `To the fullest extent permitted by applicable law, Observation Ready AI and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of employment, professional standing, or data, arising from your use of or inability to use the App.

Our total liability to you for any claims arising from your use of the App shall not exceed the amount you have paid to use the App (if any).`,
  },
  {
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    title: "8. Educational Standards & Copyrights",
    content: `When you upload educational standards, IPDP questions, or other documents to the App's Standards Library:
• You represent that you have the right to use and store that content for your personal professional purposes.
• Many state and national educational standards are in the public domain or are licensed for free educational use. However, you are responsible for ensuring that any content you upload complies with applicable copyright and licensing terms.
• Observation Ready AI does not review, validate, or take responsibility for the content you upload to your personal library.`,
  },
  {
    icon: FileText,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "9. Changes to These Terms",
    content: `We reserve the right to update these Terms of Use at any time. When we do, we will update the "Last Updated" date at the top of this page. Your continued use of the App after changes are posted constitutes your acceptance of the revised terms.

We encourage you to review these Terms periodically to stay informed of any updates.`,
  },
  {
    icon: Scale,
    color: "text-slate-600",
    bg: "bg-slate-50",
    title: "10. Governing Law",
    content: `These Terms of Use shall be governed by and construed in accordance with the laws of the State of Florida, without regard to its conflict of law provisions.

Any disputes arising under these Terms shall be resolved in the courts located in Duval County, Florida.`,
  },
  {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    title: "11. Contact",
    content: `If you have questions about these Terms of Use, please contact us through the Observation Ready AI platform.

For questions regarding your school or district's policies on AI use in professional documentation, please consult your district's human resources or legal department directly.`,
  },
];

export default function TermsPage() {
  return (
    <div className="p-8 pb-24 max-w-4xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Terms of Use</h1>
            <p className="text-slate-500 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">AI-Generated Content Notice</p>
              <p className="text-sm text-amber-700">
                All AI suggestions in this app are starting points only. You are responsible for reviewing, editing, and personalizing all content to reflect your authentic professional practice before submitting to any evaluator or administrator.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-slate-800 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${section.bg} flex items-center justify-center flex-shrink-0`}>
                    <section.icon className={`h-4 w-4 ${section.color}`} />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Separator className="my-8" />
      <p className="text-xs text-slate-400 text-center">
        © {new Date().getFullYear()} Observation Ready AI. All rights reserved. | These terms were last updated {LAST_UPDATED}.
      </p>
    </div>
  );
}
