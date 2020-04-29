import React, { Component } from 'react'
import PropTypes from 'prop-types'
export class DialectFilterList extends Component {
  render() {
    const { title, listItems /*, listItemsData*/ } = this.props
    return (
      <div className="DialectFilterList" data-testid="DialectFilterList">
        <h2>{title}</h2>
        <ul className="DialectFilterListList DialectFilterListList--root">{listItems}</ul>
        {/* { listItemsData.length === 0 && this.componentHasNoData() } */}
        {/* { listItemsData.length !== 0 && this.componentHasData() } */}
      </div>
    )
  }
  componentHasData = () => {
    // const {listItemsData} = this.props
    return (
      <ul className="DialectFilterListList DialectFilterListList--root">
        {() => {
          return <li>WIP</li>
          /*
      listItemsData.map((item, index) => {
        if (item.children.length > 0) {
          item.children.map((child, childIndex) => {

// hasActiveParent: false
// href: "/explore/FV/sections/Data/Test/Test/TestLanguageSix/learn/words/categories/61e20652-96a6-44e8-8b3b-a5e3aac350ea"
// isActive: false
// text: "Amphibians"
// uid: "61e20652-96a6-44e8-8b3b-a5e3aac350ea"

            let childActiveClass = ''
            if (parentActiveClass) {
              childActiveClass = 'DialectFilterListLink--activeParent'
            } else if (childIsActive) {
              childActiveClass = 'DialectFilterListLink--active'
            }
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
        const listItemActiveClass = parentIsActive || hasActiveChild ? 'DialectFilterListItemParent--active' : ''

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
      */
        }}
      </ul>
    )
  }
  componentHasNoData = () => {
    return null
  }
}

// Proptypes
const { any, array, string } = PropTypes
DialectFilterList.propTypes = {
  title: string.isRequired,
  listItems: any.isRequired,
  listItemsData: array.isRequired,
}

export default DialectFilterList
