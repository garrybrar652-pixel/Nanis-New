<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    /**
     * Get all groups with contact counts.
     */
    public function index()
    {
        $groups = Group::where('user_id', auth()->id())
            ->withCount('contacts')
            ->orderBy('name')
            ->get();

        return response()->json($groups);
    }

    /**
     * Get a single group by ID.
     */
    public function show($id)
    {
        $group = Group::where('user_id', auth()->id())
            ->withCount('contacts')
            ->find($id);

        if (!$group) {
            return response()->json(['error' => 'Group not found'], 404);
        }

        return response()->json($group);
    }

    /**
     * Get all contacts in a group.
     */
    public function contacts($id)
    {
        $group = Group::where('user_id', auth()->id())->find($id);

        if (!$group) {
            return response()->json(['error' => 'Group not found'], 404);
        }

        $contacts = $group->contacts()->orderBy('created_at', 'desc')->get();

        return response()->json([
            'group' => $group,
            'contacts' => $contacts,
        ]);
    }
}
