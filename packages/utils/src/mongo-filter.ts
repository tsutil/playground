/**
 * Field filter. MongoDb, Sequelize and Salesforce compatible.
 */
export type MongoFieldFilter<TValue = any> = TValue | MongoFieldComparisonFilter<TValue> | null;

/**
 * Query selectors. MongoDb, Sequelize and Salesforce compatible.
 */
export interface MongoFieldComparisonFilter<TValue = any> {
    /**
     * Matches values that are equal to a specified value.
     */
    $eq?: TValue;
    /**
     * Matches values that are not equal to a specified value.
     */
    $ne?: TValue;
    /**
     * Matches values that are greater than a specified value.
     */
    $gte?: TValue;
    /**
     * Matches values that are greater than or equal to a specified value.
     */
    $gt?: TValue;
    /**
     * Matches values that are less than or equal to a specified value.
     */
    $lte?: TValue;
    /**
     * Matches values that are less than a specified value.
     */
    $lt?: TValue;
    /**
     * Matches any of the values specified in an array.
     */
    $in?: TValue[];
    /**
     * Matches none of the values specified in an array.
     */
    $nin?: TValue[];
}
