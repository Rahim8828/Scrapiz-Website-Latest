import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const TermsAndConditions = () => {
    return (
        <>
            <Helmet>
                <title>Terms & Conditions - Scrapiz</title>
                <meta name="description" content="Read the Terms and Conditions for using the Scrapiz website and mobile application services." />
                <link rel="canonical" href="https://www.scrapiz.in/terms-and-conditions" />
            </Helmet>
            <div className="bg-white">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="pt-24 pb-16 text-center hero-pattern"
                >
                    <div className="container mx-auto px-4">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-5xl lg:text-6xl font-bold text-gray-800 mb-4"
                        >
                            Terms & <span className="text-gradient">Conditions</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg text-gray-600"
                        >
                            Last updated: November 05, 2025
                        </motion.p>
                    </div>
                </motion.div>

                <div className="py-20">
                    <div className="container mx-auto px-4 max-w-4xl prose lg:prose-lg">
                        <p>Welcome to Scrapiz! These Terms and Conditions ("Terms") govern your use of the Scrapiz website and mobile application (collectively, the "Service") operated by Scrapiz GreenTech Pvt. Ltd. ("Scrapiz", "we", "us", or "our"). By accessing or using our Service, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must not use our Service.</p>

                        <h2>1. Acceptance of Terms</h2>
                        <p>By registering for an account, downloading our mobile app, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our <a href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</a>. These Terms apply to all users of the Service, including browsers, customers, and contributors of content.</p>

                        <h2>2. Eligibility and Account Registration</h2>
                        <p>To use our Service, you must:</p>
                        <ul>
                            <li>Be at least 18 years of age</li>
                            <li>Have the legal capacity to enter into binding contracts</li>
                            <li>Provide accurate, current, and complete information during registration</li>
                            <li>Maintain and promptly update your account information</li>
                            <li>Keep your account credentials secure and confidential</li>
                            <li>Accept responsibility for all activities under your account</li>
                        </ul>
                        <p>We reserve the right to suspend or terminate accounts that provide false information or violate these Terms.</p>

                        <h2>3. Service Description</h2>
                        <p>Scrapiz provides an online platform and mobile application for:</p>
                        <ul>
                            <li>Scheduling scrap material pickup from residential and commercial locations</li>
                            <li>Viewing current market rates for various scrap materials</li>
                            <li>Receiving payment for sold scrap materials</li>
                            <li>Tracking pickup status and transaction history</li>
                            <li>Accessing recycling and sustainability information</li>
                        </ul>
                        <p>We operate primarily in Mumbai and surrounding areas. Service availability may vary by location.</p>

                        <h2>4. Mobile Application Terms</h2>
                        <p>When you download and use our mobile application:</p>
                        <ul>
                            <li>You grant us permission to access device features as described in our <a href="/privacy-policy" className="text-green-600 hover:underline">Privacy Policy</a></li>
                            <li>You are responsible for data charges from your mobile carrier</li>
                            <li>We may release updates, and you agree to install critical security updates</li>
                            <li>We are not responsible for third-party app stores' terms or policies</li>
                            <li>You must not reverse engineer, decompile, or attempt to extract source code</li>
                            <li>The app is licensed to you, not sold, for personal non-commercial use</li>
                        </ul>

                        <h2>5. Pickup Scheduling and Service Terms</h2>
                        <h3>Scheduling:</h3>
                        <ul>
                            <li>Pickup requests must be scheduled at least 24 hours in advance</li>
                            <li>We will attempt to arrive within the scheduled time window</li>
                            <li>Delays may occur due to traffic, weather, or operational constraints</li>
                            <li>You must provide accurate location and contact information</li>
                        </ul>
                        <h3>Material Requirements:</h3>
                        <ul>
                            <li>Scrap materials must be segregated and ready for collection</li>
                            <li>We reserve the right to refuse hazardous or non-recyclable materials</li>
                            <li>Minimum quantity requirements may apply for certain pickup areas</li>
                            <li>You must have legal ownership of all materials offered for sale</li>
                        </ul>

                        <h2>6. Pricing and Payment Terms</h2>
                        <h3>Pricing:</h3>
                        <ul>
                            <li>Rates displayed on the app/website are indicative and subject to change</li>
                            <li>Final pricing is determined by actual weight, quality, and current market rates</li>
                            <li>We reserve the right to revise rates without prior notice</li>
                            <li>Special pricing or promotions may have specific terms and conditions</li>
                        </ul>
                        <h3>Payment:</h3>
                        <ul>
                            <li>Payment is made after verification of weight and quality at time of pickup</li>
                            <li>Payment methods include cash, bank transfer, UPI, or digital wallets</li>
                            <li>Payment processing may take 1-3 business days for digital transfers</li>
                            <li>We provide digital receipts for all transactions</li>
                            <li>Tax deductions, if applicable, will be clearly indicated</li>
                        </ul>

                        <h2>7. Cancellation and Refund Policy</h2>
                        <h3>Customer Cancellations:</h3>
                        <ul>
                            <li>You may cancel a scheduled pickup up to 2 hours before the pickup window</li>
                            <li>Cancellations made less than 2 hours before pickup may incur a nominal fee</li>
                            <li>Repeated last-minute cancellations may result in account suspension</li>
                            <li>No-shows without cancellation may result in temporary service restriction</li>
                        </ul>
                        <h3>Scrapiz Cancellations:</h3>
                        <ul>
                            <li>We may cancel pickups due to force majeure, safety concerns, or operational issues</li>
                            <li>You will be notified promptly and offered alternative pickup times</li>
                            <li>No penalties apply for cancellations initiated by Scrapiz</li>
                        </ul>

                        <h2>8. Weight Verification and Disputes</h2>
                        <ul>
                            <li>All materials are weighed using calibrated digital scales at time of pickup</li>
                            <li>You have the right to observe the weighing process</li>
                            <li>Weight disputes must be raised immediately at time of pickup</li>
                            <li>Photo/video evidence may be requested for quality verification</li>
                            <li>Post-pickup disputes will be reviewed on a case-by-case basis</li>
                            <li>Final decisions on weight/quality disputes rest with Scrapiz management</li>
                        </ul>

                        <h2>9. Intellectual Property Rights</h2>
                        <p>All content on the Scrapiz website and mobile application, including but not limited to text, graphics, logos, images, software, and trademarks, is the property of Scrapiz GreenTech Pvt. Ltd. or its licensors and is protected by Indian and international copyright laws.</p>
                        <p>You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes only. You may not:</p>
                        <ul>
                            <li>Reproduce, distribute, or publicly display any content without written permission</li>
                            <li>Modify, reverse engineer, or create derivative works</li>
                            <li>Use our trademarks or branding without authorization</li>
                            <li>Remove or alter any copyright notices or proprietary markings</li>
                        </ul>

                        <h2>10. User Content and Conduct</h2>
                        <p>When you upload photos, provide feedback, or submit any content through our Service:</p>
                        <ul>
                            <li>You retain ownership but grant us a worldwide, royalty-free license to use, display, and reproduce the content for service operations and marketing</li>
                            <li>You represent that you have all necessary rights to the content</li>
                            <li>You will not upload offensive, illegal, or infringing content</li>
                            <li>We reserve the right to remove any content that violates these Terms</li>
                        </ul>
                        <p><strong>Prohibited Activities:</strong></p>
                        <ul>
                            <li>Engaging in fraudulent transactions or misrepresenting materials</li>
                            <li>Harassing, threatening, or abusing our staff or other users</li>
                            <li>Attempting to hack, compromise, or interfere with the Service</li>
                            <li>Using the Service for any illegal or unauthorized purpose</li>
                            <li>Collecting user data or scraping content without permission</li>
                        </ul>

                        <h2>11. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law:</p>
                        <ul>
                            <li>Scrapiz provides the Service "as is" without warranties of any kind</li>
                            <li>We are not liable for indirect, incidental, consequential, or punitive damages</li>
                            <li>Our total liability shall not exceed the amount paid by you for services in the past 3 months</li>
                            <li>We are not responsible for delays, service interruptions, or third-party actions</li>
                            <li>We do not guarantee specific outcomes, rates, or pickup times</li>
                        </ul>
                        <p><strong>Property Damage:</strong> While we take utmost care during pickups, we are not liable for pre-existing property damage or normal wear and tear. Any damage caused by our negligence will be assessed on a case-by-case basis.</p>

                        <h2>12. Indemnification</h2>
                        <p>You agree to indemnify, defend, and hold harmless Scrapiz GreenTech Pvt. Ltd., its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
                        <ul>
                            <li>Your violation of these Terms</li>
                            <li>Your use of the Service</li>
                            <li>Your violation of any rights of another party</li>
                            <li>Your provision of inaccurate or misleading information</li>
                        </ul>

                        <h2>13. Force Majeure</h2>
                        <p>We shall not be held liable for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to:</p>
                        <ul>
                            <li>Natural disasters, floods, earthquakes, or severe weather</li>
                            <li>War, terrorism, riots, or civil unrest</li>
                            <li>Government actions, regulations, or lockdowns</li>
                            <li>Strikes, labor disputes, or transportation failures</li>
                            <li>Internet or telecommunications failures</li>
                            <li>Pandemics or public health emergencies</li>
                        </ul>

                        <h2>14. Modification of Services and Terms</h2>
                        <p>We reserve the right to:</p>
                        <ul>
                            <li>Modify, suspend, or discontinue any part of the Service at any time</li>
                            <li>Change pricing, service areas, or operational hours</li>
                            <li>Update these Terms by posting a new version with an updated date</li>
                            <li>Notify you of material changes via email or in-app notifications</li>
                        </ul>
                        <p>Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

                        <h2>15. Account Termination</h2>
                        <p>We may suspend or terminate your account if you:</p>
                        <ul>
                            <li>Violate these Terms or our policies</li>
                            <li>Engage in fraudulent or illegal activities</li>
                            <li>Provide false or misleading information</li>
                            <li>Abuse our staff or misuse the Service</li>
                        </ul>
                        <p>You may request account deletion at any time through our <a href="/request-account-deletion" className="text-green-600 hover:underline">Account Deletion page</a>. Upon termination, your right to use the Service ceases immediately.</p>

                        <h2>16. Dispute Resolution and Grievances</h2>
                        <p><strong>Grievance Officer:</strong> For any complaints or concerns, please contact our Grievance Officer:</p>
                        <ul>
                            <li>Email: support@scrapiz.in</li>
                            <li>Phone: +91 8828700630</li>
                            <li>Address: Shop No 08, A K Compound, Jogeshwari West, Mumbai, 400102</li>
                        </ul>
                        <p>We aim to resolve all complaints within 7-15 business days.</p>
                        <p><strong>Arbitration:</strong> Any disputes that cannot be resolved through our grievance process shall be settled through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in Mumbai, Maharashtra, and proceedings shall be in English.</p>

                        <h2>17. Governing Law and Jurisdiction</h2>
                        <p>These Terms are governed by and construed in accordance with the laws of India. Any legal action or proceeding arising out of these Terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.</p>

                        <h2>18. Severability</h2>
                        <p>If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.</p>

                        <h2>19. Entire Agreement</h2>
                        <p>These Terms, together with our Privacy Policy and any other legal notices published on the Service, constitute the entire agreement between you and Scrapiz regarding the use of the Service and supersede all prior agreements and understandings.</p>

                        <h2>20. Contact Information</h2>
                        <p>If you have any questions, concerns, or feedback about these Terms and Conditions, please contact us:</p>
                        <ul>
                            <li><strong>Email:</strong> support@scrapiz.in</li>
                            <li><strong>Phone:</strong> +91 8828700630</li>
                            <li><strong>Website:</strong> <a href="/contact" className="text-green-600 hover:underline">scrapiz.in/contact</a></li>
                            <li><strong>Address:</strong> Scrapiz GreenTech Pvt. Ltd., Shop No 08, A K Compound, Jogeshwari West, Mumbai, 400102</li>
                        </ul>

                        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">App Store Compliance</h3>
                            <p className="text-sm text-gray-700">These Terms and Conditions comply with Google Play Store and Apple App Store requirements. We are committed to providing transparent, fair, and legally compliant services to all our users. For privacy-related queries, please refer to our <a href="/privacy-policy" className="text-green-600 hover:underline font-medium">Privacy Policy</a>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsAndConditions;
