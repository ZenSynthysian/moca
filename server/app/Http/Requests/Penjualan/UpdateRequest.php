<?php

namespace App\Http\Requests\Penjualan;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'PenjualanID'       => 'required|exists:penjualan,PenjualanID',
            'TanggalPenjualan'  => 'required|date',
            'TotalHarga'        => 'required|numeric|min:0',
            'PelangganID'       => 'required|exists:pelanggan,PelangganID',
            'details'           => 'required|array|min:1',
            'details.*.ProdukID'      => 'required|exists:produk,ProdukID',
            'details.*.JumlahProduk'  => 'required|integer|min:1',
            'details.*.Subtotal'      => 'required|numeric|min:0',
            'details.*.DetailID'     => 'sometimes|exists:detailpenjualan,DetailID'
        ];
    }
}
