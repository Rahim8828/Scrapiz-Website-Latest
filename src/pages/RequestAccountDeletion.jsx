import { Helmet } from 'react-helmet';

export default function RequestAccountDeletion() {
  return (
    <>
      <Helmet>
        <title>Request Account Deletion - Scrapiz</title>
        <meta name="description" content="Request deletion of your Scrapiz account and personal data. Learn how to permanently delete your account through the app or by contacting us." />
        <link rel="canonical" href="https://www.scrapiz.in/request-account-deletion" />
      </Helmet>
      <div className="bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-gray-900">Account Deletion</h1>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              You can permanently delete your Scrapiz account and associated personal data. Choose the method that works best for you.
            </p>
          </div>

          <div className="space-y-6">
            {/* Mobile App Users - Preferred Method */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-300">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-2">RECOMMENDED</span>
                    Delete via Mobile App
                  </h3>
                  <p className="mt-2 text-gray-700">
                    If you're using the Scrapiz mobile app, you can delete your account directly from within the app:
                  </p>
                  <ol className="mt-3 list-decimal list-inside text-gray-700 space-y-2 ml-2">
                    <li>Open the Scrapiz mobile app</li>
                    <li>Go to <strong>Profile</strong> section</li>
                    <li>Tap on <strong>Delete Account</strong></li>
                    <li>Select your reason for leaving (optional feedback)</li>
                    <li>Tap <strong>Submit Feedback</strong> to confirm deletion</li>
                  </ol>
                  <div className="mt-3 p-3 bg-white rounded border border-green-200">
                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> This is the fastest and most convenient method for app users. Your deletion request will be processed immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative Method - Email/Phone */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">Alternative: Contact Support</h3>
                  <p className="mt-2 text-gray-700">
                    If you don't have access to the mobile app or prefer to contact us directly:
                  </p>
                  <ol className="mt-3 list-decimal list-inside text-gray-700 space-y-2 ml-2">
                    <li>Send an email to <a className="text-green-600 underline font-medium" href="mailto:support@scrapiz.in">support@scrapiz.in</a> with the subject line "Account Deletion Request"</li>
                    <li>Include your registered email address, phone number, and full name</li>
                    <li>We will send you a confirmation email for verification</li>
                    <li>Once verified, your account deletion will be processed</li>
                  </ol>
                  <p className="mt-3 text-gray-700">
                    Or call us at <a className="text-green-600 underline font-medium" href="tel:+918828700630">+91 8828700630</a> during business hours.
                  </p>
                </div>
              </div>
            </div>

            {/* What Gets Deleted */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">What Data Will Be Deleted</h3>
              <div className="mt-3 text-gray-600 space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Data That Will Be Deleted:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Personal profile information (name, email, phone number)</li>
                    <li>Account settings and preferences</li>
                    <li>Uploaded content and images tied to your account</li>
                    <li>Pickup history and transaction details</li>
                    <li>Any personal identifiers associated with your account</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Data That May Be Retained:</h4>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Aggregated or anonymized usage data for analytics</li>
                    <li>Transactional records required for legal or regulatory compliance</li>
                    <li>Data that cannot be removed for technical or legal reasons</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">Deletion Timeline</h3>
              <div className="mt-3 text-gray-600">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>In-App Deletion:</strong> Processing begins immediately, complete deletion within <span className="font-medium text-gray-800">7-30 days</span></li>
                  <li><strong>Email/Phone Request:</strong> We'll respond within <span className="font-medium text-gray-800">7 days</span>, complete deletion within <span className="font-medium text-gray-800">30 days</span></li>
                  <li>Timeline may vary based on backup cycles, third-party integrations, and legal requirements</li>
                  <li>You'll receive confirmation once the deletion process is complete</li>
                </ul>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">⚠️ Important Notice</h3>
              <p className="text-gray-700 mb-3">
                <strong className="text-red-600">This process is permanent and cannot be undone.</strong> Once your account 
                is deleted, you will lose access to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>All your account data</li>
                <li>Saved addresses and preferences</li>
                <li>Any pending pickups or active requests</li>
                <li>Account benefits and promotional offers</li>
              </ul>
              <p className="text-gray-700 mt-3">
                If you have any questions or concerns before proceeding, please contact our support team.
              </p>
            </div>

            {/* Contact Support */}
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Our support team is available to assist you with the account deletion process or answer any questions.
              </p>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Email:</strong> <a className="text-green-600 underline" href="mailto:support@scrapiz.in">support@scrapiz.in</a>
                </p>
                <p>
                  <strong>Phone:</strong> <a className="text-green-600 underline" href="tel:+918828700630">+91 8828700630</a>
                </p>
                <p className="text-sm text-gray-500 mt-3">
                  Business Hours: Monday - Saturday, 9:00 AM - 6:00 PM IST
                </p>
              </div>
              <a 
                href="mailto:support@scrapiz.in?subject=Account%20Deletion%20Request"
                className="mt-4 inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Send Deletion Request Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
