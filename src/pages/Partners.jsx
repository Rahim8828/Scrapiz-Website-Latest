import { Helmet } from "react-helmet";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import partnerOne from "../assets/partner_1.png";
import partnerTwo from "../assets/partner_2.png";

const WHATSAPP_NUMBER = "918828700630";
const PARTNER_BENEFITS = [
  "Daily pickup leads across Mumbai",
  "Simple onboarding and local support",
  "Transparent payouts and growth",
];

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi Scrapiz, I want to join as a partner."
)}`;

export default function Partners() {

  return (
    <>
      <Helmet>
        <title>Scrapiz Partners | Join Mumbai's Scrap Pickup Network</title>
        <meta
          name="description"
          content="Join Scrapiz's fast-growing scrap pickup and management network in Mumbai. Share your WhatsApp number and our team will reach out to you directly."
        />
        <link rel="canonical" href="https://www.scrapiz.in/scrapiz-partners" />
        <meta property="og:title" content="Scrapiz Partners | Join Mumbai's Scrap Pickup Network" />
        <meta
          property="og:description"
          content="Join Mumbai's fastest growing scrap pickup and management network with Scrapiz."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.scrapiz.in/scrapiz-partners" />
      </Helmet>

      <div className="bg-white text-stone-900">
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbf7_24%,_#e9f7ec_58%,_#ffffff_100%)] pt-24 md:pt-28">
          <div className="absolute inset-x-0 top-[35%] h-[340px] bg-[linear-gradient(90deg,_rgba(255,255,255,0)_0%,_rgba(34,197,94,0.18)_45%,_rgba(34,197,94,0.18)_55%,_rgba(255,255,255,0)_100%)]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-12 sm:px-8 lg:px-12">
            <div className="grid min-h-[520px] items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
              <div className="max-w-2xl">
                <h1 className="max-w-xl text-3xl font-bold leading-tight text-gray-900 md:text-5xl">
                  Earn More.
                  <br />
                  Serve More.
                  <br />
                  Build for Mumbai.
                </h1>

                <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600 md:text-2xl md:leading-10">
                  Join Mumbai&apos;s fastest growing scrap pickup and management network.
                </p>

                <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-green-200 bg-white px-5 py-3 text-base font-semibold text-gray-700 shadow-sm">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-600 ring-8 ring-green-100" />
                  1000+ vendors
                </div>

                <div className="mt-7 space-y-3">
                  {PARTNER_BENEFITS.map((benefit) => (
                    <p
                      key={benefit}
                      className="flex items-center gap-3 text-base font-medium text-gray-700 md:text-lg"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                      {benefit}
                    </p>
                  ))}
                </div>
              </div>

              <div className="relative mx-auto flex min-h-[380px] w-full max-w-2xl items-end justify-center overflow-hidden lg:min-h-[500px] lg:justify-end">
                <div className="relative flex items-end justify-center pt-6">
                  <img
                    src={partnerOne}
                    alt="Scrapiz partner standing confidently"
                    className="relative z-10 -mr-12 h-[360px] w-[235px] object-cover object-top sm:-mr-16 sm:h-[430px] sm:w-[280px] lg:-mr-20 lg:h-[500px] lg:w-[320px]"
                    loading="eager"
                  />
                  <img
                    src={partnerTwo}
                    alt="Scrapiz partner ready for pickup service"
                    className="h-[370px] w-[240px] object-cover object-top sm:h-[445px] sm:w-[290px] lg:h-[515px] lg:w-[335px]"
                    loading="eager"
                  />
                </div>
              </div>
            </div>

            <div className="relative -mt-2 rounded-2xl bg-[#884dff] px-5 py-7 text-white shadow-[0_18px_40px_rgba(72,48,160,0.18)] sm:px-8 lg:mx-10 lg:px-14">
              <div className="mx-auto max-w-5xl">
                <p className="text-center text-xl font-semibold leading-snug md:text-2xl">
                  Share your WhatsApp number and we&apos;ll reach out via our WhatsApp Business Account.
                </p>

                <div className="mx-auto mt-6 flex justify-center">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[66px] w-full items-center justify-center gap-3 rounded-lg bg-white px-12 text-lg font-bold text-blue-700 shadow-md transition duration-300 hover:-translate-y-0.5 hover:bg-green-50 hover:shadow-lg sm:w-auto sm:min-w-[320px] md:text-xl"
                  >
                    Join Us
                    <ArrowRight className="h-6 w-6" />
                  </a>
                </div>

                <p className="mt-5 text-center text-base font-medium text-white/90">
                  Join Scrapiz to change your life.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
