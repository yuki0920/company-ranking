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
 * @interface EachCompany
 */
export interface EachCompany {
    /**
     * 
     * @type {number}
     * @memberof EachCompany
     */
    securityCode: number;
    /**
     * 
     * @type {string}
     * @memberof EachCompany
     */
    securityName: string;
    /**
     * 
     * @type {string}
     * @memberof EachCompany
     */
    securityNameEn: string;
    /**
     * 
     * @type {number}
     * @memberof EachCompany
     */
    netSales: number | null;
    /**
     * 
     * @type {number}
     * @memberof EachCompany
     */
    ordinaryIncome: number | null;
    /**
     * 
     * @type {number}
     * @memberof EachCompany
     */
    averageAnnualSalary: number | null;
    /**
     * 
     * @type {string}
     * @memberof EachCompany
     */
    industryName: string;
    /**
     * 業種コード
     * @type {number}
     * @memberof EachCompany
     */
    industryCode: number;
    /**
     * 
     * @type {string}
     * @memberof EachCompany
     */
    marketName: string;
    /**
     * 市場コード
     * @type {number}
     * @memberof EachCompany
     */
    marketId: number;
}

/**
 * Check if a given object implements the EachCompany interface.
 */
export function instanceOfEachCompany(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "securityCode" in value;
    isInstance = isInstance && "securityName" in value;
    isInstance = isInstance && "securityNameEn" in value;
    isInstance = isInstance && "netSales" in value;
    isInstance = isInstance && "ordinaryIncome" in value;
    isInstance = isInstance && "averageAnnualSalary" in value;
    isInstance = isInstance && "industryName" in value;
    isInstance = isInstance && "industryCode" in value;
    isInstance = isInstance && "marketName" in value;
    isInstance = isInstance && "marketId" in value;

    return isInstance;
}

export function EachCompanyFromJSON(json: any): EachCompany {
    return EachCompanyFromJSONTyped(json, false);
}

export function EachCompanyFromJSONTyped(json: any, ignoreDiscriminator: boolean): EachCompany {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'securityCode': json['security_code'],
        'securityName': json['security_name'],
        'securityNameEn': json['security_name_en'],
        'netSales': json['net_sales'],
        'ordinaryIncome': json['ordinary_income'],
        'averageAnnualSalary': json['average_annual_salary'],
        'industryName': json['industry_name'],
        'industryCode': json['industry_code'],
        'marketName': json['market_name'],
        'marketId': json['market_id'],
    };
}

export function EachCompanyToJSON(value?: EachCompany | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'security_code': value.securityCode,
        'security_name': value.securityName,
        'security_name_en': value.securityNameEn,
        'net_sales': value.netSales,
        'ordinary_income': value.ordinaryIncome,
        'average_annual_salary': value.averageAnnualSalary,
        'industry_name': value.industryName,
        'industry_code': value.industryCode,
        'market_name': value.marketName,
        'market_id': value.marketId,
    };
}

