<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Contact::where('user_id', auth()->id())->with('group');

        // Filter by group if provided
        if ($request->has('group_id') && $request->group_id) {
            $query->where('group_id', $request->group_id);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        $contacts = $query->orderBy('created_at', 'desc')->paginate(20);
        $groups = Group::where('user_id', auth()->id())->orderBy('name')->get();

        return view('admin.contacts.index', compact('contacts', 'groups'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $groups = Group::where('user_id', auth()->id())->orderBy('name')->get();
        return view('admin.contacts.create', compact('groups'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:contacts',
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
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = $request->all();
        $data['user_id'] = auth()->id();
        Contact::create($data);

        return redirect()->route('admin.contacts.index')
            ->with('success', 'Contact created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        $contact->load('group');
        return view('admin.contacts.show', compact('contact'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        $groups = Group::where('user_id', auth()->id())->orderBy('name')->get();
        return view('admin.contacts.edit', compact('contact', 'groups'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:contacts,email,' . $contact->id,
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
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $contact->update($request->all());

        return redirect()->route('admin.contacts.index')
            ->with('success', 'Contact updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('admin.contacts.index')
            ->with('success', 'Contact deleted successfully.');
    }

    /**
     * Bulk delete contacts.
     */
    public function bulkDestroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contact_ids' => 'required|array',
            'contact_ids.*' => 'exists:contacts,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        Contact::whereIn('id', $request->contact_ids)->delete();

        return response()->json(['success' => 'Contacts deleted successfully.']);
    }

    /**
     * Add contacts to a group.
     */
    public function addToGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'contact_ids' => 'required|array',
            'contact_ids.*' => 'exists:contacts,id',
            'group_id' => 'required|exists:groups,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        Contact::whereIn('id', $request->contact_ids)
            ->update(['group_id' => $request->group_id]);

        return response()->json(['success' => 'Contacts added to group successfully.']);
    }

    /**
     * Import contacts from CSV.
     */
    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv,txt|max:10240',
            'group_id' => 'nullable|exists:groups,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $file = $request->file('file');
        $handle = fopen($file->getRealPath(), 'r');
        
        // Skip header row
        $header = fgetcsv($handle);
        
        $imported = 0;
        $skipped = 0;
        
        while (($data = fgetcsv($handle)) !== false) {
            try {
                Contact::create([
                    'user_id' => auth()->id(),
                    'first_name' => $data[0] ?? '',
                    'last_name' => $data[1] ?? '',
                    'email' => $data[2] ?? '',
                    'phone' => $data[3] ?? null,
                    'company' => $data[4] ?? null,
                    'country' => $data[5] ?? null,
                    'city' => $data[6] ?? null,
                    'state' => $data[7] ?? null,
                    'zip_code' => $data[8] ?? null,
                    'group_id' => $request->group_id,
                ]);
                $imported++;
            } catch (\Exception $e) {
                $skipped++;
            }
        }
        
        fclose($handle);

        return redirect()->route('admin.contacts.index')
            ->with('success', "Imported {$imported} contacts. Skipped {$skipped} contacts.");
    }

    /**
     * Export contacts to CSV.
     */
    public function export(Request $request)
    {
        $query = Contact::where('user_id', auth()->id())->with('group');

        if ($request->has('group_id') && $request->group_id) {
            $query->where('group_id', $request->group_id);
        }

        $contacts = $query->get();

        $filename = 'contacts_' . date('Y-m-d_H-i-s') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}",
        ];

        $callback = function () use ($contacts) {
            $file = fopen('php://output', 'w');
            
            // Header row
            fputcsv($file, [
                'First Name',
                'Last Name',
                'Email',
                'Phone',
                'Company',
                'Country',
                'City',
                'State',
                'Zip Code',
                'Group',
                'Subscribed',
            ]);

            // Data rows
            foreach ($contacts as $contact) {
                fputcsv($file, [
                    $contact->first_name,
                    $contact->last_name,
                    $contact->email,
                    $contact->phone,
                    $contact->company,
                    $contact->country,
                    $contact->city,
                    $contact->state,
                    $contact->zip_code,
                    $contact->group ? $contact->group->name : '',
                    $contact->is_subscribed ? 'Yes' : 'No',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
