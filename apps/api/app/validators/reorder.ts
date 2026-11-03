import vine from '@vinejs/vine'

export const reorderValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.number().positive()),
  })
)
