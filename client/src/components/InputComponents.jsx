import { useState } from 'react';
import { motion } from 'framer-motion';
import propTypes from 'prop-types';

function InputComponents({ name, type, placeholder, value, onChange }) {
    const [focusedInput, setFocusedInput] = useState(null);

    return (
        <div className="relative w-full">
            <motion.div
                initial={{ height: '0%' }}
                animate={{ height: focusedInput === name ? '100%' : '0%' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute bottom-0 left-0 w-full bg-[#C14600] rounded-md z-0"
            />
            <input
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                name={name}
                value={value}
                className="relative z-10 w-full bg-transparent text-center text-white border-b-2 border-white outline-none py-2"
                onFocus={() => setFocusedInput(name)}
                onBlur={() => setFocusedInput(null)}
            />
        </div>
    );
}
export default InputComponents;

InputComponents.propTypes = {
    name: propTypes.string.isRequired,
    type: propTypes.string.isRequired,
    placeholder: propTypes.string,
    value: propTypes.string,
    onChange: propTypes.string,
};
