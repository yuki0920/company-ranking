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
     * 1億で割った値
     * @type {number}
     * @memberof EachCompany
     */
    netSales: number | null;
    /**
     * 1億で割った値
     * @type {number}
     * @memberof EachCompany
     */
    ordinaryIncome: number | null;
    /**
     * 1万で割った値
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
     * 
     * @type {string}
     * @memberof EachCompany
     */
    marketName: string;
}

/**
 * Check if a given object implements the EachCompany interface.
 */
export function instanceOfEachCompany(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "securityCode" in value;
    isInstance = isInstance && "securityName" in value;
    isInstance = isInstance && "netSales" in value;
    isInstance = isInstance && "ordinaryIncome" in value;
    isInstance = isInstance && "averageAnnualSalary" in value;
    isInstance = isInstance && "industryName" in value;
    isInstance = isInstance && "marketName" in value;

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
        'netSales': json['net_sales'],
        'ordinaryIncome': json['ordinary_income'],
        'averageAnnualSalary': json['average_annual_salary'],
        'industryName': json['industry_name'],
        'marketName': json['market_name'],
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
        'net_sales': value.netSales,
        'ordinary_income': value.ordinaryIncome,
        'average_annual_salary': value.averageAnnualSalary,
        'industry_name': value.industryName,
        'market_name': value.marketName,
    };
}

