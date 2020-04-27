/* Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import PropTypes from 'prop-types'
import { Set, Map, is } from 'immutable'
import selectn from 'selectn'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { pushWindowPath } from 'providers/redux/reducers/windowPath'
import { searchDialectUpdate } from 'providers/redux/reducers/searchDialect'

import NavigationHelpers from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'
import { SEARCH_BY_ALPHABET, SEARCH_BY_CATEGORY } from 'views/components/SearchDialect/constants'
import PageDialectLearnBase from 'views/pages/explore/dialect/learn/base'

class WordsData extends PageDialectLearnBase {
  constructor(props, context) {
    super(props, context)

    let filterInfo = this.initialFilterInfo()

    // If no filters are applied via URL, use props
    if (filterInfo.get('currentCategoryFilterIds').isEmpty()) {
      const pagePropertiesFilterInfo = selectn([[this._getPageKey()], 'filterInfo'], props.properties.pageProperties)
      if (pagePropertiesFilterInfo) {
        filterInfo = pagePropertiesFilterInfo
      }
    }

    this.state = {
      filterInfo,
      flashcardMode: false,
      isKidsTheme: props.routeParams.siteTheme === 'kids',
    }

    // NOTE: Removing the following `this` binding can create subtle and hard to detect bugs
    // For example: After filtering by category, clicking through to an item detail triggers an error
    // due to `handleDialectFilterList` not being able to access `this.state.filterInfo`
    ;[
      // '_getURLPageProps', // NOTE: Comes from PageDialectLearnBase
      '_handleFacetSelected', // NOTE: Comes from PageDialectLearnBase
      '_handleFilterChange', // NOTE: Comes from PageDialectLearnBase
      '_handlePagePropertiesChange', // NOTE: Comes from PageDialectLearnBase
      '_onNavigateRequest', // NOTE: Comes from PageDialectLearnBase
      '_resetURLPagination', // NOTE: Comes from PageDialectLearnBase
      'handleDialectFilterList', // NOTE: Comes from PageDialectLearnBase
    ].forEach((method) => (this[method] = this[method].bind(this)))
  }

  async componentDidMountViaPageDialectLearnBase() {
    const newState = {}
    // Clear out filterInfo if not in url, eg: /learn/words/categories/[category]
    if (this.props.routeParams.category === undefined) {
      newState.filterInfo = this.initialFilterInfo()
    }
    this.setState(newState)
  }

  render() {
    const { filterInfo, flashcardMode, isKidsTheme } = this.state
    return this.props.children({
      filterInfo,
      flashcardMode,
      isKidsTheme,
      changeFilter: this.changeFilter,
      resetSearch: this.resetSearch,
      handleDialectFilterList: this.handleDialectFilterList, // NOTE: This function is in PageDialectLearnBase
      splitWindowPath: this.props.splitWindowPath,
      pushWindowPath: this.props.pushWindowPath,
      intl: this.props.intl,
      routeParams: this.props.routeParams,
      onNavigateRequest: this._onNavigateRequest,
      searchDialectUpdate: this.props.searchDialectUpdate,
      computeSearchDialect: this.props.computeSearchDialect,
    })
  }
  // END render

  changeFilter = ({ href, updateUrl = true } = {}) => {
    const { searchByMode, searchNxqlQuery } = this.props.computeSearchDialect
    let searchType
    let newFilter = this.state.filterInfo

    switch (searchByMode) {
      case SEARCH_BY_ALPHABET: {
        searchType = 'startsWith'
        // Remove other settings
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'], null)
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'], null)
        // newFilter = newFilter.set('currentCategoryFilterIds', new Set())
        break
      }
      case SEARCH_BY_CATEGORY: {
        searchType = 'categories'
        // Remove other settings
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'], null)
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'], null)
        break
      }
      default: {
        searchType = 'contains'
        // Remove other settings
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'], null)
        // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'], null)
        // newFilter = newFilter.set('currentCategoryFilterIds', new Set())
      }
    }

    // Remove all old settings...
    newFilter = newFilter.set('currentAppliedFilter', new Map())
    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    // Add new search query
    newFilter = newFilter.updateIn(['currentAppliedFilter', searchType], () => {
      return searchNxqlQuery && searchNxqlQuery !== '' ? ` AND ${searchNxqlQuery}` : ''
    })

    // When facets change, pagination should be reset.
    // In these pages (words/phrase), list views are controlled via URL
    if (is(this.state.filterInfo, newFilter) === false) {
      this.setState({ filterInfo: newFilter }, () => {
        // NOTE: `_resetURLPagination` below can trigger FW-256:
        // "Back button is not working properly when paginating within alphabet chars
        // (Navigate to /learn/words/alphabet/a/1/1 - go to page 2, 3, 4. Use back button.
        // You will be sent to the first page)"
        //
        // The above test (`is(...) === false`) prevents updates triggered by back or forward buttons
        // and any other unnecessary updates (ie: the filter didn't change)
        this._resetURLPagination({ preserveSearch: true }) // NOTE: This function is in PageDialectLearnBase

        // See about updating url
        if (href && updateUrl) {
          NavigationHelpers.navigate(href, this.props.pushWindowPath, false)
        }
      })
    }
  }

  // NOTE: PageDialectLearnBase calls `fetchData`
  // NOTE: Providing an empty fn() so that PageDialectLearnBase doesn't complain.
  fetchData() {}

  // NOTE: PageDialectLearnBase calls `_getPageKey`
  _getPageKey = () => {
    return `${this.props.routeParams.area}_${this.props.routeParams.dialect_name}_learn_words`
  }

  initialFilterInfo = () => {
    const routeParamsCategory = this.props.routeParams.category
    const initialCategories = routeParamsCategory ? new Set([routeParamsCategory]) : new Set()
    const currentAppliedFilterCategoriesParam1 = ProviderHelpers.switchWorkspaceSectionKeys(
      'fv-word:categories',
      this.props.routeParams.area
    )
    const currentAppliedFilterCategories = routeParamsCategory
      ? ` AND ${currentAppliedFilterCategoriesParam1}/* IN ("${routeParamsCategory}")`
      : ''

    return new Map({
      currentCategoryFilterIds: initialCategories,
      currentAppliedFilter: new Map({
        categories: currentAppliedFilterCategories,
      }),
    })
  }

  resetSearch = () => {
    let newFilter = this.state.filterInfo
    // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'categories'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'contains'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFilter', 'startsWith'], null)
    newFilter = newFilter.set('currentAppliedFilter', new Map())

    // newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'categories'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'contains'], null)
    // newFilter = newFilter.deleteIn(['currentAppliedFiltersDesc', 'startsWith'], null)
    newFilter = newFilter.set('currentAppliedFiltersDesc', new Map())

    newFilter = newFilter.set('currentCategoryFilterIds', new Set())

    this.setState(
      {
        filterInfo: newFilter,
      },
      () => {
        // When facets change, pagination should be reset.
        // In these pages (words/phrase), list views are controlled via URL
        this._resetURLPagination() // NOTE: This function is in PageDialectLearnBase

        // Remove alphabet/category filter urls
        if (selectn('routeParams.category', this.props) || selectn('routeParams.letter', this.props)) {
          let resetUrl = `/${this.props.splitWindowPath.join('/')}`
          const _splitWindowPath = [...this.props.splitWindowPath]
          const learnIndex = _splitWindowPath.indexOf('learn')
          if (learnIndex !== -1) {
            _splitWindowPath.splice(learnIndex + 2)
            resetUrl = `/${_splitWindowPath.join('/')}`
          }

          NavigationHelpers.navigate(resetUrl, this.props.pushWindowPath, false)
        }
      }
    )
  }
}

// Proptypes
const { array, bool, func, object } = PropTypes
WordsData.propTypes = {
  hasPagination: bool,
  // REDUX: reducers/state
  routeParams: object.isRequired,
  properties: object.isRequired,
  splitWindowPath: array.isRequired,
  // REDUX: actions/dispatch/func
  pushWindowPath: func.isRequired,
  searchDialectUpdate: func.isRequired,
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { navigation, searchDialect, windowPath, locale } = state

  const { computeSearchDialect } = searchDialect
  const { properties, route } = navigation
  const { splitWindowPath } = windowPath
  const { intlService } = locale

  return {
    computeSearchDialect,
    properties,
    splitWindowPath,
    intl: intlService,
    routeParams: route.routeParams,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  pushWindowPath,
  searchDialectUpdate,
}

export default connect(mapStateToProps, mapDispatchToProps)(WordsData)
