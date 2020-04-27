import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
// REDUX: actions/dispatch/func
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'

class AlphabetListViewData extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  async componentDidMount() {
    const { routeParams, computePortal } = this.props
    const path = `${routeParams.dialect_path}/Alphabet`
    await ProviderHelpers.fetchIfMissing(
      path,
      this.props.fetchCharacters,
      this.props.computeCharacters,
      '&currentPageIndex=0&pageSize=100&sortOrder=asc&sortBy=fvcharacter:alphabet_order'
    )
    const extractComputedCharacters = ProviderHelpers.getEntry(this.props.computeCharacters, path)
    const characters = selectn('response.entries', extractComputedCharacters)
    const extractComputePortal = ProviderHelpers.getEntry(computePortal, `${routeParams.dialect_path}/Portal`)
    const dialectClassName = getDialectClassname(extractComputePortal)

    this.setState({
      characters,
      dialectClassName,
    })
  }
  render() {
    const { characters, dialectClassName } = this.state
    return this.props.children({
      characters,
      dialectClassName,
      letter: this.props.routeParams.letter,
      splitWindowPath: this.props.splitWindowPath,
    })
  }
}

// PROPTYPES
const { any, array, func, object } = PropTypes
AlphabetListViewData.propTypes = {
  children: any,
  // REDUX: reducers/state
  computeCharacters: object.isRequired,
  computeLogin: object.isRequired,
  computePortal: object.isRequired,
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
  // REDUX: actions/dispatch/func
  fetchDocument: func.isRequired,
  fetchCharacters: func.isRequired,
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { fvCharacter, fvPortal, navigation, nuxeo, windowPath } = state
  const { computePortal } = fvPortal
  const { route } = navigation
  const { computeLogin } = nuxeo
  const { computeCharacters } = fvCharacter
  const { splitWindowPath } = windowPath
  return {
    computePortal,
    computeCharacters,
    computeLogin,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}
// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
  fetchCharacters,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlphabetListViewData)
