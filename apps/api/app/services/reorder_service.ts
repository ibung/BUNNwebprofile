import db from '@adonisjs/lucid/services/db'

export class ReorderService {
  /**
   * Mengurutkan ulang baris-baris dalam suatu tabel secara transaksional.
   * Mensyaratkan seluruh ID yang ada di tabel/cakupan disertakan dalam array `ids`.
   * Jika ada ID yang hilang atau ID asing, fungsi akan melemparkan galat 422.
   */
  static async reorder(
    tableName: string,
    ids: number[],
    scopeCondition?: (query: any) => void
  ): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) {
      const error: any = new Error('Daftar ID untuk pengurutan ulang tidak boleh kosong.')
      error.status = 422
      error.code = 'E_VALIDATION_ERROR'
      error.messages = [{ field: 'ids', message: 'Daftar ID tidak boleh kosong.' }]
      throw error
    }

    const query = db.from(tableName)
    if (scopeCondition) {
      scopeCondition(query)
    }

    const currentRows = await query.select('id')
    const currentIdSet = new Set(currentRows.map((r: any) => Number(r.id)))

    // Validasi: jumlah ID harus sama dan seluruh ID harus cocok
    const hasSameLength = ids.length === currentIdSet.size
    const allMatch = hasSameLength && ids.every((id) => currentIdSet.has(Number(id)))

    if (!allMatch) {
      const error: any = new Error(
        'Seluruh ID yang ada dalam cakupan harus disertakan secara lengkap untuk pengurutan ulang.'
      )
      error.status = 422
      error.code = 'E_VALIDATION_ERROR'
      error.messages = [
        {
          field: 'ids',
          message: 'Seluruh ID dalam cakupan harus disertakan tanpa duplikasi atau ID asing.',
        },
      ]
      throw error
    }

    // Eksekusi pembaruan sort_order secara transaksional
    await db.transaction(async (trx) => {
      for (const [index, id] of ids.entries()) {
        await trx.from(tableName).where('id', id).update({ sort_order: index })
      }
    })
  }
}
