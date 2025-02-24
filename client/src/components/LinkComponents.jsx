import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

function LinkComponents({ name, link }) {
    return (
        <Link to={link}>
            <button className="text-moca1 w-full px-6 py-2 rounded-xl border-b-[2px] border-[#C14600] transition duration-300 hover:bg-[#C14600] hover:text-[#FEF9E1] hover:shadow-lg active:scale-95">
                {name}
            </button>
        </Link>
    );
}

export default LinkComponents;

LinkComponents.propTypes = {
    name: propTypes.string.isRequired,
    link: propTypes.string,
};
