import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Employee, Employer, Business } from '../backend';

// User Profile Hooks
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check Hook
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// Employee Hooks
export function useGetAllEmployees() {
  const { actor, isFetching } = useActor();

  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmployees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveEmployee(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useRejectEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectEmployee(id, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

// Employer Hooks
export function useGetAllEmployers() {
  const { actor, isFetching } = useActor();

  return useQuery<Employer[]>({
    queryKey: ['employers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmployers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveEmployer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveEmployer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] });
    },
  });
}

export function useRejectEmployer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectEmployer(id, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employers'] });
    },
  });
}

// Business Hooks
export function useGetAllBusinesses() {
  const { actor, isFetching } = useActor();

  return useQuery<Business[]>({
    queryKey: ['businesses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBusinesses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveBusiness() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveBusiness(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}

export function useRejectBusiness() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectBusiness(id, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
}
