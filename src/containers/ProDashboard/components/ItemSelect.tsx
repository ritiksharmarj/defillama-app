import { ReactSelect } from '~/components/MultiSelect/ReactSelect'
import { LoadingSpinner } from './LoadingSpinner'
import { createFilter } from 'react-select'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'
import { getItemIconUrl } from '../utils'
import { reactSelectStyles } from '../utils/reactSelectStyles'

interface ItemSelectProps {
	label: string
	options: Array<{ value: string; label: string; logo?: string }>
	selectedValue: string | null
	onChange: (option: any) => void
	isLoading: boolean
	placeholder: string
	itemType: 'chain' | 'protocol' | 'text'
}

const CustomChainOption = ({ innerProps, label, data }) => (
	<div {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer' }}>
		{label === 'All Chains' ? null : (
			<img
				src={getItemIconUrl('chain', null, label)}
				alt={label}
				style={{ width: '20px', height: '20px', marginRight: '10px', borderRadius: '50%' }}
			/>
		)}
		{label}
	</div>
)

const CustomProtocolOption = ({ innerProps, label, data }) => {
	const iconUrl = getItemIconUrl('protocol', data, data.value)
	return (
		<div {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer' }}>
			{data.logo ? (
				<img
					src={data.logo}
					alt={label}
					style={{ width: '20px', height: '20px', marginRight: '10px', borderRadius: '50%' }}
				/>
			) : (
				<img
					src={iconUrl}
					alt={label}
					style={{ width: '20px', height: '20px', marginRight: '10px', borderRadius: '50%' }}
					onError={(e) => {
						const target = e.target as HTMLImageElement
						target.style.display = 'none'
						const placeholder = target.nextElementSibling as HTMLElement
						if (placeholder) {
							placeholder.style.display = 'flex'
						}
					}}
				/>
			)}
			<div
				style={{
					width: '20px',
					height: '20px',
					marginRight: '10px',
					borderRadius: '50%',
					backgroundColor: 'var(--bg2)',
					display: data.logo ? 'none' : 'none'
				}}
			/>
			{label}
		</div>
	)
}

const TextOption = ({ innerProps, label }) => (
	<div {...innerProps} style={{ padding: '8px', cursor: 'pointer' }}>
		{label}
	</div>
)

function VirtualizedMenuList(props) {
	const { options, children, maxHeight, getValue } = props
	const listRef = useRef<HTMLDivElement>(null)
	const itemCount = options.length
	const virtualizer = useVirtualizer({
		count: itemCount,
		getScrollElement: () => listRef.current,
		estimateSize: () => 40
	})
	return (
		<div
			ref={listRef}
			className="thin-scrollbar"
			style={{
				maxHeight,
				overflowY: 'auto',
				position: 'relative'
			}}
		>
			<div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
				{virtualizer.getVirtualItems().map((virtualRow) => (
					<div
						key={virtualRow.key}
						data-index={virtualRow.index}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							transform: `translateY(${virtualRow.start}px)`
						}}
					>
						{children[virtualRow.index]}
					</div>
				))}
			</div>
		</div>
	)
}

export function ItemSelect({
	label,
	options,
	selectedValue,
	onChange,
	isLoading,
	placeholder,
	itemType
}: ItemSelectProps) {
	const OptionComponent =
		itemType === 'chain' ? CustomChainOption : itemType === 'protocol' ? CustomProtocolOption : TextOption
	const filterOption = itemType === 'protocol' ? createFilter({ ignoreAccents: false, ignoreCase: false }) : undefined

	return (
		<div>
			<label className="block mb-1.5 md:mb-2 text-sm font-medium pro-text2">{label}</label>
			{isLoading ? (
				<div className="flex items-center justify-center h-10">
					<LoadingSpinner size="sm" />
				</div>
			) : (
				<ReactSelect
					options={options}
					value={options.find((option) => option.value === selectedValue)}
					onChange={onChange}
					components={{ Option: OptionComponent, MenuList: VirtualizedMenuList }}
					placeholder={placeholder}
					className="w-full text-sm md:text-base"
					filterOption={filterOption}
					styles={reactSelectStyles}
					menuPosition="fixed"
				/>
			)}
		</div>
	)
}
