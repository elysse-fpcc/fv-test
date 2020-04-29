import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Set } from 'immutable'
import PropTypes from 'prop-types'
import ProviderHelpers from 'common/ProviderHelpers'
import selectn from 'selectn'
// REDUX: actions/dispatch/func
import { fetchCategories } from 'providers/redux/reducers/fvCategory'
import Link from 'views/components/Link'

class DialectFilterListData extends Component {
  clickParams = {}
  filtersSorted = []
  _isMounted = false
  selectedDialectFilter = undefined

  constructor(props) {
    super(props)

    this.state = {
      facets: [],
      facetField: ProviderHelpers.switchWorkspaceSectionKeys(props.workspaceKey, this.props.routeParams.area),
      lastCheckedUid: undefined,
      lastCheckedChildrenUids: [],
      lastCheckedParentFacetUid: undefined,
      listItems: [],
    }
  }
  async componentDidMount() {
    const { path, type } = this.props
    // Get categories
    await ProviderHelpers.fetchIfMissing(path, this.props.fetchCategories, this.props.computeCategories)
    const extractComputedCategories = ProviderHelpers.getEntry(this.props.computeCategories, path)
    const facets = selectn('response.entries', extractComputedCategories)

    // Bind history events
    this._isMounted = true
    window.addEventListener('popstate', this.handleHistoryEvent)

    // Is something selected? (via url)
    const selectedDialectFilter =
      type === 'words' ? selectn('category', this.props.routeParams) : selectn('phraseBook', this.props.routeParams)

    if (selectedDialectFilter) {
      this.selectedDialectFilter = selectedDialectFilter
    }

    // we have data, so...
    if (facets && facets.length > 0) {
      // Sort data
      this.filtersSorted = this.sortDialectFilters(facets)
      // generates markup
      this.generateListItems(this.filtersSorted, true)
    }

    this.setState(
      {
        facets,
      },
      () => {
        if (this.selectedDialectFilter) {
          const selectedParams = this.clickParams[this.selectedDialectFilter]
          if (selectedParams) {
            this.handleClick(selectedParams)
            this.selectedDialectFilter = undefined
          }
        }
      }
    )
  }

  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('popstate', this.handleHistoryEvent)
    const { lastCheckedUid, lastCheckedChildrenUids, lastCheckedParentFacetUid } = this.state
    // 'uncheck' previous
    if (lastCheckedUid) {
      const unselected = {
        checkedFacetUid: lastCheckedUid,
        childrenIds: lastCheckedChildrenUids,
        parentFacetUid: lastCheckedParentFacetUid,
      }
      // TODO: handleDialectFilterList?
      debugger
      this.props.handleDialectFilterList(this.state.facetField, undefined, unselected, this.props.type, false)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { facets } = this.state
    const { facets: prevFacets } = prevState

    const prevAppliedFilterIds = prevProps.appliedFilterIds
    const currentAppliedFilterIds = this.props.appliedFilterIds

    if (prevFacets.length !== facets.length) {
      this.filtersSorted = this.sortDialectFilters(facets)
    }

    if (prevFacets.length !== facets.length || prevAppliedFilterIds.equals(currentAppliedFilterIds) === false) {
      this.generateListItems(this.filtersSorted, true)
    }
  }
  render() {
    return this.props.children({
      facetField: this.state.facetField,
      facets: this.state.facets,
      routeParams: this.props.routeParams,
      facetSelected: this.props.routeParams.category,

      listItems: this.state.listItems,
      listItemsData: this.generateListItemData(),

      lastCheckedUid: this.state.lastCheckedUid,
      lastCheckedChildrenUids: this.state.lastCheckedChildrenUids,
      lastCheckedParentFacetUid: this.state.lastCheckedParentFacetUid,
    })
  }

  generateDialectFilterUrl = (filterId) => {
    let href = `/${this.props.splitWindowPath.join('/')}`
    const _splitWindowPath = [...this.props.splitWindowPath]
    const wordOrPhraseIndex = _splitWindowPath.findIndex((element) => {
      return element === 'words' || element === 'phrases'
    })
    if (wordOrPhraseIndex !== -1) {
      _splitWindowPath.splice(wordOrPhraseIndex + 1)
      const urlFragment = this.props.type === 'words' ? 'categories' : 'book'
      href = `/${_splitWindowPath.join('/')}/${urlFragment}/${filterId}`
    }
    return href
  }

