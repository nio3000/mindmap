import React, { Component } from 'react';

import { eventEmitter } from '../managers';
import { getTextSize, editReceiver } from '../apptools';

import CalcTopicShape from '../calcpath/topicshape';

import { CPT_SELECTED } from '../constants/EventTypes';

// Topic Shape
const TopicShape = ({ d }) => {
  return <path className = "topic-shape" d = { d } stroke="#000"></path>;
};


// Topic Fill
const TopicFill = ({ d, fillColor }) => {
  return <path d = { d } fill = { fillColor } stroke = "none"></path>;
};


// Topic Select Box
const TopicSelectBox = ({ d, display }) => {
  const style = { 
    display : display ? 'block' : 'none'
  };

  return <path d = { d } fill = "none" stroke="#000" style = { style }></path>;
};


// Topic Text
class TopicText extends Component {
  render () {
    
    const { text } = this.props;
    
    return  (
      <g ref = 'text'>
        <text>{ text }</text>
      </g>
    );
  }
}

class Topic extends Component {

  constructor () {
    super();
    
    this.state = {
      selected : false
    };
    
  }
  
  render () {
    
    const state = this.state;

    const { topicInfo, defaultStyle } = this.props;
    
    const style = Object.assign({}, defaultStyle, topicInfo.style);
    
    const boxSize = {};
    
    const textSize = getTextSize(topicInfo.text, style.fontSize);
    
    const paddingH = 30, paddingV = 20;
    
    boxSize.width = textSize.width + paddingH * 2;
    boxSize.height = textSize.height + paddingV * 2;
    
    const { topicShapePath, topicSelectBoxPath } = this.getTopicShapePath(boxSize, style.shapeClass);
    
    
    const gProps = {
      className : 'topic-group',
      transform : this.getTranslatePosition(),
      onClick : (e) => this.onTopicClick(e),
      onDoubleClick : (e) => this.onTopicDoubleClick(e)
    };
    
    const TopicFillProps = {
      d : topicShapePath,
      fillColor : style.fillColor
    };
    
    const TopicSelectBoxProps = {
      d : topicSelectBoxPath,
      display : state.selected
    };
    
    const TopicTextProps = {
      ref : 'TopicText',
      text : topicInfo.text,
      fontSize : style.fontSize,
      textSize : textSize
    };
    
    
    return (
      <g {...gProps} >
        <TopicShape d = { topicShapePath } />
        <TopicFill { ...TopicFillProps } />
        <TopicSelectBox { ...TopicSelectBoxProps } />
        <TopicText { ...TopicTextProps }/>
      </g>
    );
  }
  
  getTopicShapePath (boxSize, shapeClass) {
    return CalcTopicShape[shapeClass](boxSize);
  }

  // todo
  getTranslatePosition () {
    return 'translate(300 300)'
  }
  
  getTextClientRect () {
    return this.refs.TopicText.refs.text.getBoundingClientRect();
  }
  
  // userAgent events
  onTopicClick (e) {
    e.stopPropagation();
    
    if (this.state.selected === false) {
      this.onSelected();
      
      eventEmitter.emit(CPT_SELECTED, this);
    }
    
  }
  
  onTopicDoubleClick () {
    editReceiver.show();
  }

  // lifecycle events
  onSelected () {
    this.setState({ selected : true });

    editReceiver.prepare(this);
  }
  
  onDeselected () {
    this.setState({ selected : false });
  }

  onUpdateText (text) {
    this.props.onUpdateTopicText(text);
  }
}

export default Topic;