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
  RawDraftContentBlock,
  RawDraftEntity
} from 'draft-js'

import type { SyntheticFocusEvent, SyntheticMouseEvent } from 'react-dom'

export type EntityMap = { [key: string]: RawDraftEntity<[key: string]> }

export interface Props {
  blocks?: Array<RawDraftContentBlock>;
  customStyleMap?: Object;
  decorators?: Array<CompositeDecorator>;
  editorState: EditorState;
  entityMap?: EntityMap;
  onBlur: (event: SyntheticFocusEvent) => void;
  onChange: (editorState: EditorState) => void;
  onFocus: (event: SyntheticFocusEvent) => void;
  style?: {
    container?: { [key: string]: any },
  };
}

export type State = {
  readOnly: boolean,
}

export const createEditorState = (
  blocks: Array<RawDraftContentBlock>,
  entityMap?: EntityMap,
  decorators?: Array<CompositeDecorator>
) => {
  return EditorState.createWithContent(
    convertFromRaw({ blocks, entityMap: entityMap || {} }),
    new CompositeDecorator((decorators || []).length ? [].concat(decorators) : [])
  )
}

export const customStyleMap = {
  [PENDING_ANNOTATION_STYLE]: {
    backgroundColor: PENDING_ANNOTATION_BLUE,
  }
}

export default class Annotatable extends React.Component<Props, State> {
  static defaultProps = {
    decorators: [],
    editorState: EditorState.createEmpty(),
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    style: {},
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      readOnly: true,
    }
  }

  onBlur = (e: SyntheticFocusEvent) => {
    this.props.onBlur(e)
  }

  onChange = (editorState: EditorState) => {
    this.props.onChange(editorState)
  }

  onFocus = (e: SyntheticFocusEvent) => {
    this.props.onFocus(e)
  }

  // These mouse event handlers allow selections,
  // but they disallow actually modifying the text.
  onMouseDown = (e: SyntheticMouseEvent) => {
    this.setState({ readOnly: false })
  }

  onMouseUp = (e: SyntheticMouseEvent) => {
    this.setState({ readOnly: true })
  }

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        style={this.props.style.container}
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
