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
      facetField: ProviderHelpers.switchWorkspaceSectionKeys('fv-word:categories', this.props.routeParams.area),
    }
  }
  async componentDidMount() {
    const { routeParams } = this.props
    const path = '/api/v1/path/FV/' + routeParams.area + '/SharedData/Shared Categories/@children'
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
const { any, func, object } = PropTypes
DialectFilterListData.propTypes = {
  children: any,
  // REDUX: reducers/state
  computeCategories: object.isRequired,
  routeParams: object.isRequired,
  // REDUX: actions/dispatch/func
  fetchCategories: func.isRequired,
}
DialectFilterListData.defaultProps = {
  changeFilter: () => {},
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
