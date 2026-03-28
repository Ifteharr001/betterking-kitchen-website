import { useTranslations } from "next-intl";

export const revalidate = 86400; // Revalidate every day
export const dynamic = 'auto';

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <main className="py-20 md:py-32 bg-gray-50 min-h-screen mt-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Header Section */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 mb-10 pb-6 border-b border-gray-100">
            {t("lastUpdated")}: 13 March 2026
          </p>

          {/* Content Section */}
          <div className="space-y-8 text-gray-600 leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("section1Title")}</h2>
              <p>{t("section1Content")}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("section2Title")}</h2>
              <p>{t("section2Content")}</p>
              <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-600">
                <li>{t("point1")}</li>
                <li>{t("point2")}</li>
                <li>{t("point3")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("section3Title")}</h2>
              <p>{t("section3Content")}</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">{t("section4Title")}</h2>
              <p>{t("section4Content")}</p>
              
              <div className="mt-5 p-5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="mb-2"><strong className="text-gray-900">Email:</strong> liufenghua@betterkingkitchen.com</p>
                <p><strong className="text-gray-900">Phone:</strong> +8615821730169</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}