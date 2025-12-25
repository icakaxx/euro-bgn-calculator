import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Калкулатор Лева Евро | Лев Евро | BGN EUR | Официален Курс",
  description: "Калкулатор лева евро с официален курс лев евро 1.95583. Лева в евро, левове в евро, БГН евро, курс лев евро. Калкулатор за пазаруване в евро, ресто в евро, плащане в евро. Двойно обозначаване на цени, цени в евро, смятане лев евро.",
  keywords: [
    "лева евро",
    "лев евро",
    "левове в евро",
    "лева в евро",
    "бгн евро",
    "bgn eur",
    "лева евро калкулатор",
    "лев евро калкулатор",
    "калкулатор лева евро",
    "калкулатор лев евро",
    "калкулатор левове в евро",
    "bgn eur calculator",
    "курс лев евро",
    "официален курс лев евро",
    "преизчисляване лев евро",
    "превалутиране лев евро",
    "цени в евро",
    "цени левове евро",
    "двойно обозначаване на цени",
    "пазаруване в евро",
    "калкулатор за пазаруване в евро",
    "ресто в евро",
    "калкулатор ресто евро",
    "плащане в евро калкулатор",
    "колко евро са 5 лева",
    "колко евро са 10 лева",
    "колко евро са 20 лева",
    "колко евро са 50 лева",
    "колко евро са 100 лева",
    "левове към евро",
    "евро от левове",
    "смятане лев евро",
    "сметка в евро",
    "магазин цени в евро",
    "цена в евро калкулатор",
    "евро калкулатор българия",
    "калкулатор евро българия",
    "официален калкулатор лев евро",
    "еврокалкулатор",
    "евро в лева",
    "бгевро"
  ],
  authors: [{ name: "EuroBG Elka" }],
  creator: "EuroBG Elka",
  publisher: "EuroBG Elka",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "bg_BG",
    alternateLocale: ["en_US"],
    url: "https://eurobg-elka.vercel.app",
    title: "Калкулатор Лева Евро | Официален Курс Лев Евро | BGN EUR",
    description: "Калкулатор лева евро с официален курс 1.95583. Лева в евро, лев евро, левове в евро, БГН евро. Калкулатор за пазаруване в евро, ресто в евро, цени в евро.",
    siteName: "EuroBG Elka",
  },
  twitter: {
    card: "summary_large_image",
    title: "Калкулатор Лева Евро | Лев Евро | Курс BGN EUR",
    description: "Калкулатор лева евро - официален курс лев евро. Пазаруване в евро, ресто в евро, цени в евро.",
  },
  alternates: {
    canonical: "https://eurobg-elka.vercel.app",
  },
  category: "finance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}

