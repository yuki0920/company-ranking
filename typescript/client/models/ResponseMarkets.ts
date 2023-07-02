/* tslint:disable */
/* eslint-disable */
/**
 * Company Search API Document
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from "../runtime"
import type { EachMarket } from "./EachMarket"
import { EachMarketFromJSON, EachMarketFromJSONTyped, EachMarketToJSON } from "./EachMarket"

/**
 *
 * @export
 * @interface ResponseMarkets
 */
export interface ResponseMarkets {
  /**
   *
   * @type {Array<EachMarket>}
   * @memberof ResponseMarkets
   */
  markets: Array<EachMarket>
}

/**
 * Check if a given object implements the ResponseMarkets interface.
 */
export function instanceOfResponseMarkets(value: object): boolean {
  let isInstance = true
  isInstance = isInstance && "markets" in value

  return isInstance
}

export function ResponseMarketsFromJSON(json: any): ResponseMarkets {
  return ResponseMarketsFromJSONTyped(json, false)
}

export function ResponseMarketsFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ResponseMarkets {
  if (json === undefined || json === null) {
    return json
  }
  return {
    markets: (json["markets"] as Array<any>).map(EachMarketFromJSON),
  }
}

export function ResponseMarketsToJSON(value?: ResponseMarkets | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    markets: (value.markets as Array<any>).map(EachMarketToJSON),
  }
}
