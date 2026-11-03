import vine from '@vinejs/vine'

export const publicProjectsQueryValidator = vine.compile(
  vine.object({
    page: vine.number().positive().optional(),
    perPage: vine.number().range([1, 50]).optional(),
    featured: vine.enum(['true', 'false']).optional(),
    skill: vine.string().trim().maxLength(100).optional(),
  })
)
