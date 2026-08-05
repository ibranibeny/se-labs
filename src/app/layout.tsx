import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';

const GITHUB_URL = 'https://github.com/ibranibeny/se-labs';
const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%230078d4'/%3E%3Ctext x='50' y='68' font-size='58' text-anchor='middle' fill='white' font-family='Segoe UI,Arial'%3ES%3C/text%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: 'Major Growth SE — Asset Portal',
  description:
    'Major Growth SE Asset Portal — a single access point to demos, hands-on workshops, and reference architectures, filterable by GTM conversation and solution area.',
  icons: { icon: FAVICON },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500 sm:px-6">
              <p className="font-semibold text-slate-700">Major Growth SE — Asset Portal</p>
              <p className="mt-1 max-w-2xl">
                A single access point to demos, hands-on workshops, and reference
                architectures — mapped to the FY27 GTM framework so AEs and DES can find
                the right accelerator to move a deal forward.
              </p>
              <p className="mt-3 text-xs">
                Technical content grounded in Microsoft Learn ·{' '}
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-semibold text-azure hover:underline"
                >
                  Source on GitHub
                </a>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
