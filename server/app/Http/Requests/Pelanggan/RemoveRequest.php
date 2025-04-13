<?php

namespace App\Http\Requests\Pelanggan;

use Illuminate\Foundation\Http\FormRequest;

class RemoveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        return [
            'PelangganID' => 'required|integer|exists:pelanggan,PelangganID',
        ];
    }
}
