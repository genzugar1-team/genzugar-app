"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, BookMarked } from "lucide-react"
import type { Glossary } from "@/lib/types"

interface GlossarySearchProps {
  terms: Glossary[]
}

export function GlossarySearch({ terms }: GlossarySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return terms

    const query = searchQuery.toLowerCase()
    return terms.filter(
      (term) => term.term.toLowerCase().includes(query) || term.definition.toLowerCase().includes(query),
    )
  }, [terms, searchQuery])

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups = new Map<string, Glossary[]>()

    filteredTerms.forEach((term) => {
      const firstLetter = term.term[0].toUpperCase()
      if (!groups.has(firstLetter)) {
        groups.set(firstLetter, [])
      }
      groups.get(firstLetter)?.push(term)
    })

    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [filteredTerms])

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Cari istilah atau definisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 pl-12 text-base"
            />
          </div>
        </CardContent>
      </Card>

      {groupedTerms.length > 0 ? (
        <div className="space-y-8">
          {groupedTerms.map(([letter, letterTerms]) => (
            <div key={letter}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-2xl font-bold text-white">
                {letter}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {letterTerms.map((term) => (
                  <Card key={term.id} className="border-2 transition-shadow hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between gap-4">
                        <span className="text-xl">{term.term}</span>
                        {term.category && (
                          <Badge variant="secondary" className="text-sm">
                            {term.category}
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{term.definition}</p>
                      {term.example && (
                        <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Contoh:</p>
                          <p className="mt-1 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            {term.example}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-2">
          <CardContent className="py-16 text-center">
            <BookMarked className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {searchQuery ? "Tidak ada istilah yang ditemukan" : "Belum ada istilah dalam glosarium"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
