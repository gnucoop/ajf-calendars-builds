import { AjfCalendarService } from '@ajf/core/calendar';
import * as i0 from '@angular/core';
import { Injectable, Pipe, NgModule } from '@angular/core';
import { getISODay, startOfISOWeek, endOfISOWeek, addWeeks, subWeeks, setISODay, startOfWeek, addDays, addYears } from 'date-fns';

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
const JD_EPOCH_OFFSET_AMETE_ALEM = -285019; //      ዓ/ዓ
const JD_EPOCH_OFFSET_AMETE_MIHRET = 1723856; //    ዓ/ም
const JD_EPOCH_OFFSET_GREGORIAN = 1721426;
const JD_EPOCH_OFFSET_UNSET = -1;
let JDN_OFFSET = JD_EPOCH_OFFSET_UNSET;
const GREGORIAN_NUMBER_OF_MONTHS = 12;
const monthDays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function quotient(i, j) {
    return Math.floor(i / j);
}
function isGregorianLeap(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
function setEra(era) {
    if (era === JD_EPOCH_OFFSET_AMETE_ALEM || era === JD_EPOCH_OFFSET_AMETE_MIHRET) {
        JDN_OFFSET = era;
    }
    else {
        throw new Error(`Unknown Era: ${era}`);
    }
}
function isEraSet() {
    return JD_EPOCH_OFFSET_UNSET !== JDN_OFFSET;
}
function unsetEra() {
    JDN_OFFSET = JD_EPOCH_OFFSET_UNSET;
}
function guessEraFromJDN(jdn) {
    return jdn >= JD_EPOCH_OFFSET_AMETE_MIHRET + 365
        ? JD_EPOCH_OFFSET_AMETE_MIHRET
        : JD_EPOCH_OFFSET_AMETE_ALEM;
}
function ethiopicToJDN(day, month, year) {
    const ERA = isEraSet() ? JDN_OFFSET : JD_EPOCH_OFFSET_AMETE_MIHRET;
    const jdn = ERA + 365 + 365 * (year - 1) + quotient(year, 4) + 30 * month + day - 31;
    return jdn;
}
function jdnToEthiopic(jdn) {
    const ERA = isEraSet() ? JDN_OFFSET : guessEraFromJDN(jdn);
    const r = (jdn - ERA) % 1461;
    const n = (r % 365) + 365 * quotient(r, 1460);
    const year = 4 * quotient(jdn - ERA, 1461) + quotient(r, 365) - quotient(r, 1460);
    const month = quotient(n, 30) + 1;
    const day = (n % 30) + 1;
    return [year, month, day];
}
function gregorianToJDN(day, month, year) {
    const s = quotient(year, 4) -
        quotient(year - 1, 4) -
        quotient(year, 100) +
        quotient(year - 1, 100) +
        quotient(year, 400) -
        quotient(year - 1, 400);
    const t = quotient(14 - month, 12);
    const n = 31 * t * (month - 1) +
        (1 - t) * (59 + s + 30 * (month - 3) + quotient(3 * month - 7, 5)) +
        day -
        1;
    const j = JD_EPOCH_OFFSET_GREGORIAN +
        365 * (year - 1) +
        quotient(year - 1, 4) -
        quotient(year - 1, 100) +
        quotient(year - 1, 400) +
        n;
    return j;
}
function jdnToGregorian(jdn) {
    const r2000 = (jdn - JD_EPOCH_OFFSET_GREGORIAN) % 730485;
    const r400 = (jdn - JD_EPOCH_OFFSET_GREGORIAN) % 146097;
    const r100 = r400 % 36524;
    const r4 = r100 % 1461;
    let n = (r4 % 365) + 365 * quotient(r4, 1460);
    const s = quotient(r4, 1095);
    const aprime = 400 * quotient(jdn - JD_EPOCH_OFFSET_GREGORIAN, 146097) +
        100 * quotient(r400, 36524) +
        4 * quotient(r100, 1461) +
        quotient(r4, 365) -
        quotient(r4, 1460) -
        quotient(r2000, 730484);
    const year = aprime + 1;
    const t = quotient(364 + s - n, 306);
    let month = t * (quotient(n, 31) + 1) + (1 - t) * (quotient(5 * (n - s) + 13, 153) + 1);
    n += 1 - quotient(r2000, 730484);
    let day = n;
    if (r100 === 0 && n === 0 && r400 !== 0) {
        month = 12;
        day = 31;
    }
    else {
        monthDays[2] = isGregorianLeap(year) ? 29 : 28;
        for (let i = 1; i <= GREGORIAN_NUMBER_OF_MONTHS; i += 1) {
            if (n <= monthDays[i]) {
                day = n;
                break;
            }
            n -= monthDays[i];
        }
    }
    return [year, month, day];
}
function gregorianToEthiopic(day, month, year) {
    const jdn = gregorianToJDN(day, month, year);
    return jdnToEthiopic(jdn);
}
function ethioipicToGreg(day, month, year) {
    const jdn = ethiopicToJDN(day, month, year);
    return jdnToGregorian(jdn);
}
function ethioipicToGregorian(day, month, year, era) {
    setEra(era);
    const result = ethioipicToGreg(day, month, year);
    unsetEra();
    return result;
}
/** API * */
/** ethiopian to gregorian */
function toGC(dateArray) {
    const [y, m, d] = dateArray;
    let era = dateArray.length === 4 ? dateArray[3] : JD_EPOCH_OFFSET_AMETE_MIHRET;
    if (d < 0 || d > 30 || m < 0 || m > 13) {
        throw new Error('Invalid Ethiopian Date');
    }
    return ethioipicToGregorian(d, m, y, era);
}
/** gregorian to ethiopian */
function toEC(dateArray) {
    const [y, m, d] = dateArray;
    if (d < 0 || d > 31 || m < 0 || m > 12) {
        throw new Error('Invalid Gregorian Date');
    }
    return gregorianToEthiopic(d, m, y);
}

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
const WEEK_NAMES = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሓሙስ', 'ዓርብ', 'ቅዳሜ'];
const MONTHS_NAMES = [
    'መስከረም',
    'ጥቅምት',
    'ኅዳር',
    'ታኅሣሥ',
    'ጥር',
    'የካቲት',
    'መጋቢት',
    'ሚያዝያ',
    'ግንቦት',
    'ሰኔ',
    'ሐምሌ',
    'ነሐሴ',
    'ጳጉሜን',
];
const SHORT_MONTHS_NAMES = [
    'መስከ',
    'ጥቅም',
    'ኅዳር',
    'ታኅሣ',
    'ጥር',
    'የካቲ',
    'መጋቢ',
    'ሚያዝ',
    'ግንቦ',
    'ሰኔ',
    'ሐምሌ',
    'ነሐሴ',
    'ጳጉሜ',
];

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
class EthiopianDate {
    /**
     * @param val - A numeric year value if the second and third parameters ar provided,
     *                                        It should be a date string if not
     * @param month A zero-based numeric value for the month (0 for መስከረም, 12 for ጳጉሜን)
     * @param day A numeric value equal for the day of the month.
     */
    constructor(val, month, day) {
        this._year = 0;
        this._month = 0;
        this._date = 0;
        this._gc = new Date();
        if (val == null && month == null && day == null) {
            const ahun = EthiopianDate.gregorianToEthiopian(new Date());
            [this._year, this._month, this._date] = [ahun.getFullYear(), ahun.getMonth(), ahun.getDate()];
            this._gc = EthiopianDate.ethiopianToGregorian(this._year, this._month, this._date);
        }
        else if (val != null && month == null && day == null && typeof val !== 'number') {
            if (typeof val === 'string') {
                const result = EthiopianDate.parse(val);
                if (result == null) {
                    throw new Error('Invalid Argument Exception');
                }
                [this._year, this._month, this._date] = [
                    result.getFullYear(),
                    result.getMonth(),
                    result.getDate(),
                ];
                this._gc = EthiopianDate.ethiopianToGregorian(this._year, this._month, this._date);
            }
            else if (typeof val === 'object' && val instanceof Date) {
                const result = EthiopianDate.gregorianToEthiopian(val);
                [this._year, this._month, this._date] = [
                    result.getFullYear(),
                    result.getMonth(),
                    result.getDate(),
                ];
                this._gc = EthiopianDate.ethiopianToGregorian(this._year, this._month, this._date);
            }
            else {
                throw new Error('Invalid Argument Exception');
            }
        }
        else if (val != null && month != null && day != null && typeof val === 'number') {
            this._year = val;
            this._month = month;
            this._date = day;
            this._gc = EthiopianDate.ethiopianToGregorian(this._year, this._month, this._date);
        }
    }
    getDate() {
        return this._date;
    }
    getDay() {
        return this._gc.getDay();
    }
    getDayOfWeek() {
        const weekDay = this.getGCWeekDay();
        return WEEK_NAMES[weekDay];
    }
    getFullYear() {
        return this._year;
    }
    getGregorianDate() {
        return this._gc;
    }
    getGCWeekDay() {
        return this._gc.getDay();
    }
    getMonth() {
        return this._month;
    }
    getMonthName() {
        return this._month >= 0 && this._month < MONTHS_NAMES.length ? MONTHS_NAMES[this._month] : null;
    }
    getShortMonthName() {
        return this._month >= 0 && this._month < SHORT_MONTHS_NAMES.length
            ? SHORT_MONTHS_NAMES[this._month]
            : null;
    }
    getHours() {
        return 0;
    }
    getMinutes() {
        return 0;
    }
    getSeconds() {
        return 0;
    }
    getMilliseconds() {
        return 0;
    }
    toString() {
        return `${this._year}-${this._month + 1}-${this._date}`;
    }
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
    static ethiopianToGregorian(val, month, day) {
        let ec;
        if (val != null && month == null && day == null && typeof val !== 'number') {
            if (typeof val === 'string') {
                const etDate = new EthiopianDate(val);
                ec = [etDate.getFullYear(), etDate.getMonth() + 1, etDate.getDate()];
            }
            else if (typeof val === 'object' && val instanceof EthiopianDate) {
                const [y, m, d] = [val.getFullYear(), val.getMonth() + 1, val.getDate()];
                ec = [y, m, d];
            }
            else {
                throw new Error('Invalid Argument Exception');
            }
        }
        else if (val != null && month != null && day != null && typeof val === 'number') {
            ec = [val, month + 1, day];
        }
        else {
            throw new Error('Invalid Argument Exception');
        }
        const gc = toGC(ec);
        return new Date(gc[0], gc[1] - 1, gc[2]);
    }
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
    static gregorianToEthiopian(val, month, day) {
        let gc;
        if (val != null && month == null && day == null && typeof val !== 'number') {
            if (typeof val === 'string') {
                const gcDate = new Date(val);
                gc = [gcDate.getFullYear(), gcDate.getMonth() + 1, gcDate.getDate()];
            }
            else if (typeof val === 'object' && val instanceof Date) {
                const [y, m, d] = [val.getFullYear(), val.getMonth() + 1, val.getDate()];
                gc = [y, m, d];
            }
            else {
                throw new Error('Invalid Argument Exception');
            }
        }
        else if (val != null && month != null && day != null && typeof val === 'number') {
            gc = [val, month + 1, day];
        }
        else {
            throw new Error('Invalid Argument Exception');
        }
        const ec = toEC(gc);
        return new EthiopianDate(ec[0], ec[1] - 1, ec[2]);
    }
    /**
     * Parse Ethiopian date from string
     *
     * @param dateString a date string to parse
     * @param pattern a parsing pattern
     *
     * @returns EthiopianDate
     */
    static parse(dateString) {
        if (!dateString) {
            return null;
        }
        const result = dateString.split('-');
        if (result.length === 3) {
            const [y, m, d] = result;
            return new EthiopianDate(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
        }
        throw new Error(`ParsingError: Can't parse ${dateString}`);
    }
}

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
function getMonthDays(month, year) {
    if (month < 12) {
        return 30;
    }
    return year % 4 === 3 ? 6 : 5;
}
function getMonthBounds(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const start = new EthiopianDate(year, month, 1);
    const endDay = getMonthDays(month, year);
    const end = new EthiopianDate(year, month, endDay);
    return { start, end };
}
class AjfEthiopianCalendarService extends AjfCalendarService {
    buildView(params) {
        const { viewMode } = params;
        const viewDate = EthiopianDate.gregorianToEthiopian(params.viewDate);
        switch (viewMode) {
            case 'decade':
                let curYear = viewDate.getFullYear();
                let firstYear = curYear - (curYear % 10) + 1;
                let lastYear = firstYear + 11;
                return {
                    header: `${firstYear} - ${lastYear}`,
                    headerRow: [],
                    rows: this._ecDecadeCalendarRows(params),
                };
            case 'year':
                return {
                    header: `${viewDate.getFullYear()}`,
                    headerRow: [],
                    rows: this._ecYearCalendarRows(params),
                };
            case 'month':
                const view = super.buildView(params);
                return {
                    header: `${viewDate.getShortMonthName()} ${viewDate.getFullYear()}`,
                    headerRow: this._ecMonthHeaderRow(params),
                    rows: view.rows,
                };
        }
        return super.buildView(params);
    }
    entryLabel(entry) {
        const ecDate = EthiopianDate.gregorianToEthiopian(entry.date);
        if (entry.type === 'day') {
            return `${ecDate.getDate()}`;
        }
        if (entry.type === 'month') {
            return `${ecDate.getMonthName()}`;
        }
        return `${ecDate.getFullYear()}`;
    }
    monthBounds(date, isoMode) {
        if (!isoMode) {
            const ecDate = EthiopianDate.gregorianToEthiopian(date);
            const { start, end } = getMonthBounds(ecDate);
            return {
                start: EthiopianDate.ethiopianToGregorian(start),
                end: EthiopianDate.ethiopianToGregorian(end),
            };
        }
        else {
            let isoDay = getISODay(date);
            const ecDate = EthiopianDate.gregorianToEthiopian(date);
            let { start, end } = getMonthBounds(ecDate);
            if (ecDate.getMonth() === 12) {
                start = EthiopianDate.gregorianToEthiopian(startOfISOWeek(start.getGregorianDate()));
                end = EthiopianDate.gregorianToEthiopian(endOfISOWeek(end.getGregorianDate()));
            }
            else {
                date = isoDay < 4 ? endOfISOWeek(date) : startOfISOWeek(date);
                const startWeekDay = start.getDay();
                const endWeekDay = end.getDay();
                if (startWeekDay == 0 || startWeekDay > 4) {
                    start = EthiopianDate.gregorianToEthiopian(addWeeks(start.getGregorianDate(), 1));
                }
                if (endWeekDay > 0 && endWeekDay < 4) {
                    end = EthiopianDate.gregorianToEthiopian(subWeeks(end.getGregorianDate(), 1));
                }
            }
            return {
                start: startOfISOWeek(start.getGregorianDate()),
                end: endOfISOWeek(end.getGregorianDate()),
            };
        }
    }
    nextView(viewDate, viewMode) {
        if (viewMode === 'month') {
            const ecDate = EthiopianDate.gregorianToEthiopian(viewDate);
            let year = ecDate.getFullYear();
            let month = ecDate.getMonth();
            if (month === 12) {
                month = 0;
                year += 1;
            }
            else {
                month += 1;
            }
            return EthiopianDate.ethiopianToGregorian(new EthiopianDate(year, month, 1));
        }
        return super.nextView(viewDate, viewMode);
    }
    previousView(viewDate, viewMode) {
        if (viewMode === 'month') {
            const ecDate = EthiopianDate.gregorianToEthiopian(viewDate);
            let year = ecDate.getFullYear();
            let month = ecDate.getMonth();
            if (month === 0) {
                month = 12;
                year -= 1;
            }
            else {
                month -= 1;
            }
            return EthiopianDate.ethiopianToGregorian(new EthiopianDate(year, month, 1));
        }
        return super.previousView(viewDate, viewMode);
    }
    _ecMonthHeaderRow(params) {
        const { isoMode, viewDate } = params;
        let curDate;
        if (isoMode) {
            curDate = setISODay(startOfWeek(viewDate), 1);
        }
        else {
            curDate = startOfWeek(viewDate);
        }
        let weekDayNames = [];
        for (let i = 0; i < 7; i++) {
            const ecDate = EthiopianDate.gregorianToEthiopian(curDate);
            weekDayNames.push(ecDate.getDayOfWeek());
            curDate = addDays(curDate, 1);
        }
        return weekDayNames;
    }
    _ecYearCalendarRows(params) {
        const { viewDate, selection } = params;
        const year = EthiopianDate.gregorianToEthiopian(viewDate).getFullYear();
        let curDate;
        let rows = [];
        for (let i = 0; i <= 4; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                const curMonth = i * 3 + j;
                if (curMonth < 13) {
                    curDate = new EthiopianDate(year, curMonth, 1);
                    let date = EthiopianDate.ethiopianToGregorian(curDate);
                    let newEntry = { type: 'month', date, selected: 'none' };
                    newEntry.selected = this.isEntrySelected(newEntry, selection);
                    row.push(newEntry);
                }
            }
            rows.push(row);
        }
        return rows;
    }
    _ecDecadeCalendarRows(params) {
        const { viewDate, selection } = params;
        const ecDate = EthiopianDate.gregorianToEthiopian(viewDate);
        let curYear = ecDate.getFullYear();
        let firstYear = curYear - (curYear % 10) + 1;
        let curDate = EthiopianDate.ethiopianToGregorian(firstYear, 0, 1);
        let rows = [];
        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 3; j++) {
                let date = new Date(curDate);
                let newEntry = { type: 'year', date: date, selected: 'none' };
                newEntry.selected = this.isEntrySelected(newEntry, selection);
                row.push(newEntry);
                curDate = addYears(curDate, 1);
            }
            rows.push(row);
        }
        return rows;
    }
}
AjfEthiopianCalendarService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianCalendarService, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
AjfEthiopianCalendarService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianCalendarService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianCalendarService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

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
class AjfEthiopianDatePipe {
    transform(value) {
        try {
            const ed = EthiopianDate.gregorianToEthiopian(value);
            const date = `0${ed.getDate()}`.slice(-2);
            const month = `0${ed.getMonth() + 1}`.slice(-2);
            return `${date}/${month}/${ed.getFullYear()}`;
        }
        catch (e) {
            return null;
        }
    }
}
AjfEthiopianDatePipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianDatePipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
AjfEthiopianDatePipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianDatePipe, name: "ajfEthiopianDate" });
AjfEthiopianDatePipe.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianDatePipe });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianDatePipe, decorators: [{
            type: Injectable
        }, {
            type: Pipe,
            args: [{ name: 'ajfEthiopianDate' }]
        }] });

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
class AjfEthiopianCalendarModule {
}
AjfEthiopianCalendarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianCalendarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AjfEthiopianCalendarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianCalendarModule, declarations: [AjfEthiopianDatePipe], exports: [AjfEthiopianDatePipe] });
AjfEthiopianCalendarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianCalendarModule, providers: [{ provide: AjfCalendarService, useClass: AjfEthiopianCalendarService }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.5", ngImport: i0, type: AjfEthiopianCalendarModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [AjfEthiopianDatePipe],
                    exports: [AjfEthiopianDatePipe],
                    providers: [{ provide: AjfCalendarService, useClass: AjfEthiopianCalendarService }],
                }]
        }] });

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

/**
 * Generated bundle index. Do not edit.
 */

export { AjfEthiopianCalendarModule, AjfEthiopianCalendarService, AjfEthiopianDatePipe, EthiopianDate };
//# sourceMappingURL=ajf-calendars-ethiopian.mjs.map
