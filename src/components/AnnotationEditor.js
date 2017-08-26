// @flow

import React from 'react'
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertToRaw,
} from 'draft-js'

import type {
  EditorState as EditorStateType,
  SyntheticMouseEvent
} from 'draft-js'

import {
  ANNOTATION_ENTITY_TYPE,
  PENDING_ANNOTATION_STYLE,
} from '../constants'

export type Props = {
  editorState: EditorStateType,
  onCancel: Event => void,
  onChange: EditorState => void,
  onFocus: SyntheticMouseEvent => void,
  onSave: (Event, EditorStateType) => void,
  readOnly: boolean,
  reset: void => void,
  style: ?{ [key: string]: any },
}

export const addNoteEntityToAnnotatable = (
  annotatableEditorState: EditorStateType,
  noteEditorState: EditorStateType,
): EditorStateType => {
  const newAnnotatableEditorState = RichUtils.toggleInlineStyle(
    annotatableEditorState,
    PENDING_ANNOTATION_STYLE
  )
  const contentState = annotatableEditorState.getCurrentContent()
  const selectionState = annotatableEditorState.getSelection()
  const body = convertToRaw(noteEditorState.getCurrentContent())
  const contentStateWithEntity = contentState.createEntity(
    ANNOTATION_ENTITY_TYPE,
    'MUTABLE',
    body,
  )
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
  const contentStateWithNote = Modifier.applyEntity(
    contentStateWithEntity,
    selectionState,
    entityKey
  )

  return EditorState.set(
    newAnnotatableEditorState, {
      currentContent: contentStateWithNote
    }
  )
}

export default class AnnotationEditor extends React.Component {
  editor: Editor
  focus: Function
  handleChange: Function

  static defaultProps = {
    editorState: EditorState.createEmpty(),
    onChange: () => {},
    onFocus: () => {},
    readOnly: false,
    reset: () => {},
    style: {
      border: '1px solid #d3d3d3',
      borderRadius: 2,
      maxWidth: 480,
      padding: '0.5em',
    }
  }

  constructor(props: Props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.handleDivClick = this.handleDivClick.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleChange(editorState: EditorState) {
    this.props.onChange(editorState)
  }

  handleDivClick(e: SyntheticMouseEvent) {
    e.preventDefault()

    this.editor && this.editor.focus()
  }

  handleFocus(e: SyntheticMouseEvent) {
    this.props.onFocus(e, this.editor)
  }

  render() {
    return (
      <div
        onClick={this.handleDivClick}
        role="present"
        style={this.props.style}
      >
        <Editor
          editorState={this.props.editorState}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          readOnly={this.props.readOnly}
          ref={c => { this.editor = c }}
          spellCheck
        />
      </div>
    )
  }
}
