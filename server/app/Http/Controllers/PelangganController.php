<?php

namespace App\Http\Controllers;

use App\Http\Requests\Pelanggan\ReadRequest;
use App\Http\Requests\Pelanggan\RemoveRequest;
use App\Http\Requests\Pelanggan\StoreRequest;
use App\Http\Requests\Pelanggan\UpdateRequest;
use App\Models\Pelanggan;

class PelangganController extends Controller
{
    public function showAll()
    {
        $pelanggan = Pelanggan::all();

        if ($pelanggan->isEmpty()) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'data' => $pelanggan
        ], 200);
    }

    public function showOne(ReadRequest $request)
    {
        $validated = $request->validated();
        $keyword = $validated['NamaPelanggan'];

        $pelanggan = Pelanggan::where('NamaPelanggan', 'LIKE', '%' . $keyword . '%')->get();

        if ($pelanggan->isEmpty()) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'data' => $pelanggan
        ], 200);
    }

    public function store(StoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $pelanggan = Pelanggan::create([
                'NamaPelanggan' => $validated['NamaPelanggan'],
                'Alamat' => $validated['Alamat'],
                'NomorTelepon' => $validated['NomorTelepon'],
            ]);
            if (!$pelanggan) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Data gagal disimpan'
                ], 500);
            }

            return response()->json([
                'status' => 'ok',
                'data' => $pelanggan
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateRequest $request)
    {
        $validated = $request->validated();
        $pelanggan = Pelanggan::find($validated['PelangganID']);
        if (!$pelanggan) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $pelanggan->update([
            'NamaPelanggan' => $validated['NamaPelanggan'] ?? $pelanggan->NamaPelanggan,
            'Alamat' => $validated['Alamat'] ?? $pelanggan->Alamat,
            'NomorTelepon' => $validated['NomorTelepon'] ?? $pelanggan->NomorTelepon,
        ]);

        return response()->json([
            'status' => 'ok',
            'data' => $pelanggan
        ], 200);
    }

    public function delete(RemoveRequest $request)
    {
        $validated = $request->validated();
        $pelanggan = Pelanggan::find($validated['PelangganID']);
        if (!$pelanggan) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Data tidak ditemukan'
            ], 404);
        }
        $pelanggan->delete();
        return response()->json([
            'status' => 'ok',
            'message' => 'Data berhasil dihapus'
        ], 200);
    }
}
