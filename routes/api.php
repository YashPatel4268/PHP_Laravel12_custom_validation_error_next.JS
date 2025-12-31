<?php

use App\Http\Controllers\Api\UserController;

Route::post('/register', [UserController::class, 'store']);
