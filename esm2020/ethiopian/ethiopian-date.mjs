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
import { toEC, toGC } from './converter';
import { MONTHS_NAMES, SHORT_MONTHS_NAMES, WEEK_NAMES } from './utils';
export class EthiopianDate {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXRoaW9waWFuLWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jYWxlbmRhcnMvZXRoaW9waWFuL3NyYy9ldGhpb3BpYW4tZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFFSCxPQUFPLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFVBQVUsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUVyRSxNQUFNLE9BQU8sYUFBYTtJQU14Qjs7Ozs7T0FLRztJQUNILFlBQVksR0FBNEIsRUFBRSxLQUFjLEVBQUUsR0FBWTtRQVg5RCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixRQUFHLEdBQVMsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQVM3QixJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQy9DLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUM7WUFDNUQsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NB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LENBQUMsQ0FBQztRQUNwQixPQUFPLElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFrQjtRQUM3QixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2YsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2QixNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDekIsT0FBTyxJQUFJLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNqRjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsNkJBQTZCLFVBQVUsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IChDKSBHbnVjb29wIHNvYy4gY29vcC5cbiAqXG4gKiBUaGlzIGZpbGUgaXMgcGFydCBvZiB0aGUgQWR2YW5jZWQgSlNPTiBmb3JtcyAoYWpmKS5cbiAqXG4gKiBBZHZhbmNlZCBKU09OIGZvcm1zIChhamYpIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzXG4gKiBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSxcbiAqIG9yIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogQWR2YW5jZWQgSlNPTiBmb3JtcyAoYWpmKSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZSBHTlUgQWZmZXJvXG4gKiBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEFmZmVybyBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiBhbG9uZyB3aXRoIEFkdmFuY2VkIEpTT04gZm9ybXMgKGFqZikuXG4gKiBJZiBub3QsIHNlZSBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvLlxuICpcbiAqL1xuXG5pbXBvcnQge3RvRUMsIHRvR0N9IGZyb20gJy4vY29udmVydGVyJztcbmltcG9ydCB7TU9OVEhTX05BTUVTLCBTSE9SVF9NT05USFNfTkFNRVMsIFdFRUtfTkFNRVN9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgRXRoaW9waWFuRGF0ZSB7XG4gIHByaXZhdGUgX3llYXI6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgX21vbnRoOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIF9kYXRlOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIF9nYzogRGF0ZSA9IG5ldyBEYXRlKCk7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB2YWwgLSBBIG51bWVyaWMgeWVhciB2YWx1ZSBpZiB0aGUgc2Vjb25kIGFuZCB0aGlyZCBwYXJhbWV0ZXJzIGFyIHByb3ZpZGVkLFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBJdCBzaG91bGQgYmUgYSBkYXRlIHN0cmluZyBpZiBub3RcbiAgICogQHBhcmFtIG1vbnRoIEEgemVyby1iYXNlZCBudW1lcmljIHZhbHVlIGZvciB0aGUgbW9udGggKDAgZm9yIOGImOGIteGKqOGIqOGInSwgMTIgZm9yIOGMs+GMieGInOGKlSlcbiAgICogQHBhcmFtIGRheSBBIG51bWVyaWMgdmFsdWUgZXF1YWwgZm9yIHRoZSBkYXkgb2YgdGhlIG1vbnRoLlxuICAgKi9cbiAgY29uc3RydWN0b3IodmFsPzogRGF0ZSB8IHN0cmluZyB8IG51bWJlciwgbW9udGg/OiBudW1iZXIsIGRheT86IG51bWJlcikge1xuICAgIGlmICh2YWwgPT0gbnVsbCAmJiBtb250aCA9PSBudWxsICYmIGRheSA9PSBudWxsKSB7XG4gICAgICBjb25zdCBhaHVuID0gRXRoaW9waWFuRGF0ZS5ncmVnb3JpYW5Ub0V0aGlvcGlhbihuZXcgRGF0ZSgpKTtcbiAgICAgIFt0aGlzLl95ZWFyLCB0aGlzLl9tb250aCwgdGhpcy5fZGF0ZV0gPSBbYWh1bi5nZXRGdWxsWWVhcigpLCBhaHVuLmdldE1vbnRoKCksIGFodW4uZ2V0RGF0ZSgpXTtcbiAgICAgIHRoaXMuX2djID0gRXRoaW9waWFuRGF0ZS5ldGhpb3BpYW5Ub0dyZWdvcmlhbih0aGlzLl95ZWFyLCB0aGlzLl9tb250aCwgdGhpcy5fZGF0ZSk7XG4gICAgfSBlbHNlIGlmICh2YWwgIT0gbnVsbCAmJiBtb250aCA9PSBudWxsICYmIGRheSA9PSBudWxsICYmIHR5cGVvZiB2YWwgIT09ICdudW1iZXInKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gRXRoaW9waWFuRGF0ZS5wYXJzZSh2YWwpO1xuICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgQXJndW1lbnQgRXhjZXB0aW9uJyk7XG4gICAgICAgIH1cbiAgICAgICAgW3RoaXMuX3llYXIsIHRoaXMuX21vbnRoLCB0aGlzLl9kYXRlXSA9IFtcbiAgICAgICAgICByZXN1bHQuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICByZXN1bHQuZ2V0TW9udGgoKSxcbiAgICAgICAgICByZXN1bHQuZ2V0RGF0ZSgpLFxuICAgICAgICBdO1xuICAgICAgICB0aGlzLl9nYyA9IEV0aGlvcGlhbkRhdGUuZXRoaW9waWFuVG9HcmVnb3JpYW4odGhpcy5feWVhciwgdGhpcy5fbW9udGgsIHRoaXMuX2RhdGUpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiB2YWwgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IEV0aGlvcGlhbkRhdGUuZ3JlZ29yaWFuVG9FdGhpb3BpYW4odmFsKTtcbiAgICAgICAgW3RoaXMuX3llYXIsIHRoaXMuX21vbnRoLCB0aGlzLl9kYXRlXSA9IFtcbiAgICAgICAgICByZXN1bHQuZ2V0RnVsbFllYXIoKSxcbiAgICAgICAgICByZXN1bHQuZ2V0TW9udGgoKSxcbiAgICAgICAgICByZXN1bHQuZ2V0RGF0ZSgpLFxuICAgICAgICBdO1xuICAgICAgICB0aGlzLl9nYyA9IEV0aGlvcGlhbkRhdGUuZXRoaW9waWFuVG9HcmVnb3JpYW4odGhpcy5feWVhciwgdGhpcy5fbW9udGgsIHRoaXMuX2RhdGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEFyZ3VtZW50IEV4Y2VwdGlvbicpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodmFsICE9IG51bGwgJiYgbW9udGggIT0gbnVsbCAmJiBkYXkgIT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgICAgdGhpcy5feWVhciA9IHZhbDtcbiAgICAgIHRoaXMuX21vbnRoID0gbW9udGg7XG4gICAgICB0aGlzLl9kYXRlID0gZGF5O1xuICAgICAgdGhpcy5fZ2MgPSBFdGhpb3BpYW5EYXRlLmV0aGlvcGlhblRvR3JlZ29yaWFuKHRoaXMuX3llYXIsIHRoaXMuX21vbnRoLCB0aGlzLl9kYXRlKTtcbiAgICB9XG4gIH1cblxuICBnZXREYXRlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGU7XG4gIH1cblxuICBnZXREYXkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZ2MuZ2V0RGF5KCk7XG4gIH1cblxuICBnZXREYXlPZldlZWsoKSB7XG4gICAgY29uc3Qgd2Vla0RheSA9IHRoaXMuZ2V0R0NXZWVrRGF5KCk7XG4gICAgcmV0dXJuIFdFRUtfTkFNRVNbd2Vla0RheV07XG4gIH1cblxuICBnZXRGdWxsWWVhcigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl95ZWFyO1xuICB9XG5cbiAgZ2V0R3JlZ29yaWFuRGF0ZSgpOiBEYXRlIHtcbiAgICByZXR1cm4gdGhpcy5fZ2M7XG4gIH1cblxuICBnZXRHQ1dlZWtEYXkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fZ2MuZ2V0RGF5KCk7XG4gIH1cblxuICBnZXRNb250aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9tb250aDtcbiAgfVxuXG4gIGdldE1vbnRoTmFtZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fbW9udGggPj0gMCAmJiB0aGlzLl9tb250aCA8IE1PTlRIU19OQU1FUy5sZW5ndGggPyBNT05USFNfTkFNRVNbdGhpcy5fbW9udGhdIDogbnVsbDtcbiAgfVxuXG4gIGdldFNob3J0TW9udGhOYW1lKCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9tb250aCA+PSAwICYmIHRoaXMuX21vbnRoIDwgU0hPUlRfTU9OVEhTX05BTUVTLmxlbmd0aFxuICAgICAgPyBTSE9SVF9NT05USFNfTkFNRVNbdGhpcy5fbW9udGhdXG4gICAgICA6IG51bGw7XG4gIH1cblxuICBnZXRIb3VycygpOiBudW1iZXIge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZ2V0TWludXRlcygpOiBudW1iZXIge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZ2V0U2Vjb25kcygpOiBudW1iZXIge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZ2V0TWlsbGlzZWNvbmRzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBgJHt0aGlzLl95ZWFyfS0ke3RoaXMuX21vbnRoICsgMX0tJHt0aGlzLl9kYXRlfWA7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBFdGhpb3BpYW4gZGF0ZSB0byBHcmVnb3JpYW4gYW5kIHJldHVybnMgRGF0ZSBpbnN0YW5jZSByZXByZXNlbnRpbmcgR3JlZ29yaWFuIERhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB2YWwgLSBBIG51bWVyaWMgeWVhciB2YWx1ZSBpZiB0aGUgc2Vjb25kIGFuZCB0aGlyZCBwYXJhbWV0ZXJzIGFyZVxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdmlkZWQsIGl0IHNob3VsZCBiZSBhIGRhdGUgc3RyaW5nIGlmIG5vdFxuICAgKiBAcGFyYW0gbW9udGggQSB6ZXJvLWJhc2VkIG51bWVyaWMgdmFsdWUgZm9yIHRoZSBtb250aFxuICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAoMCBmb3Ig4YiY4Yi14Yqo4Yio4YidLCAxMiBmb3Ig4Yyz4YyJ4Yic4YqVKVxuICAgKiBAcGFyYW0gZGF5IEEgbnVtZXJpYyB2YWx1ZSBlcXVhbCBmb3IgdGhlIGRheSBvZiB0aGUgbW9udGguXG4gICAqXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuICBzdGF0aWMgZXRoaW9waWFuVG9HcmVnb3JpYW4oXG4gICAgdmFsPzogRXRoaW9waWFuRGF0ZSB8IHN0cmluZyB8IG51bWJlcixcbiAgICBtb250aD86IG51bWJlcixcbiAgICBkYXk/OiBudW1iZXIsXG4gICk6IERhdGUge1xuICAgIGxldCBlYzogW251bWJlciwgbnVtYmVyLCBudW1iZXJdO1xuICAgIGlmICh2YWwgIT0gbnVsbCAmJiBtb250aCA9PSBudWxsICYmIGRheSA9PSBudWxsICYmIHR5cGVvZiB2YWwgIT09ICdudW1iZXInKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgY29uc3QgZXREYXRlID0gbmV3IEV0aGlvcGlhbkRhdGUodmFsKTtcbiAgICAgICAgZWMgPSBbZXREYXRlLmdldEZ1bGxZZWFyKCksIGV0RGF0ZS5nZXRNb250aCgpICsgMSwgZXREYXRlLmdldERhdGUoKV07XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnICYmIHZhbCBpbnN0YW5jZW9mIEV0aGlvcGlhbkRhdGUpIHtcbiAgICAgICAgY29uc3QgW3ksIG0sIGRdID0gW3ZhbC5nZXRGdWxsWWVhcigpLCB2YWwuZ2V0TW9udGgoKSArIDEsIHZhbC5nZXREYXRlKCldO1xuICAgICAgICBlYyA9IFt5LCBtLCBkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBBcmd1bWVudCBFeGNlcHRpb24nKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHZhbCAhPSBudWxsICYmIG1vbnRoICE9IG51bGwgJiYgZGF5ICE9IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICAgIGVjID0gW3ZhbCwgbW9udGggKyAxLCBkYXldO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgQXJndW1lbnQgRXhjZXB0aW9uJyk7XG4gICAgfVxuICAgIGNvbnN0IGdjID0gdG9HQyhlYyk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKGdjWzBdLCBnY1sxXSAtIDEsIGdjWzJdKTtcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gdmFsIC0gQSBudW1lcmljIHllYXIgdmFsdWUgaWYgdGhlIHNlY29uZCBhbmQgdGhpcmQgcGFyYW1ldGVycyBhcmVcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3ZpZGVkLCBpdCBzaG91bGQgYmUgYSBkYXRlIHN0cmluZyBpZiBub3RcbiAgICogQHBhcmFtIG1vbnRoIEEgemVyby1iYXNlZCBudW1lcmljIHZhbHVlIGZvciB0aGUgbW9udGhcbiAgICogICAgICAgICAgICAgICAgICAgICAgICAgKDAgZm9yIEphbnVhcnksIDExIGZvciBEZWNlbWJlcilcbiAgICogQHBhcmFtIGRheSBBIG51bWVyaWMgdmFsdWUgZXF1YWwgZm9yIHRoZSBkYXkgb2YgdGhlIG1vbnRoLlxuICAgKlxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cbiAgc3RhdGljIGdyZWdvcmlhblRvRXRoaW9waWFuKFxuICAgIHZhbD86IERhdGUgfCBzdHJpbmcgfCBudW1iZXIsXG4gICAgbW9udGg/OiBudW1iZXIsXG4gICAgZGF5PzogbnVtYmVyLFxuICApOiBFdGhpb3BpYW5EYXRlIHtcbiAgICBsZXQgZ2M6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXTtcbiAgICBpZiAodmFsICE9IG51bGwgJiYgbW9udGggPT0gbnVsbCAmJiBkYXkgPT0gbnVsbCAmJiB0eXBlb2YgdmFsICE9PSAnbnVtYmVyJykge1xuICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IGdjRGF0ZSA9IG5ldyBEYXRlKHZhbCk7XG4gICAgICAgIGdjID0gW2djRGF0ZS5nZXRGdWxsWWVhcigpLCBnY0RhdGUuZ2V0TW9udGgoKSArIDEsIGdjRGF0ZS5nZXREYXRlKCldO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiB2YWwgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIGNvbnN0IFt5LCBtLCBkXSA9IFt2YWwuZ2V0RnVsbFllYXIoKSwgdmFsLmdldE1vbnRoKCkgKyAxLCB2YWwuZ2V0RGF0ZSgpXTtcbiAgICAgICAgZ2MgPSBbeSwgbSwgZF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgQXJndW1lbnQgRXhjZXB0aW9uJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh2YWwgIT0gbnVsbCAmJiBtb250aCAhPSBudWxsICYmIGRheSAhPSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgICBnYyA9IFt2YWwsIG1vbnRoICsgMSwgZGF5XTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIEFyZ3VtZW50IEV4Y2VwdGlvbicpO1xuICAgIH1cbiAgICBjb25zdCBlYyA9IHRvRUMoZ2MpO1xuICAgIHJldHVybiBuZXcgRXRoaW9waWFuRGF0ZShlY1swXSwgZWNbMV0gLSAxLCBlY1syXSk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgRXRoaW9waWFuIGRhdGUgZnJvbSBzdHJpbmdcbiAgICpcbiAgICogQHBhcmFtIGRhdGVTdHJpbmcgYSBkYXRlIHN0cmluZyB0byBwYXJzZVxuICAgKiBAcGFyYW0gcGF0dGVybiBhIHBhcnNpbmcgcGF0dGVyblxuICAgKlxuICAgKiBAcmV0dXJucyBFdGhpb3BpYW5EYXRlXG4gICAqL1xuICBzdGF0aWMgcGFyc2UoZGF0ZVN0cmluZzogc3RyaW5nKTogRXRoaW9waWFuRGF0ZSB8IG51bGwge1xuICAgIGlmICghZGF0ZVN0cmluZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IGRhdGVTdHJpbmcuc3BsaXQoJy0nKTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PT0gMykge1xuICAgICAgY29uc3QgW3ksIG0sIGRdID0gcmVzdWx0O1xuICAgICAgcmV0dXJuIG5ldyBFdGhpb3BpYW5EYXRlKHBhcnNlSW50KHksIDEwKSwgcGFyc2VJbnQobSwgMTApIC0gMSwgcGFyc2VJbnQoZCwgMTApKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBQYXJzaW5nRXJyb3I6IENhbid0IHBhcnNlICR7ZGF0ZVN0cmluZ31gKTtcbiAgfVxufVxuIl19