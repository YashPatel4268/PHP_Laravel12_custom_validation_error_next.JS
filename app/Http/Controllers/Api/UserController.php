<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User; // Import User model
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'min:8', // minimum 8 characters

                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&]).+$/'// Regex ensures at least 1 lowercase, 1 uppercase, and 1 special character

            ]
        ], [
            'name.required' => 'Name is required',
            'name.min' => 'Name must be at least 3 characters',
            'email.required' => 'Email is required',
            'email.email' => "Please include an '@' in the email address. '{$request->email}' is missing an '@'.",
            'email.unique' => 'Email already exists',
            'password.required' => 'Password is required',
            'password.regex' => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Save user to database
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash password
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Form submitted successfully',
            'data' => $user
        ]);
    }
}
