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
import React, { Component, Suspense } from 'react'

import NavigationHelpers, { appendPathArrayAfterLandmark } from 'common/NavigationHelpers'
import FVLabel from 'views/components/FVLabel/index'

// Note: Data component for this file
import WordsData from 'views/pages/explore/dialect/learn/words/WordsData'

import AuthorizationFilter from 'views/components/Document/AuthorizationFilter'
// TODO: AuthorizationFilterData is tailored to words index, not ready to be rolled out to other files.
import AuthorizationFilterData from 'views/components/Document/AuthorizationFilter/AuthorizationFilterData'

import DialectFilterList from 'views/components/DialectFilterList'
import DialectFilterListData from 'views/components/DialectFilterList/DialectFilterListData'

import AlphabetListView from 'views/components/AlphabetListView'
import AlphabetListViewData from 'views/components/AlphabetListView/AlphabetListViewData'

import DictionaryListData from 'views/components/Browsing/DictionaryListData'
const DictionaryList = React.lazy(() => import('views/components/Browsing/DictionaryList'))

class PageDialectLearnWords extends Component {
  render() {
    return (
      <WordsData>
        {({
          changeFilter,
          dialectFilterListWillUnmount, // TODO: why this can't be handled by setDialectFilter?
          filterInfo,
          handleAlphabetClick,
          intl,
          isKidsTheme,
          onNavigateRequest,
          pushWindowPath,
          resetSearch,
          routeParams,
          setDialectFilter,
          splitWindowPath,
        }) => {
          return (
            <>
              <div className="row row-create-wrapper">
                <div className="col-xs-12 col-md-4 col-md-offset-8 text-right">
                  <AuthorizationFilterData>
                    {({ entity, login }) => {
                      return (
                        <AuthorizationFilter
                          filter={{
                            entity,
                            login,
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
                                splitWindowPath: splitWindowPath,
                              })
                              if (url) {
                                NavigationHelpers.navigate(`/${url}`, pushWindowPath, false)
                              } else {
                                onNavigateRequest('create')
                              }
                            }}
                            className="PrintHide buttonRaised"
                          >
                            <FVLabel
                              transKey="views.pages.explore.dialect.learn.words.create_new_word"
                              defaultStr="Create New Word"
                              transform="words"
                            />
                          </button>
                        </AuthorizationFilter>
                      )
                    }}
                  </AuthorizationFilterData>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-md-3 PrintHide">
                  <AlphabetListViewData>
                    {({ characters, dialectClassName, letter }) => {
                      return (
                        <AlphabetListView
                          characters={characters}
                          dialectClassName={dialectClassName}
                          handleClick={(letterClicked, href) => {
                            // Update redux
                            handleAlphabetClick({ letterClicked, href, updateHistory: false })
                            // Navigate to new page
                            NavigationHelpers.navigate(href, pushWindowPath, false)
                          }}
                          letter={letter}
                          splitWindowPath={splitWindowPath}
                        />
                      )
                    }}
                  </AlphabetListViewData>

                  <DialectFilterListData
                    appliedFilterIds={filterInfo.get('currentCategoryFilterIds')}
                    dialectFilterListWillUnmount={dialectFilterListWillUnmount}
                    path={`/api/v1/path/FV/${routeParams.area}/SharedData/Shared Categories/@children`}
                    setDialectFilter={setDialectFilter}
                    type="words"
                    workspaceKey="fv-word:categories"
                  >
                    {({ listItemsData }) => {
                      return (
                        <DialectFilterList
                          title={intl.trans(
                            'views.pages.explore.dialect.learn.words.browse_by_category',
                            'Browse Categories',
                            'words'
                          )}
                          listItemsData={listItemsData}
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
                            <div className="col-xs-12 col-md-8 col-md-offset-2">{cloneWordsListView}</div>
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
}

export default PageDialectLearnWords
