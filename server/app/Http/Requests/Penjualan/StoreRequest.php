<?php

namespace App\Http\Requests\Penjualan;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
  public function authorize(): bool
  {
    return true;
  }

  public function rules(): array
  {
    return [
      'TanggalPenjualan' => 'required|date',
      'TotalHarga' => 'required|numeric|min:0',
      'PelangganID' => 'nullable|integer|exists:pelanggan,PelangganID',
      'details' => 'required|array|min:1',
      'details.*.ProdukID' => 'required|integer|exists:produk,ProdukID',
      'details.*.JumlahProduk' => 'required|integer|min:1',
      'details.*.Subtotal' => 'required|numeric|min:0',
    ];
  }
}

/* Contoh struktur data yang di kirim dari client
{
  "TanggalPenjualan": "2025-04-13",
  "TotalHarga": 100000,
  "PelangganID": 1,
  "details": [
    {
      "ProdukID": 1,
      "JumlahProduk": 2,
      "Subtotal": 50000
    },
    {
      "ProdukID": 2,
      "JumlahProduk": 1,
      "Subtotal": 50000
    }
  ]
}
*/
