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

// 3rd party
// -------------------------------------------
import React, { Component, Suspense } from 'react'
import PropTypes from 'prop-types'
import { Set } from 'immutable'
import selectn from 'selectn'
// REDUX
import { connect } from 'react-redux'

// FPCC
// -------------------------------------------
// import {
//   handleDialectFilterList,
//   onNavigateRequest,
//   sortHandler,
//   updateFilter,
//   updateUrlAfterResetSearch,
//   updateUrlIfPageOrPageSizeIsDifferent,
//   useIdOrPathFallback,
// } from 'views/pages/explore/dialect/learn/base'

import WordsData from 'views/pages/explore/dialect/learn/words/WordsData'

import AlphabetListView from 'views/components/AlphabetListView'
import AlphabetListViewData from 'views/components/AlphabetListView/AlphabetListViewData'

import DialectFilterList from 'views/components/DialectFilterList'
import DialectFilterListData from 'views/components/DialectFilterList/DialectFilterListData'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'

import NavigationHelpers, { appendPathArrayAfterLandmark } from 'common/NavigationHelpers'
import ProviderHelpers from 'common/ProviderHelpers'

import DictionaryListData from 'views/components/Browsing/DictionaryListData'
const DictionaryList = React.lazy(() => import('views/components/Browsing/DictionaryList'))

