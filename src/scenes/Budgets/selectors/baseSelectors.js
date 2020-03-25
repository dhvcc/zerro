import createSelector from 'selectorator'
import { getAccountsInBudget } from 'store/localData/accounts'
import { convertCurrency } from 'store/serverData'
import { round } from 'helpers/currencyHelpers'
import { getSortedTransactions } from 'store/localData/transactions'
import { getStartBalance } from 'store/localData/accounts/helpers'

export const getStartFunds = createSelector(
  [getAccountsInBudget, convertCurrency],
  (accounts, convert) =>
    accounts.reduce(
      (sum, acc) => round(sum + convert(getStartBalance(acc), acc.instrument)),
      0
    )
)

export const getTransactionsInBudget = createSelector(
  [getSortedTransactions, getAccountsInBudget],
  (transactions, accounts) => {
    const accIds = accounts.map(acc => acc.id)
    return transactions.filter(
      tr =>
        !tr.deleted &&
        (accIds.includes(tr.incomeAccount) ||
          accIds.includes(tr.outcomeAccount))
    )
  }
)
