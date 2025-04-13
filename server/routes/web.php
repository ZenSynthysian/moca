<?php

use Illuminate\Support\Facades\Route;

Route::fallback(fn() => response()->json(['message' => 'API endpoint not found.'], 404));
