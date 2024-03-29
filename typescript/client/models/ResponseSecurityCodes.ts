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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface ResponseSecurityCodes
 */
export interface ResponseSecurityCodes {
    /**
     * 
     * @type {Array<number>}
     * @memberof ResponseSecurityCodes
     */
    securityCodes: Array<number>;
}

/**
 * Check if a given object implements the ResponseSecurityCodes interface.
 */
export function instanceOfResponseSecurityCodes(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "securityCodes" in value;

    return isInstance;
}

export function ResponseSecurityCodesFromJSON(json: any): ResponseSecurityCodes {
    return ResponseSecurityCodesFromJSONTyped(json, false);
}

export function ResponseSecurityCodesFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseSecurityCodes {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'securityCodes': json['security_codes'],
    };
}

export function ResponseSecurityCodesToJSON(value?: ResponseSecurityCodes | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'security_codes': value.securityCodes,
    };
}

