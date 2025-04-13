<?php

namespace App\Http\Controllers;

use App\Http\Requests\Produk\ReadRequest;
use App\Http\Requests\Produk\RemoveRequest;
use App\Http\Requests\Produk\StoreRequest;
use App\Http\Requests\Produk\UpdateRequest;
use App\Models\Produk;

class ProdukController extends Controller
{
    public function showAll()
    {
        $produk = Produk::all();

        if ($produk->isEmpty()) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'data' => $produk
        ], 200);
    }

    public function showOne(ReadRequest $request)
    {
        $validated = $request->validated();
        $produk = $validated['NamaProduk'];
        $produk = Produk::where('NamaProduk', $produk)->first();

        if (!$produk) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'data' => $produk
        ], 200);
    }

    public function store(StoreRequest $request)
    {
        $validated = $request->validated();
        $produk = Produk::create([
            'NamaProduk' => $validated['NamaProduk'],
            'Harga' => $validated['Harga'],
            'Stok' => $validated['Stok'],
        ]);
        if (!$produk) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data gagal disimpan'
            ], 500);
        }

        return response()->json([
            'status' => 'ok',
            'data' => $produk
        ], 201);
    }

    public function update(UpdateRequest $request)
    {
        $validated = $request->validated();
        $produk = Produk::where('NamaProduk', $validated['NamaProdukBefore'])->first();
        if (!$produk) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $produk->update([
            'NamaProduk' => $validated['NamaProdukAfter'] ?? $produk->NamaProduk,
            'Harga' => $validated['Harga'] ?? $produk->Harga,
            'Stok' => $validated['Stok'] ?? $produk->Stok,
        ]);

        return response()->json([
            'status' => 'ok',
            'data' => $produk
        ], 200);
    }

    public function delete(RemoveRequest $request)
    {
        $validated = $request->validated();
        $produk = Produk::where('NamaProduk', $validated['NamaProduk'])->first();
        if (!$produk) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }
        $produk->delete();
        return response()->json([
            'status' => 'ok',
            'message' => 'Data berhasil dihapus'
        ], 200);
    }
}
