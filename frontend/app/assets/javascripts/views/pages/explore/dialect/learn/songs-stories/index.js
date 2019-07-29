/*
Copyright 2016 First People's Cultural Council

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
import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'

import classNames from 'classnames'

// REDUX
import { connect } from 'react-redux'
// REDUX: actions/dispatch/func
import { fetchBooks } from 'providers/redux/reducers/fvBook'
import { fetchDialect2 } from 'providers/redux/reducers/fvDialect'
import { fetchPortal } from 'providers/redux/reducers/fvPortal'
import { pushWindowPath } from 'providers/redux/reducers/windowPath'

import selectn from 'selectn'

import ProviderHelpers from 'common/ProviderHelpers'
import StringHelpers from 'common/StringHelpers'
import NavigationHelpers, { appendPathArrayAfterLandmark } from 'common/NavigationHelpers'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'

// import RaisedButton from 'material-ui/lib/raised-button'

import PromiseWrapper from 'views/components/Document/PromiseWrapper'

import GeneralList from 'views/components/Browsing/general-list'
import { CardView } from './list-view'
import { getDialectClassname } from 'views/pages/explore/dialect/helpers'
import withFilter from 'views/hoc/grid-list/with-filter'
import IntlService from 'views/services/intl'

const intl = IntlService.instance
const DEFAULT_LANGUAGE = 'english'

const FilteredCardList = withFilter(GeneralList)

/**
 * Learn songs
 */

const { array, func, object, string } = PropTypes
export class PageDialectLearnStoriesAndSongs extends Component {
  static propTypes = {
    routeParams: object.isRequired,
    typeFilter: string,
    typePlural: string,
    // REDUX: reducers/state
    computeBooks: object.isRequired,
    computeDialect2: object.isRequired,
    computeLogin: object.isRequired,
    computePortal: object.isRequired,
    properties: object.isRequired,
    splitWindowPath: array.isRequired,
    windowPath: string.isRequired,
    // REDUX: actions/dispatch/func
    fetchBooks: func.isRequired,
    fetchDialect2: func.isRequired,
    fetchPortal: func.isRequired,
    pushWindowPath: func.isRequired,
  }
  state = {
    filteredList: null,
  }

  // Fetch data on initial render
  componentDidMount() {
    this.fetchData(this.props)
  }

  // Refetch data on URL change
  componentDidUpdate(prevProps) {
    if (this.props.windowPath !== prevProps.windowPath) {
      this.fetchData(this.props)
    }
  }

  render() {
    const computeEntities = Immutable.fromJS([
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeBooks,
      },
      {
        id: this.props.routeParams.dialect_path,
        entity: this.props.computeDialect2,
      },
    ])

    const computeBooks = ProviderHelpers.getEntry(this.props.computeBooks, this.props.routeParams.dialect_path)
    const computeDialect2 = ProviderHelpers.getEntry(this.props.computeDialect2, this.props.routeParams.dialect_path)

    const isKidsTheme = this.props.routeParams.theme === 'kids'

    const listProps = {
      defaultLanguage: DEFAULT_LANGUAGE,
      filterOptionsKey: 'Books',
      fixedList: true,
      fixedListFetcher: this.fixedListFetcher,
      filteredItems: this.state.filteredList,
      card: <CardView />,
      area: this.props.routeParams.area,
      applyDefaultFormValues: true,
      formValues: { 'properties.fvbook:type': this.props.typeFilter },
      metadata: selectn('response', computeBooks),
      items: selectn('response.entries', computeBooks) || [],
      theme: this.props.routeParams.theme || 'explore',
      action: this._onEntryNavigateRequest,
    }

    let listView = <FilteredCardList {...listProps} />

    if (isKidsTheme) {
      listView = <GeneralList {...listProps} cols={3} theme={this.props.routeParams.theme} />
    }
    const dialectClassName = getDialectClassname(computeDialect2)

    const hrefPath = `/${appendPathArrayAfterLandmark({
      pathArray: ['create'],
      splitWindowPath: this.props.splitWindowPath,
      landmarkArray: this.props.typeFilter === 'story' ? ['stories'] : ['songs'],
    })}`
    return (
      <PromiseWrapper renderOnError computeEntities={computeEntities}>
        <div className={classNames('row', 'row-create-wrapper', { hidden: isKidsTheme })}>
          <div className={classNames('col-xs-12', 'col-md-4', 'col-md-offset-8', 'text-right')}>
            <AuthorizationFilter
              filter={{
                role: ['Record', 'Approve', 'Everything'],
                entity: selectn('response', computeDialect2),
                login: this.props.computeLogin,
              }}
            >
              <a
                className="_btn _btn--primary"
                href={hrefPath}
                onClick={(e) => {
                  e.preventDefault()
                  NavigationHelpers.navigate(hrefPath, this.props.pushWindowPath, false)
                }}
              >
                {intl.trans(
                  'views.pages.explore.dialect.learn.songs_stories.create_x_book',
                  'Create ' + this.props.typeFilter + ' Book',
                  'words',
                  [this.props.typeFilter]
                )}
              </a>
            </AuthorizationFilter>
          </div>
        </div>

        <div className="row" style={{ marginBottom: '20px' }}>
          <div className={classNames('col-xs-12', { 'col-md-8': isKidsTheme, 'col-md-offset-2': isKidsTheme })}>
            <h1 className={classNames(dialectClassName, { hidden: isKidsTheme })}>
              {selectn('response.title', computeDialect2)} {StringHelpers.toTitleCase(this.props.typePlural)}
            </h1>
            {listView}
          </div>
        </div>
      </PromiseWrapper>
    )
  }

  fetchData = (newProps) => {
    newProps.fetchDialect2(newProps.routeParams.dialect_path)
    newProps.fetchPortal(newProps.routeParams.dialect_path + '/Portal')

    newProps.fetchBooks(newProps.routeParams.dialect_path, '&sortBy=dc:title' + '&sortOrder=ASC')
  }
  fixedListFetcher = (list) => {
    this.setState({
      filteredList: list,
    })
  }

  _onEntryNavigateRequest = (item) => {
    // NOTE: generateUIDPath: function (theme, item, pluralPathId)
    this.props.pushWindowPath(
      NavigationHelpers.generateUIDPath(
        this.props.routeParams.theme || 'explore',
        item,
        selectn('properties.fvbook:type', item) === 'story' ? 'stories' : 'songs'
      )
    )
  }

  _onNavigateRequest = (path) => {
    this.props.pushWindowPath(path)
  }
}

// REDUX: reducers/state
const mapStateToProps = (state /*, ownProps*/) => {
  const { fvBook, fvDialect, fvPortal, navigation, nuxeo, windowPath } = state

  const { properties } = navigation
  const { computeLogin } = nuxeo
  const { computeBooks } = fvBook
  const { computeDialect2 } = fvDialect
  const { computePortal } = fvPortal
  const { splitWindowPath, _windowPath } = windowPath

  return {
    computeBooks,
    computeDialect2,
    computeLogin,
    computePortal,
    properties,
    splitWindowPath,
    windowPath: _windowPath,
  }
}

// REDUX: actions/dispatch/func
const mapDispatchToProps = {
  fetchBooks,
  fetchDialect2,
  fetchPortal,
  pushWindowPath,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageDialectLearnStoriesAndSongs)
