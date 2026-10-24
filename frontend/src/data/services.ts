/** CONFIRM: the engineering team should verify every capability below before launch. */

export interface Service {
  slug: string
  index: string
  title: string
  outcome: string
  body: string
  capabilities: string[]
}

export const services: Service[] = [
  {
    slug: 'ai-product-development',
    index: '01',
    title: 'AI product development',
    outcome: 'From idea to a product people use.',
    body: 'We take an AI idea through discovery, prototype and production as a real product with an interface, a backend and a roadmap, the same way we build our own.',
    capabilities: ['Product discovery and scoping', 'Rapid prototyping on real data', 'Production architecture', 'Iteration from usage'],
  },
  {
    slug: 'computer-vision',
    index: '02',
    title: 'Computer vision & visual intelligence',
    outcome: 'Turn images and video into structured, actionable data.',
    body: 'Defect and object detection, image analysis, 360° capture pipelines and visual progress estimation for inspection, monitoring and quality workflows.',
    capabilities: ['Image analysis and classification', 'Defect and anomaly identification', 'Panorama and 360° pipelines', 'Annotation tooling'],
  },
  {
    slug: 'document-intelligence',
    index: '03',
    title: 'Document processing & OCR',
    outcome: 'Stop re-keying data from files.',
    body: 'Extract, validate and reconcile data from workbooks, PDFs and scans into structured records with review steps where a human decision is needed.',
    capabilities: ['Workbook and spreadsheet ingestion', 'OCR and data extraction', 'Rule-based cross-checks', 'Exception review workflows'],
  },
  {
    slug: 'llm-applications',
    index: '04',
    title: 'LLM applications & RAG',
    outcome: 'Answers grounded in your own data.',
    body: 'Assistants that answer questions from your projects, documents and records, with retrieval, citations to source data and sensible guardrails.',
    capabilities: ['Retrieval-augmented generation', 'Domain assistants', 'Prompt and evaluation design', 'Guardrails and logging'],
  },
  {
    slug: 'agents-automation',
    index: '05',
    title: 'AI agents & workflow automation',
    outcome: 'Hand the repetitive steps to software.',
    body: 'Agents and automations that move work between systems, prepare decisions for people and escalate what they cannot resolve.',
    capabilities: ['Multi-step agent workflows', 'System integrations', 'Human-in-the-loop approvals', 'Audit trails'],
  },
  {
    slug: 'custom-software',
    index: '06',
    title: 'Custom web apps & backend systems',
    outcome: 'Software shaped around how you operate.',
    body: 'Modern web applications, APIs and data backends engineered for reliability, with design standards that match the products above.',
    capabilities: ['React and TypeScript front ends', 'Python and API backends', 'Role-based access', 'Reporting and exports'],
  },
  {
    slug: 'cloud-ai-infrastructure',
    index: '07',
    title: 'Cloud, containers & AI infrastructure',
    outcome: 'Reliable deployment, without drama.',
    body: 'Containerised deployments, CI/CD, monitoring and the infrastructure to serve AI workloads in production.',
    capabilities: ['Containerisation and CI/CD', 'Cloud deployment', 'Model serving', 'Observability'],
  },
  {
    slug: 'integration-poc',
    index: '08',
    title: 'AI integration & proof of concept',
    outcome: 'Find out if it works before you commit.',
    body: 'Short, focused engagements that test an AI approach against your data and workflow and give you an honest read on feasibility.',
    capabilities: ['Feasibility assessment', 'Time-boxed proof of concept', 'Integration into existing tools', 'Clear go / no-go report'],
  },
]
