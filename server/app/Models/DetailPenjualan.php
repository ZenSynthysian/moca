<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailPenjualan extends Model
{
    use HasFactory;
    protected $table = 'detailpenjualan';
    protected $primaryKey = 'DetailID';

    protected $fillable = [
        'PenjualanID',
        'ProdukID',
        'UserID',
        'JumlahProduk',
        'Subtotal'
    ];

    // Relasi ke Penjualan
    public function penjualan()
    {
        return $this->belongsTo(Penjualan::class, 'PenjualanID', 'PenjualanID');
    }

    // Relasi ke Produk
    public function produk()
    {
        return $this->belongsTo(Produk::class, 'ProdukID', 'ProdukID');
    }

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'id');
    }

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'PelangganID', 'PelangganID');
    }
}
