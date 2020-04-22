import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
// REDUX: actions/dispatch/func
import { fetchDocument } from 'providers/redux/reducers/document'
class AuthorizationFilterData extends Component {
  async componentDidMount() {
    const { routeParams, computeDocument } = this.props
    // Document
    await ProviderHelpers.fetchIfMissing(
      `${routeParams.dialect_path}/Dictionary`,
      this.props.fetchDocument,
      computeDocument
    )
  }
  render() {
    const { routeParams, computeDocument, computeLogin } = this.props
    const extractComputeDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
    const computeDocumentResponse = selectn('response', extractComputeDocument)

    return this.props.children({
      entity: computeDocumentResponse,
      routeParams,
      login: computeLogin,
    })
  }
}

// PROPTYPES
const { any, func, object } = PropTypes
AuthorizationFilterData.propTypes = {
  children: any,
  // REDUX: reducers/state
  computeDocument: object.isRequired,
  computeLogin: object.isRequired,
  routeParams: object.isRequired,
  // REDUX: actions/dispatch/func
  fetchDocument: func.isRequired,
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { document, navigation, nuxeo } = state
  const { computeDocument } = document
  const { route } = navigation
  const { computeLogin } = nuxeo
  return {
    computeDocument,
    computeLogin,
    routeParams: route.routeParams,
  }
}
// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizationFilterData)
