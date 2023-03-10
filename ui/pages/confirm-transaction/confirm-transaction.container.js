import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  setTransactionToConfirm,
  clearConfirmTransaction,
} from '../../ducks/confirm-transaction/confirm-transaction.duck';
import { isTokenMethodAction } from '../../helpers/utils/transactions.util';

import {
  getContractMethodData,
  setDefaultHomeActiveTabName,
} from '../../store/actions';
import {
  unconfirmedTransactionsListSelector,
  unconfirmedTransactionsHashSelector,
} from '../../selectors';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import { getSendTo } from '../../ducks/send';
import ConfirmTransaction from './confirm-transaction.component';

const mapStateToProps = (state, ownProps) => {
  const {
    metamask: { unapprovedTxs },
  } = state;
  const {
    match: { params = {} },
  } = ownProps;
  const { id } = params;
  const sendTo = getSendTo(state);

  const unconfirmedTransactions = unconfirmedTransactionsListSelector(state);
  const unconfirmedMessages = unconfirmedTransactionsHashSelector(state);
  const totalUnconfirmed = unconfirmedTransactions.length;
  const transaction = totalUnconfirmed
    ? unapprovedTxs[id] || unconfirmedMessages[id] || unconfirmedTransactions[0]
    : {};
  const { id: transactionId, type } = transaction;

  return {
    totalUnapprovedCount: totalUnconfirmed,
    sendTo,
    unapprovedTxs,
    id,
    mostRecentOverviewPage: getMostRecentOverviewPage(state),
    paramsTransactionId: id && String(id),
    transactionId: transactionId && String(transactionId),
    transaction,
    isTokenMethodAction: isTokenMethodAction(type),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTransactionToConfirm: (transactionId) => {
      dispatch(setTransactionToConfirm(transactionId));
    },
    clearConfirmTransaction: () => dispatch(clearConfirmTransaction()),
    getContractMethodData: (data) => dispatch(getContractMethodData(data)),
    setDefaultHomeActiveTabName: (tabName) =>
      dispatch(setDefaultHomeActiveTabName(tabName)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(ConfirmTransaction);
