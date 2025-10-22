import { createNavigation } from "next-intl/navigation"

export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "pt",
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
