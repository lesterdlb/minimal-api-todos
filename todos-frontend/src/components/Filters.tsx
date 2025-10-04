import { FilterType, FILTERS } from '../constants/index';

interface FilterProps {
	activeFilter: FilterType;
	onFilterChange: (filter: FilterType) => void;
	className?: string;
}

const Filters = ({ activeFilter, onFilterChange, className = '' }: FilterProps) => {
	const activeClass = 'active-filter';

	return (
		<div className={`filters ${className}`}>
			<button
				className={`link ${activeFilter === FILTERS.ALL ? activeClass : ''}`}
				onClick={() => onFilterChange(FILTERS.ALL)}
			>
				All
			</button>
			<button
				className={`link ${activeFilter === FILTERS.ACTIVE ? activeClass : ''}`}
				onClick={() => onFilterChange(FILTERS.ACTIVE)}
			>
				Active
			</button>
			<button
				className={`link ${activeFilter === FILTERS.COMPLETED ? activeClass : ''}`}
				onClick={() => onFilterChange(FILTERS.COMPLETED)}
			>
				Completed
			</button>
		</div>
	);
};

export default Filters;
