import { BookOpen } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"

interface ResearchCardProps {
  title: string
  authors: string
  year: string
  description: string
  source: string
  delay?: number
}

export function ResearchCard({ title, authors, year, description, source, delay = 0 }: ResearchCardProps) {
  return (
    <AnimatedSection
      delay={delay}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <BookOpen className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-red-600 mb-1">{title}</h3>
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-3">
            <span>{authors}</span>
            <span className="mx-2">•</span>
            <span>{year}</span>
            <span className="mx-2">•</span>
            <span>Source: {source}</span>
          </div>
          <p className="text-gray-700">{description}</p>
        </div>
      </div>
    </AnimatedSection>
  )
}
