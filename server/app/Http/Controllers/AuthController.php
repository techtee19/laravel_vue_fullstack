<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Trainee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'training_center_id' => 'required|exists:training_centers,id',
            'skill' => 'required|integer',
            'bio' => 'required|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $trainee = Trainee::create([
            'name' => $validated['name'],
            'skill' => $validated['skill'],
            'bio' => $validated['bio'],
            'training_center_id' => $validated['training_center_id'],
            'user_id' => $user->id,
        ]);

        // Don't create token on registration - require separate login
        return response()->json([
            'success' => true,
            'message' => 'Registration successful! Please log in to continue.',
            'user' => [
                'name' => $user->name,
                'email' => $user->email
            ],
            'trainee' => $trainee,
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $trainee = $user->trainee;

        return response()->json([
            'user' => $user,
            'trainee' => $trainee,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }
} 