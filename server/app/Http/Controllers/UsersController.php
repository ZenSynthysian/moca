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
        $id = $request->input('id');
        $user = User::find($id);

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
            'message' => 'User updated successfully'
        ]);
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
