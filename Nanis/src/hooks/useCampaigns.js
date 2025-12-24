import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import campaignService from '../services/api/campaign.service';

/**
 * Query key factory for campaigns
 */
export const campaignKeys = {
  all: ['campaigns'],
  lists: () => [...campaignKeys.all, 'list'],
  list: (filters) => [...campaignKeys.lists(), filters],
  details: () => [...campaignKeys.all, 'detail'],
  detail: (id) => [...campaignKeys.details(), id],
  statistics: () => [...campaignKeys.all, 'statistics'],
};

/**
 * Hook to fetch all campaigns with optional filters
 * @param {Object} params - { status?, category?, search?, sort_by?, sort_order? }
 * @param {Object} options - React Query options
 */
export const useCampaigns = (params = {}, options = {}) => {
  return useQuery({
    queryKey: campaignKeys.list(params),
    queryFn: () => campaignService.getCampaigns(params),
    staleTime: 30000, // 30 seconds
    ...options,
  });
};

/**
 * Hook to fetch a single campaign by ID
 * @param {number} id - Campaign ID
 * @param {Object} options - React Query options
 */
export const useCampaign = (id, options = {}) => {
  return useQuery({
    queryKey: campaignKeys.detail(id),
    queryFn: () => campaignService.getCampaign(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    ...options,
  });
};

/**
 * Hook to fetch campaign statistics
 * @param {Object} options - React Query options
 */
export const useCampaignStatistics = (options = {}) => {
  return useQuery({
    queryKey: campaignKeys.statistics(),
    queryFn: () => campaignService.getStatistics(),
    staleTime: 60000, // 1 minute
    ...options,
  });
};

/**
 * Hook to create a new campaign
 */
export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignData) => campaignService.createCampaign(campaignData),
    onSuccess: () => {
      // Invalidate and refetch campaigns list
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.statistics() });
    },
  });
};

/**
 * Hook to update an existing campaign
 */
export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...campaignData }) => 
      campaignService.updateCampaign(id, campaignData),
    onMutate: async ({ id, ...newData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: campaignKeys.detail(id) });

      // Snapshot previous value
      const previousCampaign = queryClient.getQueryData(campaignKeys.detail(id));

      // Optimistically update
      if (previousCampaign) {
        queryClient.setQueryData(campaignKeys.detail(id), {
          ...previousCampaign,
          data: { ...previousCampaign.data, ...newData },
        });
      }

      return { previousCampaign };
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousCampaign) {
        queryClient.setQueryData(campaignKeys.detail(id), context.previousCampaign);
      }
    },
    onSettled: (data, error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.statistics() });
    },
  });
};

/**
 * Hook to delete a campaign
 */
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => campaignService.deleteCampaign(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: campaignKeys.lists() });

      // Snapshot previous value
      const previousCampaigns = queryClient.getQueriesData({ 
        queryKey: campaignKeys.lists() 
      });

      // Optimistically update - remove from all lists
      queryClient.setQueriesData({ queryKey: campaignKeys.lists() }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: Array.isArray(old.data) 
            ? old.data.filter(campaign => campaign.id !== id)
            : old.data,
        };
      });

      return { previousCampaigns };
    },
    onError: (err, id, context) => {
      // Rollback on error
      if (context?.previousCampaigns) {
        context.previousCampaigns.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.statistics() });
    },
  });
};

/**
 * Hook to schedule a campaign
 */
export const useScheduleCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, scheduledAt }) => 
      campaignService.scheduleCampaign(id, scheduledAt),
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.statistics() });
    },
  });
};

/**
 * Hook to send a campaign immediately
 */
export const useSendCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => campaignService.sendCampaign(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.statistics() });
    },
  });
};

/**
 * Hook to suspend a campaign
 */
export const useSuspendCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => campaignService.suspendCampaign(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() });
      queryClient.invalidateQueries({ queryKey: campaignKeys.statistics() });
    },
  });
};