// WordsFilteredByCategory
// ====================================================
class WordsFilteredByCategory extends Component {
  render() {
    const { computeDocument, computeLogin, hasPagination } = this.props
    return (
      <WordsData>
        {({
          changeFilter,
          // clearDialectFilter,
          filterInfo,
          // flashcardMode,
          handleDialectFilterList,
          intl,
          isKidsTheme,
          onNavigateRequest,
          pushWindowPath,
          resetSearch,
          routeParams,
          splitWindowPath,
        }) => {
          const computedDocument = ProviderHelpers.getEntry(computeDocument, `${routeParams.dialect_path}/Dictionary`)
          return (
            <>
              <div className="row row-create-wrapper">
                <div className="col-xs-12 col-md-4 col-md-offset-8 text-right">
                  <AuthorizationFilter
                    filter={{
                      entity: selectn('response', computedDocument),
                      login: computeLogin,
                      role: ['Record', 'Approve', 'Everything'],
                    }}
                    hideFromSections
                    routeParams={routeParams}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        const url = appendPathArrayAfterLandmark({
                          pathArray: ['create'],
                          splitWindowPath,
                        })
                        if (url) {
                          NavigationHelpers.navigate(`/${url}`, pushWindowPath, false)
                        } else {
                          onNavigateRequest({
                            hasPagination,
                            path: 'create',
                            pushWindowPath,
                            splitWindowPath,
                          })
                        }
                      }}
                      className="PrintHide buttonRaised"
                    >
                      {intl.trans(
                        'views.pages.explore.dialect.learn.words.create_new_word',
                        'Create New Word',
                        'words'
                      )}
                    </button>
                  </AuthorizationFilter>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-md-3 PrintHide">
                  <AlphabetListViewData>
                    {({
                      characters,
                      dialectClassName,
                      letter,
                      // splitWindowPath, // TODO
                    }) => {
                      return (
                        <AlphabetListView
                          characters={characters}
                          dialectClassName={dialectClassName}
                          handleClick={(letterClicked, href) => {
                            NavigationHelpers.navigate(href, pushWindowPath, false)
                          }}
                          letter={letter}
                          splitWindowPath={splitWindowPath}
                        />
                      )
                    }}
                  </AlphabetListViewData>
                  <DialectFilterListData
                    appliedFilterIds={new Set([routeParams.category])}
                    path={`/api/v1/path/FV/${routeParams.area}/SharedData/Shared Categories/@children`}
                    workspaceKey="fv-word:categories"
                    handleDialectFilterList={handleDialectFilterList}
                    handleDialectFilterListClick={async ({ facetField, selected, unselected }) => {
                      // eslint-disable-next-line
                      console.log('handleDialectFilterListClick', { facetField, selected, unselected })
                      // await this.props.searchDialectUpdate({
                      //   searchByAlphabet: '',
                      //   searchByMode: SEARCH_BY_CATEGORY,
                      //   searchBySettings: {
                      //     searchByTitle: true,
                      //     searchByDefinitions: false,
                      //     searchByTranslations: false,
                      //     searchPartOfSpeech: SEARCH_PART_OF_SPEECH_ANY,
                      //   },
                      //   searchingDialectFilter: selected.checkedFacetUid,
                      //   searchTerm: '',
                      // })

                      // this.changeFilter()

                      // this.handleDialectFilterChange({
                      //   facetField,
                      //   selected,
                      //   type: this.DIALECT_FILTER_TYPE,
                      //   unselected,
                      // })
                    }}
                  >
                    {({ listItems }) => {
                      return (
                        <DialectFilterList
                          title={intl.trans(
                            'views.pages.explore.dialect.learn.words.browse_by_category',
                            'Browse Categories',
                            'words'
                          )}
                          listItems={listItems}
                        />
                      )
                    }}
                  </DialectFilterListData>
                </div>
                <div className="col-xs-12 col-md-9">
                  <DictionaryListData>
                    {({
                      columns,
                      // computeDocumentResponse,
                      dialect,
                      dialectClassName,
                      // dialectUid,
                      fetcher,
                      fetcherParams,
                      items,
                      listViewMode,
                      metadata,
                      // page,
                      // pageSize,
                      pageTitle,
                      parentId,
                      // routeParams,
                      setListViewMode,
                      smallScreenTemplate,
                      // sortCol,
                      sortHandler,
                      // sortType,
                    }) => {
                      const wordListView = parentId ? (
                        <Suspense fallback={<div>Loading...</div>}>
                          <DictionaryList
                            dictionaryListClickHandlerViewMode={setListViewMode}
                            dictionaryListViewMode={listViewMode}
                            dictionaryListSmallScreenTemplate={smallScreenTemplate}
                            flashcardTitle={pageTitle}
                            dialect={dialect}
                            // ==================================================
                            // Search
                            // --------------------------------------------------
                            handleSearch={changeFilter}
                            resetSearch={resetSearch}
                            hasSearch
                            searchUi={[
                              {
                                defaultChecked: true,
                                idName: 'searchByTitle',
                                labelText: 'Word',
                              },
                              {
                                defaultChecked: true,
                                idName: 'searchByDefinitions',
                                labelText: 'Definitions',
                              },
                              {
                                idName: 'searchByTranslations',
                                labelText: 'Literal translations',
                              },
                              {
                                type: 'select',
                                idName: 'searchPartOfSpeech',
                                labelText: 'Parts of speech:',
                              },
                            ]}
                            // ==================================================
                            // Table data
                            // --------------------------------------------------
                            items={items}
                            columns={columns}
                            // ===============================================
                            // Pagination
                            // -----------------------------------------------
                            hasPagination
                            fetcher={fetcher}
                            fetcherParams={fetcherParams}
                            metadata={metadata}
                            // ===============================================
                            // Sort
                            // -----------------------------------------------
                            sortHandler={sortHandler}
                            // ===============================================
                          />
                        </Suspense>
                      ) : null

                      // Render kids or mobile view
                      if (isKidsTheme) {
                        const cloneWordsListView = wordListView
                          ? React.cloneElement(wordListView, {
                              DEFAULT_PAGE_SIZE: 8,
                              disablePageSize: true,
                              filter: filterInfo.setIn(
                                ['currentAppliedFilter', 'kids'],
                                ' AND fv:available_in_childrens_archive=1'
                              ),
                              gridListView: true,
                            })
                          : null

                        return (
                          <div className="row" style={{ marginTop: '15px' }}>
                            <div className={`col-xs-12 col-md-8 col-md-offset-2 ${dialectClassName}`}>
                              {cloneWordsListView}
                            </div>
                          </div>
                        )
                      }

                      return (
                        <>
                          <h1 className="DialectPageTitle">{pageTitle}</h1>
                          <div className={dialectClassName}>{wordListView}</div>
                        </>
                      )
                    }}
                  </DictionaryListData>
                </div>
              </div>
            </>
          )
        }}
      </WordsData>
    )
  }

  // handleDialectFilterChange = ({ facetField, selected, type, unselected, shouldResetUrlPagination }) => {
  //   const { filterInfo } = this.state
  //   const { routeParams, splitWindowPath } = this.props

  //   const newFilter = handleDialectFilterList({
  //     facetField,
  //     selected,
  //     type,
  //     unselected,
  //     routeParams,
  //     filterInfo,
  //   })

  //   // When facets change, pagination should be reset.
  //   // In these pages (words/phrase), list views are controlled via URL
  //   if (shouldResetUrlPagination === true) {
  //     updateUrlIfPageOrPageSizeIsDifferent({
  //       // pageSize, // TODO ?
  //       // preserveSearch, // TODO ?
  //       pushWindowPath: this.props.pushWindowPath,
  //       routeParams: routeParams,
  //       splitWindowPath: splitWindowPath,
  //     })
  //   }

  //   this.setState({ filterInfo: newFilter })
  // }
}

// PROPTYPES
// -------------------------------------------
const { bool, object } = PropTypes
WordsFilteredByCategory.propTypes = {
  hasPagination: bool,
  // REDUX: reducers/state
  computeDocument: object.isRequired,
  computeLogin: object.isRequired,
}

// REDUX: reducers/state
// -------------------------------------------
const mapStateToProps = (state /*, ownProps*/) => {
  const { document, nuxeo } = state

  const { computeDocument } = document
  const { computeLogin } = nuxeo
  return {
    computeDocument,
    computeLogin,
  }
}

export default connect(mapStateToProps, null)(WordsFilteredByCategory)
