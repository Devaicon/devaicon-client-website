/**
 * How logged hour quantities are rendered across the time logger.
 *
 * "decimal" is the raw stored value ("7.5 h"); "human" reads it back as clock
 * time ("7h 30m"). This is a display preference only — nothing about how hours
 * are entered, validated or stored changes with it.
 */
export type TimeFormat = "decimal" | "human";

/** localStorage key for the persisted format preference. */
export const TIME_FORMAT_STORAGE_KEY = "devaicon-time-format";

/** Decimal is the default: it matches how hours are typed into the log form. */
export const DEFAULT_TIME_FORMAT: TimeFormat = "decimal";

export const TIME_FORMATS: TimeFormat[] = ["decimal", "human"];
