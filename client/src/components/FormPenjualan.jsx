import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Minus, Plus } from 'lucide-react';

const FormPenjualan = ({ selectedItems, products, handleIncrease, handleDecrease, handleSubmit, isSubmitLoading }) => {
    const totalHarga = Object.values(selectedItems).reduce((sum, item) => sum + item.Subtotal, 0);

    return (
        <Card className="p-4 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Keranjang</h2>

            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
                {Object.keys(selectedItems).length === 0 ? (
                    <p className="text-gray-500 text-sm">Belum ada produk dipilih.</p>
                ) : (
                    Object.values(selectedItems).map((item) => {
                        const product = products.find((p) => p.ProdukID === item.ProdukID);
                        return (
                            <div
                                key={item.ProdukID}
                                className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-xl">
                                <div className="flex flex-col">
                                    <span className="font-medium">{product?.NamaProduk || 'Produk tidak ditemukan'}</span>
                                    <span className="text-sm text-gray-500">Subtotal: Rp {item.Subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDecrease(item.ProdukID)}>
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-6 text-center">{item.JumlahProduk}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleIncrease(item.ProdukID)}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="mt-6 flex justify-between items-center">
                <span className="text-lg font-semibold">Total: Rp {totalHarga.toLocaleString('id-ID')}</span>
                <Button
                    disabled={isSubmitLoading || Object.keys(selectedItems).length === 0}
                    onClick={handleSubmit}>
                    {isSubmitLoading ? 'Menyimpan...' : 'Simpan'}
                </Button>
            </div>
        </Card>
    );
};

export default FormPenjualan;
