<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Get all contacts (paginated).
     */
    public function index(Request $request)
    {
        $query = Contact::where('user_id', auth()->id())->with('group');

        // Filter by group
        if ($request->has('group_id') && $request->group_id) {
            $query->where('group_id', $request->group_id);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        // Filter by subscription status
        if ($request->has('subscribed')) {
            $query->where('is_subscribed', $request->subscribed == 'true');
        }

        $contacts = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 15);

        return response()->json($contacts);
    }

    /**
     * Get a single contact by ID.
     */
    public function show($id)
    {
        $contact = Contact::where('user_id', auth()->id())
            ->with('group')
            ->find($id);

        if (!$contact) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        return response()->json($contact);
    }

    /**
     * Get contact by email (public endpoint for frontend forms).
     */
    public function getByEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contact = Contact::with('group')->where('email', $request->email)->first();

        if (!$contact) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        return response()->json($contact);
    }

    /**
     * Create a new contact (public endpoint for frontend forms).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:contacts,email',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'group_id' => 'nullable|exists:groups,id',
            'is_subscribed' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $data['user_id'] = auth()->id();
        $contact = Contact::create($data);

        return response()->json([
            'message' => 'Contact created successfully',
            'contact' => $contact->load('group'),
        ], 201);
    }

    /**
     * Update an existing contact (public endpoint).
     */
    public function update(Request $request, $id)
    {
        $contact = Contact::where('user_id', auth()->id())->find($id);

        if (!$contact) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:contacts,email,' . $contact->id,
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'group_id' => 'nullable|exists:groups,id',
            'is_subscribed' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contact->update($request->all());

        return response()->json([
            'message' => 'Contact updated successfully',
            'contact' => $contact->load('group'),
        ]);
    }

    /**
     * Update contact by email (public endpoint for subscription updates).
     */
    public function updateByEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip_code' => 'nullable|string|max:20',
            'group_id' => 'nullable|exists:groups,id',
            'is_subscribed' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contact = Contact::where('email', $request->email)->first();

        if (!$contact) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        $contact->update($request->except('email'));

        return response()->json([
            'message' => 'Contact updated successfully',
            'contact' => $contact->load('group'),
        ]);
    }

    /**
     * Subscribe/Unsubscribe contact by email.
     */
    public function toggleSubscription(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'is_subscribed' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contact = Contact::where('email', $request->email)->first();

        if (!$contact) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        $contact->update(['is_subscribed' => $request->is_subscribed]);

        return response()->json([
            'message' => $request->is_subscribed ? 'Subscribed successfully' : 'Unsubscribed successfully',
            'contact' => $contact,
        ]);
    }

    /**
     * Delete contact (soft delete).
     */
    public function destroy($id)
    {
        $contact = Contact::where('user_id', auth()->id())->find($id);

        if (!$contact) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        $contact->delete();

        return response()->json(['message' => 'Contact deleted successfully']);
    }

    /**
     * Delete contact by email.
     */
    public function destroyByEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contact = Contact::where('email', $request->email)->first();

        if (!$contact) {
            return response()->json(['error' => 'Contact not found'], 404);
        }

        $contact->delete();

        return response()->json(['message' => 'Contact deleted successfully']);
    }
}
