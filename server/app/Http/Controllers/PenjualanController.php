<?php

namespace App\Http\Controllers;

use App\Http\Requests\Penjualan\ReadRequest;
use App\Http\Requests\Penjualan\RemoveRequest;
use App\Models\DetailPenjualan;
use App\Models\Penjualan;
use App\Models\Produk;
use App\Http\Requests\Penjualan\StoreRequest;
use App\Http\Requests\Penjualan\UpdateRequest;
use App\Http\Requests\ReadOneToManyRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PenjualanController extends Controller
{
    public function showAll(Request $request)
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);

        $subQuery = DetailPenjualan::select('PenjualanID', DB::raw('MAX(DetailID) as latest_detail_id'))
            ->groupBy('PenjualanID');

        $query = DetailPenjualan::query()
            ->joinSub($subQuery, 'latest_details', function ($join) {
                $join->on('detailpenjualan.DetailID', '=', 'latest_details.latest_detail_id');
            })
            ->with(['penjualan.pelanggan', 'user', 'produk'])
            ->orderBy('detailpenjualan.PenjualanID', 'desc'); // <-- Tambah ini

        $penjualan = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'status' => 'ok',
            'data' => $penjualan->items(),
            'pagination' => [
                'total' => $penjualan->total(),
                'perPage' => $penjualan->perPage(),
                'currentPage' => $penjualan->currentPage(),
                'lastPage' => $penjualan->lastPage(),
            ]
        ]);
    }

    public function showOne(ReadRequest $request)
    {
        $validated = $request->validated();
        $penjualan = DetailPenjualan::where('NamaPelanggan', $validated['NamaPelanggan'])->first();
        if (!$penjualan) {
            return response()->json(
                [
                    'status' => 'fail',
                    'message' => 'Data Penjualan tidak ditemukan'
                ],
                404
            );
        }

        return response()->json([
            'status' => 'ok',
            'data' => $penjualan
        ]);
    }

    public function showOneToMany(ReadOneToManyRequest $request)
    {
        $validated = $request->validated();
        $penjualan = DetailPenjualan::where('PenjualanID', $validated['PenjualanID'])->with(['produk', 'penjualan.pelanggan'])->get();
        if ($penjualan->isEmpty()) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data Penjualan tidak ditemukan'
            ], 404);
        }
        return response()->json([
            'status' => 'ok',
            'data' => $penjualan
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'search' => 'sometimes|string',
            'page' => 'sometimes|integer|min:1',
            'perPage' => 'sometimes|integer|min:1'
        ]);

        $searchTerm = $request->input('search');
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);

        // Subquery untuk ambil DetailID terbaru per PenjualanID
        $subQuery = DetailPenjualan::select(
            'PenjualanID',
            DB::raw('MAX(DetailID) as latest_detail_id')
        )->groupBy('PenjualanID');

        // Query utama dengan join ke subquery
        $query = DetailPenjualan::query()
            ->joinSub(
                $subQuery,
                'latest_details',
                function ($join) {
                    $join->on('detailpenjualan.DetailID', '=', 'latest_details.latest_detail_id')
                        ->on('detailpenjualan.PenjualanID', '=', 'latest_details.PenjualanID'); // Tambahkan ini
                }
            )
            ->with(['penjualan.pelanggan', 'user', 'produk']);

        if ($searchTerm) {
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('penjualan.pelanggan', function ($subQ) use ($searchTerm) {
                    $subQ->where('NamaPelanggan', 'like', "%{$searchTerm}%");
                })
                    ->orWhere('detailpenjualan.PenjualanID', 'like', "%{$searchTerm}%"); // Specify table
            });
        }

        $results = $query->orderBy('detailpenjualan.created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

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

        DB::beginTransaction();
        try {
            $penjualan = Penjualan::create([
                'TanggalPenjualan' => $validated['TanggalPenjualan'],
                'TotalHarga' => $validated['TotalHarga'],
                'PelangganID' => $validated['PelangganID'] ?? 8,
            ]);

            foreach ($validated['details'] as $detail) {
                // Ambil produk dan kunci row untuk update
                $produk = Produk::where('ProdukID', $detail['ProdukID'])->lockForUpdate()->first();

                if (!$produk) {
                    throw new \Exception("Produk dengan ID {$detail['ProdukID']} tidak ditemukan.");
                }

                // Cek stok mencukupi
                if ($produk->Stok < $detail['JumlahProduk']) {
                    throw new \Exception("Stok {$produk->NamaProduk} tidak mencukupi.");
                }

                // Kurangi stok
                $produk->Stok -= $detail['JumlahProduk'];
                $produk->save();

                // Buat detail penjualan
                $penjualan->detailPenjualan()->create([
                    'ProdukID' => $detail['ProdukID'],
                    'JumlahProduk' => $detail['JumlahProduk'],
                    'Subtotal' => $detail['Subtotal'],
                    'UserID' => auth()->id(),
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Penjualan berhasil disimpan'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $penjualan = Penjualan::findOrFail($validated['PenjualanID']);

            // Update data penjualan
            $penjualan->update([
                'TanggalPenjualan' => $validated['TanggalPenjualan'] = \Carbon\Carbon::parse($validated['TanggalPenjualan'])->format('Y-m-d H:i:s'),
                'TotalHarga'       => $validated['TotalHarga'],
                'PelangganID'      => $validated['PelangganID'],
            ]);

            $existingDetailIDs = [];

            foreach ($validated['details'] as $detail) {
                if (isset($detail['DetailID'])) {
                    // Update detail yang sudah ada
                    $detailModel = DetailPenjualan::find($detail['DetailID']);
                    if ($detailModel && $detailModel->PenjualanID == $penjualan->PenjualanID) {
                        $detailModel->update([
                            'ProdukID'      => $detail['ProdukID'],
                            'JumlahProduk'  => $detail['JumlahProduk'],
                            'Subtotal'      => $detail['Subtotal'],
                            'UserID'        => auth()->id(),
                        ]);
                        $existingDetailIDs[] = $detailModel->DetailID;
                    }
                } else {
                    // Tambah detail baru
                    $newDetail = $penjualan->detailPenjualan()->create([
                        'ProdukID'      => $detail['ProdukID'],
                        'JumlahProduk'  => $detail['JumlahProduk'],
                        'Subtotal'      => $detail['Subtotal'],
                        'UserID'        => auth()->id(),
                    ]);
                    $existingDetailIDs[] = $newDetail->DetailID;
                }
            }

            DB::commit();

            return response()->json([
                'status' => 'ok',
                'message' => 'Data penjualan berhasil diperbarui.'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function delete(RemoveRequest $request)
    {
        $validated = $request->validated();

        // Hapus semua detail penjualan terlebih dahulu
        DetailPenjualan::where('PenjualanID', $validated['PenjualanID'])->delete();

        // Hapus penjualan
        $penjualan = Penjualan::find($validated['PenjualanID']);
        $penjualan->delete();

        return response()->json([
            'status' => 'ok',
            'message' => 'Penjualan berhasil dihapus.'
        ]);
    }
}
