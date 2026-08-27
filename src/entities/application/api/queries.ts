import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { applicationApi } from './requests';
import type { GetApplicationsQueryParams, CreateApplicationRequest, ProjectRoleApplicationStatus } from '../model/types';
import { applicationKeys } from './queryKeys';

export const useApplications = (params: GetApplicationsQueryParams) => {
  return useQuery({
    queryKey: applicationKeys.list(params),
    queryFn: () => applicationApi.getApplications(params),
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newApplication: CreateApplicationRequest) => applicationApi.createApplication(newApplication),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: ProjectRoleApplicationStatus }) => 
      applicationApi.updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
    },
  });
};
