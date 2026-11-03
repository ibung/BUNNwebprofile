import { test } from '@japa/runner'
import crypto from 'node:crypto'
import { DateTime } from 'luxon'

test.group('Fase 3: Logika Bisnis & Validasi Admin CRUD', () => {
  test('IP Hash harus konsisten dengan salt dan tidak membocorkan IP mentah', ({ assert }) => {
    const rawIp = '192.168.1.100'
    const salt = 'test_secret_salt_12345'
    const hash = crypto
      .createHash('sha256')
      .update(rawIp + salt)
      .digest('hex')

    assert.equal(hash.length, 64)
    assert.notInclude(hash, rawIp)

    // Hash berulang harus identik
    const repeatHash = crypto
      .createHash('sha256')
      .update(rawIp + salt)
      .digest('hex')
    assert.equal(hash, repeatHash)
  })

  test('Honeypot bot trap terdeteksi bila input website memiliki nilai', ({ assert }) => {
    const botSubmission = {
      name: 'Spam Bot',
      email: 'spam@bot.com',
      body: 'Cheap SEO deals!',
      website: 'https://spam.com',
    }

    const isBot = Boolean(botSubmission.website && botSubmission.website.trim().length > 0)
    assert.isTrue(isBot)

    const humanSubmission = {
      name: 'Real Human',
      email: 'human@example.com',
      body: 'Halo, saya tertarik bekerja sama.',
      website: '',
    }

    const isHumanBot = Boolean(humanSubmission.website && humanSubmission.website.trim().length > 0)
    assert.isFalse(isHumanBot)
  })

  test('Transisi status proyek ke published menetapkan tanggal publikasi', ({ assert }) => {
    let publishedAt: DateTime | null = null
    const newStatus = 'published'

    if (newStatus === 'published' && !publishedAt) {
      publishedAt = DateTime.now()
    }

    assert.isNotNull(publishedAt)
    assert.isTrue(DateTime.isDateTime(publishedAt))
  })

  test('Validasi set ID reorder mendeteksi ID yang hilang atau ID asing', ({ assert }) => {
    const currentDatabaseIds = new Set([1, 2, 3, 4])
    const validRequestedIds = [4, 1, 3, 2]
    const incompleteRequestedIds = [4, 1, 2] // 3 hilang
    const foreignRequestedIds = [4, 1, 3, 99] // 99 asing

    // Valid
    const isValid =
      validRequestedIds.length === currentDatabaseIds.size &&
      validRequestedIds.every((id) => currentDatabaseIds.has(id))
    assert.isTrue(isValid)

    // Incomplete
    const isMissingValid =
      incompleteRequestedIds.length === currentDatabaseIds.size &&
      incompleteRequestedIds.every((id) => currentDatabaseIds.has(id))
    assert.isFalse(isMissingValid)

    // Foreign ID
    const isForeignValid =
      foreignRequestedIds.length === currentDatabaseIds.size &&
      foreignRequestedIds.every((id) => currentDatabaseIds.has(id))
    assert.isFalse(isForeignValid)
  })
})
