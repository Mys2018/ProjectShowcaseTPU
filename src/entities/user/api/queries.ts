import { useQuery, useMutation, useQueryClient, type UseQueryResult } from '@tanstack/react-query'
import type { User } from '../model/types'
import type { AuthStatusResponse, UpdateProfileMetaRequest } from './types'
import type { AxiosError } from 'axios'
import { queryKeys } from './queryKeys'
import { getAuthStatus, getMe, getUserById, getUsers, updateProfileMeta } from './requests'

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
    // Infinity замораживал бы «меня» до F5: правки профиля из другой вкладки
    // или смена аватки в ЛК никогда бы не подхватились.
    staleTime: 5 * 60 * 1000,
  })
}

export const useUserById = (uid?: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.user(uid ?? 0),
    queryFn: () => getUserById(uid!),
    retry: false,
    enabled: !!uid && enabled,
    // Иначе чужой/свой профиль, открытый однажды, не обновлялся всю сессию.
    staleTime: 5 * 60 * 1000
  })
}

export const useSearchUsers = (
  query: string,
  options?: { enabled?: boolean; limit?: number; offset?: number }
) => {
  const trimmed = query.trim()
  const enabled = options?.enabled ?? Boolean(trimmed)

  return useQuery({
    queryKey: queryKeys.search(trimmed, options?.offset ?? 0, options?.limit ?? 20),
    queryFn: () => getUsers({ query: trimmed, limit: options?.limit ?? 20, offset: options?.offset ?? 0 }),
    enabled,
    staleTime: 1000 * 60 * 2,
  })
}

export const useUpdateProfileMeta = () => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, UpdateProfileMetaRequest>({
    mutationFn: updateProfileMeta,
    onSuccess: () => {
      // exact: true оставлял кэш user(id) (свой публичный профиль, карточки
      // куратора) со старыми данными до конца сессии. Подметаем весь
      // by-id кэш вместе с me().
      queryClient.invalidateQueries({ queryKey: queryKeys.me() })
      queryClient.invalidateQueries({ queryKey: [...queryKeys.all, 'user'] })
    }
  })
}