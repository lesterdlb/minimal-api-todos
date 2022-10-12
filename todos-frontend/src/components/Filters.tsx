import {useState} from 'react';
import {FiltersTypes} from '../constants';

interface FilterProps {
    onFilterChange: (filter: FiltersTypes) => void;
}

const Filters = ({onFilterChange}: FilterProps) => {
    const className = 'active-filter';
    const [selected, setSelected] = useState<FiltersTypes>(FiltersTypes.ALL);

    const handleFilterChange = (filter: FiltersTypes) => {
        setSelected(filter);
        onFilterChange(filter);
    }

    return (
        <div className='filters'>
            <a
                className={`${selected === FiltersTypes.ALL ? className : ''}`}
                onClick={() => handleFilterChange(FiltersTypes.ALL)}>
                All
            </a>
            <a
                className={`${selected === FiltersTypes.ACTIVE ? className : ''}`}
                onClick={() => handleFilterChange(FiltersTypes.ACTIVE)}>
                Active
            </a>
            <a
                className={`${selected === FiltersTypes.COMPLETED ? className : ''}`}
                onClick={() => handleFilterChange(FiltersTypes.COMPLETED)}>
                Completed
            </a>
        </div>
    )
}

export default Filters;