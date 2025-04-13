<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produk extends Model
{
    use HasFactory;

    protected $table = 'produk';
    protected $primaryKey = 'ProdukID';

    protected $fillable = [
        'NamaProduk',
        'Harga',
        'Stok',
    ];
}
