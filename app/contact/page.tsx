"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { FiSend, FiCheck, FiAlertCircle } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const,
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone) {
      const phoneRegex = /^[\d\s\-+()]{7,20}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
        setServerError(data.errors?.[0] || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setServerError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <motion.div
        initial="initial"
        animate="animate"
        className="flex flex-col gap-12"
      >
        {/* Header */}
        <motion.div variants={fadeUp} transition={transition} className="text-center">
          <h1 className="text-3xl font-medium tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-4 text-base text-[var(--color-foreground-muted)] sm:text-lg">
            Have a project in mind or want to collaborate? I'd love to hear from
            you.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Contact Form */}
          <motion.div
            variants={fadeUp}
            transition={{ ...transition, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <FiCheck className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-medium text-[var(--color-foreground)]">
                  Message Sent
                </h3>
                <p className="text-[var(--color-foreground-muted)]">
                  Thanks for reaching out. I'll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-sm text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Name field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-[var(--color-foreground)]"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={`rounded-md border bg-[var(--color-background-secondary)] px-4 py-3 text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                      errors.name
                        ? "border-red-500"
                        : "border-[var(--color-border)]"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[var(--color-foreground)]"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`rounded-md border bg-[var(--color-background-secondary)] px-4 py-3 text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                      errors.email
                        ? "border-red-500"
                        : "border-[var(--color-border)]"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone field (optional) */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-[var(--color-foreground)]"
                  >
                    Phone Number{" "}
                    <span className="text-[var(--color-foreground-subtle)]">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`rounded-md border bg-[var(--color-background-secondary)] px-4 py-3 text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                      errors.phone
                        ? "border-red-500"
                        : "border-[var(--color-border)]"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Message field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-[var(--color-foreground)]"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or inquiry..."
                    rows={5}
                    className={`resize-none rounded-md border bg-[var(--color-background-secondary)] px-4 py-3 text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] ${
                      errors.message
                        ? "border-red-500"
                        : "border-[var(--color-border)]"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Server error */}
                {serverError && (
                  <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                    <FiAlertCircle className="h-4 w-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white transition-colors duration-[var(--duration-hover)] hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            variants={fadeUp}
            transition={{ ...transition, delay: 0.2 }}
            className="flex flex-col gap-8 lg:col-span-2"
          >
            <div className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] p-6">
              <h3 className="text-lg font-medium text-[var(--color-foreground)]">
                Let's Work Together
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-foreground-muted)]">
                Whether you have a project idea, want to collaborate, or just
                want to say hello — I'm always open to discussing new
                opportunities.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] p-6">
              <h3 className="text-lg font-medium text-[var(--color-foreground)]">
                Connect
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://github.com/QOOlajide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm text-[var(--color-foreground-muted)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-foreground)]"
                >
                  <FaGithub className="h-5 w-5" />
                  <span>github.com/QOOlajide</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/quamdeen-olajide/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm text-[var(--color-foreground-muted)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-foreground)]"
                >
                  <FaLinkedin className="h-5 w-5" />
                  <span>linkedin.com/in/quamdeen-olajide</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
