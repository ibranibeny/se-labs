import type { Metadata } from 'next';
import { SubmitForm } from '@/components/SubmitForm';

export const metadata: Metadata = {
  title: 'Submit an asset — Major Growth SE',
  description:
    'Propose a new asset for the catalog by preparing a GitHub issue for maintainer review.',
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-azure">Onboard an asset</p>
      <h1 className="mt-2 text-3xl font-black leading-tight text-slate-900">Submit an asset</h1>
      <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
        Fill in the details below to propose a new demo, workshop, reference architecture,
        or case study. The portal prepares a{' '}
        <span className="font-semibold text-slate-800">GitHub issue</span> for you to review
        and submit with your GitHub account. A maintainer will review it before publishing.
      </p>
      <SubmitForm />
    </div>
  );
}