  // Generates the nested list markup
  /*
[{
  href,
  isActive,
  text,
  children:[
    {
      href,
      isActive,
      text,
    }
  ]
}]
*/
  generateListItemData = () => {
    const { appliedFilterIds } = this.props

    const listItemData = []
    this.filtersSorted.forEach((filter) => {
      const childData = []
      const uidParent = filter.uid

      // Process children
      const children = selectn('contextParameters.children.entries', filter)
      const parentIsActive = appliedFilterIds.includes(uidParent)
      let hasActiveChild = false

      if (children.length > 0) {
        children.forEach((filterChild) => {
          const uidChild = filterChild.uid
          const childIsActive = appliedFilterIds.includes(uidChild)
          // Set flag for parent processing
          hasActiveChild = childIsActive
          // Save child data
          childData.push({
            uid: uidChild,
            href: this.generateDialectFilterUrl(uidChild),
            isActive: childIsActive,
            hasActiveParent: parentIsActive,
            text: filterChild.title,
          })
        })
      }

      // Process parent
      listItemData.push({
        uid: uidParent,
        href: this.generateDialectFilterUrl(uidParent),
        isActive: parentIsActive,
        hasActiveChildren: hasActiveChild,
        text: filter.title,
        children: childData,
      })
    })
    return listItemData
  }

  generateListItems = (filters, updateState = false) => {
    const { appliedFilterIds } = this.props

    let lastCheckedUid = undefined
    let lastCheckedChildrenUids = undefined
    let lastCheckedParentFacetUid = undefined

    const listItems = filters.map((filter) => {
      const childrenItems = []
      const childrenUids = []
      const uidParent = filter.uid

      const parentIsActive = appliedFilterIds.includes(uidParent)
      const parentActiveClass = parentIsActive ? 'DialectFilterListLink--active' : ''

      // Process children
      const children = selectn('contextParameters.children.entries', filter)
      let hasActiveChild = false
      if (children.length > 0) {
        children.forEach((filterChild) => {
          const uidChild = filterChild.uid

          childrenUids.push(uidChild)
          const childIsActive = appliedFilterIds.includes(uidChild)

          let childActiveClass = ''
          if (parentActiveClass) {
            childActiveClass = 'DialectFilterListLink--activeParent'
          } else if (childIsActive) {
            childActiveClass = 'DialectFilterListLink--active'
          }

          if (childIsActive) {
            hasActiveChild = true
            lastCheckedUid = uidChild
            lastCheckedChildrenUids = null
            lastCheckedParentFacetUid = uidParent
          }

          const childHref = this.generateDialectFilterUrl(uidChild)
          const childClickParams = {
            href: childHref,
            checkedFacetUid: uidChild,
            childrenIds: null,
            parentFacetUid: uidParent,
          }

          // Saving for history events
          this.clickParams[uidChild] = childClickParams

          // Save markup
          const childListItem = (
            <li key={uidChild}>
              <Link
                className={`DialectFilterListLink DialectFilterListLink--child ${childActiveClass}`}
                href={childHref}
                title={filterChild.title}
              >
                {filterChild.title}
              </Link>
            </li>
          )
          childrenItems.push(childListItem)
        })
      }

      // Process parent
      const parentHref = this.generateDialectFilterUrl(uidParent)

      if (parentIsActive) {
        lastCheckedUid = uidParent
        lastCheckedChildrenUids = childrenUids
        lastCheckedParentFacetUid = undefined
      }
      const listItemActiveClass = parentIsActive || hasActiveChild ? 'DialectFilterListItemParent--active' : ''
      const parentClickParams = {
        href: parentHref,
        checkedFacetUid: uidParent,
        childrenIds: childrenUids,
        parentFacetUid: undefined,
      }
      // Saving for history events
      this.clickParams[uidParent] = parentClickParams

      const parentListItem = (
        <li key={uidParent} className={`DialectFilterListItemParent ${listItemActiveClass}`}>
          <div className="DialectFilterListItemGroup">
            <Link
              className={`DialectFilterListLink DialectFilterListLink--parent ${parentActiveClass}`}
              href={parentHref}
              title={filter.title}
            >
              {filter.title}
            </Link>
          </div>
          {childrenItems.length > 0 ? <ul className="DialectFilterListList">{childrenItems}</ul> : null}
        </li>
      )
      return parentListItem
    })
    if (updateState) {
      // Save active item/data
      this.setState(
        {
          listItems,
          lastCheckedUid,
          lastCheckedChildrenUids,
          lastCheckedParentFacetUid,
        },
        () => {
          if (this.selectedDialectFilter) {
            const selectedParams = this.clickParams[this.selectedDialectFilter]
            if (selectedParams) {
              this.handleClick(selectedParams)
              this.selectedDialectFilter = undefined
            }
          }
        }
      )
    }
  }

