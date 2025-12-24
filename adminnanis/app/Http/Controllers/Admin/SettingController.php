<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Setting::orderBy('group')->orderBy('key');

        // Filter by group if specified
        if ($request->has('group') && $request->group !== 'all') {
            $query->where('group', $request->group);
        }

        $settings = $query->get()->groupBy('group');
        $selectedGroup = $request->get('group', 'all');

        return view('admin.settings.index', compact('settings', 'selectedGroup'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.settings.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:255|unique:settings',
            'value' => 'nullable|string',
            'type' => 'required|in:string,integer,boolean,json,file',
            'description' => 'nullable|string|max:500',
            'group' => 'required|string|max:255',
            'is_public' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Process the value based on type
        $value = $this->processValue($request->value, $request->type);

        Setting::create([
            'key' => $request->key,
            'value' => $value,
            'type' => $request->type,
            'description' => $request->description,
            'group' => $request->group,
            'is_public' => $request->has('is_public'),
        ]);

        return redirect()->route('admin.settings.index')
            ->with('success', 'Setting created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Setting $setting)
    {
        return view('admin.settings.show', compact('setting'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Setting $setting)
    {
        return view('admin.settings.edit', compact('setting'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Setting $setting)
    {
        $validator = Validator::make($request->all(), [
            'key' => 'required|string|max:255|unique:settings,key,' . $setting->id,
            'value' => 'nullable|string',
            'type' => 'required|in:string,integer,boolean,json,file',
            'description' => 'nullable|string|max:500',
            'group' => 'required|string|max:255',
            'is_public' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Process the value based on type
        $value = $this->processValue($request->value, $request->type);

        $setting->update([
            'key' => $request->key,
            'value' => $value,
            'type' => $request->type,
            'description' => $request->description,
            'group' => $request->group,
            'is_public' => $request->has('is_public'),
        ]);

        return redirect()->route('admin.settings.index')
            ->with('success', 'Setting updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setting $setting)
    {
        $setting->delete();

        return redirect()->route('admin.settings.index')
            ->with('success', 'Setting deleted successfully.');
    }

    /**
     * Process the value based on its type
     */
    private function processValue($value, $type)
    {
        switch ($type) {
            case 'integer':
                return (int) $value;
            case 'boolean':
                return filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
            case 'json':
                // Validate JSON
                json_decode($value);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new \InvalidArgumentException('Invalid JSON value');
                }
                return $value;
            case 'string':
            default:
                return $value;
        }
    }
}