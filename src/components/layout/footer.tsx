import { useTranslations } from "next-intl";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";

const policyLinks = [
  { key: "about", href: "#" },
  { key: "regulations", href: "#" },
  { key: "terms", href: "#" },
  { key: "privacyPersonal", href: "#" },
  { key: "security", href: "#" },
  { key: "transaction", href: "#" },
  { key: "dispute", href: "#" },
] as const;

const socialLinks = [
  { name: "Facebook", abbr: "f", href: "https://www.facebook.com/5sportvn" },
  { name: "Instagram", abbr: "in", href: "https://www.instagram.com/5sportvn" },
  { name: "TikTok", abbr: "tt", href: "https://www.tiktok.com/@5sportvn" },
  { name: "YouTube", abbr: "yt", href: "https://www.youtube.com/@5sportvn" },
];

const ecosystem = [
  { name: "5Solution", href: "https://5solution.vn" },
  { name: "5Sport", href: "/" },
  { name: "5Pix", href: "https://5pix.org" },
  { name: "5ticket", href: "https://5ticket.vn" },
];

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-secondary text-slate-300">
      <div className="mx-auto max-w-container px-6 py-14 lg:px-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Image src="/logo.png" alt="5Sport" width={64} height={64} className="rounded-lg" />
            <p className="mt-3 text-sm font-semibold text-white">
              CÔNG TY CỔ PHẦN CÔNG NGHỆ 5SOLUTION
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
              {t("aboutDesc")}
            </p>

            {/* Ecosystem */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t("ecosystem")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ecosystem.map((app) => (
                  <a
                    key={app.name}
                    href={app.href}
                    className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors duration-200 hover:bg-white/20"
                  >
                    {app.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Policy Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("policies")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              {policyLinks.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/feedback"
                  className="text-slate-400 transition-colors duration-200 hover:text-white"
                >
                  {t("feedback")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("contact")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <a href="tel:+84336963998" className="transition-colors duration-200 hover:text-white">
                  +84 336 963 998
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <a href="mailto:5sport@5sport.vn" className="transition-colors duration-200 hover:text-white">
                  5sport@5sport.vn
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>
                  Văn phòng 501, tầng 5, tòa nhà Dreamland Bonanza, số 23 Duy Tân, P. Cầu Giấy, Tp. Hà Nội
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>Thứ 2 – Thứ 6: 09:00 – 17:00</span>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t("followUs")}
              </p>
              <div className="mt-3 flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white transition-colors duration-200 hover:bg-primary"
                  >
                    {social.abbr}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
