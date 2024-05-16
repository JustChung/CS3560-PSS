import { either } from "fp-ts";
import { isLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import * as T from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { TransientTaskType } from "./classes/TransientTask";
import { AntiTaskType } from "./classes/AntiTask";
import { RecurringTaskType } from "./classes/RecurringTask";

interface CustomNumber {
  readonly number: unique symbol; // use `unique symbol` here to ensure uniqueness across modules / packages
}

const TaskObject = T.type({
  Name: T.string,
  Type: T.string,
  StartTime: T.brand(
    T.number,
    (val): val is T.Branded<number, CustomNumber> => val >= 0 && val < 24 && val % 0.25 === 0,
    "number"
  ),
  Duration: T.brand(
    T.number,
    (val): val is T.Branded<number, CustomNumber> => val > 0 && val <= 24 && val % 0.25 === 0,
    "number"
  ),
});

export const TransientObject = T.intersection([
  TaskObject,
  T.type({
    Type: T.union([
      T.literal(TransientTaskType.Appointment),
      T.literal(TransientTaskType.Shopping),
      T.literal(TransientTaskType.Visit),
    ]),
    Date: T.brand(T.number, (val): val is T.Branded<number, CustomNumber> => val >= 0 && val <= 99999999, "number"),
  }),
]);
export const AntiObject = T.intersection([
  TaskObject,
  T.type({
    Type: T.literal(AntiTaskType.Cancellation),
    Date: T.brand(T.number, (val): val is T.Branded<number, CustomNumber> => val >= 0 && val <= 99999999, "number"),
  }),
]);
const RecurringObjectFormat = T.intersection([
  TaskObject,
  T.type({
    Type: T.union([
      T.literal(RecurringTaskType.Class),
      T.literal(RecurringTaskType.Exercise),
      T.literal(RecurringTaskType.Meal),
      T.literal(RecurringTaskType.Sleep),
      T.literal(RecurringTaskType.Study),
      T.literal(RecurringTaskType.Work),
    ]),
    StartDate: T.brand(
      T.number,
      (val): val is T.Branded<number, CustomNumber> => val >= 0 && val <= 99999999,
      "number"
    ),
    EndDate: T.brand(T.number, (val): val is T.Branded<number, CustomNumber> => val >= 0 && val <= 99999999, "number"),
    Frequency: T.brand(
      T.number,
      (val): val is T.Branded<number, CustomNumber> => val >= 0 && val <= 99999999,
      "number"
    ),
  }),
]);
export const RecurringObject = new T.Type(
  "RecurringObject",
  RecurringObjectFormat.is,
  (i: unknown, context: T.Context) => {
    return pipe(
      RecurringObjectFormat.validate(i, context),
      either.chain((object) => (object.EndDate > object.StartDate ? T.success(object) : T.failure(i, context)))
    );
  },
  T.identity
);

const PSSData = T.array(T.union([TransientObject, AntiObject, RecurringObject]));

export function decodeJSON(data: unknown): T.TypeOf<typeof PSSData> {
  const decode = PSSData.decode(data);
  if (isLeft(decode)) {
    throw Error(`Could not validate data: ${PathReporter.report(decode).join("\n")}`);
  }

  return decode.right;
}
