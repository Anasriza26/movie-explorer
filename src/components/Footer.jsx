export default function Footer() {
  return (
    <footer className="mt-10 border-t border-slate-200 px-4 py-6 dark:border-ink-700">
      {" "}
      <div className="flex items-center justify-end">
        {" "}
        <a
          href="https://anas-riza-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-slate-500 underline underline-offset-2 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          {" "}
          Anas Riza{" "}
        </a>{" "}
      </div>{" "}
    </footer>
  );
}
