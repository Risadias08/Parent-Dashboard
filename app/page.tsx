import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
          L
        </div>
        <h1 className="mt-5 text-3xl font-bold text-slate-900">Learniee</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          Discover courses, compare learning options, and find the right fit for your child.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/login" className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white hover:bg-indigo-700">
            Log in
          </Link>
          <Link href="/signup" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
