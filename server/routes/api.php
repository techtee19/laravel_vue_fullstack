<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrainingCenterController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('trainees', TrainingCenterController::class);

Route::get('/training-centers', [TrainingCenterController::class, 'listTrainingCenters']);


// http://localhost:8000/api/trainees
