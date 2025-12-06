"use client"

 import Link from "next/link"
import { ArrowRight, Zap, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
 

export function HeroSection() {
   

   

  return (
    <section className="relative py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-primary font-medium">Shorten links in milliseconds</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary md:text-5xl lg:text-6xl">
            Make Every Link <span className="text-accent">Tiny</span> & <span className="text-accent">Trackable</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Transform long, ugly URLs into clean, memorable links. Track clicks, analyze performance, and grow your
            brand—all in one place.
          </p>

          {/* URL Input Form */}
          <div className="mx-auto mb-8 flex max-w-xl flex-col gap-3 sm:flex-row">
             
            <Button
              size="lg"
              className="h-12 w-full px-6 bg-accent text-accent-foreground hover:bg-accent/90"
               
            >
             <Link href={'/'}>
              Shorten URL
            </Link>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div> 

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>No signup required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              <span>Links never expire</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
