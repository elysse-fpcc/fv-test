import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
// REDUX: actions/dispatch/func
import { fetchCategories } from 'providers/redux/reducers/fvCategory'

class DialectFilterListData extends Component {
  constructor(props) {
    super(props)

    this.state = {
      facetField: ProviderHelpers.switchWorkspaceSectionKeys(props.workspaceKey, this.props.routeParams.area),
    }
  }
  async componentDidMount() {
    const { path } = this.props
    await ProviderHelpers.fetchIfMissing(path, this.props.fetchCategories, this.props.computeCategories)
    const extractComputedCategories = ProviderHelpers.getEntry(this.props.computeCategories, path)
    const categories = selectn('response.entries', extractComputedCategories)

    this.setState({
      categories,
    })
  }
  render() {
    return this.props.children({
      facetField: this.state.facetField,
      facets: this.state.categories,
      routeParams: this.props.routeParams,
    })
  }
}

// PROPTYPES
const { any, func, object, string } = PropTypes
DialectFilterListData.propTypes = {
  children: any,
  workspaceKey: string.isRequired, // Used with facetField
  path: string.isRequired, // Used with facets
  // REDUX: reducers/state
  computeCategories: object.isRequired,
  routeParams: object.isRequired,
  // REDUX: actions/dispatch/func
  fetchCategories: func.isRequired,
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { fvCategory, navigation } = state
  const { computeCategories } = fvCategory
  const { route } = navigation
  return {
    computeCategories,
    routeParams: route.routeParams,
  }
}
// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialectFilterListData)
