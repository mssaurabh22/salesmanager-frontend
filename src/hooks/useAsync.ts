import { useCallback, useEffect, useState } from 'react'

export function useAsync<T>(factory: () => Promise<T>, deps: React.DependencyList) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await factory()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    void run()
  }, [run])

  return { data, loading, error, reload: run }
}
