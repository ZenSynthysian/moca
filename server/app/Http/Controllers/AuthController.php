<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function store(RegisterRequest $request)
    {
        $validated = $request->validated();

        $adminExists = User::where('role', 'admin')->exists();

        // Jika admin sudah ada, hanya admin yang boleh mendaftarkan user baru
        if ($adminExists) {
            $authUser = $request->user();

            if (!$authUser || $authUser->role !== 'admin') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Hanya admin yang dapat mendaftarkan pengguna baru',
                ], 403);
            }

            // Karena ini dibuat oleh admin, gunakan role dari input
            $role = $validated['role'];
        }

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $role,
        ]);

        return response()->json([
            'status'  => 'ok',
            'message' => 'User created successfully',
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $validated = $request->validated();

        // Mencari user berdasarkan email
        $user = User::where('email', $validated['email'])->first();

        // Cek apakah user ada dan password cocok
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid email or password',
            ], 401); // Unauthorized
        }

        // Jika valid, buat token untuk user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'ok',
            'message' => 'Login success',
            'token' => $token,
        ], 200); // OK
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
    }
}
