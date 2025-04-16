<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PelangganController;
use App\Http\Controllers\PenjualanController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

Route::post('/users/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // user routes
    Route::post('/users/register', [AuthController::class, 'store']);
    Route::get('/users/logout', [AuthController::class, 'logout']);
    Route::get('/users/showall', [UsersController::class, 'showAll']);
    Route::get('/users/showone', [UsersController::class, 'showOne']);
    Route::get('/users/profile', [UsersController::class, 'profile']);
    Route::put('/users/edit', [UsersController::class, 'edit']);
    Route::put('/users/edituser', [UsersController::class, 'edituser']);
    Route::delete('/users/delete', [UsersController::class, 'delete']);

    // produk routes
    Route::get('/products/showall', [ProdukController::class, 'showAll']);
    Route::post('/products/showone', [ProdukController::class, 'showOne']);
    Route::post('/products/search', [ProdukController::class, 'search']);
    Route::post('/products/store', [ProdukController::class, 'store']);
    Route::put('/products/update', [ProdukController::class, 'update']);
    Route::delete('/products/delete', [ProdukController::class, 'delete']);

    // pelanggan routes
    Route::get('/pelanggan/showall', [PelangganController::class, 'showAll']);
    Route::post('/pelanggan/showone', [PelangganController::class, 'showOne']);
    Route::post('/pelanggan/store', [PelangganController::class, 'store']);
    Route::put('/pelanggan/update', [PelangganController::class, 'update']);
    Route::delete('/pelanggan/delete', [PelangganController::class, 'delete']);

    // penjualan Routes
    Route::get('/penjualan/showall', [PenjualanController::class, 'showAll']);
    Route::post('/penjualan/search', [PenjualanController::class, 'search']);
    Route::post('/penjualan/showone', [PenjualanController::class, 'showOne']);
    Route::post('/penjualan/showonetomany', [PenjualanController::class, 'showOneToMany']);
    Route::post('/penjualan/store', [PenjualanController::class, 'store']);
    Route::put('/penjualan/update', [PenjualanController::class, 'update']);
    Route::delete('/penjualan/delete', [PenjualanController::class, 'delete']);
});
