import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  safelist: [
    // Safelist common Tailwind patterns for styled HTML content uploads
    { pattern: /^(bg|text|border|rounded|shadow|p|m|w|h|flex|grid|gap)-/ },
    { pattern: /^(from|to|via)-/ }, // Gradients
    { pattern: /^(justify|items|content|self)-/ }, // Flexbox/Grid alignment
    { pattern: /^(font|leading|tracking)-/ }, // Typography
    { pattern: /^(max-w|min-w|max-h|min-h)-/ }, // Sizing
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Audit page brand colors
        navy: '#0A2540',
        aqua: '#1FB6FF',
        gold: '#FFB800',
        charcoal: '#333333',
        'light-gray': '#F5F7FA',
        // Existing Brand-specific colors
        "navy-deep": "hsl(var(--navy-deep))",
        "aqua-bright": "hsl(var(--aqua-bright))",
        "white-pure": "hsl(var(--white-pure))",
        "white-soft": "hsl(var(--white-soft))",
        // Design system tokens
        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "accent-primary": "hsl(var(--accent-primary))",
        "accent-secondary": "hsl(var(--accent-secondary))",
        "border-subtle": "hsl(var(--border-subtle))",
        "bg-mist": "hsl(var(--bg-mist))",
        "bg-pool": "hsl(var(--bg-pool))",
        "bg-sand": "hsl(var(--bg-sand))",
        "bg-ink": "hsl(var(--bg-ink))",
        // Accent colors for key term highlighting
        "accent-orange": "hsl(var(--accent-orange))",
        "accent-blue": "hsl(var(--accent-blue))",
        "accent-green": "hsl(var(--accent-green))",
      },
      fontFamily: {
        hero: ["var(--font-hero)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "serif"],
        // Audit page fonts
        heading: ['Montserrat', 'sans-serif'],
        'body-audit': ['Inter', 'sans-serif'],
        'accent-audit': ['"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-cta": "var(--gradient-cta)",
        "gradient-gold": "var(--gradient-gold)",
      },
      boxShadow: {
        "button": "var(--shadow-button)",
        "button-hover": "var(--shadow-button-hover)",
        'card': '0 4px 20px rgba(10, 37, 64, 0.08)',
        'card-hover': '0 8px 30px rgba(10, 37, 64, 0.12)',
      },
      textShadow: {
        "hero": "var(--text-shadow-hero)",
        "subtle": "var(--text-shadow-subtle)",
        "light": "var(--text-shadow-light)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;
