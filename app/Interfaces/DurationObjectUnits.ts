export interface DurationObjectUnits {
    year?: number;
    years?: number;
    quarter?: number;
    quarters?: number;
    month?: number;
    months?: number;
    week?: number;
    weeks?: number;
    day?: number;
    days?: number;
    hour?: number;
    hours?: number;
    minute?: number;
    minutes?: number;
    second?: number;
    seconds?: number;
    millisecond?: number;
    milliseconds?: number;
}

export type DurationUnit = keyof DurationObjectUnits;