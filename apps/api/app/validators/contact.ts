import vine from '@vinejs/vine'
import { MESSAGE_STATUSES } from '@bunn/shared'

export const publicContactValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(120),
    email: vine.string().trim().email().normalizeEmail().maxLength(254),
    subject: vine.string().trim().maxLength(200).nullable().optional(),
    body: vine.string().trim().maxLength(5000),
    website: vine.string().trim().optional(),
  })
)

export const updateMessageStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(MESSAGE_STATUSES),
  })
)
