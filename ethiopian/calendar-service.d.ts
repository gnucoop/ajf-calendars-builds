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
import { AjfCalendarEntry, AjfCalendarParams, AjfCalendarService, AjfCalendarView, AjfCalendarViewMode } from '@ajf/core/calendar';
import * as i0 from "@angular/core";
export declare class AjfEthiopianCalendarService extends AjfCalendarService {
    buildView(params: AjfCalendarParams): AjfCalendarView;
    entryLabel(entry: AjfCalendarEntry): string;
    monthBounds(date: Date, isoMode: boolean): {
        start: Date;
        end: Date;
    };
    nextView(viewDate: Date, viewMode: AjfCalendarViewMode): Date;
    previousView(viewDate: Date, viewMode: AjfCalendarViewMode): Date;
    private _ecMonthHeaderRow;
    private _ecYearCalendarRows;
    private _ecDecadeCalendarRows;
    static ɵfac: i0.ɵɵFactoryDeclaration<AjfEthiopianCalendarService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AjfEthiopianCalendarService>;
}
