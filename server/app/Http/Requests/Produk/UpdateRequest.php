<?php

namespace App\Http\Requests\Produk;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ProdukID' => 'required|integer',
            'NamaProduk' => 'nullable|string|max:255',
            'Harga' => 'nullable|integer|min:0',
            'Stok' => 'nullable|integer|min:0'
        ];
    }
}
