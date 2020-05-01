import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'views/components/Link'

export class DialectFilterList extends Component {
  render() {
    const { title, listItemsData } = this.props
    return (
      <div className="DialectFilterList" data-testid="DialectFilterList">
        <h2>{title}</h2>
        {listItemsData.length === 0 && this.componentHasNoData()}
        {listItemsData.length !== 0 && this.componentHasData()}
      </div>
    )
  }
  componentHasData = () => {
    const { listItemsData } = this.props
    const listItems = listItemsData.map((parent) => {
      const {
        isActive: parentIsActive,
        hasActiveChild: parentHasActiveChild,
        uid: parentUid,
        text: parentText,
        href: parentHref,
      } = parent
      const parentActiveClass = parentIsActive ? 'DialectFilterListLink--active' : ''

      const childrenNodes =
        parent.children.length > 0
          ? parent.children.map((child) => {
              const { isActive: childIsActive, uid: childUid, text: childText, href: childHref } = child

              let childActiveClass = ''
              if (parentActiveClass) {
                childActiveClass = 'DialectFilterListLink--activeParent'
              }
              if (childIsActive) {
                childActiveClass = 'DialectFilterListLink--active'
              }
              return (
                <li key={childUid}>
                  <Link
                    className={`DialectFilterListLink DialectFilterListLink--child ${childActiveClass}`}
                    href={childHref}
                    title={childText}
                  >
                    {childText}
                  </Link>
                </li>
              )
            })
          : null

      const parentActiveChildClass = parentHasActiveChild ? 'DialectFilterListLink--activeChild' : ''
      return (
        <li key={parentUid} className={`DialectFilterListItemParent ${parentActiveClass} ${parentActiveChildClass}`}>
          <div className="DialectFilterListItemGroup">
            <Link
              className={`DialectFilterListLink DialectFilterListLink--parent ${parentActiveClass}`}
              href={parentHref}
              title={parentText}
            >
              {parentText}
            </Link>
          </div>
          {childrenNodes && <ul className="DialectFilterListList">{childrenNodes}</ul>}
        </li>
      )
    })

    return listItems ? <ul className="DialectFilterListList DialectFilterListList--root">{listItems}</ul> : null
  }
  componentHasNoData = () => {
    return null
  }
}

// Proptypes
const { array, string } = PropTypes
DialectFilterList.propTypes = {
  title: string.isRequired,
  listItemsData: array.isRequired,
}

export default DialectFilterList
