import React from 'react'

import {
  ANNOTATION_BLUE,
  ANNOTATION_HOVER_BLUE
} from '../constants'

export interface Props {
  children: string | Object;
  entityKey: string;
  hoverEntityKey: string;
  onClick: (entityKey: string) => void;
  onHover: (entityKey?: string) => void;
}

export const AnnotationComponent = (props: Props) => {
  const hoverEntityKey = props.hoverEntityKey || ''

  const style = {
    backgroundColor: hoverEntityKey === props.entityKey ?
      ANNOTATION_HOVER_BLUE :
      ANNOTATION_BLUE,
    cursor: 'pointer',
    display: 'inline-block',
  }

  const handleClick = () => props.onClick(props.entityKey)
  const handleMouseLeave = () => props.onHover('')
  const handleMouseEnter = () => props.onHover(props.entityKey)

  return (
    <span
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={style}
    >
      {props.children}
    </span>
  )
}

const AnnotationWrapper = (
  hoverEntityKey: string,
  onClick: Props["onClick"],
  onHover: Props["onHover"],
) => {
  return (props: Props) => (
    <AnnotationComponent
      {...props}
      hoverEntityKey={hoverEntityKey}
      onClick={onClick}
      onHover={onHover}
    />
  )
}

export default AnnotationWrapper