import React from 'react'
import { PropTypes } from 'react'
import Text from './Text'
import Textarea from './Textarea'
// import Select from './Select`'
import File from './File'
import Checkbox from './Checkbox'
import FormContributors from './FormContributors'
import FormRecorders from './FormRecorders'
import FormMoveButtons from './FormMoveButtons'
import FormRemoveButton from './FormRemoveButton'

import ProviderHelpers from 'common/ProviderHelpers'
import IntlService from 'views/services/intl'

import Preview from 'views/components/Editor/Preview'
// see about dropping:
import selectn from 'selectn'
import provide from 'react-redux-provide'
const intl = IntlService.instance
const { array, func, object, number, string, element } = PropTypes
export class FormRelatedAudioItem extends React.Component {
  STATE_LOADING = 0
  STATE_DEFAULT = 1
  STATE_CREATE = 2
  STATE_CREATED = 3
  STATE_EDIT = 4
  STATE_BROWSE = 5

  static propTypes = {
    name: string,
    className: string,
    groupName: string,
    id: number,
    idDescribedbyItemBrowse: string,
    idDescribedByItemMove: string,
    index: number,
    textBtnRemoveItem: string,
    textBtnMoveItemUp: string,
    textBtnMoveItemDown: string,
    textBtnCreateItem: string,
    textBtnSelectExistingItems: string,
    textLabelItemSearch: string,
    textLegendItem: string,
    handleClickCreateItem: func,
    handleClickSelectItem: func,
    handleClickRemoveItem: func,
    handleClickMoveItemUp: func,
    handleClickMoveItemDown: func,
    handleItemSelected: func,
    componentState: number,
    value: string,
    DISABLED_SORT_COLS: array,
    DEFAULT_PAGE: number,
    DEFAULT_PAGE_SIZE: number,
    DEFAULT_LANGUAGE: string,
    DEFAULT_SORT_COL: string,
    DEFAULT_SORT_TYPE: string,
    DIALECT_PATH: string.isRequired,
    selectMediaComponent: element.isRequired,
    // NOTE: COMING FROM REDUX/PROVIDER
    computeAudio: object.isRequired,
    createAudio: func.isRequired,
    // NOTE: COMING FROM PARENT COMPONENT, NOT REDUX/PROVIDER
    computeDialectFromParent: object.isRequired,
  }
  static defaultProps = {
    className: 'FormRelatedAudioItem',
    groupName: 'FormRelatedAudioItem__group',
    id: -1,
    index: 0,
    componentState: 0,
    handleClickCreateItem: () => {},
    handleClickSelectItem: () => {},
    handleClickRemoveItem: () => {},
    handleClickMoveItemUp: () => {},
    handleClickMoveItemDown: () => {},
    handleItemSelected: () => {},
    DISABLED_SORT_COLS: ['state'],
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 100,
    DEFAULT_LANGUAGE: 'english',
    DEFAULT_SORT_COL: 'dc:title',
    DEFAULT_SORT_TYPE: 'asc',
    selectMediaComponent: null,
  }
  state = {
    componentState: this.props.componentState,
    createItemName: '',
    createItemDescription: '',
    createItemFile: {},
    createItemIsShared: false,
    createItemIsChildFocused: false,
    createItemContributors: [],
    createItemRecorders: [],
    pathOrId: undefined,
  }

  CONTRIBUTOR_PATH = undefined

