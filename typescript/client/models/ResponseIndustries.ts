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

import { mapValues } from '../runtime';
import type { EachIndustry } from './EachIndustry';
import {
    EachIndustryFromJSON,
    EachIndustryFromJSONTyped,
    EachIndustryToJSON,
} from './EachIndustry';

/**
 * 
 * @export
 * @interface ResponseIndustries
 */
export interface ResponseIndustries {
    /**
     * 
     * @type {Array<EachIndustry>}
     * @memberof ResponseIndustries
     */
    industries: Array<EachIndustry>;
}

/**
 * Check if a given object implements the ResponseIndustries interface.
 */
export function instanceOfResponseIndustries(value: object): value is ResponseIndustries {
    if (!('industries' in value) || value['industries'] === undefined) return false;
    return true;
}

export function ResponseIndustriesFromJSON(json: any): ResponseIndustries {
    return ResponseIndustriesFromJSONTyped(json, false);
}

export function ResponseIndustriesFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseIndustries {
    if (json == null) {
        return json;
    }
    return {
        
        'industries': ((json['industries'] as Array<any>).map(EachIndustryFromJSON)),
    };
}

export function ResponseIndustriesToJSON(value?: ResponseIndustries | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'industries': ((value['industries'] as Array<any>).map(EachIndustryToJSON)),
    };
}

