import {
  TInstrument,
  Modify,
  TRawTag,
  TRawransaction,
  TTransactionType,
  TRawAccount,
  TTagId,
  ById,
} from 'types'
import { getType } from './helpers'

interface DataSources {
  instruments: { [id: number]: TInstrument }
  accounts: { [id: string]: TRawAccount }
  tags: { [id: string]: TRawTag }
}

export type PopulatedTransaction = Modify<
  TRawransaction,
  {
    incomeInstrument: TInstrument
    incomeAccount: TRawAccount
    opIncomeInstrument: TInstrument
    outcomeInstrument: TInstrument
    outcomeAccount: TRawAccount
    opOutcomeInstrument: TInstrument
    tag: TRawTag[] | null
    type: TTransactionType
  }
>

export const populate = (
  { instruments, accounts, tags }: DataSources,
  raw: TRawransaction
) => ({
  ...raw,
  incomeInstrument: instruments[raw.incomeInstrument],
  incomeAccount: accounts[raw.incomeAccount],
  opIncomeInstrument: instruments[Number(raw.opIncomeInstrument)],
  outcomeInstrument: instruments[raw.outcomeInstrument],
  outcomeAccount: accounts[raw.outcomeAccount],
  opOutcomeInstrument: instruments[Number(raw.opOutcomeInstrument)],
  tag: mapTags(raw.tag, tags),
  //COMPUTED PROPERTIES
  type: getType(raw),
})

function mapTags(ids: TTagId[] | null, tags: ById<TRawTag>) {
  // TODO: Надо что-то придумать с null тегом 🤔    ⤵
  return ids && ids.length ? ids.map(id => tags[id + '']) : null
}
