import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url'
import { transformRequest } from '../helpers/data'
import { flattenHeaders, processHeaders } from '../helpers/headers'
import transform from './transform'

export default function dispatchRequest(
  config: AxiosRequestConfig
): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(
    res => {
      return transformResponseData(res)
    },
    e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }
      return Promise.reject(e)
    }
  )
}

function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)

  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformURL(config: AxiosRequestConfig): string {
  let { url = '', params, paramsSerializer, baseURL } = config
  let absoluteURL: string
  if (baseURL && !isAbsoluteURL(url)) {
    url = combineURL(baseURL, url)
  }
  return buildURL(url, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
