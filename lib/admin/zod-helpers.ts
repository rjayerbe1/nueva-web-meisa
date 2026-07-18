import { z } from "zod"

// Los inputs del admin mandan "" cuando el campo queda vacío. Sin preprocess,
// z.coerce.number("") daría 0 y z.coerce.date("") daría Invalid Date.
const emptyToNull = (v: unknown) => (v === "" || v === undefined ? null : v)

export const zNullableString = z.preprocess(
  emptyToNull,
  z.string().min(1).nullable(),
)

export const zNullableInt = z.preprocess(
  emptyToNull,
  z.coerce.number().int().nullable(),
)

export const zNullableDate = z.preprocess(
  emptyToNull,
  z.coerce.date().nullable(),
)
