import propTypes from 'prop-types';

function PenjualanCard({ NamaProduk, Harga, Stok }) {
    return (
        <>
            <div
                className={`border-moca2 border-2 h-32 rounded p-2 w-[15vw] flex flex-col text-center justify-center transition-all duration-100 hover:text-moca1 hover:bg-moca3 hover:border-moca1                 }`}>
                <div>{NamaProduk}</div>
                <div>{Harga}</div>
                <div>{Stok}</div>
            </div>
        </>
    );
}

PenjualanCard.propTypes = {
    NamaProduk: propTypes.string.isRequired,
    Harga: propTypes.number,
    Stok: propTypes.number,
};

export default PenjualanCard;
