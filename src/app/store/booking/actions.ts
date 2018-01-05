import { Action } from '@ngrx/store';

export const SET_DATA = '[booking] SET_DATA';
export const GET_DATA = '[booking] GET_DATA';
export const SAVE_PASSENGER = '[booking] SAVE_PASSENGER';
export const SAVE_PRIMARY_CONTACT = '[booking] SAVE_PRIMARY_CONTACT';
export const COMMIT = '[booking] COMMIT';

export class SetData implements Action {
  readonly type = SET_DATA;

  constructor(public payload: object) { }
}

export class GetData implements Action {
  readonly type = GET_DATA;

  constructor(public payload?: {
    initial: boolean
  }) { }
}

export class SavePassenger implements Action {
  readonly type = SAVE_PASSENGER;

  constructor(public payload: {
    firstName: string,
    lastName: string
  }) { }
}

export class SavePrimaryContact implements Action {
  readonly type = SAVE_PRIMARY_CONTACT;

  constructor(public payload: {
    firstName: string,
    lastName: string,
    phoneNumber: string
  }) { }
}

export class Commit implements Action {
  readonly type = COMMIT;
}

export type All =
  SetData |
  GetData |
  SavePassenger |
  SavePrimaryContact |
  Commit;
