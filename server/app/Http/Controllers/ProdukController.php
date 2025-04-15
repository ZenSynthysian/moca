<?php

namespace App\Http\Controllers;

use App\Http\Requests\Produk\ReadRequest;
use App\Http\Requests\Produk\RemoveRequest;
use App\Http\Requests\Produk\StoreRequest;
use App\Http\Requests\Produk\UpdateRequest;
use App\Models\Produk;
use Illuminate\Http\Request;

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
        $keyword = $validated['NamaProduk'];

        $produks = Produk::where('NamaProduk', 'LIKE', '%' . $keyword . '%')->get();

        if ($produks->isEmpty()) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'data' => $produks
        ], 200);
    }

    public function search(Request $request)
    {
        $request->validate([
            'search' => 'sometimes|string',
            'page' => 'sometimes|integer|min:1',
            'perPage' => 'sometimes|integer|min:1'
        ]);

        $search = $request->input('search');
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);

        $query = Produk::query();

        if ($search) {
            $query->where('NamaProduk', 'like', "%{$search}%")
                ->orWhere('ProdukID', 'like', "%{$search}%");
        }

        $results = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $results->items(),
            'pagination' => [
                'total' => $results->total(),
                'perPage' => $results->perPage(),
                'currentPage' => $results->currentPage(),
                'lastPage' => $results->lastPage(),
            ],
            'message' => 'Search results'
        ]);
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
        $produk = Produk::where('ProdukID', $validated['ProdukID'])->first();
        if (!$produk) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $produk->update([
            'NamaProduk' => $validated['NamaProduk'] ?? $produk->NamaProduk,
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
        $produk = Produk::where('ProdukID', $validated['ProdukID'])->first();
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
