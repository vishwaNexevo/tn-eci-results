import type { Metadata } from "next";
import { fetchResultsServer } from "@/lib/fetchResults";
import { partyMeta } from "@/lib/parties";
import { Dashboard } from "@/components/Dashboard";

// Force dynamic SSR — the page is rendered fresh for every request so
// crawlers see live numbers in the HTML.
export const runtime = "nodejs";
export const preferredRegion = "bom1";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://tn-results-2026.example.com";

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchResultsServer();
  const leader = data?.leadingParty;
  const leaderMeta = leader ? partyMeta(leader.party, leader.color) : null;

  const title = leader
    ? `TN Election Results 2026 — ${leaderMeta?.short} leading ${leader.count}/${data?.totalSeats} seats`
    : "Tamil Nadu Assembly Election Results 2026 — Live";

  const description = data
    ? `Live Tamil Nadu Assembly Election Results 2026. ${leaderMeta?.short ?? "Leading party"} ahead in ${leader?.count ?? 0} of ${data.totalSeats} seats. Constituency-wise candidate trends, party-wise tally, filters, and real-time updates from the Election Commission of India.`
    : "Live Tamil Nadu Assembly Election Results 2026 with constituency-wise leads, party-wise tally, and real-time updates from the Election Commission of India.";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      "Tamil Nadu Election Results 2026",
      "TN Assembly Election 2026",
      "DMK", "AIADMK", "BJP", "TVK", "INC", "PMK", "VCK", "NTK",
      "Constituency wise results",
      "Live election results",
      "ECI results",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: SITE_URL,
      title,
      description,
      siteName: "TN Election Results 2026",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" } },
    other: {
      "geo.region": "IN-TN",
      "geo.placename": "Tamil Nadu",
    },
  };
}

export default async function Page() {
  const initialData = await fetchResultsServer();

  // ---- JSON-LD structured data ----
  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Tamil Nadu Legislative Assembly Election 2026",
    startDate: "2026-05-01",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Tamil Nadu",
      address: { "@type": "PostalAddress", addressRegion: "Tamil Nadu", addressCountry: "IN" },
    },
    organizer: {
      "@type": "Organization",
      name: "Election Commission of India",
      url: "https://eci.gov.in",
    },
    description:
      "Live results of the 2026 Tamil Nadu Legislative Assembly Election across 234 constituencies.",
    url: SITE_URL,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tamil Nadu Election Results 2026", item: SITE_URL },
    ],
  };

  const datasetLd = initialData && {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Tamil Nadu Assembly Election Results 2026 — Live",
    description:
      "Constituency-wise leading candidate and party for the Tamil Nadu Assembly Election 2026, refreshed in real time from the Election Commission of India.",
    creator: { "@type": "Organization", name: "Election Commission of India", url: "https://eci.gov.in" },
    license: "https://eci.gov.in",
    dateModified: new Date(initialData.fetchedAt).toISOString(),
    url: SITE_URL,
    variableMeasured: ["Leading party", "Leading candidate", "Constituency number"],
    keywords: ["Tamil Nadu", "Election", "2026", "Assembly", "Live results"],
  };

  const itemListLd = initialData && {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Party-wise Tally — Tamil Nadu 2026",
    numberOfItems: initialData.parties.length,
    itemListElement: initialData.parties.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${partyMeta(p.party, p.color).short} — ${p.count} seats`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {datasetLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetLd) }}
        />
      )}
      {itemListLd && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
        />
      )}

      {/* SEO: server-rendered H1 + summary so crawlers see content even before hydration */}
      <h1 className="sr-only">
        Tamil Nadu Assembly Election Results 2026 — Live constituency-wise updates
      </h1>
      {initialData && (
        <p className="sr-only">
          Live tally: {initialData.parties
            .map((p) => `${partyMeta(p.party, p.color).short} ${p.count}`)
            .join(", ")} across {initialData.totalSeats} constituencies.
          Majority mark {initialData.majority}.
        </p>
      )}

      <Dashboard initialData={initialData} />
    </>
  );
}
