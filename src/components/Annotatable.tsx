import * as React from 'react'
import {
  CompositeDecorator,
  Editor,
  EditorState,
  convertFromRaw,
} from 'draft-js'

import 'draft-js/dist/Draft.css'

import {
  PENDING_ANNOTATION_BLUE,
  PENDING_ANNOTATION_STYLE
} from '../constants'

import type {
  DraftDecorator,
  RawDraftContentBlock,
  RawDraftEntity
} from 'draft-js'

import type { MouseEvent } from 'react'

export type EntityMap = { [key: string]: RawDraftEntity<[key: string]> }

export interface AnnotatableProps {
  blocks?: Array<RawDraftContentBlock>;
  containerStyle?: Object;
  customStyleMap?: Object;
  decorators?: Array<CompositeDecorator>;
  editorState: EditorState;
  entityMap?: EntityMap;
  onBlur: (event: MouseEvent) => void;
  onChange: (editorState: EditorState) => void;
  onFocus: (event: MouseEvent) => void;
}

export type State = {
  readOnly: boolean,
}

export const createEditorState = (
  blocks: Array<RawDraftContentBlock>,
  entityMap: EntityMap = {},
  decorators: Array<DraftDecorator> = []
) => {
  return EditorState.createWithContent(
    convertFromRaw({ blocks, entityMap }),
    new CompositeDecorator(decorators)
  )
}

export const customStyleMap = {
  [PENDING_ANNOTATION_STYLE]: {
    backgroundColor: PENDING_ANNOTATION_BLUE,
  }
}

export default class Annotatable extends React.Component<AnnotatableProps, State> {
  static defaultProps = {
    containerStyle: {},
    decorators: [],
    editorState: EditorState.createEmpty(),
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
  }

  constructor(props: AnnotatableProps) {
    super(props)

    this.state = {
      readOnly: true,
    }
  }

  onBlur = (e: MouseEvent) => {
    this.props.onBlur(e)
  }

  onChange = (editorState: EditorState) => {
    this.props.onChange(editorState)
  }

  onFocus = (e: MouseEvent) => {
    this.props.onFocus(e)
  }

  // These mouse event handlers allow selections,
  // but they disallow actually modifying the text.
  onMouseDown = (e: MouseEvent) => {
    this.setState({ readOnly: false })
  }

  onMouseUp = (e: MouseEvent) => {
    this.setState({ readOnly: true })
  }

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        style={this.props.containerStyle}
      >
        <Editor
          customStyleMap={customStyleMap}
          editorState={this.props.editorState}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onFocus={this.onFocus}
          readOnly={this.state.readOnly}
          spellCheck
        />
      </div>
    )
  }
}