  handleClick = (obj) => {
    const { href, checkedFacetUid, childrenIds, parentFacetUid } = obj

    const { lastCheckedUid, lastCheckedChildrenUids, lastCheckedParentFacetUid } = this.state

    let unselected = undefined

    // 'uncheck' previous
    if (lastCheckedUid) {
      unselected = {
        checkedFacetUid: lastCheckedUid,
        childrenIds: lastCheckedChildrenUids,
        parentFacetUid: lastCheckedParentFacetUid,
      }
    }

    // 'check' new
    this.setState(
      {
        lastCheckedUid: checkedFacetUid,
        lastCheckedChildrenUids: childrenIds,
        lastCheckedParentFacetUid: parentFacetUid,
      },
      () => {
        const selected = {
          checkedFacetUid,
          childrenIds,
        }
        this.props.handleDialectFilterClick({
          facetField: this.state.facetField,
          selected,
          unselected,
          href,
        })
      }
    )
  }

  handleHistoryEvent = () => {
    if (this._isMounted) {
      const _filterId =
        this.props.type === 'words'
          ? selectn('routeParams.category', this.props)
          : selectn('routeParams.phraseBook', this.props)
      if (_filterId) {
        const selectedParams = this.clickParams[_filterId]
        if (selectedParams) {
          const { href, checkedFacetUid, childrenIds, parentFacetUid } = selectedParams
          // this.handleClick(selectedParams)
          this.setState(
            {
              lastCheckedUid: checkedFacetUid,
              lastCheckedChildrenUids: childrenIds,
              lastCheckedParentFacetUid: parentFacetUid,
            },
            () => {
              const selected = {
                checkedFacetUid,
                childrenIds,
              }
              this.props.handleDialectFilterClick(
                {
                  facetField: this.state.facetField,
                  selected,
                  undefined,
                  href,
                },
                false
              )
            }
          )
        }
      }
    }
  }

  setUidUrlPath = (filter, path) => {
    // TODO: map encodeUri title to uid for friendly urls
    // this.uidUrl[category.uid] = encodeURI(category.title)

    // TODO: temp using uid in url
    this.uidUrl[filter.uid] = `${path}/${encodeURI(filter.uid)}`
  }

  sortByTitle = (a, b) => {
    if (a.title < b.title) return -1
    if (a.title > b.title) return 1
    return 0
  }

  sortDialectFilters = (filters = []) => {
    const _filters = [...filters]
    // Sort root level
    _filters.sort(this.sortByTitle)
    const _filtersSorted = _filters.map((filter) => {
      // Sort children
      const children = selectn('contextParameters.children.entries', filter)
      if (children.length > 0) {
        children.sort(this.sortByTitle)
      }
      return filter
    })
    return _filtersSorted
  }
}

// PROPTYPES
const { any, array, func, instanceOf, object, string } = PropTypes
DialectFilterListData.propTypes = {
  appliedFilterIds: instanceOf(Set),
  children: any,
  handleDialectFilterClick: func.isRequired,
  path: string.isRequired, // Used with facets
  type: string.isRequired,
  workspaceKey: string.isRequired, // Used with facetField
  handleDialectFilterList: func.isRequired,
  // REDUX: reducers/state
  computeCategories: object.isRequired,
  routeParams: object.isRequired,
  splitWindowPath: array.isRequired,
  // REDUX: actions/dispatch/func
  fetchCategories: func.isRequired,
}
DialectFilterListData.defaultProps = {
  type: 'words',
}

// REDUX: reducers/state
const mapStateToProps = (state) => {
  const { fvCategory, navigation, windowPath } = state
  const { computeCategories } = fvCategory
  const { route } = navigation
  const { splitWindowPath } = windowPath
  return {
    computeCategories,
    routeParams: route.routeParams,
    splitWindowPath,
  }
}
// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchCategories,
}

export default connect(mapStateToProps, mapDispatchToProps)(DialectFilterListData)
