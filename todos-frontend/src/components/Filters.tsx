import {FiltersTypes} from '../constants';

interface FilterProps {
    activeFilter: FiltersTypes;
    onFilterChange: (filter: FiltersTypes) => void;
}

const Filters = ({activeFilter, onFilterChange}: FilterProps) => {
    const className = 'active-filter';

    return (
        <div className='filters'>
            <button
                className={`link ${activeFilter === FiltersTypes.ALL ? className : ''}`}
                onClick={() => onFilterChange(FiltersTypes.ALL)}>
                All
            </button>
            <button
                className={`link ${activeFilter === FiltersTypes.ACTIVE ? className : ''}`}
                onClick={() => onFilterChange(FiltersTypes.ACTIVE)}>
                Active
            </button>
            <button
                className={`link ${activeFilter === FiltersTypes.COMPLETED ? className : ''}`}
                onClick={() => onFilterChange(FiltersTypes.COMPLETED)}>
                Completed
            </button>
        </div>
    )
}

export default Filters;