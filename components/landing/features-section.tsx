import { Link2, BarChart3, Shield, Zap, Globe, QrCode } from "lucide-react"

const features = [
  {
    icon: Link2,
    title: "Instant Shortening",
    description: "Shorten any URL in milliseconds with our lightning-fast infrastructure. No waiting, no hassle.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track clicks, geographic data, referrers, and devices. Understand your audience like never before.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with SSL encryption. Your links are safe, always available, 24/7.",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Global CDN ensures your shortened links redirect in under 50ms, anywhere in the world.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Use your own branded domain for shortened links. Build trust and recognition with your audience.",
  },
  {
    icon: QrCode,
    title: "Beautiful QR Codes",
    description: "Generate customizable QR codes for any link. Perfect for print materials and offline marketing.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-secondary py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Everything You Need to <span className="text-accent">Manage Links</span>
          </h2>
          <p className="text-muted-foreground">
            Powerful features designed to help you create, share, and track links with ease.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border/50 bg-background p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
