import type { Feature } from '@/types'

const features: Feature[] = [
  {
    icon: 'fa-code',
    title: 'Auto Code Formatting',
    description: 'For C, Python, Java - Perfect syntax highlighting'
  },
  {
    icon: 'fa-sitemap',
    title: 'Flowchart & Block Diagrams',
    description: 'DAA, OS, DBMS - Auto-generated visuals'
  },
  {
    icon: 'fa-calculator',
    title: 'Formula Highlighter',
    description: 'Maths, Physics - Enhanced visibility'
  },
  {
    icon: 'fa-play-circle',
    title: 'Algorithm Animation',
    description: 'Step-wise execution visualization'
  },
  {
    icon: 'fa-microchip',
    title: 'Circuit Diagram Generator',
    description: 'ECE - Instant circuit visualization'
  },
  {
    icon: 'fa-project-diagram',
    title: 'UML Generator',
    description: 'Software Engineering - Auto class diagrams'
  }
]

export default function FeaturesGrid() {
  return (
    <div className="features-grid">
      {features.map((feature, index) => (
        <div key={index} className="feature-card">
          <div className="feature-icon">
            <i className={`fas ${feature.icon}`}></i>
          </div>
          <div className="feature-title">{feature.title}</div>
          <div className="feature-desc">{feature.description}</div>
        </div>
      ))}
    </div>
  )
}