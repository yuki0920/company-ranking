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

export interface EachCompany {
    security_code: number;
    security_name: string;
    /**
     * 1億で割った値
     */
    net_sales: number | null;
    /**
     * 1億で割った値
     */
    ordinary_income: number | null;
    /**
     * 1万で割った値
     */
    average_annual_salary: number | null;
    industry_name: string;
    market_name: string;
}
