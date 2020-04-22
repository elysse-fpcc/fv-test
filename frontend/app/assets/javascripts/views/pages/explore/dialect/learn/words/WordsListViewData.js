import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
// REDUX: actions/dispatch/func
// import { setRouteParams } from 'providers/redux/reducers/navigation'
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { setListViewMode } from 'providers/redux/reducers/listView'
class WordsListViewData extends Component {
  async componentDidMount() {
    const { routeParams, computeDocument, computePortal } = this.props
    // Document
    await ProviderHelpers.fetchIfMissing(
      `${routeParams.dialect_path}/Dictionary`,
      this.props.fetchDocument,
      computeDocument
    )
    // Portal
    ProviderHelpers.fetchIfMissing(routeParams.dialect_path + '/Portal', this.props.fetchPortal, computePortal)
  }
  render() {
    const { intl, routeParams, computeDocument, computePortal, computeSearchDialect, listView } = this.props
    const { dialect_path, pageSize, page } = routeParams
    const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, `${dialect_path}/Dictionary`)
    const computeDocumentResponse = selectn('response', extractComputeDocument)
    const dialectUid = selectn('response.contextParameters.ancestry.dialect.uid', extractComputeDocument)
    const pageTitle = `${selectn('response.contextParameters.ancestry.dialect.dc:title', computePortal) ||
      ''} ${intl.trans('words', 'Words', 'first')}`
    const { searchNxqlSort = {} } = computeSearchDialect
    const { DEFAULT_SORT_COL, DEFAULT_SORT_TYPE } = searchNxqlSort
    const parentId = selectn('response.uid', extractComputeDocument)
    const extractComputePortal = ProviderHelpers.getEntry(computePortal, `${dialect_path}/Portal`)
    const dialectClassName = getDialectClassname(extractComputePortal)

    return this.props.children({
      routeParams,
      pageSize: parseInt(pageSize, 10),
      page: parseInt(page, 10),
      dialectUid,
      sortCol: DEFAULT_SORT_COL,
      sortType: DEFAULT_SORT_TYPE,
      pageTitle,
      parentId,
      setListViewMode: this.props.setListViewMode,
      dialectClassName,
      computeDocumentResponse,
      listViewMode: listView.mode,
    })
  }
}

// PROPTYPES
const { any, func, object } = PropTypes
WordsListViewData.propTypes = {
  children: any,
  // REDUX: reducers/state
  computeDocument: object.isRequired,
  computePortal: object.isRequired,
  computeSearchDialect: object.isRequired,
  routeParams: object.isRequired,
  listView: object.isRequired,
  // REDUX: actions/dispatch/func
  fetchDocument: func.isRequired,
  fetchPortal: func.isRequired,
  setListViewMode: func.isRequired,
}
WordsListViewData.defaultProps = {
  searchDialectUpdate: () => {},
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { document, fvPortal, listView, locale, navigation, searchDialect } = state
  const { computeDocument } = document
  const { computePortal } = fvPortal
  const { computeSearchDialect } = searchDialect
  const { intlService } = locale
  const { route } = navigation
  return {
    computeDocument,
    computePortal,
    computeSearchDialect,
    intl: intlService,
    routeParams: route.routeParams,
    listView,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
  fetchPortal,
  setListViewMode,
}

export default connect(mapStateToProps, mapDispatchToProps)(WordsListViewData)
