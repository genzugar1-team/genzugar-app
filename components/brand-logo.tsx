"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  showText?: boolean
  size?: number
}

export function BrandLogo({ className, showText = true, size = 36 }: Props) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2", className)} aria-label="Gen-Zugar Home">
      <Image
        src="/images/gen-zugar-logo.png"
        alt="Gen-Zugar Logo"
        width={size}
        height={size}
        priority
        className="h-auto w-auto"
      />
      {showText ? (
        <span className="text-base font-semibold tracking-tight text-foreground md:text-lg">Gen-Zugar</span>
      ) : null}
    </Link>
  )
}
