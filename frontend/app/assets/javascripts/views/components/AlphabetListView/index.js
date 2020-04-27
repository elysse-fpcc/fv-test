import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import FVLabel from '../FVLabel/index'

// TODO: REFACTOR - convert to hooks
export class AlphabetListView extends Component {
  _isMounted = false

  async componentDidMount() {
    this._isMounted = true
    window.addEventListener('popstate', this.handleHistoryEvent)
  }

  componentWillUnmount() {
    this._isMounted = false
    window.removeEventListener('popstate', this.handleHistoryEvent)
  }

  render() {
    let content = this.componentIsLoading()
    if (this.props.characters !== undefined) {
      content = this.props.characters.length === 0 ? this.componentHasNoContent() : this.componentHasContent()
    }
    return (
      <div className="AlphabetListView" data-testid="AlphabetListView">
        <h2>
          <FVLabel
            transKey="views.pages.explore.dialect.learn.words.find_by_alphabet"
            defaultStr="Browse Alphabetically"
            transform="words"
          />
        </h2>
        {content}
      </div>
    )
  }

  handleHistoryEvent = () => {
    if (this._isMounted) {
      const { letter, handleClick } = this.props
      if (letter) {
        handleClick(letter, false)
      }
    }
  }

  componentHasContent = () => {
    const { characters = [] } = this.props
    const { letter, dialectClassName = '' } = this.props
    /*
    Truncates splitWindowPath after 'words' or 'phrases', eg:
      splitWindowPath =  ["explore", "FV", "sections", "Data", "TEst", "Test", "AlphabetBatchTester", "learn", "words", "10", "1"]
      modifiedSplitWindowPath = ["explore", "FV", "sections", "Data", "TEst", "Test", "AlphabetBatchTester", "learn", "words"]
    */
    const modifiedSplitWindowPath = [...this.props.splitWindowPath]
    const wordOrPhraseIndex = modifiedSplitWindowPath.findIndex((element) => {
      return element === 'words' || element === 'phrases'
    })
    if (wordOrPhraseIndex !== -1) {
      modifiedSplitWindowPath.splice(wordOrPhraseIndex + 1)
    }
    const truncatedSplitWindowPath = modifiedSplitWindowPath.join('/')

    const characterTiles = characters.map((value, index) => {
      const curLetter = value.title
      const href = `/${truncatedSplitWindowPath}/alphabet/${curLetter}`

      return (
        <a
          href={href}
          className={`AlphabetListViewTile ${letter === curLetter ? 'AlphabetListViewTile--active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            this.props.handleClick(curLetter, href)
          }}
          key={index}
        >
          {curLetter}
        </a>
      )
    })

    let content = null
    if (characterTiles.length > 0) {
      content = <div className={`AlphabetListViewTiles ${dialectClassName}`}>{characterTiles}</div>
    }
    return content
  }

  componentHasNoContent = () => {
    return (
      <Typography className="AlphabetListView__noCharacters" variant="caption">
        Characters are unavailable at this time
      </Typography>
    )
  }

  componentIsLoading = () => {
    return (
      <div className="AlphabetListView__loading">
        <CircularProgress className="AlphabetListView__loadingSpinner" color="secondary" mode="indeterminate" />
        <Typography className="AlphabetListView__loadingText" variant="caption">
          Loading characters
        </Typography>
      </div>
    )
  }
}

// PropTypes
// ---------------------------------------------
const { array, func, string } = PropTypes
AlphabetListView.propTypes = {
  characters: array,
  dialectClassName: string,
  handleClick: func,
  letter: string,
  // REDUX: reducers/state
  splitWindowPath: array.isRequired,
}
AlphabetListView.defaultProps = {
  handleClick: () => {},
  fetchCharacters: () => {},
}

export default AlphabetListView
