import { MetadataLinkValid } from '@geonetwork-ui/util/shared'
import { marker } from '@biesbjerg/ngx-translate-extract-marker'

marker('downloads.wfs.featuretype.not.found')

const FORMATS = {
  csv: ['csv'],
  geojson: ['geojson'],
  json: ['json'],
  shp: ['shp', 'shape', 'zipped-shapefile'],
  kml: ['kml', 'kmz'],
  gpkg: ['gpkg', 'geopackage'],
  excel: ['xls', 'xlsx', 'ms-excel', 'openxmlformats-officedocument'],
  pdf: ['pdf'],
  jpg: ['jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp'],
  zip: ['zip'],
}

export function getWfsFormat(link: MetadataLinkValid): string {
  for (const format in FORMATS) {
    for (const alias of FORMATS[format]) {
      if ('format' in link && new RegExp(`${alias}`, 'i').test(link.format))
        return `WFS:${format}`
    }
  }
  return undefined
}

export function getFileFormat(link: MetadataLinkValid): string {
  if (link.format) {
    return link.format
  }
  if ('protocol' in link && /^WWW:DOWNLOAD/.test(link.protocol)) {
    // mime types in protocol
    const matches = link.protocol.match(/^WWW:DOWNLOAD:(.+\/.+)$/)
    if (matches !== null) {
      const mimeType = checkMimeType(matches[1])
      if (mimeType) return mimeType
    }
  }
  for (const format in FORMATS) {
    for (const alias of FORMATS[format]) {
      if (checkFileFormat(link, alias)) return format
    }
  }
  return undefined
}

export function checkMimeType(mimeType: string) {
  switch (mimeType) {
    case 'application/json':
      return 'json'
    case 'application/geo+json':
    case 'application/vnd.geo+json':
      return 'geojson'
    case 'text/csv':
    case 'application/csv':
      return 'csv'
    case 'x-gis/x-shapefile':
      return 'shp'
    case 'application/vnd.ms-excel':
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'excel'
  }
  return undefined
}

export function checkFileFormat(
  link: MetadataLinkValid,
  format: string
): boolean {
  return (
    ('name' in link && new RegExp(`[./]${format}`, 'i').test(link.name)) ||
    ('url' in link && new RegExp(`[./]${format}`, 'i').test(link.url))
  )
}
