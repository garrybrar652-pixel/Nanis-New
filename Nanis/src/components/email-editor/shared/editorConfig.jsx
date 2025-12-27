import { 
  buildBlockComponent,
  buildBlockConfigurationDictionary,
  buildBlockConfigurationSchema,
} from '@usewaypoint/document-core';
import { Avatar, AvatarPropsSchema } from '@usewaypoint/block-avatar';
import { Button, ButtonPropsSchema } from '@usewaypoint/block-button';
import { Text, TextPropsSchema } from '@usewaypoint/block-text';
import { Image, ImagePropsSchema } from '@usewaypoint/block-image';
import { Heading, HeadingPropsSchema } from '@usewaypoint/block-heading';
import { Divider, DividerPropsSchema } from '@usewaypoint/block-divider';
import { Spacer, SpacerPropsSchema } from '@usewaypoint/block-spacer';
import { Container, ContainerPropsSchema } from '@usewaypoint/block-container';
import { ColumnsContainer, ColumnsContainerPropsSchema } from '@usewaypoint/block-columns-container';
import { Html, HtmlPropsSchema } from '@usewaypoint/block-html';
import { z } from 'zod';

import EmailLayoutEditor from '../DragDropEditor/blocks/EmailLayoutEditor';
import EmailLayoutPropsSchema from './EmailLayoutPropsSchema';

// Error boundary wrapper for unknown blocks
function UnknownBlockError({ type, ...props }) {
  console.error(`Unknown block type: "${type}"`, props);
  return (
    <div style={{ 
      padding: '12px', 
      border: '2px dashed #ef4444', 
      backgroundColor: '#fef2f2',
      borderRadius: '4px',
      margin: '8px 0',
      fontFamily: 'monospace'
    }}>
      <div style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '4px' }}>
        ⚠️ Unknown Block Type
      </div>
      <div style={{ color: '#7f1d1d', fontSize: '14px' }}>
        Type: <strong>"{type}"</strong>
      </div>
      <details style={{ marginTop: '8px', fontSize: '12px', color: '#991b1b' }}>
        <summary style={{ cursor: 'pointer' }}>Block Data</summary>
        <pre style={{ marginTop: '4px', overflow: 'auto' }}>
          {JSON.stringify(props, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// Editor block dictionary - blocks render WITHOUT wrapper
// The wrapper is applied in EmailLayoutEditor's SortableBlockWrapper
export const EDITOR_DICTIONARY = buildBlockConfigurationDictionary({
  Avatar: {
    schema: AvatarPropsSchema,
    Component: (props) => <Avatar {...props} />, // ✅ No wrapper here
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: (props) => <Button {...props} />, // ✅ No wrapper here
  },
  Text: {
    schema: TextPropsSchema,
    Component: (props) => <Text {...props} />, // ✅ No wrapper here
  },
  Image: {
    schema: ImagePropsSchema,
    Component: (props) => <Image {...props} />, // ✅ No wrapper here
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: (props) => <Heading {...props} />, // ✅ No wrapper here
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: (props) => <Divider {...props} />, // ✅ No wrapper here
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: (props) => <Spacer {...props} />, // ✅ No wrapper here
  },
  Container: {
    schema: ContainerPropsSchema,
    Component: (props) => <Container {...props} />, // ✅ No wrapper here
  },
  ColumnsContainer: {
    schema: ColumnsContainerPropsSchema,
    Component: (props) => <ColumnsContainer {...props} />, // ✅ No wrapper here
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: (props) => <Html {...props} />, // ✅ No wrapper here
  },
  EmailLayout: {
    schema: EmailLayoutPropsSchema,
    Component: (props) => <EmailLayoutEditor {...props} />,
  },
});

// Build the core EditorBlock component
const CoreEditorBlock = buildBlockComponent(EDITOR_DICTIONARY);

// Wrap EditorBlock to handle unknown types and errors gracefully
export const EditorBlock = (props) => {
  // Check if the block type exists in dictionary
  const blockType = props?.type;
  
  if (!blockType) {
    console.error('Block has no type property:', props);
    return <UnknownBlockError type="(missing)" {...props} />;
  }
  
  if (!EDITOR_DICTIONARY[blockType]) {
    return <UnknownBlockError {...props} />;
  }
  
  try {
    return <CoreEditorBlock {...props} />;
  } catch (error) {
    console.error('Error rendering block:', error, props);
    return <UnknownBlockError {...props} error={error.message} />;
  }
};

export const EditorBlockSchema = buildBlockConfigurationSchema(EDITOR_DICTIONARY);
export const EditorConfigurationSchema = z.record(z.string(), EditorBlockSchema);

// Default empty template
export const EMPTY_EMAIL_TEMPLATE = {
  root: {
    type: 'EmailLayout',
    data: {
      backdropColor: '#F5F5F5',
      canvasColor: '#FFFFFF',
      textColor: '#262626',
      fontFamily: 'MODERN_SANS',
      childrenIds: [],
    },
  },
};

// Block icons and labels for sidebar
export const BLOCK_DEFINITIONS = [
  {
    type: 'Text',
    label: 'Text',
    icon: 'Type',
    description: 'Add text content',
    category: 'Basic',
  },
  {
    type: 'Heading',
    label: 'Heading',
    icon: 'Heading',
    description: 'Add headings',
    category: 'Basic',
  },
  {
    type: 'Button',
    label: 'Button',
    icon: 'RectangleHorizontal',
    description: 'Call-to-action button',
    category: 'Basic',
  },
  {
    type: 'Image',
    label: 'Image',
    icon: 'Image',
    description: 'Add images',
    category: 'Media',
  },
  {
    type: 'Avatar',
    label: 'Avatar',
    icon: 'User',
    description: 'Profile picture',
    category: 'Media',
  },
  {
    type: 'Divider',
    label: 'Divider',
    icon: 'Minus',
    description: 'Horizontal line',
    category: 'Layout',
  },
  {
    type: 'Spacer',
    label: 'Spacer',
    icon: 'MoveVertical',
    description: 'Add vertical space',
    category: 'Layout',
  },
  {
    type: 'Container',
    label: 'Container',
    icon: 'Square',
    description: 'Group elements',
    category: 'Layout',
  },
  {
    type: 'ColumnsContainer',
    label: 'Columns',
    icon: 'Columns',
    description: '3-column layout',
    category: 'Layout',
  },
  {
    type: 'Html',
    label: 'HTML',
    icon: 'Code',
    description: 'Custom HTML',
    category: 'Advanced',
  },
];