<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CampaignController extends Controller
{
    /**
     * Display a listing of campaigns.
     */
    public function index(Request $request)
    {
        try {
            $query = Campaign::with('user:id,name,email');
            
            // Only filter by user if authenticated
            if (auth()->check()) {
                $query->where('user_id', auth()->id());
            }

            // Filter by status
            if ($request->has('status') && !empty($request->status)) {
                $statuses = is_array($request->status) ? $request->status : explode(',', $request->status);
                $query->whereIn('status', $statuses);
            }

            // Filter by category
            if ($request->has('category') && !empty($request->category)) {
                $query->where('category', $request->category);
            }

            // Search by name or subject
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('subject', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'updated_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination or all results
            if ($request->has('per_page')) {
                $campaigns = $query->paginate($request->per_page);
            } else {
                $campaigns = $query->get();
            }

            return response()->json([
                'success' => true,
                'data' => $campaigns
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch campaigns',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created campaign.
     */
    public function store(Request $request)
    {
        // Log incoming data for debugging
        \Log::info('Creating campaign with data:', $request->all());

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'emoji' => 'nullable|string|max:10',
            'category' => 'required|in:email,website,social_media,sms,rss,ab_testing',
            'status' => 'nullable|in:draft,scheduled,sending,published,suspended',
            'subject' => 'nullable|string|max:500',
            'preview' => 'nullable|string',
            'content' => 'nullable|string',
            'scheduled_at' => 'nullable|date',
            'total_recipients' => 'nullable|integer|min:0',
            'group_ids' => 'nullable|array',
            'group_ids.*' => 'integer|exists:groups,id',
        ]);

        if ($validator->fails()) {
            \Log::error('Validation failed:', ['errors' => $validator->errors()->toArray()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $campaign = Campaign::create([
                'user_id' => auth()->id(),
                'name' => $request->name,
                'emoji' => $request->emoji ?? '📧',
                'category' => $request->category,
                'status' => $request->status ?? 'draft',
                'subject' => $request->subject,
                'preview' => $request->preview,
                'content' => $request->content,
                'scheduled_at' => $request->scheduled_at,
                'total_recipients' => $request->total_recipients ?? 0,
            ]);

            if ($request->has('group_ids')) {
                $campaign->groups()->attach($request->group_ids);
            }

            return response()->json([
                'success' => true,
                'message' => 'Campaign created successfully',
                'data' => $campaign->load('user:id,name,email')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create campaign',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified campaign.
     */
    public function show($id)
    {
        try {
            $campaign = Campaign::with('user:id,name,email')
                ->where('user_id', auth()->id())
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $campaign
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Campaign not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified campaign.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'emoji' => 'nullable|string|max:10',
            'category' => 'sometimes|required|in:email,website,social_media,sms,rss,ab_testing',
            'status' => 'nullable|in:draft,scheduled,sending,published,suspended',
            'subject' => 'nullable|string|max:500',
            'preview' => 'nullable|string',
            'content' => 'nullable|string',
            'scheduled_at' => 'nullable|date',
            'total_recipients' => 'nullable|integer|min:0',
            'sent_count' => 'nullable|integer|min:0',
            'opened_count' => 'nullable|integer|min:0',
            'clicked_count' => 'nullable|integer|min:0',
            'group_ids' => 'nullable|array',
            'group_ids.*' => 'integer|exists:groups,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $campaign = Campaign::where('user_id', auth()->id())->findOrFail($id);

            // Check if campaign can be edited
            if (!$campaign->canEdit() && $request->has('content')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Campaign cannot be edited in current status'
                ], 403);
            }

            $campaign->update($request->only([
                'name', 'emoji', 'category', 'status', 'subject', 
                'preview', 'content', 'scheduled_at', 'total_recipients',
                'sent_count', 'opened_count', 'clicked_count'
            ]));

            if ($request->has('group_ids')) {
                $campaign->groups()->sync($request->group_ids);
            }

            return response()->json([
                'success' => true,
                'message' => 'Campaign updated successfully',
                'data' => $campaign->load('user:id,name,email')
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update campaign',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified campaign.
     */
    public function destroy($id)
    {
        try {
            $campaign = Campaign::where('user_id', auth()->id())->findOrFail($id);

            if (!$campaign->canDelete()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only draft campaigns can be deleted'
                ], 403);
            }

            $campaign->delete();

            return response()->json([
                'success' => true,
                'message' => 'Campaign deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete campaign',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Schedule a campaign for later sending.
     */
    public function schedule(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'scheduled_at' => 'required|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $campaign = Campaign::where('user_id', auth()->id())->findOrFail($id);

            if (!$campaign->canSchedule()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Campaign cannot be scheduled in current status'
                ], 403);
            }

            $campaign->update([
                'status' => Campaign::STATUS_SCHEDULED,
                'scheduled_at' => $request->scheduled_at
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Campaign scheduled successfully',
                'data' => $campaign
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to schedule campaign',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send a campaign immediately.
     */
    public function send($id)
    {
        try {
            $campaign = Campaign::where('user_id', auth()->id())->findOrFail($id);

            if (!$campaign->canSendNow()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Campaign cannot be sent in current status'
                ], 403);
            }

            // Update status to sending
            $campaign->update([
                'status' => Campaign::STATUS_SENDING,
                'sent_at' => now()
            ]);

            // Dispatch job to send campaign emails
            \App\Jobs\SendCampaignJob::dispatch($campaign);

            return response()->json([
                'success' => true,
                'message' => 'Campaign is being sent',
                'data' => $campaign
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send campaign',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suspend a campaign.
     */
    public function suspend($id)
    {
        try {
            $campaign = Campaign::where('user_id', auth()->id())->findOrFail($id);

            if (!$campaign->canSuspend()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Campaign cannot be suspended in current status'
                ], 403);
            }

            $campaign->update([
                'status' => Campaign::STATUS_SUSPENDED
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Campaign suspended successfully',
                'data' => $campaign
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to suspend campaign',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get campaign statistics.
     */
    public function statistics()
    {
        try {
            $userId = auth()->id();

            $stats = [
                'total' => Campaign::where('user_id', $userId)->count(),
                'draft' => Campaign::where('user_id', $userId)->where('status', Campaign::STATUS_DRAFT)->count(),
                'scheduled' => Campaign::where('user_id', $userId)->where('status', Campaign::STATUS_SCHEDULED)->count(),
                'sending' => Campaign::where('user_id', $userId)->where('status', Campaign::STATUS_SENDING)->count(),
                'published' => Campaign::where('user_id', $userId)->where('status', Campaign::STATUS_PUBLISHED)->count(),
                'suspended' => Campaign::where('user_id', $userId)->where('status', Campaign::STATUS_SUSPENDED)->count(),
                'by_category' => [
                    'email' => Campaign::where('user_id', $userId)->where('category', Campaign::CATEGORY_EMAIL)->count(),
                    'website' => Campaign::where('user_id', $userId)->where('category', Campaign::CATEGORY_WEBSITE)->count(),
                    'social_media' => Campaign::where('user_id', $userId)->where('category', Campaign::CATEGORY_SOCIAL_MEDIA)->count(),
                    'sms' => Campaign::where('user_id', $userId)->where('category', Campaign::CATEGORY_SMS)->count(),
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Track email open.
     */
    public function trackOpen($campaignId, $contactId)
    {
        try {
            $campaign = Campaign::findOrFail($campaignId);
            $campaign->increment('opened_count');

            // Return a 1x1 transparent pixel
            $pixel = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
            return response($pixel)->header('Content-Type', 'image/png');
        } catch (\Exception $e) {
            // Log error but don't fail
            \Log::error('Track open failed: ' . $e->getMessage());
            $pixel = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
            return response($pixel)->header('Content-Type', 'image/png');
        }
    }

    /**
     * Track email click.
     */
    public function trackClick($campaignId, $contactId, Request $request)
    {
        try {
            $campaign = Campaign::findOrFail($campaignId);
            $campaign->increment('clicked_count');

            $url = $request->get('url');
            if ($url) {
                return redirect($url);
            }

            return response()->json(['message' => 'Click tracked']);
        } catch (\Exception $e) {
            \Log::error('Track click failed: ' . $e->getMessage());
            return redirect('/');
        }
    }
}
