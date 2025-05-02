
import React from "react";
import { Shield, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100">
            Learn how we collect, use, and protect your personal information
          </p>
        </div>
      </div>

      {/* Policy Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8 flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Effective Date: 01/05/2025</p>
              <p className="text-sm text-gray-500">Last Updated: 01/05/2025</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">1. OVERVIEW</h2>
              <p className="text-gray-700">
                This Privacy Policy outlines how KG Components ("we", "us", or "our") collects,
                processes, uses, and protects personal information provided by users ("you", "your") in
                connection with the use of our services, including our website, and physical store located
                in Luanda, Angola.
              </p>
              <p className="text-gray-700 mt-4">
                By accessing our platform, utilizing our services, or interacting with us, you acknowledge
                that you have read and understood this Privacy Policy and agree to the practices
                described herein.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">2. INFORMATION WE COLLECT</h2>
              <p className="text-gray-700 mb-4">
                We collect and process the following categories of personal data:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <span className="font-medium">Identification Data:</span> Full name, national ID number (for pickup verification, if applicable).
                </li>
                <li>
                  <span className="font-medium">Contact Details:</span> Phone number, email address, and where applicable, physical address.
                </li>
                <li>
                  <span className="font-medium">Order Information:</span> Products ordered, order history, reference numbers for payments.
                </li>
                <li>
                  <span className="font-medium">Payment Reference Data:</span> Information required to verify offline payment via references.
                </li>
                <li>
                  <span className="font-medium">Technical Data:</span> IP address, browser information, device type, and activity logs.
                </li>
                <li>
                  <span className="font-medium">User Correspondence:</span> Inquiries, feedback, or customer service communications.
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                We do not collect or process credit card or debit card information. All payments are
                conducted through a reference-based method, and instructions are provided after order
                placement.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">3. PURPOSES FOR DATA COLLECTION</h2>
              <p className="text-gray-700 mb-4">
                We process personal data for the following lawful purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>To fulfill product orders and generate payment instructions.</li>
                <li>To verify identity at the time of collection.</li>
                <li>To provide customer service and respond to inquiries or complaints.</li>
                <li>To improve operational efficiency, platform usability, and overall user experience.</li>
                <li>To comply with legal obligations, including anti-fraud and regulatory requirements.</li>
                <li>To send service-related communications, such as updates or important notifications.</li>
              </ul>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">4. LEGAL BASIS FOR PROCESSING</h2>
              <p className="text-gray-700 mb-4">
                We rely on the following lawful bases for processing your data:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <span className="font-medium">Consent:</span> Where we seek your explicit agreement (e.g., marketing).
                </li>
                <li>
                  <span className="font-medium">Contractual Necessity:</span> To fulfill our obligations arising from any agreements with you.
                </li>
                <li>
                  <span className="font-medium">Legal Obligation:</span> Where processing is necessary to comply with applicable laws.
                </li>
                <li>
                  <span className="font-medium">Legitimate Interests:</span> To manage and improve our operations and services.
                </li>
              </ul>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">5. CROSS-BORDER DATA TRANSFERS</h2>
              <p className="text-gray-700">
                Your data may be transferred to and processed in jurisdictions outside Angola, including
                South Africa, where our suppliers or partners may be located. Where such transfers
                occur, we ensure appropriate safeguards are in place to maintain the security and
                confidentiality of your data.
              </p>
              <p className="text-gray-700 mt-4">
                Such safeguards may include data processing agreements, standard contractual clauses,
                or compliance with recognized data protection frameworks.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">6. DATA SHARING AND DISCLOSURE</h2>
              <p className="text-gray-700 mb-4">
                We may share your data with the following third parties, only to the extent necessary:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <span className="font-medium">Suppliers and Service Providers:</span> Who assist in logistics, order fulfillment, IT
                  services, and customer support, under strict confidentiality obligations.
                </li>
                <li>
                  <span className="font-medium">Regulatory and Legal Authorities:</span> Where required by applicable law, legal
                  process, or court order.
                </li>
                <li>
                  <span className="font-medium">Successors:</span> In the event of a merger, acquisition, restructuring, or sale of assets,
                  your data may be transferred to the new entity as part of the business continuity
                  process.
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                We do not sell, rent, or disclose your personal information to unrelated third parties for
                their marketing purposes.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">7. DATA SECURITY</h2>
              <p className="text-gray-700 mb-4">
                We implement robust administrative, technical, and physical safeguards to protect your
                personal information from loss, misuse, unauthorized access, disclosure, alteration, or
                destruction. Measures include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encrypted storage systems</li>
                <li>Restricted access to personal data</li>
                <li>Secure user verification upon collection</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Despite our security efforts, no system is entirely impenetrable. We cannot guarantee
                absolute security of your data and recommend that you take appropriate steps to
                safeguard your credentials.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">8. DATA RETENTION</h2>
              <p className="text-gray-700">
                We retain personal information for as long as reasonably necessary to fulfill the purposes
                for which it was collected, including to comply with legal or regulatory obligations, resolve
                disputes, and enforce our agreements.
              </p>
              <p className="text-gray-700 mt-4">
                When retention is no longer required, data is securely deleted or anonymized in
                accordance with our data retention policy.
              </p>
              <p className="text-gray-700 mt-4">
                Retention periods may vary depending on the type of data, the nature of our relationship
                with you, and specific legal or contractual requirements.
              </p>
              <p className="text-gray-700 mt-4">
                We periodically review the data we hold to ensure it is accurate, up-to-date, and retained
                only for as long as necessary.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">9. YOUR DATA PROTECTION RIGHTS</h2>
              <p className="text-gray-700 mb-4">
                You may have the following rights under applicable data protection laws:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>The right to access the personal data we hold about you.</li>
                <li>The right to request correction of inaccurate or incomplete data.</li>
                <li>The right to request deletion of your personal data, subject to legal limitations.</li>
                <li>The right to restrict or object to certain forms of processing.</li>
                <li>The right to withdraw consent where processing is based on consent.</li>
                <li>The right to lodge a complaint with a data protection authority.</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise your rights, please contact us using the details provided in Section 18.
                Verification of identity may be required to protect your privacy and comply with legal
                obligations.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">10. COOKIES AND TRACKING TECHNOLOGIES</h2>
              <p className="text-gray-700">
                Our website may use cookies and similar technologies to enhance user experience and
                gather analytical data. These technologies help us understand user behavior and improve
                our platform. You may disable cookies through your browser settings, though this may
                impact certain functionalities.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">11. CHILDREN'S PRIVACY</h2>
              <p className="text-gray-700">
                Our services are not intended for children under the age of 13. We do not knowingly
                collect personal data from minors. If you believe a child has provided us with personal
                information, please contact us, and we will take appropriate steps to delete such data.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">12. DATA BREACH NOTIFICATION</h2>
              <p className="text-gray-700">
                In the event of a personal data breach, we will notify affected individuals and relevant
                authorities in accordance with applicable data protection laws, including the nature of the
                breach, potential impact, and steps taken to mitigate harm.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">13. DATA CONTROLLER AND DATA PROCESSORS</h2>
              <p className="text-gray-700">
                Mar-Haja LDA. is the Data Controller responsible for your personal information. We may
                engage Data Processors under binding agreements to process data on our behalf. These
                entities are contractually obligated to maintain strict data security and confidentiality
                standards.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">14. RECORD OF PROCESSING ACTIVITIES</h2>
              <p className="text-gray-700">
                We maintain a comprehensive internal record of all data processing activities, including
                the types of personal data collected, purposes, legal bases, retention periods, and thirdparty
                disclosures. These records support our commitment to transparency and
                accountability.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">15. LIMITATION OF LIABILITY</h2>
              <p className="text-gray-700">
                To the fullest extent permitted by applicable law, we disclaim any liability for damages
                arising from unauthorized access to or use of your personal information, unless such
                breach is directly attributable to our gross negligence or willful misconduct.
              </p>
              <p className="text-gray-700 mt-4">
                We shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including loss of profits, data, goodwill, or other intangible losses resulting from
                the use of or inability to use our services.
              </p>
              <p className="text-gray-700 mt-4">
                Our total liability, whether in contract, tort (including negligence), or otherwise, shall not
                exceed the amount paid by you, if any, for accessing or using our services during the
                twelve (12) months preceding the event giving rise to the claim.
              </p>
              <p className="text-gray-700 mt-4">
                This limitation of liability forms an essential basis of the agreement between you and KG
                Components, and applies even if any limited remedy fails of its essential purpose.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">16. CONSENT AND POLICY UPDATES</h2>
              <p className="text-gray-700">
                By accessing or using our services, you consent to the collection, processing, and storage
                of your data as described in this Privacy Policy. We reserve the right to amend this Policy
                at any time. Updates will be posted on our platform with a revised "Effective Date."
                Continued use after any changes constitutes your acceptance of the revised terms.
              </p>
              <p className="text-gray-700 mt-4">
                We encourage you to review this Policy periodically to stay informed about how we are
                protecting your information.
              </p>
              <p className="text-gray-700 mt-4">
                In the event of significant changes, we may provide additional notice through email or
                prominent placement on our platform.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">17. GOVERNING LAW AND JURISDICTION</h2>
              <p className="text-gray-700">
                This Privacy Policy shall be governed by the laws of South Africa. Any dispute arising
                from or related to this Policy shall be subject to the exclusive jurisdiction of the courts of
                Pretoria, South Africa.
              </p>
            </section>

            <Separator className="bg-gray-200" />

            <section>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">18. CONTACT INFORMATION</h2>
              <p className="text-gray-700">
                If you have any questions, requests, or concerns regarding this Privacy Policy or our data
                processing practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4 border border-gray-200">
                <p className="text-gray-700 font-medium">KG Components</p>
                <p className="text-gray-700">137 Cassava Residencial, Via Expressa, Luanda, Angola</p>
                <p className="text-gray-700">Email: support@kgcomponents.com</p>
                <p className="text-gray-700">Phone: +244923054613, +244921191202</p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} KG Components. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
