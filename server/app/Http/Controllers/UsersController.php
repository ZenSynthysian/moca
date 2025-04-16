<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\UserEditRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    public function showAll()
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return response()->json([
                'status'  => 'error',
                'message' => 'No users found'
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'data'   => $users
        ], 200);
    }

    public function showOne(Request $request)
    {
        $name = $request->input('name');
        $user = User::where('name', 'LIKE', '%' . $name . '%')->get();

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'status' => 'ok',
            'data'   => $user
        ], 200);
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status' => 'ok',
            'data' => $user
        ]);
    }

    public function edit(UserEditRequest $request)
    {
        $validated = $request->validated();

        $user = $request->user();
        $user->name = $validated['name'] ?? $user->name;
        $user->email = $validated['email'] ?? $user->email;
        $user->password = Hash::make($validated['password'] ?? $user->password);
        $user->role = $validated['role'] ?? $user->role;
        $user->save();
        return response()->json([
            'status' => 'ok',
            'message' => $user
        ]);
    }

    public function editUser(Request $request)
    {
        // Cari user berdasarkan id yang dikirim lewat parameter
        $id = $request->input('id');
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User not found'
            ], 404);
        }

        // Validasi input yang diterima
        // Jika diperlukan, Anda juga dapat membuat Form Request tersendiri (misalnya: AdminUserEditRequest) untuk validasi
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            // Pastikan email unik kecuali untuk user yang sama
            'email'    => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role'     => 'required|string'
        ]);

        // Update field user dengan data yang valid
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        // Hanya ubah password jika nilai password diisi
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'status' => 'ok',
            'data'   => $user
        ], 200);
    }


    public function delete(Request $request)
    {
        $id = $request->input('id');
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User not found'
            ], 404);
        }
        $user->delete();
        return response()->json([
            'status' => 'ok',
            'message' => 'User deleted successfully'
        ]);
    }
}
