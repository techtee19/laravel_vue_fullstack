<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Trainee;
use App\Models\TrainingCenter;

class TrainingCenterController extends Controller
{

    public function index()
    {
        try {
            $trainees = Trainee::with('training_center')->latest()->paginate(10);
            return response()->json($trainees, 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $trainee = Trainee::with('training_center')->findOrFail($id);

            return response()->json(['success' => true, 'data' => $trainee], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 404);
        }
    }


    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'skill' => 'required|integer|min:0|max:100',
                'bio' => 'required|string|min:20|max:100',
                'training_center_id' => 'required|exists:training_centers,id',
            ]);

            $trainee = Trainee::create($validatedData);
            return response()->json(['success' => true, 'data' => $trainee], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'skill' => 'required|integer|min:0|max:100',
                'bio' => 'required|string',
                'training_center_id' => 'required|exists:training_centers,id',
            ]);

            $trainee = Trainee::findOrFail($id);

            $trainee->update($validatedData);

            return response()->json(['success' => true, 'message' => 'Trainee updated successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update trainee: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $trainee = Trainee::findOrFail($id);

            $trainee->delete();
            return response()->json(['success' => true, 'message' => 'Trainee deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete trainee: ' . $e->getMessage()
            ], 500);
        }
    }
    public function listTrainingCenters()
    {
        return TrainingCenter::all();
    }
}