  render() {
    const {
      className,
      // name,
      id,
      idDescribedByItemMove,
      index,
      textBtnRemoveItem,
      textBtnMoveItemUp,
      textBtnMoveItemDown,
      textBtnCreateItem,
      textBtnSelectExistingItems,
      textLegendItem,
      handleClickRemoveItem,
      handleClickMoveItemUp,
      handleClickMoveItemDown,
    } = this.props

    let componentContent = null
    const computeCreate = ProviderHelpers.getEntry(this.props.computeAudio, this.state.pathOrId)
    const isFetching = selectn('isFetching', computeCreate)
    const isSuccess = selectn('success', computeCreate)

    const _handleItemSelectedOrCreated = (selected) => {
      this.props.handleItemSelected(selected, () => {
        handleClickRemoveItem(id)
      })
    }

    if (isSuccess) {
      // Note: deletes the in-progress/newly added item and inserts the just created item
      _handleItemSelectedOrCreated(selectn('response', computeCreate))
    }

    switch (this.state.componentState) {
      case this.STATE_CREATE: {
        let formStatus = null
        if (isFetching) {
          formStatus = (
            <div className="alert alert-info">
              {intl.trans('views.components.editor.uploading_message', 'Uploading... Please be patient...', 'first')}
            </div>
          )
        }

        // CREATE AUDIO ------------------------------------
        componentContent = (
          <div>
            <h2>Create new audio item</h2>
            {/* Name ------------- */}
            <Text
              className={this.props.groupName}
              id={`${className}__Contributor${index}__NewName`}
              labelText="Name of audio item"
              // name={`${name}[${index}]__NewName`}
              name="FormRelatedAudioItem.name"
              value=""
              handleChange={(data) => {
                this.setState({ createItemName: data })
              }}
            />
            {/* Description --------------- */}
            <Textarea
              className={this.props.groupName}
              id="CreateAudio__Description"
              labelText="Description of audio item"
              // name="dc:description"
              name="FormRelatedAudioItem.description"
              value=""
              handleChange={(data) => {
                this.setState({ createItemDescription: data })
              }}
            />

            {/* File --------------- */}
            <File
              className={this.props.groupName}
              id="CreateAudio__File"
              labelText="Upload audio item"
              // name="file"
              name=""
              value=""
              handleChange={(data) => {
                this.setState({ createItemFile: data })
              }}
            />

            {/* Shared --------------- */}
            <Checkbox
              className={this.props.groupName}
              id="CreateAudio__Shared"
              labelText="Share this audio across dialects"
              // name="fvm:shared"
              name=""
              handleChange={(data) => {
                this.setState({ createItemIsShared: data })
              }}
            />
            {/* Child focused --------------- */}
            <Checkbox
              className={this.props.groupName}
              id="CreateAudio__ChildFocused"
              labelText="Audio is child focused"
              // name="fvm:child_focused"
              name=""
              handleChange={(data) => {
                this.setState({ createItemIsChildFocused: data })
              }}
            />

            {/* Contributors: fvm:source --------------- */}
            <FormContributors
              className={this.props.groupName}
              // name="fv:source"
              name=""
              textInfo="Contributors who helped create the audio item."
              handleItemsUpdate={(data) => {
                this.setState({ createItemContributors: data })
              }}
            />

            {/* Recorders: fvm:recorder --------------- */}
            <FormRecorders
              className={this.props.groupName}
              // name="fvm:recorder"
              name=""
              textInfo="Recorders who helped create the audio item."
              handleItemsUpdate={(data) => {
                this.setState({ createItemRecorders: data })
              }}
            />

            {/* BTN: Create contributor ------------- */}
            <button
              disabled={isFetching || isSuccess}
              type="button"
              onClick={(event) => {
                event.preventDefault()
                this._handleCreateItemSubmit()
              }}
            >
              Create new audio item
            </button>

            {/* BTN: Cancel, go back ------------- */}
            <button
              disabled={isFetching || isSuccess}
              type="button"
              onClick={() => {
                this.setState({
                  componentState: this.STATE_DEFAULT,
                })
              }}
            >
              {"Cancel, don't create new audio item"}
            </button>
            {formStatus}
          </div>
        )
        break
      }
      case this.STATE_CREATED: {
        // AUDIO CREATED/SELECTED ------------------------------------
        let previewInput = 'Something went wrong!'
        if (id !== -1) {
          previewInput = (
            <div>
              <Preview id={id} type="FVAudio" />
            </div>
          )
        }
        componentContent = (
          <div>
            <div className="FormItemButtons">
              <FormMoveButtons
                id={id}
                idDescribedByItemMove={idDescribedByItemMove}
                textBtnMoveItemUp={textBtnMoveItemUp}
                textBtnMoveItemDown={textBtnMoveItemDown}
                handleClickMoveItemUp={handleClickMoveItemUp}
                handleClickMoveItemDown={handleClickMoveItemDown}
              />
              <FormRemoveButton
                id={id}
                textBtnRemoveItem={textBtnRemoveItem}
                handleClickRemoveItem={handleClickRemoveItem}
              />
            </div>
            {previewInput}
          </div>
        )
        break
      }
      default: {
        // INITIAL STATE ------------------------------------
        const { computeDialectFromParent, selectMediaComponent } = this.props
        const SelectMediaComponent = selectMediaComponent
        componentContent = (
          <div>
            <div className="FormItemButtons">
              <FormRemoveButton
                id={id}
                textBtnRemoveItem={textBtnRemoveItem}
                handleClickRemoveItem={handleClickRemoveItem}
              />
            </div>
            {/* Create contributor */}
            <button
              type="button"
              onClick={() => {
                this._handleClickCreateItem()
              }}
            >
              {textBtnCreateItem}
            </button>

            <SelectMediaComponent
              type={'FVAudio'}
              label={textBtnSelectExistingItems}
              onComplete={_handleItemSelectedOrCreated}
              dialect={selectn('response', computeDialectFromParent)}
            />
          </div>
        )
      }
    }
    return (
      <fieldset className={`${className} ${this.props.groupName}`}>
        <legend>{textLegendItem}</legend>
        {componentContent}
      </fieldset>
    )
  }
  _handleClickCreateItem = () => {
    const { handleClickCreateItem } = this.props
    this.setState(
      {
        componentState: this.STATE_CREATE,
      },
      () => {
        handleClickCreateItem()
      }
    )
  }
  _handleSubmitExistingItem = (createItemUid) => {
    this.setState(
      {
        componentState: this.STATE_CREATED,
        contributorUid: createItemUid,
      },
      () => {}
    )
  }

  async _handleCreateItemSubmit() {
    const {
      createItemName,
      createItemDescription,
      createItemFile,
      createItemIsShared,
      createItemIsChildFocused,
      createItemContributors,
      createItemRecorders,
    } = this.state

    const docParams = {
      type: 'FVAudio',
      name: createItemName,
      properties: {
        'dc:title': createItemName,
        'dc:description': createItemDescription,
        'fvm:shared': createItemIsShared,
        'fvm:child_focused': createItemIsChildFocused,
        'fvm:recorder': createItemRecorders['fvm:recorder'],
        'fvm:source': createItemContributors['fvm:source'],
      },
    }

    const timestamp = Date.now()
    const { DIALECT_PATH } = this.props
    this.props.createAudio(`${DIALECT_PATH}/Resources`, docParams, createItemFile, timestamp)
    const pathOrId = `${DIALECT_PATH}/Resources/${createItemName}.${timestamp}`
    this.setState({ pathOrId })
  }
}

export default provide(FormRelatedAudioItem)
