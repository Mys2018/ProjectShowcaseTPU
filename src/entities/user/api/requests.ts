import type {
  AuthStatusResponse,
  GetUsersRequest,
  GetUsersResponse,
  OAuthExchangeParams,
  UpdateProfileMetaRequest
} from './types'
import type { User, UserDto } from '../model/types'
import { mapUserDto } from '../lib/mappers'
import { api, ENDPOINTS } from '@/shared'

export async function login(params: OAuthExchangeParams): Promise<void> {
  await api.post(ENDPOINTS.LOGIN, params)
}

export async function getAuthStatus(): Promise<AuthStatusResponse> {
  const { data } = await api.get<AuthStatusResponse>(ENDPOINTS.STATUS)
  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<UserDto>(ENDPOINTS.ME)
  return mapUserDto(data)
}

export async function logout(): Promise<void> {
  await api.post(ENDPOINTS.LOGOUT)
}

// TODO Undefined
export async function getUserById(uid: number): Promise<User> {
  const { data } = await api.get<UserDto>(`/users/${uid}`)
  return mapUserDto(data)
}

export async function getUsers(params?: GetUsersRequest): Promise<{ users: User[]; total: number }> {
  const { data } = await api.get<GetUsersResponse>(ENDPOINTS.USERS, {
    params: {
      query: params?.query,
      limit: params?.limit ?? 20,
      offset: params?.offset ?? 0
    }
  })

  const rawUsers = data?.users ?? []
  const total = data?.total ?? rawUsers.length

  // N+1-обогащение: один удалённый между листингом и enrich'ем пользователь
  // не должен ронять весь поиск — раньше Promise.all превращал 19 найденных
  // людей в «Пользователей с таким именем не найдено».
  const enrichedUsers = await Promise.allSettled(
    rawUsers.map((u) => getUserById(u.userId))
  )

  return {
    users: enrichedUsers.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : [])),
    total
  }
}

export async function updateProfileMeta(payload: UpdateProfileMetaRequest): Promise<void> {
  await api.patch(ENDPOINTS.ME, payload)
}