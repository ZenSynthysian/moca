<?php

namespace App\Http\Controllers;

use App\Http\Requests\Penjualan\ReadRequest;
use App\Http\Requests\Penjualan\RemoveRequest;
use App\Models\DetailPenjualan;
use App\Models\Penjualan;
use App\Http\Requests\Penjualan\StoreRequest;
use App\Http\Requests\Penjualan\UpdateRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class PenjualanController extends Controller
{
    public function showAll()
    {
        $penjualan = DetailPenjualan::all();
        if ($penjualan->isEmpty()) {
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

    public function showOne(ReadRequest $request)
    {
        $validated = $request->validated();
        $penjualan = DetailPenjualan::where('DetailID', $validated['DetailID'])->first();
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

    public function store(StoreRequest $request)
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $penjualan = Penjualan::create([
                'TanggalPenjualan' => $validated['TanggalPenjualan'],
                'TotalHarga' => $validated['TotalHarga'],
                'PelangganID' => $validated['PelangganID'],
            ]);

            $penjualan->detailPenjualan()->createMany(array_map(function ($detail) {
                return [
                    'ProdukID' => $detail['ProdukID'],
                    'JumlahProduk' => $detail['JumlahProduk'],
                    'Subtotal' => $detail['Subtotal'],
                    'UserID' => auth()->id(),
                ];
            }, $validated['details']));

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
                'TanggalPenjualan' => $validated['TanggalPenjualan'],
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
        $penjualan = Penjualan::find($validated['PenjualanID']);
        if (!$penjualan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Penjualan tidak ditemukan.'
            ], 404);
        }

        $penjualan->delete();
        return response()->json([
            'status' => 'ok',
            'message' => 'Penjualan berhasil dihapus.'
        ]);
    }
}
