import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { ApiErrorCode } from '@bunn/shared'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected debug = !app.inProduction

  async handle(error: unknown, ctx: HttpContext) {
    const err = error as Record<string, unknown> & {
      message?: string
      status?: number
      code?: string
      messages?: unknown
    }

    const httpStatus = typeof err.status === 'number' ? err.status : 500
    const apiCode = this.mapToApiCode(httpStatus, err.code)
    const message = this.resolveMessage(apiCode, err.message)
    const details = this.resolveDetails(err)

    ctx.response.status(httpStatus).send({
      error: {
        code: apiCode,
        message,
        ...(details.length > 0 ? { details } : {}),
      },
    })
  }

  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }

  private mapToApiCode(status: number, code?: string): ApiErrorCode {
    if (code === 'E_VALIDATION_ERROR') return 'VALIDATION_ERROR'
    if (code === 'E_UNAUTHORIZED_ACCESS') return 'UNAUTHENTICATED'
    if (code === 'E_ROW_NOT_FOUND' || code === 'E_ROUTE_NOT_FOUND') return 'NOT_FOUND'
    if (code === 'E_REQUEST_ENTITY_TOO_LARGE') return 'PAYLOAD_TOO_LARGE'
    if (code === 'E_TOO_MANY_REQUESTS') return 'RATE_LIMITED'

    switch (status) {
      case 401:
        return 'UNAUTHENTICATED'
      case 403:
        return 'FORBIDDEN'
      case 404:
        return 'NOT_FOUND'
      case 409:
        return 'CONFLICT'
      case 413:
        return 'PAYLOAD_TOO_LARGE'
      case 422:
        return 'VALIDATION_ERROR'
      case 429:
        return 'RATE_LIMITED'
      default:
        return 'INTERNAL'
    }
  }

  private resolveMessage(code: ApiErrorCode, original?: string): string {
    if (original && code !== 'INTERNAL') return original

    const defaultMessages: Record<ApiErrorCode, string> = {
      VALIDATION_ERROR: 'Data yang dikirim tidak valid.',
      UNAUTHENTICATED: 'Silakan login terlebih dahulu.',
      FORBIDDEN: 'Anda tidak memiliki izin untuk tindakan ini.',
      NOT_FOUND: 'Sumber daya tidak ditemukan.',
      CONFLICT: 'Data berkonflik dengan data yang sudah ada.',
      PAYLOAD_TOO_LARGE: 'Ukuran berkas terlalu besar.',
      RATE_LIMITED: 'Terlalu banyak permintaan. Coba lagi nanti.',
      INTERNAL: 'Terjadi kesalahan pada server.',
    }

    return defaultMessages[code]
  }

  private resolveDetails(err: Record<string, unknown>): Array<{ field: string; message: string }> {
    // VineJS validation errors
    if (err.code === 'E_VALIDATION_ERROR' && Array.isArray(err.messages)) {
      return (err.messages as Array<{ field: string; message: string }>).map((m) => ({
        field: m.field,
        message: m.message,
      }))
    }
    return []
  }
}
