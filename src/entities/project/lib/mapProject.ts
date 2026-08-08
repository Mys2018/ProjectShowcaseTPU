import type {ProjectDto, ProjectCardData} from '../model/types';

export const mapProjectDtoToEntity = (dto: ProjectDto): ProjectCardData => {

  return {
    id: dto.id,
    type: dto.type || 'Case',

    tags: dto.tags ?? [],
    primaryTag: dto.primaryTag,

    ownerId: dto.ownerId,
    partnerId: dto.partnerId,
    status: dto.status,
    meta: {
      title: dto.meta?.title || '',
      description: dto.meta?.description || '',
    },
    
    checkpoints: dto.checkpoints?.checkpoints || [],

    roles: (dto.roles || []).map((r) => ({
      roleId: r.roleId,
      placesCount: r.placesCount,
      minPlacesCount: r.minPlacesCount,
      places: r.places?.length || 0,
      meta: {
        name: r.roleType?.name || 'Без названия',
        description: r.meta?.description || '',
      },
      skills: (r.skills || []).map((s) => ({
        skillId: s.skillId,
        skillName: s.skillName,
      })),
    })),

    prdMeta: dto.prdMeta,
    
    extended: dto.tags?.some(t => t.tagId === 'ml' || t.tagId === 'fintech'), 
    brandColor: dto.id === '8201' ? '28be46' : undefined,
  };
};