<?php

namespace App\Http\Requests\Pelanggan;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
            'NamaPelanggan' => 'required|string|max:255',
            'Alamat' => 'required|string',
            'NomorTelepon' => 'required|string|max:15',
        ];
    }
}
