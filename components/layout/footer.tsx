import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)]">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <p className="text-sm text-[var(--color-foreground-muted)]">
          © {currentYear} Deen Dynamics
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/QOOlajide"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-foreground-muted)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-foreground)]"
            aria-label="GitHub"
          >
            <FaGithub className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/quamdeen-olajide/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-foreground-muted)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-foreground)]"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
