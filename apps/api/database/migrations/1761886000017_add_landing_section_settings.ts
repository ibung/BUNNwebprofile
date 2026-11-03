import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('site_settings', (table) => {
      // Tentang (About)
      table.string('about_label', 80).nullable().defaultTo('Tentang saya')
      table.string('about_title_main', 120).nullable().defaultTo('Membangun, ')
      table.string('about_title_accent', 120).nullable().defaultTo('lalu menguji.')

      // Proyek (Projects)
      table.string('projects_label', 80).nullable().defaultTo('Karya pilihan')
      table.string('projects_title_main', 120).nullable().defaultTo('Pilihan ')
      table.string('projects_title_accent', 120).nullable().defaultTo('karya.')
      table
        .text('projects_subtitle')
        .nullable()
        .defaultTo('Pilihan karya dan aplikasi yang pernah saya rancang, bangun, dan uji.')

      // Keahlian (Skills)
      table.string('skills_label', 80).nullable().defaultTo('Keahlian')
      table.string('skills_title_main', 120).nullable().defaultTo('Alat ')
      table.string('skills_title_accent', 120).nullable().defaultTo('pendukung.')
      table
        .text('skills_subtitle')
        .nullable()
        .defaultTo(
          'Teknologi, pustaka, dan perangkat yang biasa saya gunakan dalam proses pengembangan dan pengujian.'
        )

      // Perjalanan (Timeline / Experiences)
      table.string('experiences_label', 80).nullable().defaultTo('Perjalanan')
      table.string('experiences_title_main', 120).nullable().defaultTo('Satu langkah, ')
      table.string('experiences_title_accent', 120).nullable().defaultTo('lalu berikutnya.')
      table
        .text('experiences_subtitle')
        .nullable()
        .defaultTo(
          'Jejak pendidikan, pengalaman kerja, dan proyek penting yang membentuk cara saya berpikir dan bekerja.'
        )

      // Kontak (Contact)
      table.string('contact_label', 80).nullable().defaultTo('Kontak')
      table.string('contact_title_main', 120).nullable().defaultTo('Ayo ')
      table.string('contact_title_accent', 120).nullable().defaultTo('ngobrol.')
      table
        .text('contact_subtitle')
        .nullable()
        .defaultTo(
          'Punya proyek atau kesempatan kerja sama? Kirim pesan lewat formulir di bawah atau hubungi saya langsung.'
        )
    })
  }

  async down() {
    this.schema.alterTable('site_settings', (table) => {
      table.dropColumns(
        'about_label',
        'about_title_main',
        'about_title_accent',
        'projects_label',
        'projects_title_main',
        'projects_title_accent',
        'projects_subtitle',
        'skills_label',
        'skills_title_main',
        'skills_title_accent',
        'skills_subtitle',
        'experiences_label',
        'experiences_title_main',
        'experiences_title_accent',
        'experiences_subtitle',
        'contact_label',
        'contact_title_main',
        'contact_title_accent',
        'contact_subtitle'
      )
    })
  }
}
