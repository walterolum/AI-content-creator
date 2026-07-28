import GeneratorForm from '../components/generator/GeneratorForm'

export default function GeneratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">AI Content Generator</h1>
        <p className="text-secondary-500 mt-1">Create professional social media content in seconds</p>
      </div>
      <GeneratorForm />
    </div>
  )
}
