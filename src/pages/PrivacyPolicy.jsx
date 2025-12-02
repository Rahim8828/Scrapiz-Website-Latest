import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - Scrapiz</title>
                <meta name="description" content="Read the Privacy Policy for Scrapiz. Understand how we collect, use, and protect your personal information." />
                <link rel="canonical" href="https://www.scrapiz.in/privacy-policy" />
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
                            Privacy <span className="text-gradient">Policy</span>
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
                        <p>Scrapiz GreenTech Pvt. Ltd. ("us", "we", or "our") operates the Scrapiz website and mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

                        <h2>1. Information Collection and Use</h2>
                        <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                        <h3>Types of Data Collected</h3>
                        <ul>
                            <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City.</li>
                            <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
                            <li><strong>Location Data:</strong> With your permission, we may collect and process information about your actual location to provide location-based services such as finding nearby scrap collection centers and calculating pickup routes. You can enable or disable location services through your device settings at any time.</li>
                            <li><strong>Device Information:</strong> We may collect device-specific information (such as hardware model, operating system version, unique device identifiers, and mobile network information) to improve app performance and user experience.</li>
                        </ul>

                        <h2>2. Mobile App Permissions</h2>
                        <p>Our mobile application may request the following permissions:</p>
                        <ul>
                            <li><strong>Camera:</strong> To allow you to take photos of scrap items for accurate weight estimation and pickup scheduling.</li>
                            <li><strong>Photo Library/Storage:</strong> To upload images of scrap materials from your device.</li>
                            <li><strong>Location Services:</strong> To find nearby collection centers, calculate pickup routes, and provide location-based pricing.</li>
                            <li><strong>Phone:</strong> To enable direct calling to our support team or schedule callbacks.</li>
                            <li><strong>Push Notifications:</strong> To send you updates about your pickup requests, price changes, promotional offers, and service updates. You can disable notifications in your device settings.</li>
                            <li><strong>Internet/Network Access:</strong> Required for core app functionality including booking pickups, viewing rates, and accessing your account.</li>
                        </ul>
                        <p>You can manage these permissions at any time through your device settings. Denying certain permissions may limit some features of the app.</p>

                        <h2>3. Use of Data</h2>
                        <p>Scrapiz uses the collected data for various purposes:</p>
                        <ul>
                            <li>To provide and maintain our Service</li>
                            <li>To notify you about changes to our Service</li>
                            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information so that we can improve our Service</li>
                            <li>To monitor the usage of our Service</li>
                            <li>To detect, prevent and address technical issues</li>
                            <li>To process pickup requests and schedule collections</li>
                            <li>To calculate accurate pricing based on location and scrap type</li>
                            <li>To send you notifications about pickups, payments, and service updates</li>
                            <li>To improve our route optimization and delivery efficiency</li>
                        </ul>

                        <h2>4. Data Retention and Deletion</h2>
                        <p>We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.</p>
                        <p><strong>Your Right to Data Deletion:</strong> You have the right to request deletion of your personal data at any time. To request account and data deletion:</p>
                        <ul>
                            <li>Visit our <a href="/request-account-deletion" className="text-green-600 hover:underline">Account Deletion Request</a> page</li>
                            <li>Or email us at: support@scrapiz.in with "Account Deletion Request" in the subject line</li>
                            <li>We will process your request within 7 days and complete deletion within 30 days</li>
                            <li>Some data may be retained for legal or regulatory compliance purposes</li>
                        </ul>

                        <h2>5. Security of Data</h2>
                        <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
                        <p>We implement appropriate technical and organizational security measures including:</p>
                        <ul>
                            <li>Encrypted data transmission (SSL/TLS)</li>
                            <li>Secure storage of sensitive information</li>
                            <li>Regular security audits and updates</li>
                            <li>Access controls and authentication mechanisms</li>
                            <li>Employee training on data protection</li>
                        </ul>
                        
                        <h2>6. Third-Party Services and Analytics</h2>
                        <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.</p>
                        <p>Our app may use the following third-party services:</p>
                        <ul>
                            <li><strong>Google Analytics:</strong> For understanding app usage and improving user experience</li>
                            <li><strong>Firebase:</strong> For push notifications, analytics, and crash reporting</li>
                            <li><strong>Google Maps API:</strong> For location services and route optimization</li>
                            <li><strong>Payment Gateways:</strong> For secure payment processing (Razorpay, Paytm, etc.)</li>
                        </ul>
                        <p>These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>

                        <h2>7. Data Sharing and Disclosure</h2>
                        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> With trusted partners who assist in operating our app and conducting our business</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                            <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
                            <li><strong>With Your Consent:</strong> With your explicit permission for specific purposes</li>
                        </ul>

                        <h2>8. Your Privacy Rights</h2>
                        <p>You have the following rights regarding your personal data:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                            <li><strong>Data Portability:</strong> Request transfer of your data to another service</li>
                            <li><strong>Withdraw Consent:</strong> Revoke permissions granted for data processing</li>
                        </ul>
                        <p>To exercise these rights, contact us at support@scrapiz.in or use our <a href="/request-account-deletion" className="text-green-600 hover:underline">Account Deletion Request</a> page.</p>

                        <h2>9. Links to Other Sites</h2>
                        <p>Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>

                        <h2>10. Children's Privacy</h2>
                        <p>Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>

                        <h2>11. Cookies and Tracking Technologies</h2>
                        <p>We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>

                        <h2>12. International Data Transfers</h2>
                        <p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy.</p>

                        <h2>13. Changes to This Privacy Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. For material changes, we may also notify you via email or through a prominent notice in our app. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

                        <h2>14. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us:</p>
                        <ul>
                            <li>By email: support@scrapiz.in</li>
                            <li>By phone: +91 8828700630</li>
                            <li>By visiting this page on our website: <a href="/contact" className="text-green-600 hover:underline">scrapiz.in/contact</a></li>
                            <li>By mail: Shop No 08, A K Compound, Jogeshwari West, Mumbai, 400102</li>
                        </ul>

                        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Google Play & App Store Compliance</h3>
                            <p className="text-sm text-gray-700">This Privacy Policy complies with Google Play Store and Apple App Store data safety requirements. We are committed to transparency in how we collect, use, and protect your data. For account deletion requests, please visit our <a href="/request-account-deletion" className="text-green-600 hover:underline font-medium">Account Deletion page</a>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
