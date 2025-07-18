import { getChainPageData } from '~/api/categories/chains'
import { getBridgeOverviewPageData } from '~/containers/Bridges/queries.server'
import {
	getDimensionsAdaptersChainsPageData,
	getDimensionProtocolPageData,
	getDimensionAdapterChainPageData
} from '~/api/categories/adaptors'
import { fetchJson } from '~/utils/async'

export const fetchChain = async ({ chain }) => {
	const [data, volumeData, feesData, usersData, txsData, bridgeData, stablecoinsData] = await Promise.all([
		getChainPageData(chain).catch(() => null),
		getDimensionsAdaptersChainsPageData('dexs').catch(() => null),
		getDimensionAdapterChainPageData('dexs', chain).catch(() => null),
		getDimensionProtocolPageData({ adapterType: 'fees', protocolName: chain }).catch(() => null),
		fetchJson(`https://api.llama.fi/userData/users/chain$${chain}`)
			.then((r) => JSON.parse(r?.body || null))
			.catch(() => null),
		fetchJson(`https://api.llama.fi/userData/txs/chain$${chain}`)
			.then((r) => JSON.parse(r?.body || null))
			.catch(() => null),
		getDimensionAdapterChainPageData('fees', chain)
			.catch(() => null)
			.then((r) => (r && r.total24h === undefined ? null : r)),
		getBridgeOverviewPageData(chain).catch(() => null),
		[]
	])

	return {
		...(data?.props || {}),
		volumeData: volumeData || null,
		feesData: feesData || null,
		usersData: usersData || null,
		txsData: txsData || null,
		bridgeData: bridgeData || null,
		stablecoinsData: stablecoinsData || null
	}
}
