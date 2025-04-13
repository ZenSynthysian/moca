<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    use HasFactory;
    protected $table = "pelanggan";
    protected $primaryKey = "PelangganID";
    public $incrementing = true;

    protected $fillable = [
        'NamaPelanggan',
        'Alamat',
        'NomorTelepon'
    ];
}
