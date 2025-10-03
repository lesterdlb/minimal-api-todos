import { FilterType, FILTERS } from '../constants/index';

interface FilterProps {
	activeFilter: FilterType;
	onFilterChange: (filter: FilterType) => void;
}

const Filters = ({ activeFilter, onFilterChange }: FilterProps) => {
	const className = 'active-filter';

	return (
		<div className='filters'>
			<button
				className={`link ${activeFilter === FILTERS.ALL ? className : ''}`}
				onClick={() => onFilterChange(FILTERS.ALL)}
			>
				All
			</button>
			<button
				className={`link ${activeFilter === FILTERS.ACTIVE ? className : ''}`}
				onClick={() => onFilterChange(FILTERS.ACTIVE)}
			>
				Active
			</button>
			<button
				className={`link ${activeFilter === FILTERS.COMPLETED ? className : ''}`}
				onClick={() => onFilterChange(FILTERS.COMPLETED)}
			>
				Completed
			</button>
		</div>
	);
};

export default Filters;
