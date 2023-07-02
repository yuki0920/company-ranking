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
import type { EachIndustryCategory } from "./EachIndustryCategory"
import {
  EachIndustryCategoryFromJSON,
  EachIndustryCategoryFromJSONTyped,
  EachIndustryCategoryToJSON,
} from "./EachIndustryCategory"

/**
 *
 * @export
 * @interface ResponseIndustries
 */
export interface ResponseIndustries {
  /**
   *
   * @type {Array<EachIndustryCategory>}
   * @memberof ResponseIndustries
   */
  industryCategories: Array<EachIndustryCategory>
}

/**
 * Check if a given object implements the ResponseIndustries interface.
 */
export function instanceOfResponseIndustries(value: object): boolean {
  let isInstance = true
  isInstance = isInstance && "industryCategories" in value

  return isInstance
}

export function ResponseIndustriesFromJSON(json: any): ResponseIndustries {
  return ResponseIndustriesFromJSONTyped(json, false)
}

export function ResponseIndustriesFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean,
): ResponseIndustries {
  if (json === undefined || json === null) {
    return json
  }
  return {
    industryCategories: (json["industry_categories"] as Array<any>).map(
      EachIndustryCategoryFromJSON,
    ),
  }
}

export function ResponseIndustriesToJSON(value?: ResponseIndustries | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    industry_categories: (value.industryCategories as Array<any>).map(EachIndustryCategoryToJSON),
  }
}
