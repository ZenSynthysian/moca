import propTypes from 'prop-types';

function ProductCard({ id, isSelected, onClick }) {
    return (
        <div
            onClick={() => onClick(id)}
            className={`border-moca2 border-2 h-32 rounded p-2 w-[15vw] flex flex-col text-center justify-center transition-all duration-100 hover:text-moca1 hover:bg-moca3 hover:border-moca1 ${
                isSelected ? 'bg-moca3' : ''
            }`}>
            <div>Nama Produk {id}</div>
            <div>25000</div>
            <div>30</div>
        </div>
    );
}

ProductCard.propTypes = {
    id: propTypes.number,
    isSelected: propTypes.bool,
    onClick: propTypes.func,
};

export default ProductCard;
