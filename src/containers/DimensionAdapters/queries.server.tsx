import { ADAPTER_DATA_TYPES, ADAPTER_TYPES, ADAPTER_TYPES_TO_METADATA_TYPE } from './constants'
import { getAdapterChainOverview } from './queries'
import { postRuntimeLogs } from '~/utils/async'

// TODO single api
export async function getDimensionAdapterChainsOverview({
	adapterType,
	dataType
}: {
	adapterType: `${ADAPTER_TYPES}`
	dataType?: `${ADAPTER_DATA_TYPES}`
}) {
	const metadataCache = await import('~/utils/metadata').then((m) => m.default)

	const chains = []
	for (const chain in metadataCache.chainMetadata) {
		if (metadataCache.chainMetadata[chain][ADAPTER_TYPES_TO_METADATA_TYPE[adapterType]]) {
			chains.push(chain)
		}
	}

	const data = await Promise.all(
		chains.map((chain) =>
			getAdapterChainOverview({
				chain,
				adapterType,
				excludeTotalDataChart: true,
				excludeTotalDataChartBreakdown: true,
				dataType
			}).catch(() => {
				postRuntimeLogs(`getDimensionAdapterChainsOverview:${chain}:${adapterType}:failed`)
				return null
			})
		)
	)

	return data.filter(Boolean)
}
