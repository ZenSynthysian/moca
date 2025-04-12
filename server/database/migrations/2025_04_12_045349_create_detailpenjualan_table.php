<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detailpenjualan', function (Blueprint $table) {
            $table->id('DetailID');
            $table->unsignedBigInteger('PenjualanID');
            $table->unsignedBigInteger('ProdukID');
            $table->unsignedBigInteger('UserID');
            $table->integer('JumlahProduk');
            $table->decimal('Subtotal', 10, 2);
            $table->timestamps();

            $table->foreign('PenjualanID')->references('PenjualanID')->on('penjualan');
            $table->foreign('ProdukID')->references('ProdukID')->on('produk');
            $table->foreign('UserID')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detailpenjualan');
    }
};
