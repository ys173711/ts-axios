// 处理请求头headers

import { isPlainObject } from './utils'

function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return
  }
  Object.keys(headers).forEach(name => {
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      headers[normalizedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}

export function parseHeaders(headers: string): void {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }
  headers.split('\r\n').forEach(line => {
    let [key, value] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (value) {
      value = value.trim()
    }
    parsed[key] = value
  })

  return parsed
}
