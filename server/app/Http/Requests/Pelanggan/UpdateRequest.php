<?php

namespace App\Http\Requests\Pelanggan;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
            'PelangganID' => 'required|integer|exists:pelanggan,PelangganID',
            'NamaPelanggan' => 'nullable|string|max:255',
            'Alamat' => 'nullable|string',
            'NomorTelepon' => 'nullable|string|max:15',
        ];
    }
}
