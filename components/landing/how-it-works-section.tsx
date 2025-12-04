import { Link2, Settings, Share2, BarChart3 } from "lucide-react"

const steps = [
  {
    step: 1,
    icon: Link2,
    title: "Paste Your URL",
    description: "Simply paste any long URL into our shortener. We accept links of any length or format.",
  },
  {
    step: 2,
    icon: Settings,
    title: "Customize (Optional)",
    description: "Add a custom alias, set expiration dates, or password-protect your link for extra security.",
  },
  {
    step: 3,
    icon: Share2,
    title: "Share Everywhere",
    description: "Copy your new tiny link and share it on social media, emails, or anywhere you need.",
  },
  {
    step: 4,
    icon: BarChart3,
    title: "Track Performance",
    description: "Monitor clicks, analyze traffic sources, and optimize your marketing campaigns in real-time.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary md:text-4xl">
            How It <span className="text-accent">Works</span>
          </h2>
          <p className="text-muted-foreground">Get started in seconds. No technical skills required.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="relative mx-auto mb-6">
                {/* Number badge */}
                <div className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {item.step}
                </div>
                {/* Icon container */}
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 mx-auto">
                  <item.icon className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
