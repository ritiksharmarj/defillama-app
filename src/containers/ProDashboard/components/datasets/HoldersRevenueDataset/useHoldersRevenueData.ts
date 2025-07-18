import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '~/utils/async'

export function useHoldersRevenueData(chains?: string[]) {
	const queryParams =
		chains && chains.length > 0 ? `?${chains.map((chain) => `chains=${encodeURIComponent(chain)}`).join('&')}` : ''

	// Use sorted chains array to ensure consistent query key
	const sortedChains = chains ? [...chains].sort() : []

	return useQuery({
		queryKey: ['holders-revenue-overview', sortedChains.join(',')],
		queryFn: () => fetchJson(`/api/datasets/holders-revenue${queryParams}`),
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 5 * 60 * 1000, // 5 minutes
		enabled: true
	})
}
