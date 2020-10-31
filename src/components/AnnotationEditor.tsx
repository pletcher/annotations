// @flow

import React from 'react'
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertToRaw,
} from 'draft-js'

import type { MouseEvent } from 'react'

import {
  ANNOTATION_ENTITY_TYPE,
  PENDING_ANNOTATION_STYLE,
} from '../constants'

export interface AnnotationEditorProps {
  editorState: EditorState;
  onCancel?: (e: Event) => void;
  onChange: (editorState: EditorState) => void;
  onFocus: (event: MouseEvent) => void;
  onSave?: (e: Event, editorState: EditorState) => void;
  readOnly?: boolean;
  reset?: () => void;
  style?: { [key: string]: any };
}

export const addNoteEntityToAnnotatable = (
  annotatableEditorState: EditorState,
  noteEditorState: EditorState,
): EditorState => {
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

export default class AnnotationEditor extends React.Component<AnnotationEditorProps> {
  editorRef: React.RefObject<Editor>

  static defaultProps = {
    editorState: EditorState.createEmpty(),
    onCancel: () => {},
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

  constructor(props: AnnotationEditorProps | Readonly<AnnotationEditorProps>) {
    super(props)

    this.editorRef = React.createRef()
  }

  onChange = (editorState: EditorState) => {
    this.props.onChange(editorState)
  }

  onDivClick = (e: MouseEvent) => {
    e.preventDefault()

    // @ts-ignore -- not sure why it isn't picking up on Editor.focus()
    this.editorRef && this.editorRef.focus()
  }

  onFocus = (e: MouseEvent) => {
    this.props.onFocus(e)
  }

  render() {
    return (
      <div
        onClick={this.onDivClick}
        role="present"
        style={this.props.style}
      >
        <Editor
          editorState={this.props.editorState}
          onChange={this.onChange}
          onFocus={this.onFocus}
          readOnly={this.props.readOnly}
          ref={this.editorRef}
          spellCheck
        />
      </div>
    )
  }
}
