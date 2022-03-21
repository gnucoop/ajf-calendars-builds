/**
 * @license
 * Copyright (C) Gnucoop soc. coop.
 *
 * This file is part of the Advanced JSON forms (ajf).
 *
 * Advanced JSON forms (ajf) is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Advanced JSON forms (ajf) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Advanced JSON forms (ajf).
 * If not, see http://www.gnu.org/licenses/.
 *
 */
export declare class EthiopianDate {
    private _year;
    private _month;
    private _date;
    private _gc;
    /**
     * @param val - A numeric year value if the second and third parameters ar provided,
     *                                        It should be a date string if not
     * @param month A zero-based numeric value for the month (0 for መስከረም, 12 for ጳጉሜን)
     * @param day A numeric value equal for the day of the month.
     */
    constructor(val?: Date | string | number, month?: number, day?: number);
    getDate(): number;
    getDay(): number;
    getDayOfWeek(): string;
    getFullYear(): number;
    getGregorianDate(): Date;
    getGCWeekDay(): number;
    getMonth(): number;
    getMonthName(): string | null;
    getShortMonthName(): string | null;
    getHours(): number;
    getMinutes(): number;
    getSeconds(): number;
    getMilliseconds(): number;
    toString(): string;
    /**
     * Converts a Ethiopian date to Gregorian and returns Date instance representing Gregorian Date.
     *
     * @param val - A numeric year value if the second and third parameters are
     *                                   provided, it should be a date string if not
     * @param month A zero-based numeric value for the month
     *                         (0 for መስከረም, 12 for ጳጉሜን)
     * @param day A numeric value equal for the day of the month.
     *
     * @api public
     */
    static ethiopianToGregorian(val?: EthiopianDate | string | number, month?: number, day?: number): Date;
    /**
     *
     * @param val - A numeric year value if the second and third parameters are
     *                                   provided, it should be a date string if not
     * @param month A zero-based numeric value for the month
     *                         (0 for January, 11 for December)
     * @param day A numeric value equal for the day of the month.
     *
     * @api public
     */
    static gregorianToEthiopian(val?: Date | string | number, month?: number, day?: number): EthiopianDate;
    /**
     * Parse Ethiopian date from string
     *
     * @param dateString a date string to parse
     * @param pattern a parsing pattern
     *
     * @returns EthiopianDate
     */
    static parse(dateString: string): EthiopianDate | null;
}
