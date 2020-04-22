import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
// REDUX: actions/dispatch/func
import { fetchDocument } from 'providers/redux/reducers/document'
import { fetchCharacters } from 'providers/redux/reducers/fvCharacter'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'

import { SEARCH_BY_ALPHABET, SEARCH_PART_OF_SPEECH_ANY } from 'views/components/SearchDialect/constants'

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

    this.setState(
      {
        characters,
        dialectClassName,
      },
      () => {
        if (routeParams.letter) {
          this.handleAlphabetClick(routeParams.letter)
        }
      }
    )
  }
  render() {
    const { characters, dialectClassName } = this.state
    return this.props.children({
      dialectClassName,
      characters,
      handleAlphabetClick: this.handleAlphabetClick,
      letter: this.props.routeParams.letter,
    })
  }

  handleAlphabetClick = async (letter, href, updateHistory = true) => {
    await this.props.searchDialectUpdate({
      searchByAlphabet: letter,
      searchByMode: SEARCH_BY_ALPHABET,
      searchBySettings: {
        searchByTitle: true,
        searchByDefinitions: false,
        searchByTranslations: false,
        searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
      },
      searchTerm: '',
    })
    this.props.changeFilter({ href, updateHistory })
  }
}

// PROPTYPES
const { any, func, object } = PropTypes
AlphabetListViewData.propTypes = {
  children: any,
  changeFilter: func.isRequired,
  // REDUX: reducers/state
  computeCharacters: object.isRequired,
  computeLogin: object.isRequired,
  computePortal: object.isRequired,
  routeParams: object.isRequired,
  // REDUX: actions/dispatch/func
  fetchDocument: func.isRequired,
  fetchCharacters: func.isRequired,
}
AlphabetListViewData.defaultProps = {
  changeFilter: () => {},
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { fvCharacter, fvPortal, navigation, nuxeo } = state
  const { computePortal } = fvPortal
  const { route } = navigation
  const { computeLogin } = nuxeo
  const { computeCharacters } = fvCharacter
  return {
    computePortal,
    computeCharacters,
    computeLogin,
    routeParams: route.routeParams,
  }
}
// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchDocument,
  fetchCharacters,
  searchDialectUpdate,
}

export default connect(mapStateToProps, mapDispatchToProps)(AlphabetListViewData)
