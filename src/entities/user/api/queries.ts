import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query'
import type { User, SkillDto } from '../model/types'
import type { AuthStatusResponse, UpdateProfileMetaRequest, RoleTypeDto } from './types'
import type { AxiosError } from 'axios'
import { queryKeys } from './queryKeys'
import { getAuthStatus, getMe, getUserById, updateProfileMeta, getSkills, getRoleTypes } from './requests'
import { placeholderUser } from '../config/constants'

export const useAuthStatus = (enabled = true): UseQueryResult<AuthStatusResponse, AxiosError> => {
  return useQuery({
    queryKey: queryKeys.status,
    queryFn: getAuthStatus,
    retry: false,
    enabled,
    staleTime: Infinity
  })
}

export const useMe = (enabled = true): UseQueryResult<User, AxiosError> => {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: getMe,
    retry: false,
    enabled,
    staleTime: Infinity,
    placeholderData: placeholderUser
  })
}

export const useUserById = (uid: string) => {
  return useQuery({
    queryKey: queryKeys.user(uid),
    queryFn: () => getUserById(uid),
    retry: false,
    enabled: !!uid,
    staleTime: Infinity
  })
}

export const useUpdateProfileMeta = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, UpdateProfileMetaRequest>({
    mutationFn: updateProfileMeta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.me(), exact: true })
    }
  })
}

export const useSkills = (): UseQueryResult<SkillDto[], AxiosError> => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    retry: false,
    staleTime: Infinity
  })
}

export const useRoleTypes = (): UseQueryResult<RoleTypeDto[], AxiosError> => {
  return useQuery({
    queryKey: ['roleTypes'],
    queryFn: getRoleTypes,
    retry: false,
    staleTime: Infinity
  })
}