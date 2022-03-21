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
import { AjfCalendarService, } from '@ajf/core/calendar';
import { Injectable } from '@angular/core';
import { addDays, addWeeks, addYears, endOfISOWeek, getISODay, setISODay, startOfISOWeek, startOfWeek, subWeeks, } from 'date-fns';
import { EthiopianDate } from './ethiopian-date';
import * as i0 from "@angular/core";
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
export class AjfEthiopianCalendarService extends AjfCalendarService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsZW5kYXItc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2NhbGVuZGFycy9ldGhpb3BpYW4vc3JjL2NhbGVuZGFyLXNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JHO0FBRUgsT0FBTyxFQUdMLGtCQUFrQixHQUduQixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUNMLE9BQU8sRUFDUCxRQUFRLEVBQ1IsUUFBUSxFQUNSLFlBQVksRUFDWixTQUFTLEVBQ1QsU0FBUyxFQUNULGNBQWMsRUFDZCxXQUFXLEVBQ1gsUUFBUSxHQUNULE1BQU0sVUFBVSxDQUFDO0FBRWxCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQzs7QUFFL0MsU0FBUyxZQUFZLENBQUMsS0FBYSxFQUFFLElBQVk7SUFDL0MsSUFBSSxLQUFLLEdBQUcsRUFBRSxFQUFFO1FBQ2QsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELE9BQU8sSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxJQUFtQjtJQUN6QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDaEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlCLE1BQU0sS0FBSyxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6QyxNQUFNLEdBQUcsR0FBRyxJQUFJLGFBQWEs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O1FBQzdDLElBQUksT0FBTyxHQUFTLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXhFLElBQUksSUFBSSxHQUF5QixFQUFFLENBQUM7UUFDcEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQixJQUFJLEdBQUcsR0FBdUIsRUFBRSxDQUFDO1lBQ2pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFCLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUM3QixJQUFJLFFBQVEsR0FBcUIsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDO2dCQUM5RSxRQUFRLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUM5RCxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNuQixPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzthQUNoQztZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDaEI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O3dIQXpLVSwyQkFBMkI7NEhBQTNCLDJCQUEyQixjQURmLE1BQU07MkZBQ2xCLDJCQUEyQjtrQkFEdkMsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgKEMpIEdudWNvb3Agc29jLiBjb29wLlxuICpcbiAqIFRoaXMgZmlsZSBpcyBwYXJ0IG9mIHRoZSBBZHZhbmNlZCBKU09OIGZvcm1zIChhamYpLlxuICpcbiAqIEFkdmFuY2VkIEpTT04gZm9ybXMgKGFqZikgaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXNcbiAqIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLFxuICogb3IgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiBBZHZhbmNlZCBKU09OIGZvcm1zIChhamYpIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlIEdOVSBBZmZlcm9cbiAqIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgQWZmZXJvIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqIGFsb25nIHdpdGggQWR2YW5jZWQgSlNPTiBmb3JtcyAoYWpmKS5cbiAqIElmIG5vdCwgc2VlIGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8uXG4gKlxuICovXG5cbmltcG9ydCB7XG4gIEFqZkNhbGVuZGFyRW50cnksXG4gIEFqZkNhbGVuZGFyUGFyYW1zLFxuICBBamZDYWxlbmRhclNlcnZpY2UsXG4gIEFqZkNhbGVuZGFyVmlldyxcbiAgQWpmQ2FsZW5kYXJWaWV3TW9kZSxcbn0gZnJvbSAnQGFqZi9jb3JlL2NhbGVuZGFyJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBhZGREYXlzLFxuICBhZGRXZWVrcyxcbiAgYWRkWWVhcnMsXG4gIGVuZE9mSVNPV2VlayxcbiAgZ2V0SVNPRGF5LFxuICBzZXRJU09EYXksXG4gIHN0YXJ0T2ZJU09XZWVrLFxuICBzdGFydE9mV2VlayxcbiAgc3ViV2Vla3MsXG59IGZyb20gJ2RhdGUtZm5zJztcblxuaW1wb3J0IHtFdGhpb3BpYW5EYXRlfSBmcm9tICcuL2V0aGlvcGlhbi1kYXRlJztcblxuZnVuY3Rpb24gZ2V0TW9udGhEYXlzKG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlcik6IG51bWJlciB7XG4gIGlmIChtb250aCA8IDEyKSB7XG4gICAgcmV0dXJuIDMwO1xuICB9XG4gIHJldHVybiB5ZWFyICUgNCA9PT0gMyA/IDYgOiA1O1xufVxuXG5mdW5jdGlvbiBnZXRNb250aEJvdW5kcyhkYXRlOiBFdGhpb3BpYW5EYXRlKToge3N0YXJ0OiBFdGhpb3BpYW5EYXRlOyBlbmQ6IEV0aGlvcGlhbkRhdGV9IHtcbiAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgY29uc3QgbW9udGggPSBkYXRlLmdldE1vbnRoKCk7XG4gIGNvbnN0IHN0YXJ0ID0gbmV3IEV0aGlvcGlhbkRhdGUoeWVhciwgbW9udGgsIDEpO1xuICBjb25zdCBlbmREYXkgPSBnZXRNb250aERheXMobW9udGgsIHllYXIpO1xuICBjb25zdCBlbmQgPSBuZXcgRXRoaW9waWFuRGF0ZSh5ZWFyLCBtb250aCwgZW5kRGF5KTtcbiAgcmV0dXJuIHtzdGFydCwgZW5kfTtcbn1cblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgQWpmRXRoaW9waWFuQ2FsZW5kYXJTZXJ2aWNlIGV4dGVuZHMgQWpmQ2FsZW5kYXJTZXJ2aWNlIHtcbiAgb3ZlcnJpZGUgYnVpbGRWaWV3KHBhcmFtczogQWpmQ2FsZW5kYXJQYXJhbXMpOiBBamZDYWxlbmRhclZpZXcge1xuICAgIGNvbnN0IHt2aWV3TW9kZX0gPSBwYXJhbXM7XG4gICAgY29uc3Qgdmlld0RhdGUgPSBFdGhpb3BpYW5EYXRlLmdyZWdvcmlhblRvRXRoaW9waWFuKHBhcmFtcy52aWV3RGF0ZSk7XG4gICAgc3dpdGNoICh2aWV3TW9kZSkge1xuICAgICAgY2FzZSAnZGVjYWRlJzpcbiAgICAgICAgbGV0IGN1clllYXI6IG51bWJlciA9IHZpZXdEYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgICAgIGxldCBmaXJzdFllYXIgPSBjdXJZZWFyIC0gKGN1clllYXIgJSAxMCkgKyAxO1xuICAgICAgICBsZXQgbGFzdFllYXIgPSBmaXJzdFllYXIgKyAxMTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoZWFkZXI6IGAke2ZpcnN0WWVhcn0gLSAke2xhc3RZZWFyfWAsXG4gICAgICAgICAgaGVhZGVyUm93OiBbXSxcbiAgICAgICAgICByb3dzOiB0aGlzLl9lY0RlY2FkZUNhbGVuZGFyUm93cyhwYXJhbXMpLFxuICAgICAgICB9O1xuICAgICAgY2FzZSAneWVhcic6XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaGVhZGVyOiBgJHt2aWV3RGF0ZS5nZXRGdWxsWWVhcigpfWAsXG4gICAgICAgICAgaGVhZGVyUm93OiBbXSxcbiAgICAgICAgICByb3dzOiB0aGlzLl9lY1llYXJDYWxlbmRhclJvd3MocGFyYW1zKSxcbiAgICAgICAgfTtcbiAgICAgIGNhc2UgJ21vbnRoJzpcbiAgICAgICAgY29uc3QgdmlldyA9IHN1cGVyLmJ1aWxkVmlldyhwYXJhbXMpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGhlYWRlcjogYCR7dmlld0RhdGUuZ2V0U2hvcnRNb250aE5hbWUoKX0gJHt2aWV3RGF0ZS5nZXRGdWxsWWVhcigpfWAsXG4gICAgICAgICAgaGVhZGVyUm93OiB0aGlzLl9lY01vbnRoSGVhZGVyUm93KHBhcmFtcyksXG4gICAgICAgICAgcm93czogdmlldy5yb3dzLFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc3VwZXIuYnVpbGRWaWV3KHBhcmFtcyk7XG4gIH1cblxuICBvdmVycmlkZSBlbnRyeUxhYmVsKGVudHJ5OiBBamZDYWxlbmRhckVudHJ5KTogc3RyaW5nIHtcbiAgICBjb25zdCBlY0RhdGUgPSBFdGhpb3BpYW5EYXRlLmdyZWdvcmlhblRvRXRoaW9waWFuKGVudHJ5LmRhdGUpO1xuICAgIGlmIChlbnRyeS50eXBlID09PSAnZGF5Jykge1xuICAgICAgcmV0dXJuIGAke2VjRGF0ZS5nZXREYXRlKCl9YDtcbiAgICB9XG4gICAgaWYgKGVudHJ5LnR5cGUgPT09ICdtb250aCcpIHtcbiAgICAgIHJldHVybiBgJHtlY0RhdGUuZ2V0TW9udGhOYW1lKCl9YDtcbiAgICB9XG4gICAgcmV0dXJuIGAke2VjRGF0ZS5nZXRGdWxsWWVhcigpfWA7XG4gIH1cblxuICBvdmVycmlkZSBtb250aEJvdW5kcyhkYXRlOiBEYXRlLCBpc29Nb2RlOiBib29sZWFuKToge3N0YXJ0OiBEYXRlOyBlbmQ6IERhdGV9IHtcbiAgICBpZiAoIWlzb01vZGUpIHtcbiAgICAgIGNvbnN0IGVjRGF0ZSA9IEV0aGlvcGlhbkRhdGUuZ3JlZ29yaWFuVG9FdGhpb3BpYW4oZGF0ZSk7XG4gICAgICBjb25zdCB7c3RhcnQsIGVuZH0gPSBnZXRNb250aEJvdW5kcyhlY0RhdGUpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IEV0aGlvcGlhbkRhdGUuZXRoaW9waWFuVG9HcmVnb3JpYW4oc3RhcnQpLFxuICAgICAgICBlbmQ6IEV0aGlvcGlhbkRhdGUuZXRoaW9waWFuVG9HcmVnb3JpYW4oZW5kKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpc29EYXkgPSBnZXRJU09EYXkoZGF0ZSk7XG4gICAgICBjb25zdCBlY0RhdGUgPSBFdGhpb3BpYW5EYXRlLmdyZWdvcmlhblRvRXRoaW9waWFuKGRhdGUpO1xuICAgICAgbGV0IHtzdGFydCwgZW5kfSA9IGdldE1vbnRoQm91bmRzKGVjRGF0ZSk7XG4gICAgICBpZiAoZWNEYXRlLmdldE1vbnRoKCkgPT09IDEyKSB7XG4gICAgICAgIHN0YXJ0ID0gRXRoaW9waWFuRGF0ZS5ncmVnb3JpYW5Ub0V0aGlvcGlhbihzdGFydE9mSVNPV2VlayhzdGFydC5nZXRHcmVnb3JpYW5EYXRlKCkpKTtcbiAgICAgICAgZW5kID0gRXRoaW9waWFuRGF0ZS5ncmVnb3JpYW5Ub0V0aGlvcGlhbihlbmRPZklTT1dlZWsoZW5kLmdldEdyZWdvcmlhbkRhdGUoKSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0ZSA9IGlzb0RheSA8IDQgPyBlbmRPZklTT1dlZWsoZGF0ZSkgOiBzdGFydE9mSVNPV2VlayhkYXRlKTtcbiAgICAgICAgY29uc3Qgc3RhcnRXZWVrRGF5ID0gc3RhcnQuZ2V0RGF5KCk7XG4gICAgICAgIGNvbnN0IGVuZFdlZWtEYXkgPSBlbmQuZ2V0RGF5KCk7XG4gICAgICAgIGlmIChzdGFydFdlZWtEYXkgPT0gMCB8fCBzdGFydFdlZWtEYXkgPiA0KSB7XG4gICAgICAgICAgc3RhcnQgPSBFdGhpb3BpYW5EYXRlLmdyZWdvcmlhblRvRXRoaW9waWFuKGFkZFdlZWtzKHN0YXJ0LmdldEdyZWdvcmlhbkRhdGUoKSwgMSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmRXZWVrRGF5ID4gMCAmJiBlbmRXZWVrRGF5IDwgNCkge1xuICAgICAgICAgIGVuZCA9IEV0aGlvcGlhbkRhdGUuZ3JlZ29yaWFuVG9FdGhpb3BpYW4oc3ViV2Vla3MoZW5kLmdldEdyZWdvcmlhbkRhdGUoKSwgMSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGFydDogc3RhcnRPZklTT1dlZWsoc3RhcnQuZ2V0R3JlZ29yaWFuRGF0ZSgpKSxcbiAgICAgICAgZW5kOiBlbmRPZklTT1dlZWsoZW5kLmdldEdyZWdvcmlhbkRhdGUoKSksXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIG92ZXJyaWRlIG5leHRWaWV3KHZpZXdEYXRlOiBEYXRlLCB2aWV3TW9kZTogQWpmQ2FsZW5kYXJWaWV3TW9kZSk6IERhdGUge1xuICAgIGlmICh2aWV3TW9kZSA9PT0gJ21vbnRoJykge1xuICAgICAgY29uc3QgZWNEYXRlID0gRXRoaW9waWFuRGF0ZS5ncmVnb3JpYW5Ub0V0aGlvcGlhbih2aWV3RGF0ZSk7XG4gICAgICBsZXQgeWVhciA9IGVjRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgbGV0IG1vbnRoID0gZWNEYXRlLmdldE1vbnRoKCk7XG4gICAgICBpZiAobW9udGggPT09IDEyKSB7XG4gICAgICAgIG1vbnRoID0gMDtcbiAgICAgICAgeWVhciArPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW9udGggKz0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBFdGhpb3BpYW5EYXRlLmV0aGlvcGlhblRvR3JlZ29yaWFuKG5ldyBFdGhpb3BpYW5EYXRlKHllYXIsIG1vbnRoLCAxKSk7XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5uZXh0Vmlldyh2aWV3RGF0ZSwgdmlld01vZGUpO1xuICB9XG5cbiAgb3ZlcnJpZGUgcHJldmlvdXNWaWV3KHZpZXdEYXRlOiBEYXRlLCB2aWV3TW9kZTogQWpmQ2FsZW5kYXJWaWV3TW9kZSk6IERhdGUge1xuICAgIGlmICh2aWV3TW9kZSA9PT0gJ21vbnRoJykge1xuICAgICAgY29uc3QgZWNEYXRlID0gRXRoaW9waWFuRGF0ZS5ncmVnb3JpYW5Ub0V0aGlvcGlhbih2aWV3RGF0ZSk7XG4gICAgICBsZXQgeWVhciA9IGVjRGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgICAgbGV0IG1vbnRoID0gZWNEYXRlLmdldE1vbnRoKCk7XG4gICAgICBpZiAobW9udGggPT09IDApIHtcbiAgICAgICAgbW9udGggPSAxMjtcbiAgICAgICAgeWVhciAtPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbW9udGggLT0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBFdGhpb3BpYW5EYXRlLmV0aGlvcGlhblRvR3JlZ29yaWFuKG5ldyBFdGhpb3BpYW5EYXRlKHllYXIsIG1vbnRoLCAxKSk7XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5wcmV2aW91c1ZpZXcodmlld0RhdGUsIHZpZXdNb2RlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2VjTW9udGhIZWFkZXJSb3cocGFyYW1zOiBBamZDYWxlbmRhclBhcmFtcyk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCB7aXNvTW9kZSwgdmlld0RhdGV9ID0gcGFyYW1zO1xuICAgIGxldCBjdXJEYXRlOiBEYXRlO1xuICAgIGlmIChpc29Nb2RlKSB7XG4gICAgICBjdXJEYXRlID0gc2V0SVNPRGF5KHN0YXJ0T2ZXZWVrKHZpZXdEYXRlKSwgMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1ckRhdGUgPSBzdGFydE9mV2Vlayh2aWV3RGF0ZSk7XG4gICAgfVxuICAgIGxldCB3ZWVrRGF5TmFtZXM6IHN0cmluZ1tdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA3OyBpKyspIHtcbiAgICAgIGNvbnN0IGVjRGF0ZSA9IEV0aGlvcGlhbkRhdGUuZ3JlZ29yaWFuVG9FdGhpb3BpYW4oY3VyRGF0ZSk7XG4gICAgICB3ZWVrRGF5TmFtZXMucHVzaChlY0RhdGUuZ2V0RGF5T2ZXZWVrKCkpO1xuICAgICAgY3VyRGF0ZSA9IGFkZERheXMoY3VyRGF0ZSwgMSk7XG4gICAgfVxuICAgIHJldHVybiB3ZWVrRGF5TmFtZXM7XG4gIH1cblxuICBwcml2YXRlIF9lY1llYXJDYWxlbmRhclJvd3MocGFyYW1zOiBBamZDYWxlbmRhclBhcmFtcyk6IEFqZkNhbGVuZGFyRW50cnlbXVtdIHtcbiAgICBjb25zdCB7dmlld0RhdGUsIHNlbGVjdGlvbn0gPSBwYXJhbXM7XG4gICAgY29uc3QgeWVhciA9IEV0aGlvcGlhbkRhdGUuZ3JlZ29yaWFuVG9FdGhpb3BpYW4odmlld0RhdGUpLmdldEZ1bGxZZWFyKCk7XG4gICAgbGV0IGN1ckRhdGU6IEV0aGlvcGlhbkRhdGU7XG5cbiAgICBsZXQgcm93czogQWpmQ2FsZW5kYXJFbnRyeVtdW10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSA0OyBpKyspIHtcbiAgICAgIGxldCByb3c6IEFqZkNhbGVuZGFyRW50cnlbXSA9IFtdO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgICAgY29uc3QgY3VyTW9udGggPSBpICogMyArIGo7XG4gICAgICAgIGlmIChjdXJNb250aCA8IDEzKSB7XG4gICAgICAgICAgY3VyRGF0ZSA9IG5ldyBFdGhpb3BpYW5EYXRlKHllYXIsIGN1ck1vbnRoLCAxKTtcbiAgICAgICAgICBsZXQgZGF0ZSA9IEV0aGlvcGlhbkRhdGUuZXRoaW9waWFuVG9HcmVnb3JpYW4oY3VyRGF0ZSk7XG4gICAgICAgICAgbGV0IG5ld0VudHJ5OiBBamZDYWxlbmRhckVudHJ5ID0ge3R5cGU6ICdtb250aCcsIGRhdGUsIHNlbGVjdGVkOiAnbm9uZSd9O1xuICAgICAgICAgIG5ld0VudHJ5LnNlbGVjdGVkID0gdGhpcy5pc0VudHJ5U2VsZWN0ZWQobmV3RW50cnksIHNlbGVjdGlvbik7XG4gICAgICAgICAgcm93LnB1c2gobmV3RW50cnkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByb3dzLnB1c2gocm93KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm93cztcbiAgfVxuXG4gIHByaXZhdGUgX2VjRGVjYWRlQ2FsZW5kYXJSb3dzKHBhcmFtczogQWpmQ2FsZW5kYXJQYXJhbXMpOiBBamZDYWxlbmRhckVudHJ5W11bXSB7XG4gICAgY29uc3Qge3ZpZXdEYXRlLCBzZWxlY3Rpb259ID0gcGFyYW1zO1xuICAgIGNvbnN0IGVjRGF0ZSA9IEV0aGlvcGlhbkRhdGUuZ3JlZ29yaWFuVG9FdGhpb3BpYW4odmlld0RhdGUpO1xuICAgIGxldCBjdXJZZWFyOiBudW1iZXIgPSBlY0RhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICBsZXQgZmlyc3RZZWFyID0gY3VyWWVhciAtIChjdXJZZWFyICUgMTApICsgMTtcbiAgICBsZXQgY3VyRGF0ZTogRGF0ZSA9IEV0aGlvcGlhbkRhdGUuZXRoaW9waWFuVG9HcmVnb3JpYW4oZmlyc3RZZWFyLCAwLCAxKTtcblxuICAgIGxldCByb3dzOiBBamZDYWxlbmRhckVudHJ5W11bXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICBsZXQgcm93OiBBamZDYWxlbmRhckVudHJ5W10gPSBbXTtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgMzsgaisrKSB7XG4gICAgICAgIGxldCBkYXRlID0gbmV3IERhdGUoY3VyRGF0ZSk7XG4gICAgICAgIGxldCBuZXdFbnRyeTogQWpmQ2FsZW5kYXJFbnRyeSA9IHt0eXBlOiAneWVhcicsIGRhdGU6IGRhdGUsIHNlbGVjdGVkOiAnbm9uZSd9O1xuICAgICAgICBuZXdFbnRyeS5zZWxlY3RlZCA9IHRoaXMuaXNFbnRyeVNlbGVjdGVkKG5ld0VudHJ5LCBzZWxlY3Rpb24pO1xuICAgICAgICByb3cucHVzaChuZXdFbnRyeSk7XG4gICAgICAgIGN1ckRhdGUgPSBhZGRZZWFycyhjdXJEYXRlLCAxKTtcbiAgICAgIH1cbiAgICAgIHJvd3MucHVzaChyb3cpO1xuICAgIH1cblxuICAgIHJldHVybiByb3dzO1xuICB9XG59XG4iXX0=